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
      <h1 className="text-3xl font-bold mb-4">{home.title}</h1>
      <article className="prose">
        <MDX components={getMDXComponents()} />
      </article>
    </main>
  );
}
