# bryancampana.com

Bryan's portfolio. Astro, static, no client JavaScript. 14 projects, 20 pages.
Live at bryancampana.com on Netlify.

## How this project is run

**One chat does the work — design and code together.** It was split across four
chats until 2026-09-07; that cost more in coordination than it returned. Extra
chats are fine as long as they only *read* and advise. Only one chat writes.

You own design decisions as well as code. There is nobody to route them to.
When something is genuinely Bryan's call — a colour, a word, an editorial choice
— ask him directly.

## Where the truth is

| Question | Answer lives in |
|---|---|
| What is true right now | `DECISIONS.md` → "Current state" |
| What we already rejected, and why | `DECISIONS.md` → "Do not reopen" — **read before proposing** |
| Why we did something | `git log`, then `docs/decisions-archive.md` |
| Every colour, size, weight | `src/styles/tokens.css` |

The archive is frozen history. Entries in it contradict each other in places —
`DECISIONS.md` wins, always.

**Write a decision down or it never happened.** A conclusion reached only in chat
is gone when the chat ends.

## Things that cost money or silently break

**1. Publishing costs 15 credits. Nothing else does.**
A build runs only when the commit **subject starts with** `[deploy]`. Netlify
Personal gives 1,000 credits a cycle (~65 builds), cycle runs the 7th to the 6th.
The gate in `netlify.toml` reads the subject only, anchored — the fix after a body-matching
version fired 19 builds and burned a whole cycle. `.githooks/pre-push` is the second layer:
it refuses a push carrying the tag in a body, and announces an intentional build with its
cost. Nothing to check by hand.

**Preview before pushing.** Build locally, show Bryan, push once he approves.

**2. Restart the dev server after editing CSS in an `.astro` file.**
Hot reload does not reapply scoped styles. You will see the old rule and "fix" a
bug that does not exist. Never clear `.astro/` while the server runs — it corrupts
the content store and the site goes silently empty.

**3. HTML comments in a markdown body ship to the page.**
Astro passes them straight through — invisible in preview, visible in view-source.
Use YAML `#` comments in frontmatter, and `{/* … */}` in `.astro` templates.
`tests/rules.test.ts` fails on the mistake; only the alternatives above need remembering.

**4. Measuring a baseline needs `overflow:hidden` on the probe.**
The trick is a zero-size inline-block span appended to the element; its
`getBoundingClientRect().bottom` sits on the line's baseline. **Without
`overflow:hidden` it returns the element's box top instead**, which reads as a 5px
misalignment that is not there. A measurement that disagrees with *itself* — box top
and baseline being identical is impossible — indicts the instrument, not the site.
Check that a number could physically be what it claims before acting on it.

**5. `git` can stop working after an Xcode update.**
macOS gates it behind a licence prompt and every git command fails with the same
message. `/Library/Developer/CommandLineTools/usr/bin/git` works without it, so nothing
is blocked; the permanent fix is `sudo xcode-select -s /Library/Developer/CommandLineTools`,
which needs Bryan's password.

**6. Images go under `src/`, never `public/`.**
`public/` is copied through unoptimised — `tests/rules.test.ts` fails on an image
there. What the test cannot check: export sRGB at 2400px, and `cover.<ext>` is
card-and-poster only and is excluded from the gallery.

## Design rules that are load-bearing

- **The code is the source of truth. Figma is a reference.** `tokens.css` and the
  built site are what ships. When the two disagree, **code wins and there is no
  bug to file** — say Figma is behind and move on. Figma variables still name
  their CSS property via `codeSyntax`, which is useful documentation, not a
  contract. Ten CSS properties have no Figma variable **on purpose**.
- **No rule may reference `--color-fg`.** That token means *the colour of text*.
  Rules point at `--color-line`, whose value is derived so a rule holds the same
  contrast against its ground in both modes. Derive future values; never eyeball one.
- **`--color-accent` is hover only.** Charge at rest, full charge on hover.
  `--color-focus` is the same value but a different state — keep them separate.
- **No synthesised faces, ever.** `font-synthesis: none` is set on `html`.
  Anything italic uses the serif via `--font-italic`; Plex Sans ships no italic.
  A missing weight renders upright on purpose, so the gap is visible.
- **Style names have no space** — `SemiBold`, not `Semi Bold`. The mismatch
  silently drops text to Regular.
- **Dark mode is not in Figma** and cannot be — the two variable modes are
  Desktop/Mobile. The dark palette lives in `DECISIONS.md`'s colour table and in
  `tokens.css`, and nothing else checks it.
- **`src/lib/projects.ts` holds the single visibility rule.** Index, landing and
  route generator all call it. Keep it that way.

## Figma

File `IeY23kkW263ZvuyJqiV2kD` — "bryancampana.com — Design System & Screens".
Professional plan: 200 calls/day, 15/min, shared across every session.

**The tools are deferred — load them first or you will think you have no access:**

    ToolSearch query="select:use_figma,get_screenshot,get_metadata,get_figma_skill"

Load the `figma-use` skill before every `use_figma` call. **`get_metadata` lies
about the page list** — it reports one page however many exist. Use
`figma.root.children` via `use_figma` instead; that is authoritative.

**"Figma isn't working" is two different problems that look the same:**
- *The tools weren't loaded.* By far the more common one. Run the `ToolSearch`
  above. The connection is fine; you just hadn't asked for the tools.
- *The session can't sign in.* Some sessions can't run the authorization flow.
  Nothing in a chat fixes this — Bryan authorizes Figma in his claude.ai
  connector settings, or works in an interactive terminal. Say which of the two
  it is before telling him anything is broken.

**Figma is a sketchpad, not a spec — since 2026-09-08.** It was the channel between
four chats that could not see each other; with one chat that job is gone, and the
1:1 obligation it justified went with it. Design changes go straight to code.

**Sync Figma on purpose, for a reason** — Bryan is about to draw in it, look at it,
or show it — never continuously and never out of duty. Expect it to be behind.

**Nothing in Figma rules the code, type styles included.** A sync pipeline for type was
considered and dropped: Figma-to-code token tooling is real and standard, but it exists
to carry a decision between a designer and an engineer who are different people, which
is the problem this project removed. Type is simply the *easiest* thing to copy across
by hand, because Figma holds a text style completely and loses nothing.

**The habit that prevents drift: when code and Figma diverge, say which one is stale in
the same message.** The failure is never the gap, it is a gap nobody mentioned.

Nothing in the build depends on live Figma access. It was a day-one non-goal.

## Commands

    npm run dev      # restart it after any CSS edit; port is auto-assigned
    npm run build
    npm test
    npm run todos    # regenerates CONTENT-TODO.md

## Working with Bryan

Graphic designer, new to git and the terminal, learns fast, watches cost.

- **Plain English, with an analogy for anything mechanical.** Skip the jargon
  first pass; he'll ask for depth and you should give it properly.
- **Give a recommendation, not a menu.** He overrules often and is usually right.
- **Verify, then report** — not the other way round. Read state back after a
  change and say what you actually observed.
- **Own a mistake in one sentence and move on.** Hedging costs more than the error.

## Agent skills

Configuration for the `mattpocock-skills` engineering skills. These files are
read by the skills, not by the build. Nothing here changes what ships.

### Issue tracker

GitHub Issues on `bryanc9624-sudo/bryancampana-com`, via the `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels, unchanged: `needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. **There is no `docs/adr/` and there should not be** — decisions
live in `DECISIONS.md`. See `docs/agents/domain.md`.
