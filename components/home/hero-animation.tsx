'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const MESSAGE = 'Hello, Watch!';

// A phone types "Hello, Watch!", sends it as a paper plane, and the Watch shows it. Plays once.
// The markup is the final frame, so readers with reduced motion (or no JS) see the message arrived.
export function HeroAnimation() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const q = gsap.utils.selector(svg);
      const typed = svg.querySelector<SVGTextElement>('#typed')!;
      const flight = svg.querySelector<SVGPathElement>('#flight')!;
      const cursor = q('#cursor');
      const mm = gsap.matchMedia();

      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
        ({ conditions }) => {
          if (conditions?.reduce) {
            gsap.set(svg, { autoAlpha: 1 });
            return;
          }

          // Start frame: empty field, no plane, Watch screen without the message.
          const typing = { chars: 0 };
          gsap.set(svg, { autoAlpha: 1 });
          gsap.set(q('#notification'), { autoAlpha: 0, y: 12 });
          gsap.set([q('#plane'), flight], { autoAlpha: 0 });
          gsap.set(q('#placeholder'), { autoAlpha: 0 });
          gsap.set(cursor, { autoAlpha: 1, x: 0 });
          typed.textContent = '';

          const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.3 });

          tl.from(q('#phone'), { x: -24, autoAlpha: 0, duration: 0.6 })
            .from(q('#watch'), { x: 24, autoAlpha: 0, duration: 0.6 }, '<0.1')
            .addLabel('type', '+=0.2')
            .to(
              typing,
              {
                chars: MESSAGE.length,
                duration: 1.1,
                ease: 'none',
                onUpdate: () => {
                  typed.textContent = MESSAGE.slice(0, Math.round(typing.chars));
                  gsap.set(cursor, { x: typed.getComputedTextLength() });
                },
              },
              'type',
            )
            .addLabel('send', '+=0.25')
            .to(q('#send'), { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut', svgOrigin: '120 272' }, 'send')
            .to([typed, cursor], { y: -10, autoAlpha: 0, duration: 0.3 }, 'send+=0.15')
            .to(q('#placeholder'), { autoAlpha: 1, duration: 0.3 }, '>')
            .to(flight, { autoAlpha: 0.6, duration: 0.3 }, 'send+=0.2')
            .fromTo(q('#plane'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, 'send+=0.2')
            .to(
              q('#plane'),
              {
                duration: 1.3,
                ease: 'power1.inOut',
                motionPath: { path: flight, align: flight, alignOrigin: [0.5, 0.5], autoRotate: true },
              },
              'send+=0.2',
            )
            .addLabel('arrive')
            .to(q('#plane'), { autoAlpha: 0, scale: 0.4, duration: 0.2 }, 'arrive')
            .to(flight, { autoAlpha: 0, duration: 0.4 }, 'arrive')
            .to(
              q('#watch'),
              { keyframes: { rotation: [-4, 4, -3, 3, 0] }, duration: 0.5, ease: 'none', svgOrigin: '415 195' },
              'arrive',
            )
            .to(q('#notification'), { autoAlpha: 1, y: 0, duration: 0.45 }, 'arrive+=0.1');
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
      <svg
        ref={root}
        viewBox="0 0 520 380"
        role="img"
        aria-label="An iPhone sends “Hello, Watch!”, and the message arrives on an Apple Watch."
        className="hero-animation invisible h-auto w-full max-w-[520px] fill-none stroke-fd-foreground"
        strokeWidth={2}
      >
        {/* Phone */}
        <g id="phone">
          <rect x="30" y="30" width="180" height="320" rx="32" className="fill-fd-background" />
          <rect x="95" y="46" width="50" height="14" rx="7" className="fill-fd-foreground" stroke="none" />
          <text x="120" y="120" textAnchor="middle" className="fill-fd-muted-foreground text-[13px]" stroke="none">
            To: Apple Watch
          </text>
          <rect x="48" y="200" width="144" height="42" rx="12" />
          <text id="placeholder" x="62" y="226" className="fill-fd-muted-foreground text-[15px]" stroke="none">
            Message
          </text>
          <text id="typed" x="62" y="226" className="fill-fd-foreground text-[15px]" stroke="none" />
          <line id="cursor" x1="63" y1="211" x2="63" y2="231" className="invisible stroke-[var(--hero-accent)]" />
          <g id="send">
            <rect x="48" y="252" width="144" height="40" rx="20" className="fill-[var(--hero-accent)]" stroke="none" />
            <text x="120" y="277" textAnchor="middle" className="fill-white text-[14px] font-semibold" stroke="none">
              Send Message
            </text>
          </g>
        </g>

        {/* Flight */}
        <path
          id="flight"
          d="M196,262 C255,110 320,70 392,140"
          className="invisible stroke-[var(--hero-accent)]"
          strokeDasharray="4 7"
          strokeLinecap="round"
        />
        <g id="plane" className="invisible">
          <path
            d="M0,10 L32,0 L0,-10 L7,0 Z M7,0 L32,0"
            className="fill-[var(--hero-accent)] stroke-[var(--hero-accent)]"
            strokeLinejoin="round"
          />
        </g>

        {/* Watch */}
        <g id="watch">
          <rect x="375" y="40" width="80" height="62" rx="12" className="fill-fd-background" />
          <rect x="375" y="288" width="80" height="62" rx="12" className="fill-fd-background" />
          <rect x="484" y="150" width="10" height="30" rx="4" className="fill-fd-background" />
          <rect x="485" y="196" width="7" height="22" rx="3" className="fill-fd-background" />
          <rect x="345" y="95" width="140" height="200" rx="42" className="fill-fd-background" />
          <rect x="357" y="107" width="116" height="176" rx="32" className="fill-fd-muted" stroke="none" />
          <text x="452" y="134" textAnchor="end" className="fill-fd-muted-foreground text-[11px]" stroke="none">
            10:09
          </text>
          <g id="notification">
            <circle cx="380" cy="160" r="9" className="fill-[var(--hero-accent)]" stroke="none" />
            <text x="396" y="164" className="fill-fd-muted-foreground text-[11px]" stroke="none">
              iPhone
            </text>
            <text x="372" y="204" className="fill-fd-foreground text-[18px] font-medium" stroke="none">
              Hello,
            </text>
            <text x="372" y="228" className="fill-fd-foreground text-[18px] font-medium" stroke="none">
              Watch!
            </text>
          </g>
        </g>
      </svg>
      <noscript>
        <style>{'.hero-animation { visibility: visible !important; }'}</style>
      </noscript>
    </>
  );
}
