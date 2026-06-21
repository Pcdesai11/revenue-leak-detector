import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Reveal from '../components/Reveal';
import { useCountUp } from '../hooks/useCountUp';

function HeroCard() {
  const [stage, setStage] = useState(0); // 0: idle, 1: total shown, 2: tenure shown, 3: verdict revealed
  const total = useCountUp(42000, { duration: 900, start: stage >= 1, delay: 0 });

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1150);
    const t3 = setTimeout(() => setStage(3), 1500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const revealed = stage >= 3;

  return (
    <div className="relative animate-rise-in opacity-0 [animation-delay:0.3s]">
      <div
        className={`pointer-events-none absolute -inset-3.5 rounded-2xl border border-ledger ${
          revealed ? 'animate-pulse-ring' : 'opacity-0'
        }`}
      />
      <div
        className={`rounded-lg border border-line bg-white p-6 pb-5 shadow-sm transition-shadow ${
          revealed ? 'animate-card-glow' : ''
        }`}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[17px] font-medium">Harborline Studio</div>
            <div className="mt-0.5 text-[12.5px] text-ink-faint">
              Client since Mar 2023 · Monthly retainer
            </div>
          </div>
          <div
            className={`rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors duration-500 ${
              revealed ? 'bg-flag-bg text-flag' : 'bg-line text-ink-faint'
            }`}
          >
            {revealed ? 'Worth a look' : 'Reviewing'}
          </div>
        </div>

        <Row label="Total paid" value={`$${total.toLocaleString()}`} />
        <Row label="Tenure" value={stage >= 2 ? '3 years' : '—'} />
        <Row label="vs. similar customers" value={stage >= 2 ? '25% below' : '—'} last />

        <div
          className={`mt-4 min-h-[42px] border-t border-line pt-4 text-[13.5px] leading-relaxed text-ink transition-opacity duration-500 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Paying{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-serif font-semibold text-gold">25% less</span>
            <span
              className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-gold/40 ${
                revealed ? 'animate-underline-draw' : 'scale-x-0'
              }`}
              style={{ animationDelay: '0.3s' }}
            />
          </span>{' '}
          than similar long-term customers. Worth a look.
        </div>
      </div>
    </div>
  );
}

function LiveTicker() {
  const [n, setN] = useState(1248);

  useEffect(() => {
    const interval = setInterval(() => {
      setN((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-5 flex animate-rise-in items-center gap-2 text-[12.5px] text-ink-faint opacity-0 [animation-delay:0.66s]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-ledger" />
      </span>
      <span>
        <span className="font-medium text-ink-soft">{n.toLocaleString()}</span> customer records
        compared so far today
      </span>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div className={`flex items-baseline justify-between py-2.5 text-[13.5px] ${!last ? 'border-b border-[#F0EEE5]' : ''}`}>
      <span className="text-ink-faint">{label}</span>
      <span className="font-serif text-[15px] font-medium">{value}</span>
    </div>
  );
}

function StepContent({ label, body }) {
  return (
    <div className="border-t-2 border-ink pt-4.5">
      <div className="mb-2 font-serif text-[15px] font-medium text-ledger">{label}</div>
      <div className="text-[14.5px] leading-relaxed text-ink-soft">{body}</div>
    </div>
  );
}

function PrincipleItem({ number, children }) {
  return (
    <div className="flex items-start gap-3.5 text-[14.5px] leading-relaxed text-ink-soft">
      <span className="mt-px flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-full bg-ledger-bg text-[12px] font-semibold text-ledger">
        {number}
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Nav variant="landing" />

      {/* Hero */}
      <div className="relative">
        <div className="ledger-texture pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-14 px-8 py-16 md:py-24 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5.5 inline-flex animate-rise-in items-center gap-2 rounded-full bg-ledger-bg px-3 py-1.5 text-[12.5px] font-medium text-ledger opacity-0 [animation-delay:0.1s]">
            Built for agencies &amp; consultants on Stripe
          </div>

          <h1 className="mb-5 animate-rise-in font-serif text-[32px] font-medium leading-[1.14] tracking-tight opacity-0 [animation-delay:0.22s] md:text-[44px]">
            Find the clients you
            <br />
            forgot to <span className="text-ledger">reprice</span>.
          </h1>

          <p className="mb-8 max-w-[440px] animate-rise-in text-[17px] text-ink-soft opacity-0 [animation-delay:0.34s]">
            Connect Stripe. We compare every customer's price against others with similar tenure
            and volume — and flag the ones quietly paying less than they should.
          </p>

          <div className="mb-7 flex animate-rise-in gap-3 opacity-0 [animation-delay:0.46s]">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-ink bg-ink px-5.5 py-3 text-[14.5px] font-medium text-paper transition-transform hover:-translate-y-px hover:bg-[#313129]"
            >
              See a live example ↗
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-5.5 py-3 text-[14.5px] font-medium text-ink transition-transform hover:-translate-y-px hover:border-ink-faint"
            >
              How it works
            </a>
          </div>

          <p className="animate-rise-in text-[13px] text-ink-faint opacity-0 [animation-delay:0.56s]">
            Read-only access to Stripe. Nothing is changed without you.
          </p>

          <LiveTicker />
        </div>

        <HeroCard />
        </div>
      </div>

      {/* Strip */}
      <div className="mx-auto max-w-[1080px] px-8 pb-16 text-center">
        <div className="mb-4.5 text-[12.5px] uppercase tracking-wide text-ink-faint">
          Built for the way agencies actually bill
        </div>
        <div className="flex flex-wrap justify-center gap-10 font-serif text-base text-ink-faint">
          <span className="transition-colors hover:text-ink">Design &amp; dev studios</span>
          <span className="transition-colors hover:text-ink">Marketing retainers</span>
          <span className="transition-colors hover:text-ink">Consulting firms</span>
          <span className="transition-colors hover:text-ink">Small SaaS shops</span>
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-[1080px] border-t border-line px-8 py-18">
        <div className="mb-12 max-w-[540px]">
          <div className="mb-2.5 text-[12.5px] uppercase tracking-wide text-ink-faint">
            How it works
          </div>
          <h2 className="font-serif text-[28px] font-medium leading-tight tracking-tight">
            One question, answered honestly — not a dashboard you have to interpret yourself.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          <Reveal delay={0}>
            <StepContent
              label="Connect"
              body="Read-only access to Stripe. No write permissions — we never touch your billing, only read it."
            />
          </Reveal>
          <Reveal delay={90}>
            <StepContent
              label="Compare"
              body="We group customers by tenure and billing volume, then check who's priced below similar customers."
            />
          </Reveal>
          <Reveal delay={180}>
            <StepContent
              label="Review"
              body="You get a short list of flags in plain language. Mark them reviewed, or dismiss with a reason — it remembers."
            />
          </Reveal>
        </div>
      </section>

      {/* Principle */}
      <section id="principle" className="mx-auto max-w-[1080px] border-t border-line px-8 py-18">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
            <div className="font-serif text-2xl leading-snug tracking-tight">
              We don't tell you what to charge.
              <br />
              <span className="text-ledger">We tell you what's worth checking.</span>
            </div>
            <div className="flex flex-col gap-4.5">
              <PrincipleItem number={1}>
                <strong className="font-medium text-ink">The math is plain statistics</strong> —
                peer comparison, not a guess. The numbers you see are auditable, not invented.
              </PrincipleItem>
              <PrincipleItem number={2}>
                <strong className="font-medium text-ink">We don't know your reasons</strong> — a
                discount might be intentional. That's why every flag can be dismissed with a note,
                permanently.
              </PrincipleItem>
              <PrincipleItem number={3}>
                <strong className="font-medium text-ink">You decide, always</strong> — this finds
                anomalies worth a conversation. It never emails your client or changes a price on
                its own.
              </PrincipleItem>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA band */}
      <Reveal>
        <div className="mx-auto mb-22 max-w-[1016px] rounded-xl bg-ink px-7 py-14 text-center transition-transform duration-300 hover:-translate-y-0.5 md:px-12">
          <h2 className="mb-3.5 font-serif text-[28px] font-medium text-paper">
            See what's hiding in your own Stripe data.
          </h2>
          <p className="mb-7 text-[15px] text-[#C9C7BD]">
            Takes about two minutes to connect. Nothing changes until you say so.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-paper bg-paper px-5.5 py-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-[#EDEAE0]"
          >
            See a live example ↗
          </Link>
        </div>
      </Reveal>

      <footer className="px-8 pb-12 text-center text-[13px] text-ink-faint">
        Revenue Leak Detector — a quiet second look at your pricing.
      </footer>
    </div>
  );
}
