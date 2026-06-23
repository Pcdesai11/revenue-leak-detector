import { useEffect, useState } from 'react';

export default function FlagCard({ flag, index, onResolve, resolution }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 250 + index * 110);
    return () => clearTimeout(t);
  }, [index]);

  const isResolved = Boolean(resolution);

  return (
    <div
      className={`rounded-lg border bg-paper-warm p-6 transition-all duration-500 ${
        entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      } ${
        isResolved
          ? 'scale-[0.99] opacity-55'
          : 'border-line hover:-translate-y-0.5 hover:border-ink-faint/60 hover:shadow-[0_4px_16px_rgba(28,28,26,0.06)] dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="mb-3.5 flex items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-medium">{flag.name}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-faint">{flag.meta}</div>
        </div>
        <div
          className={`flex-shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors duration-300 ${
            isResolved ? 'bg-line/60 text-ink-faint' : 'bg-flag-bg text-flag'
          }`}
        >
          {flag.gapPercent}% below peers
        </div>
      </div>

      <p className="mb-4.5 text-[14px] leading-relaxed text-ink">
        {flag.sentence.before}{' '}
        <span className="font-semibold">{flag.sentence.total}</span>{' '}
        {flag.sentence.mid1}{' '}
        <span className="font-semibold">{flag.sentence.tenure}</span>
        {flag.sentence.mid2}{' '}
        {flag.sentence.gap && <span className="font-semibold">{flag.sentence.gap}</span>}{' '}
        {flag.sentence.after}
      </p>

      <div className="mb-4.5">
        <div className="mb-1.5 flex justify-between text-[11px] text-ink-faint">
          <span>{flag.peerLow}</span>
          <span>Peer range</span>
          <span>{flag.peerHigh}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#EFEDE5] dark:bg-[#2A2A26]">
          <div
            className="absolute top-0 bottom-0 rounded-full bg-ledger-bg transition-transform duration-700 ease-out"
            style={{
              left: `${flag.rangeStart}%`,
              width: `${flag.rangeWidth}%`,
              transform: entered ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />
          <div
            title={flag.dotLabel}
            className="absolute -top-[3px] h-3 w-3 rounded-full border-2 border-paper bg-flag transition-transform duration-300"
            style={{
              left: `${flag.dotPosition}%`,
              transform: `translateX(-50%) scale(${entered ? 1 : 0})`,
              transitionDelay: '0.5s',
            }}
          />
        </div>
      </div>

      <div className="flex gap-2.5 border-t border-line pt-3.5">
        {isResolved ? (
          <button disabled className="cursor-default border-none bg-transparent italic text-ink-faint">
            {resolution === 'reviewed'
              ? "✓ Marked reviewed — you'll follow up"
              : "Dismissed — won't be flagged again"}
          </button>
        ) : (
          <>
            <button
              onClick={() => onResolve(flag.id, 'reviewed')}
              className="rounded-md border border-ledger bg-ledger px-3.5 py-1.5 text-[13px] font-medium text-paper transition-all hover:-translate-y-px hover:bg-[#244e41] dark:text-ink"
            >
              Mark reviewed
            </button>
            <button
              onClick={() => onResolve(flag.id, 'dismissed')}
              className="rounded-md border border-line bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink transition-all hover:-translate-y-px hover:border-ink-faint"
            >
              Dismiss — there's a reason
            </button>
          </>
        )}
      </div>
    </div>
  );
}
