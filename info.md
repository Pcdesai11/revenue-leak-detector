# Revenue Leak Detector

**Find the customers you forgot to raise prices on.**

## The Problem

Agencies, consultants, and small software shops bill the same clients repeatedly over months or years. Over time, some clients end up paying well below what comparable clients pay — a legacy discount that never expired, a price that was never revisited, a deal nobody questioned. Nobody sits down and compares clients side by side, so this money quietly leaks away.

## The Solution

Connect Stripe. We analyze customer tenure, total revenue, payment frequency, and discount history, then flag customers who are paying noticeably less than similar customers. We don't claim to know *why* — we surface the anomaly and let the owner decide whether it's justified.

**Example output:**
> Customer A has paid you for 3 years and is paying 25% less than similar long-tenure customers. Worth a look — is there a reason, or did this just never get revisited?

This is a flag for judgment, not a confident recommendation. The tool finds the anomaly; the owner supplies the context the data can't see (service level, relationship, negotiated terms).

## Target Customer (v1)

- Agencies, consultants, small software/SaaS shops, marketing firms
- Recurring or repeat billing relationships with named customers (not one-time e-commerce)
- Currently using Stripe (Billing or Invoicing) as their primary payment processor

## Non-Goals (v1)

- Not a full BI/dashboard tool — one question, one answer, no exploratory analytics
- Not multi-source (no QuickBooks, Gmail, Calendar) — Stripe only, deliberately
- Not a pricing *recommendation* engine — it flags anomalies, it does not tell you what to charge
- Not for one-time-purchase or low-repeat-customer businesses (e-commerce, single-project shops)

---

## Architecture Overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Browser    │ ───▶ │   Backend API     │ ───▶ │   Stripe API     │
│  (Frontend)  │ ◀─── │  (FastAPI/Node)   │ ◀─── │  (read-only)     │
└─────────────┘      └──────────────────┘      └─────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Analysis Engine  │
                     │ (stats, no LLM    │
                     │  for the math)    │
                     └──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   LLM (Claude)    │
                     │  phrasing only —  │
                     │  turns numbers    │
                     │  into a sentence  │
                     └──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Postgres DB     │
                     │ (cached Stripe    │
                     │  data + flags)    │
                     └──────────────────┘
```

**Key architectural decision:** the LLM does *not* compute the anomaly. A deterministic statistics layer does the comparison (percentile ranking, z-scores against peer groups). The LLM's only job is turning a verified number into a readable sentence. This keeps the "is this actually true" risk low — the math is auditable, the language is just presentation. This separation is the single most important design decision in this product; an LLM that free-associates about "why" a customer is underpriced will produce confident, wrong, and occasionally embarrassing output.

---

## Tech Stack

### Frontend
- **Framework:** React (Vite) — simple SPA, no need for Next.js/SSR at this stage since there's no public-facing marketing/SEO surface yet
- **UI:** Tailwind CSS + shadcn/ui components — fast to build, looks credible to a non-technical small business owner without custom design work
- **Charts (minimal):** Recharts — only for the one or two supporting visuals (e.g. "this customer vs. peer group" bar)
- **State/data fetching:** TanStack Query (React Query) for API calls and caching

### Backend
- **Language/framework:** Python + FastAPI
  - Why Python: Stripe's data needs real statistical work (percentiles, peer grouping) — Python's pandas/numpy ecosystem is the fastest path, and it keeps the analysis layer in the same language as any future ML work.
- **Auth:** Stripe OAuth (Stripe Connect) for connecting the customer's Stripe account; your own session auth (e.g. simple JWT or magic-link email) for the dashboard login
- **Background jobs:** A simple task queue (e.g. Celery + Redis, or even a basic cron-triggered job at this stage) to pull and refresh Stripe data — this should NOT happen synchronously on page load, Stripe data pulls can be slow for accounts with years of history

### Data & Analysis
- **Database:** PostgreSQL — stores synced Stripe customers/invoices/charges and computed flags. Don't build live against the Stripe API on every request; sync and cache.
- **Analysis layer:** plain Python (pandas) computing, per customer:
  - Tenure (first charge to most recent)
  - Total lifetime revenue
  - Average revenue per billing period
  - Peer group (customers with similar tenure + similar service/plan, if that data exists)
  - Percentile rank of price-per-period within peer group
  - Discount/coupon history flag
- **LLM layer:** Claude API, called only after the stats layer has produced numbers — used strictly to phrase the flag in plain language and to suggest the "worth a look" framing, never to invent the underlying comparison

### Integrations
- **Stripe API** (read-only scopes only: `customers:read`, `charges:read`, `invoices:read`, `subscriptions:read`) — no write access needed for v1, which also makes the security conversation with prospects much easier

### Infrastructure
- **Hosting:** Render or Railway for v1 (skip AWS/GCP complexity until there's real usage — both support Postgres + background workers out of the box)
- **Email (for "here's your weekly flag" digest):** Resend or Postmark
- **Error tracking:** Sentry (free tier is enough at this stage)

---

## API Design (v1 — kept intentionally small)

| Endpoint | Method | Purpose |
|---|---|---|
| `/auth/stripe/connect` | GET | Redirects to Stripe OAuth |
| `/auth/stripe/callback` | GET | Handles OAuth callback, stores access token |
| `/sync` | POST | Triggers a background sync of Stripe data for the connected account |
| `/sync/status` | GET | Polling endpoint — "still syncing" / "done" |
| `/flags` | GET | Returns the list of computed pricing-anomaly flags for the logged-in account |
| `/flags/:customer_id` | GET | Returns detail view for one flagged customer (tenure, peer comparison, raw numbers) |
| `/flags/:customer_id/dismiss` | POST | Owner marks a flag as "reviewed, not an issue" (this matters — see below) |

**Why the `dismiss` endpoint matters:** owners will hit false positives (a discount that's intentional, a VIP client). Letting them dismiss with a reason, and excluding dismissed-with-reason customers from future flags, is what turns this from "annoying nagging tool" into "tool that gets smarter about my business." This is a cheap feature with outsized trust payoff.

---

## Data Model (simplified)

```
accounts
  id, stripe_account_id, email, connected_at

customers
  id, account_id, stripe_customer_id, name, first_charge_at, total_revenue, plan_type

charges (synced)
  id, customer_id, amount, period_start, period_end, discount_amount

flags
  id, customer_id, flag_type, peer_group_percentile, suggested_message,
  status (open / dismissed), dismissed_reason, created_at
```

---

## Build Sequence (matches the validation plan, not just "build everything")

1. **Stripe sync + raw data pull** — get real customer/charge data into Postgres. No UI yet.
2. **Stats layer only** — compute peer groups and percentile flags. Eyeball the output yourself against real data. This is where you find out if the signal is real before writing a single line of frontend code.
3. **Manual review pass** — check flagged "anomalies" against what you know about the business (or ask the account owner). This is Step 2 of validation — correctness before polish.
4. **Minimal frontend** — a single list view of flags + the LLM-phrased sentence. No dashboard, no charts yet.
5. **Show to one real agency/consultant owner** using their actual Stripe data. This is Step 1 of validation — do they react with "oh, huh, yeah" or do they need convincing?
6. Only after both validate: build out dismiss/feedback loop, email digest, multi-user accounts, billing for the product itself.

---

## Open Questions to Resolve Before Building Further

- What counts as a "peer group" when a business has very few customers (common for agencies)? Percentile comparisons need enough customers to be meaningful — below some threshold (~10-15 customers), this whole approach may need a different statistical method or simply won't work.
- How do we handle businesses with highly bespoke pricing (every client negotiated separately, no real "plan" structure)? This may be the biggest threat to the core assumption.
- What's the actual willingness to pay? (Not addressed in this document — needs real conversations, not assumed.)
