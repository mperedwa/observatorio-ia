'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 2000;

function parseValue(raw: string): { num: number; suffix: string; decimals: number } {
  const match = raw.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: raw, decimals: 0 };
  const numStr = match[1];
  const dot = numStr.indexOf('.');
  return {
    num: parseFloat(numStr),
    suffix: match[2],
    decimals: dot >= 0 ? numStr.length - dot - 1 : 0,
  };
}

function format(current: number, decimals: number): string {
  if (decimals === 0) return Math.round(current).toString();
  return current.toFixed(decimals);
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const { num, suffix, decimals } = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  // SSR + non-JS crawlers (ChatGPT WebBrowse, social-preview fetchers, RSS
  // readers, screen-reader pre-render): initial state is the FINAL value, so
  // the rendered HTML carries the real number (e.g. "21 proyectos") instead
  // of the previous "0" that came from `useState(0)`. The IntersectionObserver
  // effect below resets to 0 and animates up only after hydration on the
  // client — so JS-enabled users still see the count-up animation when the
  // element enters the viewport. A `<noscript>` shadow holds the literal
  // raw value (with original suffix) as a belt-and-suspenders fallback for
  // any consumer that strips out client `<span>` interactivity.
  const [display, setDisplay] = useState(num);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setDisplay(num);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      // Reset to 0 ONLY at the moment we start animating, so SSR output (and
      // hydration's first paint) keep the final value visible until the user
      // actually scrolls the element into view.
      setDisplay(0);
      const t0 = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const elapsed = now - t0;
        const p = Math.min(1, elapsed / DURATION_MS);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(num * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [num]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="false">
        {format(display, decimals)}
        {suffix}
      </span>
      <noscript>{value}</noscript>
    </span>
  );
}
