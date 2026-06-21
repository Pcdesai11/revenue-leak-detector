import { Link } from 'react-router-dom';

export default function Nav({ variant = 'landing' }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div
        className={`mx-auto flex items-center justify-between px-6 py-4 ${
          variant === 'landing' ? 'max-w-[1080px] px-8' : 'max-w-[800px]'
        }`}
      >
        <div className="font-serif text-[17px] font-semibold tracking-tight">
          Revenue Leak Detector
        </div>

        {variant === 'landing' ? (
          <div className="flex items-center gap-7">
            <a href="#how" className="text-sm text-ink-soft transition-colors hover:text-ink">
              How it works
            </a>
            <a href="#principle" className="text-sm text-ink-soft transition-colors hover:text-ink">
              Why it's careful
            </a>
            <Link
              to="/dashboard"
              className="rounded-md bg-ink px-4.5 py-2 text-sm font-medium text-paper"
            >
              See a live example ↗
            </Link>
          </div>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[13.5px] text-ink-faint transition-colors hover:text-ink"
          >
            ← Back
          </Link>
        )}
      </div>
    </nav>
  );
}
