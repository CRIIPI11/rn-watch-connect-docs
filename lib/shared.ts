import { createGetUrl } from 'fumadocs-core/source';
import libraryPackage from 'rn-watch-connect/package.json';

export const appName = 'rn-watch-connect';

// The production site. llms output uses it for absolute links; content/docs/ai-agents.mdx spells it out too.
export const siteUrl = 'https://rn-watch-connect.vercel.app';

// The documented version ("2.0"), read from the pinned dev dependency so the label can't drift.
export const libraryVersion = libraryPackage.version.split('.').slice(0, 2).join('.');

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// The library this site documents (the navbar's GitHub link).
export const libraryRepoUrl = 'https://github.com/CRIIPI11/rn-watch-connect';

// This site's own repo ("Edit on GitHub" links).
export const gitConfig = {
  user: 'CRIIPI11',
  repo: 'rn-watch-connect-docs',
  branch: 'master',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
