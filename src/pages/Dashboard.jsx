import { useState } from 'react';
import Nav from '../components/Nav';
import FlagCard from '../components/FlagCard';
import Toast from '../components/Toast';
import { useCountUp } from '../hooks/useCountUp';
import { flags as initialFlags, summary } from '../data/flags';

export default function Dashboard({ isDark, setIsDark }) {
  const [resolutions, setResolutions] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });

  const statTotal = useCountUp(summary.customersReviewed, { duration: 700 });
  const statFlags = useCountUp(summary.flagsFound, { duration: 500, delay: 150 });
  const statUpside = useCountUp(summary.potentialUpside, { duration: 900, delay: 300 });

  const openCount = initialFlags.length - Object.keys(resolutions).length;

  function handleResolve(id, kind) {
    setResolutions((prev) => ({ ...prev, [id]: kind }));
    setToast({
      show: true,
      message:
        kind === 'reviewed'
          ? "Marked reviewed. We'll check in if nothing changes in 30 days."
          : "Dismissed. This customer won't be flagged again for this reason.",
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
  }

  return (
    <div>
      <Nav variant="dashboard" isDark={isDark} setIsDark={setIsDark} />

      <div className="mx-auto max-w-[800px] px-6 pb-24 pt-11">
        <header className="mb-9 border-b border-line pb-7.5">
          <div className="mb-5.5 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ledger" />
            Connected to Stripe — synced 4 min ago
          </div>
          <h1 className="mb-2.5 max-w-[520px] font-serif text-[24px] font-medium leading-tight tracking-tight md:text-[28px]">
            3 customers are probably underpriced
          </h1>
          <p className="max-w-[480px] text-[14.5px] text-ink-soft">
            Based on tenure, payment history, and how similar customers are priced. These are
            flags worth a look — not instructions.
          </p>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          <SummaryCell label="Customers reviewed" value={statTotal.toLocaleString()} />
          <SummaryCell label="Flags found" value={statFlags.toLocaleString()} flagged />
          <SummaryCell label="Potential annual upside" value={`$${statUpside.toLocaleString()}`} />
        </div>

        <div className="mb-4 flex items-center justify-between text-[12.5px] uppercase tracking-wide text-ink-faint">
          <span>Worth a look</span>
          <span className="text-ink-soft normal-case tracking-normal">{openCount} open</span>
        </div>

        <div className="mb-12 flex flex-col gap-3.5">
          {initialFlags.map((flag, i) => (
            <FlagCard
              key={flag.id}
              flag={flag}
              index={i}
              onResolve={handleResolve}
              resolution={resolutions[flag.id]}
            />
          ))}
        </div>

        <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-ink-faint">
          <strong className="font-medium text-ink-soft">How this works:</strong> we compare each
          customer's price against others with similar tenure and billing volume — we don't know
          your business reasons for a price, so we flag, you decide. Dismissed flags with a reason
          won't be raised again.
        </p>
      </div>

      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}

function SummaryCell({ label, value, flagged }) {
  return (
    <div className="bg-paper-warm px-5 py-4.5 transition-colors hover:bg-[#EDEAE0] dark:hover:bg-[#222220]">
      <div className="mb-1.5 text-[11.5px] uppercase tracking-wide text-ink-faint">{label}</div>
      <div className={`font-serif text-[23px] font-medium ${flagged ? 'text-flag' : ''}`}>
        {value}
      </div>
    </div>
  );
}
