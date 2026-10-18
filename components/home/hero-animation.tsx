'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, MotionPathPlugin, MorphSVGPlugin);

const MESSAGE = 'Hello, Watch!';

// A rounded rectangle as path data, so MorphSVG can morph it into the other outlines.
function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
}

// One outline morphs through three shapes, all centred on (200, 220).
const PHONE = roundedRect(108, 20, 184, 400, 40); // about a real iPhone's 19.5:9
const PLANE = 'M290,220 L120,162 L158,220 L120,278 Z'; // a paper plane, nose to the right
const WATCH = roundedRect(118, 122, 164, 196, 44); // about a real Apple Watch's case

// The phone types "Hello, Watch!" and taps Send Message, folds into a paper plane that loops in place
// for about a second, and unfolds into the Watch showing the message. Plays once.
// The markup is the final frame, so readers with reduced motion (or no JS) see the message arrived.
export function HeroAnimation() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current!;
      const q = gsap.utils.selector(svg);
      const body = svg.querySelector<SVGPathElement>('#body')!;
      const typed = svg.querySelector<SVGTextElement>('#typed')!;
      const cursor = q('#cursor');
      const mm = gsap.matchMedia();

      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
        ({ conditions }) => {
          if (conditions?.reduce) {
            gsap.set(svg, { autoAlpha: 1 });
            return;
          }

          // Start frame: the phone, with an empty text field.
          const typing = { chars: 0 };
          gsap.set(body, { attr: { d: PHONE } });
          gsap.set(q('#phone-ui'), { autoAlpha: 1 });
          gsap.set([q('#watch-ui'), q('#watch-screen'), q('#fold')], { autoAlpha: 0 });
          gsap.set(q('#notification'), { autoAlpha: 0, y: 10 });
          gsap.set(q('#placeholder'), { autoAlpha: 0 });
          gsap.set(cursor, { autoAlpha: 1, x: 0 });
          gsap.set(q('#craft'), { transformOrigin: '50% 50%' });
          typed.textContent = '';
          gsap.set(svg, { autoAlpha: 1 });

          const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.3 });

          tl.from([body, q('#phone-ui')], { y: 16, autoAlpha: 0, duration: 0.6 })
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
            .to(q('#send'), { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut', svgOrigin: '200 362' }, 'send')
            .to(q('#phone-ui'), { autoAlpha: 0, duration: 0.25 }, 'send+=0.3')
            // Fold: the phone outline becomes the paper plane.
            .addLabel('fold', '>')
            .to(body, { morphSVG: PLANE, duration: 0.45, ease: 'power2.inOut' }, 'fold')
            .to(q('#fold'), { autoAlpha: 1, duration: 0.2 }, 'fold+=0.3')
            // Flight: one loop in place, about a second.
            .addLabel('flight', '>')
            .to(
              q('#craft'),
              {
                duration: 1,
                ease: 'power1.inOut',
                motionPath: {
                  path: [
                    { x: 0, y: 0 },
                    { x: 60, y: -20 },
                    { x: 55, y: -85 },
                    { x: -15, y: -105 },
                    { x: -70, y: -50 },
                    { x: -45, y: 10 },
                    { x: 0, y: 0 },
                  ],
                  curviness: 1.2,
                  autoRotate: true,
                },
              },
              'flight',
            )
            .to(q('#craft'), { rotation: 0, duration: 0.2 }, '>-0.1')
            // Unfold: the plane becomes the Watch, and the message arrives.
            .addLabel('unfold', '>')
            .to(q('#fold'), { autoAlpha: 0, duration: 0.15 }, 'unfold')
            .to(body, { morphSVG: WATCH, duration: 0.45, ease: 'power2.inOut' }, 'unfold')
            .to([q('#watch-ui'), q('#watch-screen')], { autoAlpha: 1, duration: 0.3 }, 'unfold+=0.35')
            .to(q('#notification'), { autoAlpha: 1, y: 0, duration: 0.45 }, '>-0.05');
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
        viewBox="0 0 400 440"
        role="img"
        aria-label="An iPhone sends “Hello, Watch!”, which flies as a paper plane and arrives on an Apple Watch."
        className="hero-animation invisible h-auto w-full max-w-[400px] fill-none stroke-fd-foreground"
        strokeWidth={2}
      >
        {/* Watch bands and crown sit behind the morphing outline. */}
        <g id="watch-ui">
          <rect x="146" y="56" width="108" height="72" rx="14" className="fill-fd-background" />
          <rect x="146" y="312" width="108" height="72" rx="14" className="fill-fd-background" />
          <rect x="280" y="170" width="11" height="34" rx="4" className="fill-fd-background" />
          <rect x="281" y="216" width="8" height="22" rx="3" className="fill-fd-background" />
        </g>

        {/* The one outline: phone → paper plane → Watch. Its markup is the Watch (the final frame). */}
        <g id="craft">
          <path id="body" d={WATCH} className="fill-fd-background" strokeLinejoin="round" />
          <path id="fold" d="M158,220 L290,220" className="invisible" strokeLinecap="round" />
        </g>

        {/* Phone screen */}
        <g id="phone-ui" className="invisible">
          <rect x="172" y="36" width="56" height="16" rx="8" className="fill-fd-foreground" stroke="none" />
          <rect x="126" y="300" width="148" height="42" rx="21" />
          <text id="placeholder" x="144" y="326" className="fill-fd-muted-foreground text-[15px]" stroke="none">
            Message
          </text>
          <text id="typed" x="144" y="326" className="fill-fd-foreground text-[15px]" stroke="none" />
          <line id="cursor" x1="145" y1="311" x2="145" y2="331" className="invisible stroke-[var(--hero-accent)]" />
          <g id="send">
            <rect x="126" y="352" width="148" height="40" rx="20" className="fill-[var(--hero-accent)]" stroke="none" />
            <text x="200" y="377" textAnchor="middle" className="fill-white text-[14px] font-semibold" stroke="none">
              Send Message
            </text>
          </g>
        </g>

        {/* Watch screen */}
        <g id="watch-screen">
          <rect x="130" y="134" width="140" height="172" rx="34" className="fill-fd-muted" stroke="none" />
          <text x="248" y="160" textAnchor="end" className="fill-fd-muted-foreground text-[12px]" stroke="none">
            10:09
          </text>
          <g id="notification">
            <circle cx="156" cy="186" r="9" className="fill-[var(--hero-accent)]" stroke="none" />
            <text x="172" y="190" className="fill-fd-muted-foreground text-[12px]" stroke="none">
              iPhone
            </text>
            <text x="148" y="232" className="fill-fd-foreground text-[22px] font-medium" stroke="none">
              Hello,
            </text>
            <text x="148" y="260" className="fill-fd-foreground text-[22px] font-medium" stroke="none">
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
