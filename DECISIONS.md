# Decisions: rn-watch-connect docs site

Settled with the user on 2026-10-17, from the open questions in `HANDOFF.md`. Sources for the content are listed in `HANDOFF.md` ("Source material").

## Content

- **Scope:** the public API of `rn-watch-connect@2.x` (every property, method and event), plus the home page and the Migration page. No internals.
- **Versions:** 2.x only, no versioned docs. Users on Expo SDK < 57 or iOS 15 are pointed to the 1.x README (git tag `v1.2.0`, the last 1.x release).
- **Home page (`/`):** a custom React page holding:
  - a headline, "Talk to your watchOS app directly from Expo" (frontmatter `headline`; the library name stays the tab title and the llms heading);
  - an intro saying it's a library for communicating with your companion watchOS app from your Expo and React Native app, built for Expo;
  - a "Why rn-watch-connect" section: what sets the library apart, described on its own terms, with no comparison to other libraries named. Each point links to its page. How it's presented visually may still change with the animation work;
  - The text below the box is 1024 px wide (`max-w-5xl`). The box is wider, up to 1280 px (`max-w-7xl`), with the headline taking 3/5 of it on large screens so it fits on two lines.
  - The home page stays lean: setup lives on the Installation page.
- **Installation page (`/docs/installation`):** first in the sidebar, above the API pages. Requirements (Expo SDK 57+ / React Native 0.86+, iOS 16.4+, a companion watchOS app, iOS only), the "On an older SDK or iOS 15? Use `rn-watch-connect@1.x`" callout (links the 1.x README), the install command, "rebuild the native app; a JS reload isn't enough", and a short quick-start.
- **Home page animation:** a Fumadocs-style box at the top of `/` (`components/home/hero.tsx`): the headline with **Get started** (→ Installation) and **GitHub** buttons on the left, and on the right one inline SVG animated by one GSAP timeline (`components/home/hero-animation.tsx`). One device sits in the centre: a phone (real iPhone proportions, text field and button centred) types "Hello, Watch!" and taps **Send Message**, its outline folds into a paper plane (MorphSVGPlugin) that flies forward in place for about a second, bobbing and tilting with a dotted trail streaming behind it, and the plane unfolds into an Apple Watch showing the message. It loops: the Watch shows the message for 5 seconds, fades out, and the animation replays. Line art with one accent colour (`--hero-accent`, iOS blue). The SVG's markup is the final frame, so reduced motion and no-JS show the message already arrived.
- **Hero background:** three blurred colour blobs (the iOS-blue accent, violet and cyan) drift slowly under a faint dot grid that fades towards the edges (`components/home/hero-background.tsx`, styles in `app/global.css`). CSS only, and the drift stops for reduced motion. It's the closest feel to the Fumadocs WebGL background without adding a shader library.
- **Navigation order:** home → Installation → API pages → Migration.
- **API pages:** one per feature, named with `GLOSSARY.md` terms, one heading (anchor) per entry:

  | Page | Slug | Entries |
  |---|---|---|
  | Watch status | `/docs/watch-status` | `isWatchSupported`, `isWatchPaired`, `isWatchAppInstalled`, `isWatchReachable`, `watchActivationState`, `onReachabilityChanged`, `onWatchPairedChanged`, `onWatchAppInstallChanged` |
  | Messages | `/docs/messages` | `sendMessage`, `sendMessageWithoutReply`, `onMessageReceived`, `onMessageWithReply` (+ `reply`), `replyToMessage` (deprecated) |
  | Data Messages | `/docs/data-messages` | `sendDataMessage`, `sendDataMessageWithoutReply`, `onDataMessageReceived`, `onDataMessageWithReply` (+ `reply`), `replyToDataMessage` (deprecated) |
  | Application Context | `/docs/application-context` | `updateApplicationContext`, `applicationContext`, `receivedApplicationContext`, `onApplicationContextChanged` |
  | User Info | `/docs/user-info` | `transferUserInfo`, `cancelUserInfoTransfer`, `outstandingUserInfoTransfers`, `onUserInfoReceived`, `onUserInfoTransferFinished` |
  | File Transfer | `/docs/file-transfer` | `transferFile`, `cancelFileTransfer`, `outstandingFileTransfers`, `onFileReceived`, `onFileReceiveFailed`, `onFileTransferFinished` |
  | Error codes | `/docs/errors` | `WatchConnectErrorCode`: the "match on `code`" rule, Expo's message prefix, the full code table |
  | Migrating from 1.x to 2.0 | `/docs/migration` | Steps for app code, from the CHANGELOG "2.0.0" section |

  `/docs` on its own redirects to `/docs/installation`.
- **Each entry:** signature, parameters, what it returns or sends, what it throws (each code links to Error codes), and a short example. Types appear inline on the entries that use them; there is no Types page. The deprecated reply methods stay on their feature's page, marked deprecated, after the `reply` function that replaces them.
- **No "iOS only" callout on API pages.** The library is iOS only, which is obvious from what it does, so it's said once, on the home page. `ERR_UNSUPPORTED_PLATFORM` still appears in each entry's Throws table.

## AI-facing output

- **Single source for the home text:** `content/home.mdx`. The home page renders it, and the `llms` routes put it at the top of both files.
- **`/llms.txt`:** the home text, then one line per page, with Installation first (it carries the key rules: iOS only, rebuild after install, match on `code`). Each line uses the page's frontmatter `entries` field, which names every entry on it, e.g. `- [File Transfer](…/docs/file-transfer.md): transferFile, cancelFileTransfer, …`. The build fails if a page has no `entries`.
- **Page subtitles:** the frontmatter `description` is a short sentence for people. It's shown under the page title and used as the HTML meta description, but not in `llms.txt`.
- **`/llms-full.txt`:** the home text, then every page in full, Migration last.
- **Per-page Markdown:** at `/docs/<page>.md`.
- Both files follow the sidebar order (`content/docs/meta.json`). The Markdown is rewritten for agents: Twoslash markup (the `twoslash` code-block flag, `// ^?` lines) and heading anchors are stripped, callouts become blockquotes, and links to `/docs/<page>` point to `/docs/<page>.md`.
- Home sections and callouts written only for people are listed by title in `home.mdx`'s `llmsSkip` frontmatter and left out of both files (today: "Get started" and "Why rn-watch-connect").
- Everything is generated from the pages. No hand-written copies.

## Tech

- **Framework:** Fumadocs on Next.js 16 (App Router), with Fumadocs' built-in search and dark mode. Package manager: npm.
- **Animation:** GSAP with `@gsap/react` (`useGSAP`), in a `"use client"` component.
- **Example checking:** Twoslash type-checks every TypeScript example during the build. `rn-watch-connect` is pinned as a dev dependency (`2.0.0`).
- **Version label:** the header says "Docs for rn-watch-connect 2.0", read from that dev dependency.
- **No analytics.**

## Hosting and repo

- **Host:** Vercel Hobby, deployed as a normal Next.js app (not a static export), with a preview deployment for every PR.
- **URL:** a free Vercel subdomain, `rn-watch-connect.vercel.app` if available. No custom domain.
- **When:** deploying is the last step, after the content, the AI-output review and the home page animation. Until then, everything is checked locally.
- **Repo:** a separate public GitHub repo, `CRIIPI11/rn-watch-connect-docs`, in this folder. Base branch `master`; one branch per piece of work, with PRs into `master`.
- **Repo guide:** an `AGENTS.md` that points to the library's sources and glossary, and states "public API only" and "use glossary terms".
- **Outward-facing steps need the user's go-ahead first:** creating the GitHub repo, pushing, and creating or linking the Vercel project.

## Follow-ups in the library repo

These go through the library's own flow (issue → branch → PR into `master`), after the site is live:

- Shrink the README to: intro, Requirements, Installation, a short quick-start and a "Full docs →" link. Drop the API, Errors and Types sections.
- Set `package.json` `homepage` to the site URL.
- Add an "update the docs site" item to the release checklist.
