import { defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { transformerTwoslash } from 'fumadocs-twoslash';

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // `ts twoslash` code blocks are type-checked against the pinned rn-watch-connect:
      // a type error in an example fails the build.
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerTwoslash()],
      // Twoslash popups can't lazy-load languages, so load them up front.
      langs: ['js', 'jsx', 'ts', 'tsx'],
    },
  },
});
