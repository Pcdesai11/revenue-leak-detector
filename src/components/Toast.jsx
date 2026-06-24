export default function Toast({ message, show }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-7 left-1/2 z-50 max-w-[90vw] rounded-lg bg-[#1C1C1A] px-5 py-2.5 text-[13.5px] text-[#FAF9F6] shadow-[0_8px_32px_rgba(28,28,26,0.18)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
        show
          ? '-translate-x-1/2 translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-x-1/2 translate-y-6 scale-95 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
