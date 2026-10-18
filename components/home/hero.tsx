import Link from 'next/link';
import { libraryRepoUrl } from '@/lib/shared';
import { HeroAnimation } from './hero-animation';
import { HeroBackground } from './hero-background';

// The home page's top box, laid out like the Fumadocs homepage: title and buttons on the left,
// the phone-to-Watch animation on the right, over a drifting-blob and dot-grid background. Stacks on
// narrow screens.
export function Hero({ headline }: { headline: string }) {
  // The last word ("Expo") and its logo stay on one line.
  const words = headline.split(' ');
  const lastWord = words.pop();

  return (
    <section className="relative isolate mb-12 flex flex-col overflow-hidden rounded-2xl border md:min-h-[600px] md:flex-row">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <HeroBackground />
      </div>
      <div className="flex flex-col gap-8 p-6 md:w-1/2 md:p-12 lg:w-3/5">
        <h1 className="text-4xl leading-tight font-medium xl:text-5xl">
          {words.join(' ')}{' '}
          <span className="whitespace-nowrap">
            {lastWord}
            <ExpoLogo />
          </span>
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/installation"
            className="rounded-full bg-[var(--hero-accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <a
            href={libraryRepoUrl}
            className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:w-1/2 lg:w-2/5">
        <HeroAnimation />
      </div>
    </section>
  );
}

// The Expo logo, sized to the headline text and filled with its colour so it shows in both themes.
function ExpoLogo() {
  return (
    <svg
      viewBox="0 0 256 231"
      preserveAspectRatio="xMidYMid"
      aria-hidden
      className="ml-[0.25em] inline-block h-[0.8em] w-auto align-baseline"
    >
      <path
        d="M121 85c2-3 5-4 7-4 1 0 5 1 7 4 16 22 43 67 63 101l26 40c7 8 18 3 24-6s8-15 8-22c0-4-88-168-97-182-9-13-11-16-26-16h-11c-14 0-16 3-25 16C88 30 0 194 0 198c0 7 2 13 8 22s17 14 24 6l26-40c20-34 47-79 63-101Z"
        fill="currentColor"
      />
    </svg>
  );
}
