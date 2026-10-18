'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Each card's glow colour.
const COLORS = {
  blue: '#0a84ff',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  emerald: '#10b981',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
} as const;

// How many of the 6 columns a card takes on large screens. Wide cards also span both columns on
// medium screens.
const SPANS = {
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'md:col-span-2 lg:col-span-4',
  6: 'md:col-span-2 lg:col-span-6',
} as const;

// The "Why rn-watch-connect" cards on the home page: a bento grid whose cards fade up into place as
// they scroll into view. With reduced motion they're simply there.
export function WhyGrid({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.why-card', { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch('.why-card', {
          start: 'top 85%',
          once: true,
          onEnter: (cards) =>
            gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="not-prose my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
      {children}
    </div>
  );
}

export function WhyCard({
  title,
  color,
  span,
  href,
  linkText,
  children,
}: {
  title: string;
  color: keyof typeof COLORS;
  span: keyof typeof SPANS;
  href: string;
  linkText: string;
  children: ReactNode;
}) {
  const glow = `radial-gradient(circle at 50% 50%, color-mix(in oklab, ${COLORS[color]} 22%, transparent), transparent 70%)`;

  return (
    <div
      className={`why-card flex min-h-[220px] flex-col gap-3 rounded-2xl border bg-fd-card p-8 ${SPANS[span]}`}
      style={{ backgroundImage: glow }}
    >
      <h3 className="text-xl font-medium">{title}</h3>
      <div className="text-fd-muted-foreground [&_a]:text-fd-foreground [&_a]:underline [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-fd-foreground">
        {children}
      </div>
      <Link href={href} className="mt-auto pt-2 text-sm font-medium text-fd-foreground hover:underline">
        {linkText} →
      </Link>
    </div>
  );
}
