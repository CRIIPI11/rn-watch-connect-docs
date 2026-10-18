import Link from 'next/link';
import { libraryRepoUrl } from '@/lib/shared';
import { HeroAnimation } from './hero-animation';

// The home page's top box, laid out like the Fumadocs homepage: title and buttons on the left,
// the phone-to-Watch animation on the right. Stacks on narrow screens.
export function Hero({ headline }: { headline: string }) {
  return (
    <section className="mb-12 flex flex-col overflow-hidden rounded-2xl border md:min-h-[600px] md:flex-row">
      <div className="flex flex-col gap-8 p-6 md:w-1/2 md:p-12 lg:w-3/5">
        <h1 className="text-4xl leading-tight font-medium xl:text-5xl">{headline}</h1>
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
