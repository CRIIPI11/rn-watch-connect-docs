import { getHome } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const home = getHome();
  return { title: { absolute: home.title }, description: home.description };
}

export default function HomePage() {
  const home = getHome();
  const MDX = home.body;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-4xl leading-tight font-medium xl:text-5xl">{home.headline}</h1>
      {/* The intro paragraph uses the same type scale as the Fumadocs homepage intro. */}
      <article className="prose [&>p:first-of-type]:text-2xl [&>p:first-of-type]:leading-snug [&>p:first-of-type]:font-light [&>p:first-of-type]:tracking-tight md:[&>p:first-of-type]:text-3xl xl:[&>p:first-of-type]:text-4xl">
        <MDX components={getMDXComponents()} />
      </article>
    </main>
  );
}
