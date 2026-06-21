# Revenue Leak Detector — frontend (React + Tailwind)

This is the demo frontend: a marketing landing page + a dashboard, both using **fake data**.
No backend, no live Stripe connection yet — see the main project README for that plan.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite` — no `tailwind.config.js` needed, theme tokens live in `src/index.css`)
- React Router for the two pages (`/` landing, `/dashboard`)

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Project structure

```
src/
  components/
    Nav.jsx          shared top nav, switches style by page
    FlagCard.jsx      one flagged customer card (used on dashboard)
    Toast.jsx         bottom toast notification
  hooks/
    useCountUp.js     reusable count-up number animation
  data/
    flags.js          fake flag data — swap this for a real API call later
  pages/
    Landing.jsx       marketing page with animated hero card
    Dashboard.jsx      the flags list
  index.css           Tailwind import + design tokens (colors, fonts, keyframes)
```

## Notes on Tailwind v4

This uses Tailwind v4's new CSS-first config — there's no `tailwind.config.js`.
Custom colors, fonts, and animations are all defined inside `src/index.css` under
the `@theme` block, and are available as Tailwind utility classes
(e.g. `bg-ledger-bg`, `text-flag`, `font-serif`, `animate-rise-in`).

## What's still fake

- `src/data/flags.js` is hardcoded — no Stripe connection.
- "Mark reviewed" / "Dismiss" only update local React state — nothing persists on refresh.
- No backend exists yet. See the root `README.md` for the planned architecture
  (FastAPI + Postgres + Stripe sync) before that gets built.
