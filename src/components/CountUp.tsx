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
  const [display, setDisplay] = useState(0);
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
      {format(display, decimals)}
      {suffix}
    </span>
  );
}
