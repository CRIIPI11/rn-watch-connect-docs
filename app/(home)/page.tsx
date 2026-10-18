import { getHome } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { Hero } from '@/components/home/hero';
import { WhyCard, WhyGrid } from '@/components/home/why-grid';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const home = getHome();
  return { title: { absolute: home.title }, description: home.description };
}

export default function HomePage() {
  const home = getHome();
  const MDX = home.body;

  return (
    <main className="w-full px-4 py-12">
      {/* The hero box is wider than the text below it, like the Fumadocs homepage. */}
      <div className="mx-auto max-w-7xl">
        <Hero headline={home.headline} />
      </div>
      {/* The intro paragraph uses the same type scale as the Fumadocs homepage intro. */}
      <article className="prose mx-auto max-w-5xl [&>p:first-of-type]:text-2xl [&>p:first-of-type]:leading-snug [&>p:first-of-type]:font-light [&>p:first-of-type]:tracking-tight md:[&>p:first-of-type]:text-3xl xl:[&>p:first-of-type]:text-4xl">
        <MDX components={getMDXComponents({ WhyGrid, WhyCard })} />
      </article>
    </main>
  );
}
