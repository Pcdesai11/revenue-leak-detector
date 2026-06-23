const TAPE_ITEMS = [
  { label: 'Harborline Studio', detail: '25% below peers', tone: 'flag' },
  { label: 'Northfield Logistics', detail: '18% below peers', tone: 'flag' },
  { label: 'Pearl & Co.', detail: 'discount still active 22 mo', tone: 'flag' },
  { label: 'Riverside Consulting', detail: 'reviewed, on track', tone: 'neutral' },
  { label: 'Avg. flag found', detail: '$6,100 / year', tone: 'gold' },
  { label: 'Brightline Media', detail: '12% below peers', tone: 'flag' },
  { label: 'Customers compared', detail: '24 this sync', tone: 'neutral' },
  { label: 'Cedar & Finch', detail: 'dismissed — VIP rate', tone: 'neutral' },
];

function ToneDot({ tone }) {
  const color =
    tone === 'flag' ? 'bg-flag' : tone === 'gold' ? 'bg-gold' : 'bg-ledger';
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}

function TapeRow({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={ariaHidden}>
      {TAPE_ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[13px]">
          <ToneDot tone={item.tone} />
          <span className="font-medium text-ink-soft">{item.label}</span>
          <span className="text-ink-faint">{item.detail}</span>
        </span>
      ))}
    </div>
  );
}

export default function TickerTape() {
  return (
    <div className="overflow-hidden border-b border-line bg-paper-warm/60 py-2.5">
      <div className="flex w-max animate-[tape-scroll_32s_linear_infinite] hover:[animation-play-state:paused]">
        <TapeRow />
        <TapeRow ariaHidden />
      </div>
    </div>
  );
}
