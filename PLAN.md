# Build plan: rn-watch-connect docs site

Implements `DECISIONS.md`. Steps 1–3 are done. **Deploying is the last step:** until then, check every PR locally (`npm run build`, `npm run dev`). Each step is one branch and one PR into `master`, unless it says otherwise. Read each tool's current docs before writing code (Fumadocs, Next.js 16, Twoslash, GSAP), because their APIs change.

## 1. Scaffold the repo

- `git init` this folder on `master`. Commit `HANDOFF.md`, `DECISIONS.md` and `PLAN.md` first.
- Create the Fumadocs app with its current CLI: Next.js, `fumadocs-mdx`, npm.
- Add `AGENTS.md`: library source paths, "public API only", "use glossary terms", and a link to `DECISIONS.md`.
- **Needs go-ahead:** create the GitHub repo `CRIIPI11/rn-watch-connect-docs` (public) and push `master`.
- **Done when:** `npm run dev` serves the Fumadocs starter, and `master` is on GitHub.

## 2. Site skeleton

- Navigation and slugs from the `DECISIONS.md` table. Each page is a stub with only its frontmatter `title` and `description` (the description names the page's entries).
- `/docs` redirects to `/docs/watch-status`.
- Home page at `app/(home)/page.tsx` renders `content/home.mdx` (a stub for now).
- Install `rn-watch-connect@2.0.0` as a dev dependency. The header label "Docs for rn-watch-connect 2.0" reads its version.
- Turn on Twoslash, and prove it with one example that imports `rn-watch-connect`. **Risk to check early:** the library's types need its React Native and Expo peer dependencies to resolve. If Twoslash can't type them, stop and bring the options to the user.
- **Done when:** every slug renders, the redirect works, a deliberately wrong example fails `npm run build`, and a correct one passes.

## 3. `llms` output

> Done together with step 2, because the skeleton's stubs were needed to check it.

- Turn on Fumadocs' `llms()` integration (`includeProcessedMarkdown`).
- `/llms.txt`: the text of `home.mdx`, then the generated index.
- `/llms-full.txt`: the text of `home.mdx`, then every page, Migration last.
- `/docs/<page>.md`: per-page Markdown.
- **Done when:** all three outputs come from the stubs, the home text appears first, and each index line shows its description.

## 4. Content

Write every page from the library's public sources (`README.md`, `CHANGELOG.md`, `GLOSSARY.md`, `src/RnWatchConnect.types.ts`, `example/App.tsx`), never from memory. Each entry has: signature, parameters, what it returns or sends, what it throws, and an example that Twoslash checks. The "must cover" notes in `HANDOFF.md` go on the page of the entry they concern.

These pages don't depend on each other, so they can run as parallel sessions now that step 2 has landed, each on its own branch:

- 4a. `home.mdx`: installation guide, Features placeholder overview, both callouts.
- 4b. Watch status.
- 4c. Messages, and 4d. Data Messages: the `reply` function first, then the deprecated `replyTo…` methods.
- 4e. Application Context.
- 4f. User Info, and 4g. File Transfer: finish events, Transfer ids, Received files.
- 4h. Error codes.
- 4i. Migrating from 1.x to 2.0: steps for app code, with a before/after `reply` example.

- **Done when:** every entry in the `DECISIONS.md` table is documented, `npm run build` passes with Twoslash, and the glossary's "Avoid" words don't appear on the site.

## 5. Review the AI output

- Read the local `llms.txt` and `llms-full.txt` (`npm run dev`) with the `writing-for-agents` skill: is the index scannable, and are the key rules first? Fix them through the pages, not by editing the files.

## 6. Home page animation

> Done: see "Home page animation" in `DECISIONS.md`.

- A short GSAP intro on the home page: `useGSAP` in a `"use client"` component. It never hides or delays the text.
- Waits for the user's design. The home overview (Q12) is decided at the same time.

## 7. Deploy (last)

- **Needs go-ahead:** create the Vercel project (Hobby) linked to the GitHub repo, and claim `rn-watch-connect.vercel.app`. If that name is taken, bring alternatives to the user, since the URL is permanent.
- Make the links in `llms.txt`, `llms-full.txt` and `/docs/*.md` absolute, using the site URL (`toAgentMarkdown` and `llmsIndex` in `lib/source.ts`).
- Check the deployed `/`, every `/docs` page, `/llms.txt`, `/llms-full.txt` and a `/docs/<page>.md`.
- **Done when:** `master` deploys to production, and a PR gets a preview URL.

## 8. Library follow-ups (in the library repo, after deploy)

- Shrink the README, set `homepage` to the site URL, and add an "update the docs site" item to the release checklist. One issue → branch → PR into the library's `master`.
