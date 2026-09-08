# Decisions

The contract for bryancampana.com. **"Current state" is what is true; "Do not reopen" is what
was rejected and why.** Dated reasoning lives in `git log` — `git log --grep CD-020` returns the
decision and the reasoning behind it.

**One chat does the work.** Until 2026-09-07 this was split across four, and most of this file's
machinery existed only to keep them from overwriting each other. That machinery is gone: the
ownership table, the routing rules, the per-chat id prefixes and the separate inboxes. What
survived is what does not depend on how many chats exist — the contract below, the record of what
was rejected, and the discipline that a decision is two writes.

## The ledger was compacted on 2026-09-08

**`docs/decisions-archive.md` is gone and `git log` is the *why* layer.** An archive is a cache of
a lookup git already performs, and 3,682 lines is past the point anyone re-reads: a decision id had
been dangling in this file for a day, and a live billing obligation sat unread at line 1979.
`git log --grep <id>` returns more reasoning than the entry did. `git tag ledger-full` marks
`6401470`, the last commit holding everything — `git show ledger-full:docs/decisions-archive.md`.

**What the audit moved before deleting**, since the entries were read rather than assumed:

- The correction that a missing **weight** renders as the nearest loaded face, silently — this
  file and `CLAUDE.md` had recorded the safe failure mode instead. Now `tests/rules.test.ts`.
- Six generalising laws, into `CLAUDE.md` → "How a decision is made here".
- Six site-level rules, into Current state below.
- One dated obligation that no file should hold: the Netlify plan reverts to Free before it
  renews on **2026-10-07**. Bryan holds this in his calendar, not in the repo.

**Three rules the audit itself produced, worth keeping:**

1. **Extract before deleting, and do not trust a plan that says "no reading required."** The plan
   called `docs/retired/` a free win; three facts lived only there.
2. **The decision index goes LAST, with the archive.** It was the map used to audit the archive.
3. **A prohibition is not a peer of the law it comes from.** *"No rule may reference
   `--color-fg`"* is a *consequence* of *"a rule holds the same contrast against its ground in
   both modes"*. State the law; the prohibition follows. Where a prohibition follows from no law,
   a law is missing.

## The rules

1. **Read "Current state" and "Do not reopen" before proposing anything.** The answer is
   usually already there, and the second one is the record of what has already been paid for
   once.
2. **Write a decision down or it never happened.** Two writes, same commit: the reasoning in the
   **commit message**, and the "Current state" section it changes. A conclusion reached only in
   chat is gone when the chat ends.
3. **Preview before pushing.** Build locally, show Bryan, push once he approves.
4. **Builds need a `[deploy]` subject line.** A push only builds when the commit *subject starts
   with* the tag. `netlify.toml` gates it and `.githooks/pre-push` catches the mistake before
   the push lands, so this is enforced rather than remembered.
5. **A commit message is frozen history and "Current state" wins.** A past message says what was
   true when it was written, never what is true now. Read it for *why*, never for *what*.

---

# Current state

**This section is the contract. Read it to know what is true.** Dated reasoning lives in
`git log` — go there for *why*, never for *what*.

## Colour — this table wins

**Read this before touching a colour anywhere.** When a colour changes, update it **here**, in
the same commit that changes it.

It matters because **dark has no second check.** Light is verifiable against Figma by eye; dark
lives only in this table and in `tokens.css`, so if those two disagree nothing catches it.
`tokens.css` names this section as its source of truth for the dark block.

| Token | Light | Dark | Figma variable | Notes |
|---|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0F0C0F` | `color/bg` | Ground. Dark is near-neutral (chroma 0.006) so it does not fight the photography |
| `--color-fg` | `#361A38` | `#FFFFFF` | `color/fg` | Text. **Never bind a rule to this** |
| `--color-muted` | `#75617A` | `#C9BFCD` | `color/muted` | Diluted ink. Dark is tinted deliberately — see the trap below |
| `--color-line` | `#361A38` | `#E5E5E5` | `color/line` | Rules only, and the only token a rule may reference |
| `--color-placeholder` | `#F0F0F0` | `#1E1C1F` | `color/placeholder` | Unworked paper |
| `--color-focus` | `#8817EA` | `#B07AFF` | `color/focus` | Containment ring |
| `--color-accent` | `#8817EA` | `#B07AFF` | `color/accent` | The charge. Same value as focus, deliberately |
| `--color-filter-label` | `= muted` | `= fg` | — | Work filter at rest. `CD-016` |

**Three principles that derive the dark values, so future ones are not picked by eye:**

1. **A rule holds the same contrast ratio against its ground in both modes** — 15.42:1 light,
   15.44:1 dark. This is why `--color-line` is not simply `--color-fg` in dark.
2. **Accent and focus derive from ONE hue — 300 in OKLCH.** Light holds chroma 0.269 at
   lightness 0.526; dark takes the most chroma sRGB allows at its lightness, 0.192. The old pair
   was picked per mode and drifted to 308 and 319 — an 11-degree gap that read as magenta in
   dark. Contrast lands 6.25:1 light and 6.55:1 dark. `CD-016`.
3. **Muted is tuned for equal *perceived* separation, not equal measured ratio** — gap to ink
   2.75 light, 1.78 dark. A dark surround exaggerates lightness differences, so equal perceived
   separation needs a smaller measured step in dark. Do not "fix" them to match.

**A colour token is named for where it is used, never for what it is.** `bg` / `fg` / `accent`,
not `plum` / `violet`. It is why two hue changes have cost nothing to absorb: the name stays true
when the value moves. In conversation the roles are paper / ink / charge; in the file and in Figma
they are `bg` / `fg` / `accent`.

**The trap:** anything *derived* from the dark ground comes out neutral, because that ground sits
at chroma 0.006 — diluting white toward it lands at r−g = 1. Dark values that should read as part
of the violet system have to be tinted on purpose.

**Two pairs look identical in light and are not the same token.** `focus` and `accent` share a
violet by design. `fg` and `line` share the ink **in light only** — they diverge in dark, the one
mode Figma cannot show.

## Type

- **Families.** `--font-display` is IBM Plex **Serif** — Display 2XL, Display XL, Title Large and
  the wordmark. `--font-body` is IBM Plex **Sans** — everything read, plus the label tier
  (Eyebrow, Label). `--font-italic` is IBM Plex **Serif**: anything italic uses the serif,
  whatever surrounds it, because Plex Sans ships no italic file and the browser would otherwise
  synthesise a slant. **No synthesised faces, ever.**
- **Self-hosted** through Fontsource, not Google's CDN. **Weights in use: SemiBold 600,
  Medium 500, Regular 400, and Serif Italic 400. Nothing else — and every one is already
  loaded, so no font import is outstanding.**
- **Style names have no space** — `SemiBold`, not Inter's `Semi Bold`. The mismatch silently
  drops text to Regular.
- **Size ramp:** xs 13 · sm 15 · base 17 · lg 22 · xl 32 · 2xl 48. `xl` and `2xl` step to 24 and
  32 under 40rem — in Figma that is the `Mobile` variable mode.
- **The display ramp is uniform: Display/2XL, Display/XL and Title/Large are all SemiBold
  600.** A Bold/Medium split was tried on 2026-09-07 and reverted — see `D-064`.
- **There is ONE eyebrow, in two contexts.** As a section heading above a grid it takes a
  hairline; as a column label it does not. Figma models this exactly: the `Eyebrow` *text
  style* is type only, the `Eyebrow` *component* is that style plus the rule. Any second
  implementation of the type is a bug, not a variant.
- **The section eyebrow is `Eyebrow` — Sans SemiBold 15px, `--color-fg`.** It separates from the card
  discipline on **three** axes now — weight, size and colour — against `Label`, Sans Medium 13px
  muted. The two were never the same style, but they read as one tier until this changed. **It is not `--color-accent`** — accent is the
  charge and marks the selected filter link only; spending it on static labels would make it
  decorative and stop it meaning anything.
- **`Wordmark`** is serif at `--size-lg`, a step above the nav it shares a line with. It was at
  body size until `CD-010`; Bryan stepped it up because it read small. Not an optical fix — Plex
  Serif and Sans have identical vertical metrics at the same size; the serif just puts less ink
  down. **The header is baseline-aligned, which is what makes this safe.**

## Layout and chrome

- **Widths:** `--page-max` 1440; project pages `--page-max-wide` 1600.
- **Header and footer are full bleed.** They span the viewport and pad their contents by
  `--page-pad`. They are *not* `.page` — that was the bug where chrome sat 80px narrower per side
  than the work it framed.
- **No rule on the header or footer.** Chrome is marked by position and space.
- **Underlines clear the letters by `--underline-offset` (0.2em).** Applied where the underline is
  drawn, never inherited from `html` — an `em` there resolves against the root size and inherits
  as a fixed length, so it stops scaling. `CD-010`.
- **Links carry no decoration at rest; an underline means a STATE.** Two exist: a card title on
  hover, and the selected filter link. Set once as `a { text-decoration: none }` in `base.css` —
  never repeat it per component. No inline prose link exists yet; one would need its own
  decision. `CD-004`.
- **One rule type, one meaning: a break within content.** Three places only — under the eyebrow,
  above the facts block, under the work-index filter.
- **Rules reference `--color-line` and nothing else.** Never bind a rule to `--color-fg`: that
  token means *the colour of text*, and text and rules do not want the same value in every mode.
- **Header contents:** wordmark, 64px gap, then **Work · About**, all flush left. Contact is
  not in the chrome — see the contact block below.
- **The header row is baseline-aligned, not centred**, and this is a spec rather than an
  accident. The wordmark is serif and the nav is sans, and the two families share neither a cap
  height nor an x-height. Centring aligns their bounding boxes; baseline aligns the line the
  letters actually stand on, which is what the eye reads. Today both are 17px so the two
  approaches land identically — **the moment the wordmark steps up a size, only baseline stays
  correct.**
- **The header stacks under 40rem, and the `Breakpoint` axis stays.** With Contact removed the
  row is 307px against 342px at 390px, so it fits there — but the query runs `0–639px`, and at
  **320px** there is only 272px of content width. The row stops fitting below a **355px**
  viewport. Six `SiteHeader` variants, not three.
- **A project page opens on its discipline, as a link to that discipline's page.** `CD-020`.
  **Two routes out, each with one job:** the header nav goes to everything, the discipline goes to
  the sibling set. `← All work` is gone — it went where the nav already goes. The discipline
  appears at the top *and* the foot because those are two moments, not two destinations: nothing
  on this site is sticky below 64rem and a photography page runs to seven images.
- **An eyebrow is the label above a block of content** — a section heading on the landing page, a
  column label on About, a classification on a project page. `DF-002` said "section headings only"
  and `CD-020` widened it; that is one job described more broadly, not two jobs. The project
  eyebrow takes **no hairline** — a fourth rule would break "one rule type, one meaning".
- **Contact block, About page.** Desktop is three columns — portrait `1fr`, biography `2fr`,
  contact `1fr`, 64px gutters. Mobile stacks it after the biography. The block is a `CONTACT`
  eyebrow (the text style, **no rule** — it is a column element, not a break in a flow), then
  `Based in New York City` in muted, then **email · LinkedIn · resume**. The link reads `Download resume` — no accents, no file type in the label, Bryan's call 2026-09-08. Email renders as
  the address, `bryanc9624@gmail.com`, not the label: it is copyable and reads as an invitation.
- **Radius is 0** on both tokens, derived from Plex's square construction rather than left unset.

## Components

Figma page `04 — Components`: `ProjectCard`, `Placeholder`, `SiteHeader` (Current × Breakpoint,
six variants), `SiteFooter`, `Eyebrow`, `FactPair`, `FilterLink`, `VideoFacade`.

- **Card is image → discipline → title → scope.** No year. No design question. The label was the
  first keyword until `CD-017`: a keyword is a filter facet and a project carries several, so the
  card showed an arbitrary one. The discipline names the practice and there is exactly one.
- **`SiteFooter` is Terms of Use · Privacy Policy.** No Contact, no LinkedIn — both live
  on About.
- **`FilterLink` is the Eyebrow tier** — uppercase, 15px, SemiBold, 8% tracking. At rest it takes
  `--color-filter-label`: muted in light, ink in dark. **In light, label and count are now the
  same colour** — `CD-016` retired the "separated by colour alone" half of `CD-002`, and the
  selected state carries the distinction instead. Never separated by size or a raised position.
  The count is the **same size and weight**, separated by colour alone (`--color-muted`), 6px to the
  right on the shared baseline. Selected is `Eyebrow / Selected` — Bold plus an underline, still ink.
  The count does not take the selected emphasis. `CD-002`.
- **`--color-accent` is hover-only, everywhere.** Not a resting state, not a selected state, not
  a label colour. One rule, `a:hover` in `base.css`, plus `.filterlink:hover` for the label, which
  is not an anchor. Nothing static carries the charge; a permanent accent makes it decorative and
  it stops signalling. `--color-focus` is the same value but a different token for a different
  state — pointers versus keyboards — and the two must stay distinguishable.
- **Hover changes colour and nothing else.** Weight lives in the *rest* state — a weight change
  under the cursor reflows the text being pointed at. Once an underline is at stem weight,
  thickening it on hover is a second signal doing the first one's job.
- **The count is part of the link's width** — `ART` grew 10px when its count reached double
  digits, with no character changing. This is why a filter row measurement goes stale on its own:
  publish a project and a label can widen without anyone editing a string.
- **The count is `--weight-regular`, not Medium** — `CD-001`. It annotates the label rather
  than belonging to it, and every property on that element is chosen to keep it inside the 26px
  row the label sets, because the filter hairline sits on that row. Figma's node is to be
  rebound from `Label` to `Body / Small`.
- **Every state carries two cues — never colour alone.** The current nav item is `Body / Medium`
  500 + `--color-fg`. The selected filter is `Eyebrow / Selected` — Bold **plus an underline** —
  because both filter states are ink, so weight alone would be one cue.
- **VideoFacade is image-then-label, not label-over-image.** The `PLAY` label sits **below** the
  ground in `--color-fg`, `--color-accent` on hover, no underline — the whole facade is the
  target, the same reasoning as card titles. Text over a photograph has no derivable contrast;
  below it, the label is on paper and measures 15.42:1 light and 19.45:1 dark like everything
  else. See `DF-006`.
- **VideoFacade's ground is `--color-fg` (ink), not grey** — grey is this site's placeholder
  colour, so a grey video block reads as a missing image rather than something pressable.

## Content and schema

- **Copy is Bryan's**, verbatim from `archive/content/`. No chat writes portfolio prose in his
  voice; Content and Copy edits, cuts and advises.
- **Project bodies are first person, active, and name Bryan as the author.** Professional register,
  not curatorial — an architecture-firm reader should finish knowing he can do the job. `CD-014`.
- **Copy is written here, direction comes from outside.** Bryan's adviser sets voice and angle;
  this chat writes the words, because length is checkable against the built page and voice is not.
  Assign each to whoever can verify it. `docs/copy-constraints.md` is deleted — `CD-013`.
- **The four limits that actually bite.** Round numbers on purpose: precision is the part that
  goes stale, and the file that carried it to two decimal places was 30% wrong within a day.
  Measure the page when it matters.
  - **Keyword label ≤ 14 characters**, and the set is full at seven links.
  - **Card scope ≤ 80 characters** — the card is drawn for two lines; a third makes it taller
    than its neighbours and the ragged edge shows across fourteen.
  - **Project title ≤ 26 characters** for one line. `Dura Architectural Signage` is the tested
    ceiling at 291px of 342px.
  - **Mobile is binding for all of them.** 342px card, 342px content. Desktop always has slack.
- **The discipline IS the filter vocabulary — keywords are retired.** `CD-019`. One taxonomy,
  used in three places that now agree: the card label, the `/work` filter, and the project page's
  `Discipline` fact. Keywords were the discipline set plus `Art`, which sat on **10 of 14** and so
  barely filtered; maintaining a second vocabulary for one extra facet was not worth a visitor
  reading `Photography` on a card and `Art` in the filter.
- **Each view of the work index is a real page** — `/work/` for everything,
  `/work/discipline/<slug>/` for one. `CD-020`. Nested under `discipline/` because
  `[slug].astro` claims every single segment below `/work/`, so a project slugged
  `photography` would otherwise collide; the extra segment makes that impossible rather than
  merely unlikely. The filter is ordinary links now — still no JavaScript, and a filtered view
  finally has an address it can be linked, shared, bookmarked and refreshed at.
- **The filter row runs to two lines on desktop, and that is accepted.** Discipline names are
  longer than keywords were — an estimated 1159px against the 814px the keyword row measured, on a
  ~894px budget. The single-line row was a *measurement*, never a goal. Shortening the labels to
  fit was rejected: it left 7px of headroom and put the card and the filter back on different
  words, which is the split retiring keywords was meant to close. Mobile already ran three rows.
- **`tests/content.test.ts` pins the set of six.** A misspelled discipline would otherwise become
  its own filter link matching one project, silently. Adding a seventh means editing that test,
  which is the point — it makes admitting one a decision rather than a typo.
- **Projects sort by `year` then `month`, both descending; `order` is the last tiebreak.** The
  filter hides cards rather than reordering them, so every filtered view inherits this one order —
  a date sort is the only one that stays true of every subset. No `year` sorts last overall; no
  `month` sorts last within its year. **`month` sorts, `completed` renders, and a test asserts they
  agree.** `CD-007`, `CD-008`.
- **Never derive behaviour from an unordered collection.** `discipline` is single-valued and
  selects nothing; `layout` selects the layout. Deriving a page's layout from `keywords[0]` — the
  first element of an explicitly unordered array — meant adding a keyword could silently change a
  page. The card label had exactly that bug until `CD-017`.
- **`layout` selects the project page layout — `discipline` does not**, and never has; the field
  is a label and the filter vocabulary. `year` sorts,
  `completed` renders. `columns` overrides the photography grid, else it is derived from image
  count (≤2 → one column, 4 → two-up, otherwise three-up). `cover.<ext>` is a card-only image.
- **Slugs carry no `-1` suffix.** Three did, out of the Cargo export; they are renamed with `301`
  redirects in `netlify.toml`. A slug rename is TWO renames — the content file and the matching
  directory under `src/assets/projects/`, which is how images are keyed. `CD-005`.
- **No card scope carries a terminal period** — all 14, checked. Register is still editorial:
  narrative reads as a sentence, a capability list as Title Case. **Consistency within one scope is
  not editorial** — Title Case running into lowercase mid-list is a bug. A scope containing a colon
  needs YAML quotes, which are stripped before render. Pinned by `tests/content.test.ts`, so a
  period reintroduced in a copy pass fails the build rather than reaching the grid.
- **Six disciplines, exactly one per project.** Photography 4 · New Media 3 · Brand Identity 2 ·
  Signage & Wayfinding 2 · Exhibition Design 2 · Printmaking 1. **Every one names a practice**, which
  is the test for admitting a new one — `Visual Communications` named a *field* and was retired for
  the second time, `New Media Art` on `re:semblance` named the exhibition's *subject* rather than
  Bryan's work. Longest is `Signage & Wayfinding` at 20 characters. `CD-018`.
- **Featured set is 4**; all 14 projects get a page. Design questions are optional and Bryan's.

## Figma

**A reference, not the spec — `CD-011`, corrected by `CD-012`.** The code is the source of truth;
where the two disagree the site is right and Figma is behind, which is expected rather than a
defect. **Nothing in Figma rules the code, type included.** Type is only the easiest thing to copy
across by hand, because a text style is held completely. **When the two diverge, say which is
stale in the same message** — that habit is the whole mechanism.

**Node ids, so nothing has to be hunted for:** `SiteHeader` `16:49` · `SiteFooter` `16:50` ·
`ProjectCard` `15:23` · `Eyebrow` `17:50` · `FactPair` `17:52` · `FilterLink` `29:62` ·
`VideoFacade` `100:2` · `Placeholder` `13:5`. Landing desktop `19:2` · work index desktop
`30:130` (its `FilterBar` `30:138`) · About desktop `35:183` · work index mobile `38:35`
(`FilterBar` `38:43`) · About mobile `41:159`.

**How to check Figma is build-ready — four queries, all via `use_figma`. NO LONGER ROUTINE.**
Retired as an after-every-change ritual in `CD-011`: the code is the source of truth now, so a
drifted Figma file is expected rather than a defect. Run them when the file is about to be
*used* — shown to someone, drawn in, or synced from. Each has caught a real defect a screenshot
did not, **and one they cannot catch**: on 2026-09-08 all four passed while three `FilterLink`
fills rendered pure black, because `boundVariables` reported them bound. Render the node too.

1. **Text nodes with no `textStyleId`** — unstyled text drifts silently.
2. **Solid fills or strokes with no `boundVariables.color`** — this found a `#000000` eyebrow
   that looked plausibly dark in every render, and 74 stray white frame fills.
3. **Text styles not bound to both `fontFamily` and `fontSize`** — an unbound style stops
   following a variable change.
4. **Variables with no WEB `codeSyntax`** — those have no counterpart in `tokens.css`.

Clean as of 2026-09-07, and unverified since: 0, 0, 0, 0 across all three pages — 8 components, 13 styles, 30
variables, 9 desktop and 9 mobile frames.

**Figma API traps that cost real time here:**

- `layoutMode` **cannot be overridden on an instance.** It silently keeps the parent's direction
  while accepting the spacing change. Responsive direction changes need a variant axis.
- `textDecoration` is a property of the **text style**, not just the node. Setting it on a styled
  node appears to work and resolves back from the style on the next read.
- `figma.createAutoLayout()` adds an opaque **white fill** by default; `figma.createText()`
  defaults to **black**, and applying a text style sets type but never colour. Bind both
  explicitly or they enter the file unbound.
- **A container does not paint a ground.** 74 unbound `#FFFFFF` frame fills were invisible on
  white and would have rendered as white blocks under a theme switch. Only the top-level page
  frame holds the ground.
- **Read state back after every write.** A write's return value is not evidence — it reports what
  was set, not what resolved.


**Figma and the code are 1:1 on VALUES and STRUCTURE, and deliberately not on BEHAVIOUR.**
Read this before "fixing" code to match a drawing — `DF-004` has the full reasoning.

*1:1, and a mismatch here is a bug:* the 30 variables → the CSS custom properties they name in
`codeSyntax`; the 12 text styles → the type rules; the 8 components → their Astro counterparts;
spacing, sizes, radii; which elements exist on a page and in what order.

*NOT 1:1, and matching Figma here would be the bug:*

| Figma shows | The code does | Why Figma cannot |
|---|---|---|
| Light mode only | Both palettes | The collection's modes are Desktop/Mobile — a breakpoint axis |
| Photography two-up | Columns derived from image count (≤2 → 1, 4 → 2, else 3), `columns` overrides | The layout is a rule; a frame is one instance of it |
| Chrome to 1600 | Chrome spans the viewport | 1600 is the widest frame in the file |
| 1440 / 1600 / 390 | A continuum with one 40rem breakpoint | Frames are fixed widths |
| `Placeholder` blocks | Real photographs | The file holds no imagery |
| A snapshot of filter labels and counts | Generated from content | Counts are computed at build |

- File `IeY23kkW263ZvuyJqiV2kD`. Pages: `0:1` Foundations, `1:29` Desktop, `1:30` Mobile,
  `12:2` Components.
- Professional. **One collection, modes `Desktop` / `Mobile` — a breakpoint axis, not a theme.**
  Dark mode cannot live in Figma; the palette table above owns dark and has no second check.
- **`get_metadata`'s page enumeration is wrong, and wrong *stably*** — it reports one page
  however many exist, and does not change when Bryan switches page, selects a node or reopens the
  file. **Node-addressed `get_metadata` calls are fine; only the enumeration lies.** The
  authoritative read is a read-only `use_figma` running
  `figma.root.children.map(p => ({ id: p.id, name: p.name, children: p.children.length }))`,
  which executes against the Plugin API and sees the real document tree.
- **For photography galleries the code is the source of truth, not Figma.** Figma draws two-up,
  which is now only the four-image case. Do not "correct" the code to match the drawing.

## Hosting and deploys

- **Netlify, Personal plan** ($9/month, team `Nero`). **1,000 credits per cycle**, cycle runs
  the **7th to the 6th** — not the calendar month. One concurrent build.
- **A production build costs ~15 credits**, so a cycle buys roughly **65 builds**. Measured, not
  quoted: the first deploy took 15.2 credits including bandwidth and compute. **Builds are the
  entire cost** — bandwidth and compute together were 0.2.
- **A build runs only when the commit SUBJECT STARTS WITH `[deploy]`.** The gate is
  `netlify.toml`'s `ignore`, which reads `%s` anchored at `^`. An earlier version read `%B` and
  matched bodies discussing the rule — that is how `D-052` burned a cycle.
- **`.githooks/pre-push` makes the gate's verdict visible before the push, since 2026-09-08.**
  It announces a build with its credit cost, and blocks a subject carrying the tag anywhere but
  the front — which reads as intent to publish and builds nothing. A body mention is harmless
  under the anchor and gets a note only. **Its first version blocked body mentions and refused
  the commit that introduced it**, since messages here discuss deploys constantly; a guard
  stricter than the thing it guards is a false-positive generator. Wired through
  `git config core.hooksPath .githooks` so it is versioned, not stranded in `.git/hooks`.
- **Domain:** `bryancampana.com`, apex canonical, `www` 301s to it. DNS delegated to Netlify
  (`dns1..4.p04.nsone.net`). Let's Encrypt certificate issued 2026-09-07 23:34 UTC.
- **"Static" describes delivery, not behaviour.** CSS animation, View Transitions, canvas and
  WebGL all run client-side and work identically on any host. Nothing about this hosting choice
  forecloses motion later. (The site ships one 416-byte inline script, on the three video pages
  only — the facade in `VideoFacade.astro`. Everything else is zero-JS.)
- **During a DNS cutover a check by hostname proves nothing** — it says only that *something*
  answered. Pin the IP (`curl --resolve`, `openssl s_client -connect <IP>`) and read the
  certificate's `notBefore`.

---

# Do not reopen

Decided *against*, with the reason. Re-raising these costs someone a redo of rejected work.

| Rejected | Why |
|---|---|
| Credit line on the card | They are not his clients — venue, studio or employer's client in most cases |
| Design question on the card | Bryan's call, made twice. It lives on the project page only |
| Year on the card | Read as a table column in a layout with no other columns |
| Rounded corners on cards | Architectural photography fights a rounded frame. **Do not introduce an element in order to use it** — the "droplet" (three rounded corners, one square; the square "nib corner" goes top-left) is named and applied to nothing, and stays that way until a real button appears |
| Previous/next project nav | Its default direction walked readers from strong recent work toward older student work |
| "More work" control | At 14 projects the discipline filter already does this, better |
| A non-zero radius | Measured against the typeface; Plex has square corners throughout. If one is ever wanted the defensible value is the stem width — 80/1000em = **0.08em**, ~1.4px at 17px |
| Dark mode in Figma | Costed and rejected — 74 unbound fills, a second copy of the palette, and you can already see dark on the built site |

---

# Open

- [x] **CLOSED 2026-09-08 — overtaken by Bryan's rewrite.** Both items came out of `CD-014` and
      neither has anything left to attach to.

      **The thin input.** The paragraph that raised the question — the inventory of what the
      architects had shared — is gone; Bryan cut it in his own pass. There is no sentence left to
      move in either direction. The 590 body is now two paragraphs and about 60% shorter, and it
      no longer describes the material-contrast hierarchy at all. That is his editorial call,
      recorded here because the specificity was the page's strongest asset and its absence should
      be a decision rather than an accident.

      **Dura framing 590 as team work.** `dura-architectural-signage.md` now reads *"real estate
      clients like 590 Madison Avenue"* instead of *"our team handled donor recognition and
      corporate signage at 590 Madison Avenue"*. The passage that read against the sole-authorship
      claim is no longer there.

---
Everything above is closed. The routing items that used to be listed here described a four-chat
structure that no longer exists; they are in `git log` with the rest of the history.

---

*The decision index lived here — 92 rows pointing into `docs/decisions-archive.md`. Both were
deleted together on 2026-09-08: the index was the map used to audit the archive, so it only became
meaningless once its target was gone. `git log --grep <id>` replaces both, and
`tests/ledger.test.ts` fails if an id we cite stops resolving.*
