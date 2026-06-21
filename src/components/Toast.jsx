export default function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 rounded-lg bg-ink px-5 py-2.5 text-[13.5px] text-paper shadow-lg transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}
