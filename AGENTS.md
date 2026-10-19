# AGENTS.md

The documentation site for the `rn-watch-connect` library (Fumadocs on Next.js 16, npm). Read [`DECISIONS.md`](DECISIONS.md) before changing what the site covers or how it's built, and [`PLAN.md`](PLAN.md) for what to build next.

## Rules

- **Public API only.** Document every property, method and event of `rn-watch-connect@2.x`: signature, parameters, what it returns or sends, what it throws, and an example. No Swift, architecture, ADRs or contributor docs. A behaviour note belongs on an entry's page only when it changes how you call or handle that entry.
- **Use the library's glossary terms** (Session, Message, Data Message, Reply function, Transfer, Received file, Error code…), and never the words it lists under "Avoid".
- **Write from the sources, not from memory.** The library repo is read-only from here.
- **Generate, don't copy.** `llms.txt`, `llms-full.txt` and the per-page `.md` files are generated from the pages. Fix the pages, never the output.
- **Ask before anything outward-facing:** pushing, creating the GitHub repo, or creating or linking the Vercel project.

## Sources (library repo: `/Users/criipi/Developer/Expo-Modules/rn-watch-connect`, GitHub `CRIIPI11/rn-watch-connect`)

| What | Path |
|---|---|
| API, events, Error codes, types | `src/RnWatchConnect.types.ts` and this site's own pages (the library README is now short and points here) |
| What changed in 2.0.0 (for the Migration page) | `CHANGELOG.md` |
| Domain words, and words to avoid | `GLOSSARY.md` |
| The exact public TypeScript surface | `src/RnWatchConnect.types.ts` |
| A working example | `example/App.tsx` |

Never document `ios/`, `docs/adr/`, `src/withReplyFunctions.ts`, `src/RnWatchConnectNative.types.ts`, `src/errorCodes.ts` or `src/eventNames.ts`: they're internal.

## Workflow

One branch per piece of work, with a PR into `master`. Run `npm run build` before opening a PR.
