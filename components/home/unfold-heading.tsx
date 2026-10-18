'use client';

import { useRef, type ComponentProps } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// The home page's section headings. When one scrolls into view, its words drop in one after another,
// each unfolding down from its top edge like a banner unrolling. With reduced motion it's simply there.
export function UnfoldHeading({ className, ...props }: ComponentProps<'h2'>) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(ref.current!, { type: 'words' });
        gsap.set(split.words, { rotationX: -90, y: -24, autoAlpha: 0, transformOrigin: '50% 0%' });
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top 85%',
          once: true,
          onEnter: () =>
            gsap.to(split.words, {
              rotationX: 0,
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: 'back.out(1.6)',
              stagger: 0.08,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h2
      ref={ref}
      className={`text-2xl font-medium tracking-tight [perspective:600px] md:text-[28px] xl:text-3xl ${className ?? ''}`}
      {...props}
    />
  );
}
