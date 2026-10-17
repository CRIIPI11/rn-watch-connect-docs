import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Required by fumadocs-twoslash.
  serverExternalPackages: ['typescript'],
  async redirects() {
    // There's no /docs index page: the docs start at the first API page.
    return [{ source: '/docs', destination: '/docs/watch-status', permanent: false }];
  },
};

export default withMDX(config);
