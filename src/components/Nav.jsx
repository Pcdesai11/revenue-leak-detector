import { Link } from 'react-router-dom';

export default function Nav({ variant = 'landing', isDark, setIsDark }) {
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

        <div className="flex items-center gap-5">
          {variant === 'landing' && (
            <div className="hidden items-center gap-7 sm:flex">
              <a href="#how" className="text-sm text-ink-soft transition-colors hover:text-ink">
                How it works
              </a>
              <a
                href="#principle"
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                Why it's careful
              </a>
            </div>
          )}

          <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />

          {variant === 'landing' ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-ink px-4.5 py-2 text-sm font-medium text-paper"
            >
              See a live example ↗
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[13.5px] text-ink-faint transition-colors hover:text-ink"
            >
              ← Back
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function DarkModeToggle({ isDark, setIsDark }) {
  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-paper-warm text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
