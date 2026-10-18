import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute, siteUrl } from './shared';
import { defineCollections, defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // `description` is the page's subtitle for people. `entries` names every property, method and
    // event on the page, for the llms.txt index, so an agent can find an entry by name.
    schema: pageSchema.extend({ entries: z.string() }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// The home page's text: rendered on `/`, and put at the top of llms.txt and llms-full.txt.
const homeCollection = defineCollections({
  type: 'doc',
  dir: 'content',
  files: ['home.mdx'],
  // `headline` is the big title on `/` (`title`, the library name, stays the browser tab title and the
  // llms heading). `llmsSkip` lists `##` sections and callouts (by title) written for people only, left
  // out of llms.txt and llms-full.txt.
  schema: pageSchema.extend({ headline: z.string(), llmsSkip: z.array(z.string()).default([]) }),
  postprocess: {
    includeProcessedMarkdown: true,
  },
});

export function getHome() {
  const home = homeCollection.get('home.mdx');
  if (!home) throw new Error('content/home.mdx is missing');
  return home;
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// The site's Markdown, rewritten for agents: plain code (no Twoslash markup), no heading anchors,
// callouts as blockquotes, and absolute links, with docs pages pointing to their `.md` version.
function toAgentMarkdown(markdown: string) {
  return markdown
    .replace(/^(```\w+)[^\n]*\btwoslash\b[^\n]*$/gm, '$1')
    .replace(/^[ \t]*\/\/[ \t]*(\^[?|~^]+|@\w+.*|---(cut|cut-after|cut-start|cut-end)---)[ \t]*\n/gm, '')
    .replace(/^(#{1,6} .*?) \[#[\w-]+\]$/gm, '$1')
    .replace(
      /^<Callout(?:[^>]*?title="([^"]*)")?[^>]*>\n([\s\S]*?)\n<\/Callout>$/gm,
      (_, title: string | undefined, body: string) => {
        const lines = body.replace(/^ {2}/gm, '').split('\n');
        if (title) lines.unshift(`**${title}**`, '');
        return lines.map((line) => (line ? `> ${line}` : '>')).join('\n');
      },
    )
    .replace(/\]\((\/docs\/[\w-]+)(#[\w-]+)?\)/g, ']($1.md$2)')
    .replace(/\]\(\//g, `](${siteUrl}/`);
}

// Drops each `##` section, or blockquote (a callout), whose heading or title is listed.
function skipSections(markdown: string, titles: string[]) {
  return titles.reduce(
    (text, title) =>
      text
        .replace(new RegExp(`^## ${title}\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm'), '')
        .replace(new RegExp(`^> \\*\\*${title}\\*\\*\\n(?:>.*\\n?)*\\n?`, 'm'), ''),
    markdown,
  );
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${siteUrl}${page.url})

${toAgentMarkdown(await page.data.getText('processed'))}`,
});

type PageTreeNode = ReturnType<typeof source.getPageTree>['children'][number];

// The pages in sidebar order (meta.json), so llms output reads like the site.
function pagesInNavOrder(nodes: PageTreeNode[] = source.getPageTree().children) {
  const out: { separator?: string; page?: NonNullable<ReturnType<typeof source.getNodePage>> }[] = [];
  for (const node of nodes) {
    if (node.type === 'separator') out.push({ separator: String(node.name ?? '') });
    else if (node.type === 'folder') out.push(...pagesInNavOrder(node.children));
    else {
      const page = source.getNodePage(node);
      if (page) out.push({ page });
    }
  }
  return out;
}

async function homeMarkdown() {
  const home = getHome();
  return `# ${home.title}

${skipSections(toAgentMarkdown(await home.getText('processed')), home.llmsSkip)}`.trimEnd();
}

// llms.txt: the home text, then one line per page linking to its Markdown version.
export async function llmsIndex() {
  const lines = pagesInNavOrder().map(({ separator, page }) =>
    page
      ? `- [${page.data.title}](${siteUrl}${page.url}.md): ${page.data.entries}`
      : `\n## ${separator}\n`,
  );
  return `${(await homeMarkdown()).trimEnd()}\n\n${lines.join('\n').trimStart()}\n`;
}

// llms-full.txt: the home text, then every page in full, in sidebar order.
export async function llmsFull() {
  const pages = pagesInNavOrder().flatMap(({ page }) => (page ? [page] : []));
  const rendered = await Promise.all(pages.map((page) => docsLlms.page(page)));
  return [await homeMarkdown(), ...rendered].join('\n\n');
}
