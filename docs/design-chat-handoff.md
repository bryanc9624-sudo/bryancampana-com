# Handoff — Design and Figma chat

**Written:** 2026-09-07, at the end of the first design chat.
**For:** whoever picks up the Design and Figma role next.
**Authority:** this document orients you. **`DECISIONS.md` on `main` is the source of truth.**
Where the two disagree, the ledger wins and this file is wrong.

---

## Read these three things, in this order, before doing anything

1. **`DECISIONS.md` on `main`** — the whole thing, including the ⚠ block at the top. It is the
   only channel between this chat, the Code and Deploy chat, and the Oversight chat. None of us
   can see each other's conversations.
2. **The Figma file** — `IeY23kkW263ZvuyJqiV2kD`. Look at it before you plan anything. Bryan
   edits it directly between sessions and does not always narrate what he changed.
3. **`docs/figma-to-code-spec.md`** — the implementation spec for the code chat. Partly
   superseded; the ledger says where.

Then `git pull` before you read and `git push` after you write. The ledger goes straight to
`main` — Bryan gave standing permission for that specifically so it never goes stale.

---

## The four rules that actually matter

The ledger has thirteen. These are the ones that will bite you:

1. **Never ask Bryan something `DECISIONS.md` already answers.** Read it first, every session.
2. **Never ask Bryan something the other chat owns.** Route it into the ledger instead.
   *He is not a message bus.*
3. **A design decision is not real until it is in the ledger or visible in Figma.** Saying it in
   chat does not count. The chat ends; the file does not.
4. **Check whether something matters before investigating whether it is possible.** Learned the
   hard way — see "What I got wrong" below.

---

## What this chat owns

Layout, typography, colour, spacing, radii, component structure, and the editorial call on which
projects are featured. Everything visual, expressed in Figma.

**Not yours:** the codebase, builds, deploys, hosting, DNS. That is the Code and Deploy chat.
Write what you need into the ledger and let them implement it.

---

## Where the design stands

**Settled and drawn.** All of this is in Figma and logged:

- **Colour** — plum ink on white paper, magenta as the "charged" state. Both light and dark
  palettes, all seven tokens, contrast verified. This came out of a concept Bryan holds
  seriously (ink as a portal; energy in the ink glows magenta) — read that entry in full before
  you touch colour, because the system is his and it is coherent.
- **Type** — IBM Plex Serif for titles only, IBM Plex Sans for everything else. One variable
  (`font/body`) drives it. Do not add a third family.
- **Radius** — `0`. Deliberately, and measured, not defaulted. There is a reserved "droplet"
  motif (three corners rounded, top-left square) that is **named but not applied** — it is for a
  real button if one ever appears. Do not apply it to image cards; that was considered and
  rejected.
- **Rules (hairlines)** — two levels only: ink at the page edges (header, footer), hairline
  inside (facts, landing eyebrow). Settled 2026-09-07, last thing this chat did.
- **Components** — `ProjectCard`, `Placeholder`, `SiteHeader`, `SiteFooter`, `Eyebrow`,
  `FactPair`, `FilterLink`, `VideoFacade`. Nine desktop frames, nine mobile.
- **Card contents** — image, keyword, title, description. **No year, and the design question is
  never on the card.** Both were tried and rejected by Bryan. Do not re-propose them.

**Open, and yours to pick up** — the ledger has the detail:

- **Credit line on the card.** Bryan raised it, then scrapped it — they are not his clients.
  The analysis is kept in the ledger *only so it is not raised a third time.* Do not reopen it
  without new information.
- **Video poster stills.** Bryan's to supply. Not blocking: the ink ground is a deliberate
  state, not a gap.
- **The 14 design questions.** Bryan chose to ship with blank placeholders. Still blank.

---

## Connecting to Figma — read this first if the tools seem missing

Three environment-specific traps. All three look like "Figma is broken" and none of them are.

**1. The Figma tools are deferred — they are not in your tool list until you ask for them.**
This is the most common failure. Run this before anything else:

```
ToolSearch query="select:use_figma,get_screenshot,get_metadata,get_figma_skill"
```

If you look for Figma tools without doing that, you will find none and conclude you have no
Figma access. You do.

**2. The rate limit is per-account, not per-chat: 200 calls/day, 15/min** (Pro plan, Full seat).
The Code and Deploy chat and any other session share that same 200. A discovery burst trips the
per-minute ceiling easily. Symptom is a 429; it resets on its own. Batch your reads, and do not
spend calls on speculative discovery. `whoami` and write tools are exempt from the limit —
`whoami` is the cheap way to confirm auth is healthy before blaming it.

**3. `get_screenshot` works, but downloading its result does not.** `figma.com` is blocked by
this container's egress policy, so the `curl` command the tool suggests fails with
`connect_rejected`. MCP traffic itself is fine — it routes through an allowlisted proxy. Always
pass `enableBase64Response: true` and read the image inline. Do not try to fetch the URL.

**Also:** the Figma MCP server has dropped and reconnected mid-session before. Retry once before
concluding anything is actually wrong.

If access genuinely fails, run `whoami` — it reports the authenticated account, plan tier and
seat, and is the documented first step for debugging permission errors.

## Working with Figma, practically

- **Load the `figma-use` skill before every `use_figma` call.** Every one. It is mandatory and
  skipping it produces failures that are hard to read.
- **Figma is on Professional** — 200 calls/day, 15/min. Not the 20/month Starter limit that
  stopped this chat early on. Still, batch your work; do not burn calls on speculative reads.
- **Variable modes are `Desktop` / `Mobile` — a breakpoint axis, not a theme axis.** Dark mode
  cannot live in this collection. If it ever needs to be in Figma it needs its own collection.
- **Verify before you report.** Read state back, or screenshot, and say what you actually saw.
  See below.

---

## What I got wrong, so you do not repeat it

Four mistakes worth inheriting:

1. **I told Bryan a font variable was unchanged when it was not.** I read stale state and
   reported it as fact. His edit had reached all 10 text styles and 421 nodes. **Read state back
   after a change, and say what you actually observed.**
2. **I built a colour bench whose numbers were entirely wrong.** I read colours with
   `getComputedStyle` assuming it returns `rgb()`; it returns `oklch()` unconverted, so every hex
   and every contrast ratio was garbage — and every ratio falsely showed a failure. The swatches
   were fine; only the numbers lied. **If you compute contrast, convert OKLCH→sRGB properly.**
   The corrected conversion is in the scratchpad bench and in the ledger's colour entry.
3. **I spent a long time flattening glyphs and computing bézier curvature to derive a corner
   radius — before checking whether anything on the site was actually rounded.** Two elements
   were, and one was being deleted. Bryan's words: *"what you did was insane, and I think it was
   too much."* He was right. **Ask "does this matter?" before "is this possible?"**
4. **I twice picked a typeface without checking its available weights.** New Frank had no
   Semi Bold; Almarai had no Medium and no italic. **`listAvailableFontsAsync` first, always.**

---

## How to talk to Bryan

He is a designer and a systems thinker, and he is precise about his own concepts. Some things
that made this chat work:

- **Give him a recommendation, not a menu.** He responds well to "I lean toward X, here is why,
  but it is your call." He responds badly to being handed five options.
- **Show your reasoning when you disagree, then defer.** He overruled me several times and was
  right most of them.
- **Do not over-engineer.** The radius episode is the canonical example.
- **When he explains a concept, listen to the whole thing before designing against it.** The
  colour system is his, not mine, and it is better for that.

---

*Last action of this chat: bracketed the page in ink — header and footer rules moved from
`color/line` to `color/fg`, facts block reduced to a single top rule. Logged in `DECISIONS.md`
under "Horizontal rules get a hierarchy".*
