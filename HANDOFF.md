# Handoff: rn-watch-connect documentation site

You're picking up a **new project**: a documentation website for the `rn-watch-connect` library. The site lives in its **own folder**, separate from the library repo. The previous session built and released the library itself. This file covers only what the site work needs. Everything else is in the library repo, so read it there rather than relying on this summary.

## Where things are

- **Library repo:** `/Users/criipi/Developer/Expo-Modules/rn-watch-connect` (GitHub: `CRIIPI11/rn-watch-connect`). Treat it as **read-only from the docs session**. Library changes go through that repo's own flow: an issue, a branch, a PR into `master`.
- **Released:** `rn-watch-connect@2.0.0`, which is both `latest` and `next` on npm. GitHub release `v2.0.0`. `master` is the only branch.
- **The docs site folder:** whichever folder you've been opened in. Ask the user if it's unclear.

## Scope: the public API only

The site documents **the public API and nothing else**: every **property**, every **method** (function) and every **event**. Each entry covers its signature, its parameters, what it returns or sends, what it throws (its Error codes) and a short example. The types and Error codes appear only where an entry uses them (a payload, a return value, a thrown error).

**Plus two non-API pages** the user asked for:
- **Installation:** requirements (Expo SDK 57+ / React Native 0.86+, iOS 16.4+; apps on an older SDK or iOS 15 stay on `rn-watch-connect@1.x`; a companion watchOS app to talk to), installing, and rebuilding the native app afterwards. Source: README "Requirements" and "Installation".
- **Migrating from 1.x to 2.0:** what an app on 1.x must change, and what it can change. Source: the CHANGELOG "2.0.0" section. Write it as steps for app code, not a copy of the changelog:
  - **Breaking changes:** Expo SDK 57 / iOS 16.4; `transferFile` progress keys renamed (`total`/`completed` → `totalUnitCount`/`completedUnitCount`).
  - **Behaviour changes to check:** status events no longer fire when a listener is added, so read the properties for the initial value; error `code`s replace `ERR_UNEXPECTED`, and functions that throw directly get Expo's message prefix, so match on `code`; `transferUserInfo` now returns the full snapshot; stricter TypeScript types; the new reply error text.
  - **Deprecated, still working:** `replyToMessage`, `replyToDataMessage` and `replyId`. Move to the event's `reply` function, with a before/after example.
  - **New, optional:** finish events, `onFileReceiveFailed`, the `reply` function, `WatchConnectErrorCode`.

**No internals.** That means no Swift, no architecture, no ADRs, no Controller or port, no drift checks, no test setup, and no contributor docs. A behaviour note belongs on the site only when it changes how you *call* or *handle* the API. When it does, put it on that entry's page rather than in a separate concepts section.

## Source material for the docs (read these, don't copy from memory)

| What | Path in the library repo |
|---|---|
| Current user docs: API, events, Errors, Types | `README.md` (the main source; its section outline maps well onto site pages) |
| What changed in 2.0.0, and why | `CHANGELOG.md` (the "2.0.0" section, including breaking changes, deprecations and behaviour changes) |
| Domain words (Session, Reply function, Transfer, Received file, Error code, Outbound/Inbound…) | `GLOSSARY.md`. Use these terms on the site, and avoid the words it lists under "Avoid". |
| The exact public TypeScript surface | `src/RnWatchConnect.types.ts` (with JSDoc, `@throws` and `@deprecated` notes) |
| Every Error code | the README "Errors" section, and `WatchConnectErrorCode` in `src/RnWatchConnect.types.ts` |
| A working usage example | `example/App.tsx` |

Only the public files above are sources. Don't document anything from `ios/`, `docs/adr/`, `src/withReplyFunctions.ts`, `src/RnWatchConnectNative.types.ts`, `src/errorCodes.ts` or `src/eventNames.ts`: they're internal.

**Must cover**, each on the page of the property, method or event it concerns:
- **Replying to Inbound Messages:** the event's `reply` function. `replyToMessage`, `replyToDataMessage` and `replyId` are deprecated but still work.
- **Error codes:** match on `code`, never on `message`. Functions that throw directly get Expo's "Calling the '…' function has failed" prefix in their message.
- **Received files:** the library moves each file into the temp directory, and the app owns it from `onFileReceived` on. Name collisions are numbered `name(1).ext`. `onFileReceiveFailed` reports files that couldn't be kept.
- **Finish events:** exactly one per Transfer (delivered, failed or cancelled). Transfer ids are valid only for the current app run.
- **Status events fire only on a real change.** Read the properties for the initial value.
- **There's no event for activation failure.** Check `watchActivationState`.
- **iOS only.** On other platforms, methods throw `ERR_UNSUPPORTED_PLATFORM`, and `watchActivationState` is `"unknown"`.
- **Native changes need a rebuild,** not just a JS reload.

## Decisions already made

- **Site first, then `llms.txt`.** Pick a docs framework that **generates `llms.txt` and `llms-full.txt`** from the same pages, so they can't drift from the docs. Candidates mentioned: Mintlify, Fumadocs, Docusaurus, VitePress and Starlight. **Check each one's current docs for llms.txt support before choosing.** Nothing about the framework or hosting has been decided yet.
- Goal of `llms.txt`: let AI agents and LLMs read the docs for far fewer tokens than fetching the whole API.

## Open questions (grill the user on these)

1. Framework, and hosting (custom domain?).
2. Page structure within the API scope. For example one page per group (Properties; Messages and replies; Application Context; Transfers; Events), or one page per method and event. Installation and the 1.x → 2.0 migration page are decided (see Scope). Ask only where they sit in the navigation.
3. What goes in `llms.txt` (the index) versus `llms-full.txt` (everything in one file).
4. Whether the library's README should then shrink to point at the site, and whether to add the site URL to `package.json` `homepage`. Both would be library changes, made in the library repo's flow.
5. Versioned docs (1.x versus 2.x), or 2.x only.

## How the user likes to work

- Explain things plainly before asking them to decide, with concrete before/after examples. They often run `/wait-what` to get something re-explained. Give a recommendation for each question, and wait for their answer.
- One branch per piece of work, PRs into the base branch, and closing issues by hand. Confirm before anything outward-facing (pushing, publishing, deploying).
- Leave their uncommitted edits alone.

## Suggested skills

- **`grill-with-docs`**: start here, on the open questions above (it runs `grilling` plus `domain-modeling`).
- **`writing-for-agents`**: for the wording and structure of `llms.txt`, `llms-full.txt` and any agent-facing pages (context pointers, progressive disclosure).
- **`research`**: if you want a cited comparison of the frameworks' current llms.txt support before the user picks one.
- **`implement`**: once the decisions are settled and the build is small enough for one session; otherwise `to-spec` then `to-tickets`.
- **`pr`**: when the site's work goes up as a pull request.
