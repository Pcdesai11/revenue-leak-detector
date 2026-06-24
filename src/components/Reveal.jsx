import { useEffect, useRef, useState } from 'react';

/**
 * Wraps children and fades/rises them in once they scroll into view.
 * Use `delay` (ms) to stagger multiple Reveals in the same section.
 */
export default function Reveal({ children, delay = 0, className = '', blur = false }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setInView(true), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView
          ? 'translate-y-0 scale-100 opacity-100 blur-0'
          : `translate-y-5 scale-[0.98] opacity-0 ${blur ? 'blur-[4px]' : ''}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
