# Decisions

The contract for bryancampana.com. **"Current state" is what is true; "Do not reopen" is what
was rejected and why.** Dated reasoning lives in [`docs/decisions-archive.md`](docs/decisions-archive.md).

**One chat writes; read-only advisory chats are fine.** Until 2026-09-07 this was split across
four, and most of the machinery below existed only to keep them from overwriting each other.

## ⚠ The chat structure is being consolidated — 2026-09-07

Bryan is folding the separate chats into one. **Most of this file's coordination machinery exists
only because several chats wrote to it concurrently**, and with one writer it is dead weight that
will mislead rather than help. What survives and what does not:

**Still worth keeping with one chat:**
- **Current state** — this is the contract, and its value does not depend on how many chats exist.
- **Do not reopen** — the record of what was rejected and why. The most expensive thing to lose.
- **A decision is two writes** (rule 11): the archive entry *and* the Current state update.
  This is what stopped the file becoming 1,863 lines of unresolvable history.
- **Archive entries are immutable; supersede rather than edit** (rule 11a).
- **Re-read a section at write time** (rule 9a) — the cause of the worst error made here.

**Dead weight once there is one chat:** the ownership table, rule 2 routing, rule 9 section
ownership, the per-chat id prefixes of rule 11b, and both "Open decisions" sections as separate
inboxes. Collapse them rather than leaving them to describe a structure that no longer exists —
a file that lies about its own process is the failure this ledger was restructured to fix.

## The rules

1. **Read "Current state" and "Do not reopen" before proposing anything.** The answer is
   usually already there, and the second one is the record of what has already been paid for
   once.
2. **Write a decision down or it never happened.** Two writes, same commit: an entry at the top
   of `docs/decisions-archive.md`, and the "Current state" section it changes. A conclusion
   reached only in chat is gone when the chat ends.
3. **Preview before pushing.** Build locally, show Bryan, push once he approves.
4. **Builds need a `[deploy]` subject line.** A push only builds when the commit *subject starts
   with* the tag — never put it in a body. Check first:
   `git log -1 --pretty=%s | grep -q "^\[deploy\]" && echo BUILD || echo skip`
5. **The archive is frozen history and "Current state" wins.** Entries are immutable and several
   contradict each other; supersede rather than edit. An entry being present says nothing about
   it still being true — check whether a later one overrode it.

---

# Current state

**This section is the contract. Read it to know what is true.** Dated reasoning lives in
[`docs/decisions-archive.md`](docs/decisions-archive.md) — go there for *why*, never for *what*.

## Colour — this table wins

**Read this before touching a colour anywhere.** When a colour changes, update it **here**, in
the same commit as the archive entry that changes it.

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
| `--color-focus` | `#9600DD` | `#DD51FF` | `color/focus` | Containment ring |
| `--color-accent` | `#9600DD` | `#DD51FF` | `color/accent` | The charge. Same value as focus, deliberately |

**Two principles that derive the dark values, so future ones are not picked by eye:**

1. **A rule holds the same contrast ratio against its ground in both modes** — 15.42:1 light,
   15.44:1 dark. This is why `--color-line` is not simply `--color-fg` in dark.
2. **Muted is tuned for equal *perceived* separation, not equal measured ratio** — gap to ink
   2.75 light, 1.78 dark. A dark surround exaggerates lightness differences, so equal perceived
   separation needs a smaller measured step in dark. Do not "fix" them to match.

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
  keyword on **three** axes now — weight, size and colour — against `Label`, Sans Medium 13px
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
- **Project pages open on the title, and the slot above it stays empty.** The `WORK` eyebrow is
  removed and nothing replaces it — putting `discipline` there was considered and dropped
  (`DF-002`). **Eyebrows are for section headings only**: `FEATURED` on the landing page and
  `CONTACT` on About. They do not appear on project pages. The `← All work` link at the foot
  stays — a different affordance, offered where the reading ends.
- **Contact block, About page.** Desktop is three columns — portrait `1fr`, biography `2fr`,
  contact `1fr`, 64px gutters. Mobile stacks it after the biography. The block is a `CONTACT`
  eyebrow (the text style, **no rule** — it is a column element, not a break in a flow), then
  `Based in New York City` in muted, then **email · LinkedIn · résumé (PDF)**. Email renders as
  the address, `bryanc9624@gmail.com`, not the label: it is copyable and reads as an invitation.
- **Radius is 0** on both tokens, derived from Plex's square construction rather than left unset.

## Components

Figma page `04 — Components`: `ProjectCard`, `Placeholder`, `SiteHeader` (Current × Breakpoint,
six variants), `SiteFooter`, `Eyebrow`, `FactPair`, `FilterLink`, `VideoFacade`.

- **Card is image → keyword → title → description.** No year. No design question.
- **`SiteFooter` is Terms of Use · Privacy Policy.** No Contact, no LinkedIn — both live
  on About.
- **`FilterLink` is the Eyebrow tier** — uppercase, 15px, SemiBold, 8% tracking, `--color-fg`.
  The count is the **same size and weight**, separated by colour alone (`--color-muted`), 6px to the
  right on the shared baseline. Selected is `Eyebrow / Selected` — Bold plus an underline, still ink.
  The count does not take the selected emphasis. `CD-002`.
- **`--color-accent` is hover-only, everywhere.** One rule, `a:hover` in `base.css`, plus
  `.filterlink:hover` for the label, which is not an anchor. Nothing static carries the charge;
  a permanent accent makes it decorative and it stops signalling. `--color-focus` is the same
  value but a different token for a different state — pointers versus keyboards.
- **The keyword set is full at seven links.** 804px against ~122px for an average keyword; an
  eighth goes to four mobile rows. Renaming inside 14 characters is free. See
  `docs/copy-constraints.md`.
- **The count is `--weight-regular`, not Medium** — `CD-001`. It annotates the label rather
  than belonging to it, and every property on that element is chosen to keep it inside the 26px
  row the label sets, because the filter hairline sits on that row. Figma's node is to be
  rebound from `Label` to `Body / Small`.
- **Every state carries two cues — never colour alone.** The current nav item is `Body / Medium`
  500 + `--color-fg`. The selected filter is `Eyebrow / Selected` — Bold **plus an underline** —
  because both filter states are ink, so weight alone would be one cue.
- **`--color-accent` is HOVER ONLY.** It marks a link under the pointer and nothing else. It is
  not a resting state, not a selected state, and not a label colour. `--color-focus` shares its
  value but is a different token for a different state and stays — hover is for pointers, focus
  is for keyboards, and the two must remain distinguishable.
- **The keyword filter is the Eyebrow tier**: uppercase, 15px, 8% tracking. **Label and count are
  the same size and weight and are separated by colour alone** — label `--color-fg`, count
  `--color-muted`. Not by size or a raised position, which is what they used before.
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
- **`src/content/**` belongs to Content and Copy.** Design and Code both keep out. Content
  changes either chat needs go to Bryan.
- **Copy works inside measured limits, not by asking.** `docs/copy-constraints.md` carries
  them — keyword label ≤ 14 characters, filter set ≤ 7 links, card scope ≤ 100 characters,
  project title ≤ 30 for one line, discipline ≤ 32. **Design owns that file and re-measures
  it after any text-style change**, since size, weight, family and tracking all move it.
- **Seven keywords** — Art 10 · Photography 4 · New Media 3 · Exhibition 2 · Identity 2 ·
  Signage 2. `Fine Art` and `Digital` are retired. **`Art` is a second axis, not a medium** —
  it covers everything made as art rather than commissioned as design, so a project can carry
  it alongside `Photography` or `New Media`. The four excluded are the client work. The filter
  row measures 814px, one desktop line, three rows at 390px. `CD-005`, `CD-006`.
- **Projects sort by `year` then `month`, both descending; `order` is the last tiebreak.** The
  filter hides cards rather than reordering them, so every filtered view inherits this one order —
  a date sort is the only one that stays true of every subset. No `year` sorts last overall; no
  `month` sorts last within its year. **`month` sorts, `completed` renders, and a test asserts they
  agree.** `CD-007`, `CD-008`.
- `discipline` selects the project page layout; `keywords` is an unordered set. `year` sorts,
  `completed` renders. `columns` overrides the photography grid, else it is derived from image
  count (≤2 → one column, 4 → two-up, otherwise three-up). `cover.<ext>` is a card-only image.
- **Slugs carry no `-1` suffix.** Three did, out of the Cargo export; they are renamed with `301`
  redirects in `netlify.toml`. A slug rename is TWO renames — the content file and the matching
  directory under `src/assets/projects/`, which is how images are keyed. `CD-005`.
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
- **`get_metadata`'s page listing is wrong** — it reports one page. Use a read-only `use_figma`
  running `figma.root.children`. Full detail in `docs/retired/design-chat-handoff.md`.
- **For photography galleries the code is the source of truth, not Figma.** Figma draws two-up,
  which is now only the four-image case. Do not "correct" the code to match the drawing.

## Hosting and deploys

- **Netlify, Personal plan** ($9/month, team `Nero`). **1,000 credits per cycle**, cycle runs
  the **7th to the 6th** — not the calendar month. One concurrent build.
- **A production build costs ~15 credits**, so a cycle buys roughly **65 builds**. Measured, not
  quoted: the first deploy took 15.2 credits including bandwidth and compute. **Builds are the
  entire cost** — bandwidth and compute together were 0.2.
- **A build runs only when the commit SUBJECT STARTS WITH `[deploy]`.** Never put the tag in a
  commit body. Check before pushing:
  `git log -1 --pretty=%s | grep -q "^\[deploy\]" && echo BUILD || echo skip`
- **Domain:** `bryancampana.com`, apex canonical, `www` 301s to it. DNS delegated to Netlify
  (`dns1..4.p04.nsone.net`). Let's Encrypt certificate issued 2026-09-07 23:34 UTC.
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
| Rounded corners on cards | Architectural photography fights a rounded frame. The "droplet" motif is reserved for a real button if one ever appears |
| Previous/next project nav | Its default direction walked readers from strong recent work toward older student work |
| "More work" control | At 14 projects the keyword filter already does this, better |
| A non-zero radius | Measured against the typeface; Plex has square corners throughout |
| Dark mode in Figma | Costed and rejected — 74 unbound fills, a second copy of the palette, and you can already see dark on the built site |

---

# Open

**Nothing open.** Recently closed items are kept below for traceability; older ones are in
the archive's "Appendix — closed routing items".

- [x] **RESOLVED 2026-09-07 — Design names the final six. See `D-059`.** Two content edits,
      no code change, and one question that is Bryan's rather than mine.

      **`Art` becomes `Fine Art`** — the settled name stands. `Art` sitting beside `Photography`
      and `New Media` is a category error, since those are also art; `Fine Art` names a
      medium-specific practice instead of a superset. Rename only — the three projects carrying
      it keep it.

      **`Visual Communications` is removed** from `dura-architectural-signage`, which keeps
      `Signage` alone. It was explicitly consolidated into Signage, it matches one project, and
      at 192px it is the longest label in the set — the exact string that wrapped the mobile
      filter to five rows and caused the consolidation in the first place.

      **Resulting six:** Photography 4 · Identity 4 · New Media 3 · **Fine Art 3** · Signage 2 ·
      Digital 1. Better than the consolidation predicted, which expected Fine Art at 1.

      **`Digital` stays a singleton, deliberately.** It is on `represent-1` only, but it is seven
      characters, so it causes none of the wrapping the long labels did, and it names a real axis
      Bryan has more work in. Revisit only if it is still alone when the next projects land.

      **Not my call — flagged for Bryan.** `represent-1` and `resemblance-1` carry `Fine Art`
      alongside `Identity`. The consolidation mapped both to Identity from *Exhibition Design*,
      so the `Art` on them was added afterwards. If that was deliberate, it stands and is
      arguably a better description of New Media Artspace work than Identity is. If it was
      accidental, say so and it comes off. **Which projects carry which keyword is editorial;
      only the vocabulary was mine to settle.**

      **Note for Code and Deploy before you edit:** your working tree currently has uncommitted
      changes to `dura-architectural-signage.md`, `photopolymer-letterpress.md`, `represent-1.md`
      and `resemblance-1.md` — exactly the four files this touches. The values above were read
      from `HEAD`, not from your tree. Check you are not already mid-fix before applying.

> **Restored 2026-09-07 after Design and Figma deleted it by accident.** The ledger
> restructure rebuilt this section from a hardcoded "Nothing open" based on an audit taken
> before Code and Deploy raised the item above, so a live routed question was overwritten and
> then reported as closed. Recovered verbatim from `29a3b72`. The mistake is recorded rather
> than quietly repaired because it is the exact failure the restructure was meant to prevent —
> acting on a value copied from a source that had since moved on.

- [x] **RESOLVED 2026-09-07 — both strings change. See `DF-001`.** The rule, not the words:
      **`discipline` is a prose description of the practice, and it may coincide with a keyword
      where the practice genuinely has that name — but it must never carry a string the keyword
      vocabulary has retired.** Seven of fourteen disciplines already equal their keyword
      (`Photography`, `New Media`), and that is fine. A *retired* string is different: to a reader
      who has just used the filter, it reads as the site contradicting itself.

      So `Art` and `Visual Communications` both go. What replaces them is **copy, not vocabulary**,
      and `src/content/**` belongs to Content and Copy as of `D-063` — so this is theirs to write,
      not Code and Deploy's to edit. My recommendations, to accept or improve:

      | Project | Now | Suggested | Why |
      |---|---|---|---|
      | `photopolymer-letterpress` | `Art` | **`Printmaking`** | Names the actual practice. More informative than either `Art` or `Fine Art`, and it is what the work is |
      | `dura-architectural-signage` | `Visual Communications` | **`Signage & Wayfinding`** | Matches the register of `590 Madison Ave`, and describes the work the scope line already describes |

      **Not a naming problem in one case.** `Art` is also the category error `D-059` names — beside
      `Photography` and `New Media`, which are themselves art, it claims a superset. That reasoning
      applies to any field it appears in, not just the filter.

      **Correction to the routing:** the item says "Code and Deploy will make the edits". They no
      longer can — `D-063` moved `src/content/**` to Content and Copy the same day. The edits go
      to Bryan, who takes them to that chat.

- [x] **RESOLVED 2026-09-07 — the label moves below the image. See `DF-006`.** Drawn on the
      `VideoFacade` component, so every instance follows.

Bryan's, not this chat's: the 14 design questions.


- [x] **DONE — `CD-002`, with a correction.** Only ONE of the four ever shipped: the selected
      filter link, now ink + Bold + underline. The other three line numbers point at `.card__draft`,
      `.case__draft` and `.photo__draft`, which are dev-only (`showDraftFlag` is
      `import.meta.env.DEV`) — `.card__keyword` has been `--color-muted` all along. Draft flags
      left loud on purpose; say so if the rule should be absolute. Hover added as one global
      `a:hover` rule plus `.filterlink:hover`.
      Original: **The violet is on four static things and should be on none of them. `DF-005`.**
      *Raised by Design and Figma 2026-09-07. Three of the four are drift against Figma, not a
      new decision — Figma has said `muted` all along.*

      `--color-accent` is **hover only**. The settled colour system has always said so — *"drawn
      charge"* at rest, *"full charge"* on hover — and the code has it on four resting elements
      and one hover.

      | File | Now | Should be |
      |---|---|---|
      | `ProjectCard.astro:69` `.card__keyword` | `--color-accent` | `--color-muted` |
      | `ProjectStandard.astro:91` | `--color-accent` | `--color-muted` |
      | `ProjectPhotography.astro:114` | `--color-accent` | `--color-muted` |
      | `work/index.astro:88,91` selected filter + count | `--color-accent` | see below |

      The card keyword is the loud one — it renders violet **fourteen times on `/work`** and four
      more on the landing page. That is what Bryan was reacting to.

      **Add hover instead**, which currently exists only on `VideoFacade`: a filter label and any
      inline text link take `--color-accent` on `:hover`. **`--color-focus` does not change** —
      same value, different token, different state. Hover is for pointers and focus is for
      keyboards, and the settled system requires them to stay distinguishable.

- [x] **DONE — `CD-002`.** Built and measured against the component: 815px row against the 813px
      in `DF-005`, 19.5px rows, three rows at 390px. The selected count follows the DRAWING rather
      than the snippet — SemiBold and undecorated, as Figma's Selected variant has it.
      Original: **Restyle the keyword filter to the eyebrow tier. `DF-005`.** *Design and Figma; drawn on
      both work-index frames.*

      Label and count now share one tier and are separated by **colour alone**:

      ```css
      .filterlink {
        font-size: var(--size-sm); font-weight: var(--weight-semibold);
        text-transform: uppercase; letter-spacing: var(--tracking-wide);
        color: var(--color-fg);
      }
      .filterlink__count {           /* same size and weight — only the colour differs */
        margin-left: 6px; font-size: inherit; font-weight: inherit;
        color: var(--color-muted);
      }
      .filter input:checked + .filterlink {
        font-weight: var(--weight-bold); text-decoration: underline;
        color: var(--color-fg);      /* NOT accent */
      }
      .filterlink:hover { color: var(--color-accent); }
      ```

      **`--weight-bold: 700` is needed** and `tokens.css` stops at semibold. No font work: Sans
      is the variable file spanning `100 700`.

      **Why selected gains an underline.** Both states are ink now, so weight alone would be a
      single cue. Underline is the second, and it is the device the colour system already
      reserves for text links.

      **Drop `line-height: 0` and the baseline offset on the count** — it is the same size as the
      label now, so it cannot grow the line box and needs no protection.

      **Measured, so the row is known-good:** 696px → 813px, +17%. One line on desktop, three rows
      at 390px, unchanged. Headroom fell from ~197px to 80px, so **the keyword set is now full at
      seven links** — `docs/copy-constraints.md` is updated.

- [x] **DONE — `CD-001`.** `.eyebrow` is SemiBold and is now the single definition of that type;
      `.eyebrow--section` adds the hairline, and `about.astro` declares no eyebrow type of its own.
      Original: **`.eyebrow` is still Medium; it should be SemiBold.** *Raised by Design and Figma
      2026-09-07. Full reasoning in `DF-002`; this is the actionable half.*

      `src/styles/base.css:75` reads `font-weight: var(--weight-medium)`. It should be
      `var(--weight-semibold)`. The colour half of that change is already in — you took
      `--color-fg` from `D-064` and the comment on line 78 records it.

      Bryan stepped the eyebrow up one weight class because ink alone was not enough
      separation from the keyword on project cards. It now differs on three axes: SemiBold
      against Medium, 15px against 13px, ink against muted.

      **No font work.** SemiBold 600 is Sans, which loads as a variable file spanning
      `100 700`, and 600 is already used by four other styles. This is not the situation
      that made `D-061` fail — that asked for **Serif** 500 and 700, which are static
      per-weight files and were not imported.

      **⚠ Do this in one place, not two — read before you edit.** There are currently *two*
      eyebrow implementations, and changing only `.eyebrow` splits them:

      | | Where | Carries |
      |---|---|---|
      | `.eyebrow` | `base.css:75` | type + the hairline + margins |
      | `.about__label` | `about.astro:56` | the same seven type declarations, no rule |

      Both set sans / medium / `--size-sm` / `--leading-eyebrow` / uppercase /
      `--tracking-wide` / `--color-fg`. Identical type, written twice. Change one and the
      landing's `FEATURED` goes SemiBold while About's `CONTACT` stays Medium — two things
      drawn from a single Figma text style, no longer matching.

      **Design's statement of what this is:** there is **one** eyebrow. It appears in two
      contexts — as a section heading above a grid, where it takes a hairline, and as a
      column label, where it does not. Figma already models it that way: the `Eyebrow` *text
      style* is type only, and the `Eyebrow` *component* is that style plus the rule. The CSS
      should mirror it — type on one shared selector, the rule added by the section-heading
      case only. Structure is yours; the fact that it is one thing and not two is mine.

      Your `<h2>` with a CSS-uppercased accessible name is a better call than the styled
      paragraph this chat drew, and nothing above asks you to undo it.

- [x] **DECIDED — Regular, recorded in `CD-001`.** Design and Figma: please rebind the Figma node
      from `Label` to `Body / Small`. Original: **Decide the filter count's weight, and say which in
      the ledger.** *Raised by Design
      and Figma 2026-09-07; flagged twice now without resolution.*

      `work/index.astro:81` sets `.filterlink__count` to `var(--weight-regular)`. Figma draws
      that node with the **`Label`** style, which is Sans **Medium 500**. The two have
      disagreed since the count was drawn.

      **This chat has deliberately not picked**, twice: the routing document that moved the
      count to the baseline asked for the treatment to be preserved, and changing weight is
      not preserving it. But leaving it means Figma and the site disagree on a live element,
      which is the condition every drift today started from.

      Either is defensible — Regular is quieter behind a Medium label, Medium matches the
      other small-label tier. **Pick one and record it**; if you pick Medium, Design updates
      Figma to match rather than the other way round, and if you pick Regular, Design changes
      the Figma node to `Body / Small`.

- [x] **DONE 2026-09-07.** `--size-xs` and `--leading-label`; computes 13px / 500 / 18.2px /
      1.04px, matching the `Label` style exactly. Every Label-tier element in the codebase now
      uses that pairing, and `--leading-eyebrow` is used by the eyebrow alone.
      Original: **`.video__label` does not match the `Label` style it is bound to.** *Raised by Code and
      Deploy 2026-09-07 while doing `CD-001`; flagged rather than changed because it is a
      visible size change outside the routed scope.*

      `VideoFacade`'s label node uses the `Label` text style — 13px Medium, 140%.
      `src/components/VideoFacade.astro` sets `--size-sm` (15px) and `--leading-eyebrow` (1.3).
      Both are wrong; `--size-xs` and `--leading-label` are correct and are what `ProjectFacts`
      already uses.

      `.card__keyword` had the same leading error and is fixed in `CD-001`, so this is the last
      one. It is a one-line change and Code and Deploy will make it — confirming first only
      because it shrinks the PLAY label on every video facade, which is Bryan's to see.

> **Note on this section, for transparency — written by Design and Figma, 2026-09-07.**
> Rule 9 makes this section Code and Deploy's, and I edited it. Bryan authorised it directly.
>
> It held eight items, **all of them closed**, running to 126 lines — mostly full original
> text kept "for traceability", plus pointers to a "Settled log" that no longer exists in this
> file. None of it was written by the current Code and Deploy chat: most came from the first
> one, since retired, and two were raised by me.
>
> Nothing was deleted. It is preserved verbatim in
> [`docs/decisions-archive.md`](docs/decisions-archive.md) under **"Appendix — closed routing
> items"**. It was moved rather than left because a new chat reads this section as its inbox,
> and an inbox of someone else's finished business is a poor first thing to read.
>
> **This section is yours again from here.** Add items freely; I will not touch it without
> Bryan saying so.

Two of the archived items are worth reading if you hit something odd, because they record how a
drift happened rather than just that it did: **the serif body drift** (a spec written against a
tree one commit stale) and **the muted values** (which carry the contrast reasoning behind the
current palette).

# Decision index

84 decisions, and ids are now per chat — see rule 11b. **⚠ means the entry is superseded or partly superseded — read it for
history, never to decide what to do next.** Full text in
[`docs/decisions-archive.md`](docs/decisions-archive.md).

| ID | Decision | Status |
|---|---|---|
| [`CD-001`](docs/decisions-archive.md#cd-001) | Filter count stays Regular; one eyebrow, one definition. Code and Deploy. | |
| [`DF-007`](docs/decisions-archive.md#df-007) | Handover: what this chat knew that no file held | |
| [`CD-012`](docs/decisions-archive.md#cd-012) | No type-sync pipeline; nothing in Figma rules the code. Bryan's call. | |
| [`CD-011`](docs/decisions-archive.md#cd-011) | Figma is a reference, not the spec; code is the source of truth. ⚠ | — Partly superseded |
| [`CD-010`](docs/decisions-archive.md#cd-010) | Wordmark steps up; underlines step away; "Featured work" loses a word. | |
| [`CD-009`](docs/decisions-archive.md#cd-009) | Every project dated to the month; three years were wrong. | |
| [`CD-008`](docs/decisions-archive.md#cd-008) | Month refines the sort; month and completed guarded by a test. | |
| [`CD-007`](docs/decisions-archive.md#cd-007) | Projects sort by date, newest first. Bryan's call. | |
| [`CD-006`](docs/decisions-archive.md#cd-006) | The photography is Art too. Bryan's call. | |
| [`CD-005`](docs/decisions-archive.md#cd-005) | Art replaces Fine Art, Exhibition returns, slugs lose the Cargo suffix. Bryan's call. | |
| [`CD-004`](docs/decisions-archive.md#cd-004) | Links are undecorated; an underline is a state. Bryan's call. | |
| [`CD-003`](docs/decisions-archive.md#cd-003) | Consolidated to one chat; DF-005 finished, DF-006 built, disciplines settled. | |
| [`DF-006`](docs/decisions-archive.md#df-006) | The PLAY label moves below the image | |
| [`CD-002`](docs/decisions-archive.md#cd-002) | Filter is the eyebrow tier; the charge is hover-only. Code and Deploy. | |
| [`DF-005`](docs/decisions-archive.md#df-005) | Filter takes the eyebrow tier; the violet becomes hover-only | |
| [`DF-004`](docs/decisions-archive.md#df-004) | Figma is build-ready; where it is 1:1 with code and where it is not | |
| [`DF-003`](docs/decisions-archive.md#df-003) | One eyebrow, two contexts — the type is implemented twice | |
| [`DF-002`](docs/decisions-archive.md#df-002) | Eyebrows are section headings only; eyebrow steps to SemiBold | |
| [`DF-001`](docs/decisions-archive.md#df-001) | Discipline strings, and per-chat decision ids | |
| [`D-065`](docs/decisions-archive.md#d-065) | Build budget is 1,000 credits a cycle, not 300. Code and Deploy. | |
| [`D-064`](docs/decisions-archive.md#d-064) | Weights reverted; the eyebrow keeps its ink. Bryan's call. | |
| [`D-063`](docs/decisions-archive.md#d-063) | A fourth chat for copy, which does not use this ledger. `src/content/` moves to it. | |
| [`D-062`](docs/decisions-archive.md#d-062) | The WORK eyebrow above the project title is removed. Bryan's call. | |
| [`D-061`](docs/decisions-archive.md#d-061) | Bryan reweights the display ramp and the eyebrow. ⚠ | — Superseded |
| [`D-060`](docs/decisions-archive.md#d-060) | Contact consolidates on About; header baseline locked; counts drop to the baseline. | |
| [`D-059`](docs/decisions-archive.md#d-059) | The final six keywords, and a routed item that was destroyed and restored. | |
| [`D-058`](docs/decisions-archive.md#d-058) | Shipped. First deploy ran, and the domain was cut over to Netlify. | |
| [`D-057`](docs/decisions-archive.md#d-057) | Muted retuned and the nav gains a weight cue, in code. Code and Deploy. | |
| [`D-056`](docs/decisions-archive.md#d-056) | Closing out Design and Figma's open list before launch. Three items, three … | |
| [`D-055`](docs/decisions-archive.md#d-055) | Muted is retuned, and the current nav item gains a weight cue. Bryan's call… | |
| [`D-054`](docs/decisions-archive.md#d-054) | Figma realigned to the rule token. Design and Figma confirms Code and Deplo… | |
| [`D-053`](docs/decisions-archive.md#d-053) | `--color-line` is the rule token, and its value is derived, not picked. Bry… | |
| [`D-052`](docs/decisions-archive.md#d-052) | The deploy gate was inverted and burned the whole billing cycle. Fixed. | |
| [`D-051`](docs/decisions-archive.md#d-051) | The chrome rules are gone. Every remaining rule is ink. Bryan's call. Drawn… | |
| [`D-050`](docs/decisions-archive.md#d-050) | The wordmark is serif, at body size. New `Wordmark` text style. Bryan's call. | |
| [`D-049`](docs/decisions-archive.md#d-049) | Header reworked: full width, everything left, Contact moved up from the foo… | |
| [`D-048`](docs/decisions-archive.md#d-048) | Hosting stays on Netlify. Bryan's call. Cloudflare question closed. | |
| [`D-047`](docs/decisions-archive.md#d-047) | `/terms` and `/privacy` are approved as they stand. Bryan's call. | |
| [`D-046`](docs/decisions-archive.md#d-046) | No synthesised faces, ever. Bryan's rule. | |
| [`D-045`](docs/decisions-archive.md#d-045) | Rule hierarchy implemented in code. Code and Deploy. | |
| [`D-044`](docs/decisions-archive.md#d-044) | Figma brought in line with the code's type decisions; Foundations repaired.… | |
| [`D-043`](docs/decisions-archive.md#d-043) | The domain mailbox is not carried over. Bryan's call. | |
| [`D-042`](docs/decisions-archive.md#d-042) | Cargo's image ORDER and caption pairing recovered from the archive. | |
| [`D-041`](docs/decisions-archive.md#d-041) | `cover.<ext>` is a card-only image. Code decision. | |
| [`D-040`](docs/decisions-archive.md#d-040) | Body text is Sans, not Serif. Bryan's call, made in Code and Deploy. | |
| [`D-039`](docs/decisions-archive.md#d-039) | Design questions leave Design and Figma's list. Bryan's call. | |
| [`D-038`](docs/decisions-archive.md#d-038) | Horizontal rules get a hierarchy. Bryan's call. Done in Figma. ⚠ | — Superseded |
| [`D-037`](docs/decisions-archive.md#d-037) | Serif/sans pairing: IBM Plex Serif with IBM Plex Sans. Bryan's call. In Figma. ⚠ | — Partly superseded |
| [`D-036`](docs/decisions-archive.md#d-036) | Video facade drawn. Ready to implement. | |
| [`D-035`](docs/decisions-archive.md#d-035) | "Droplet" — a reserved shape motif. Named, not applied. | |
| [`D-034`](docs/decisions-archive.md#d-034) | Radius stays 0, derived from the typeface. Measured, not defaulted. | |
| [`D-033`](docs/decisions-archive.md#d-033) | Colour VALUES settled. Bryan's call. *(VALUES PARTLY SUPERSEDED — see "Curr… ⚠ | — Values superseded |
| [`D-032`](docs/decisions-archive.md#d-032) | Keywords consolidated from eight to six. Bryan's call. Content change. ⚠ | — Partly superseded |
| [`D-031`](docs/decisions-archive.md#d-031) | Keyword filter reverted to text links. Bryan's call. Drawn in Figma. | |
| [`D-030`](docs/decisions-archive.md#d-030) | Open: the keyword set may be too granular for 14 projects. ⚠ | — Resolved |
| [`D-029`](docs/decisions-archive.md#d-029) | Colour SYSTEM agreed. Values still open. Bryan's concept. ⚠ | — Accepted |
| [`D-028`](docs/decisions-archive.md#d-028) | Video is embedded as a facade, not an iframe. Bryan's call (option B). | |
| [`D-027`](docs/decisions-archive.md#d-027) | Figma file cleaned: no archives, no versioned duplicates. Bryan's call. | |
| [`D-026`](docs/decisions-archive.md#d-026) | Typeface swap executed in Figma. Done, verified. | |
| [`D-025`](docs/decisions-archive.md#d-025) | Typeface is IBM Plex Sans (Google Fonts), replacing New Frank. Bryan's call. ⚠ | — Accepted |
| [`D-024`](docs/decisions-archive.md#d-024) | Legal copy approved as published. Bryan's call. | |
| [`D-023`](docs/decisions-archive.md#d-023) | Design questions are optional, not required. Bryan's call. ⚠ | — Accepted |
| [`D-022`](docs/decisions-archive.md#d-022) | Previous/Next project navigation removed. ⚠ | — Accepted |
| [`D-021`](docs/decisions-archive.md#d-021) | Landing statement is `--size-xl`. Figma is right; the code should change. | |
| [`D-020`](docs/decisions-archive.md#d-020) | Type ramp is bound to one variable. | |
| [`D-019`](docs/decisions-archive.md#d-019) | Role is removed entirely. Bryan's call. | |
| [`D-018`](docs/decisions-archive.md#d-018) | Keywords are seeded from the site's disciplines, not the three categories. ⚠ | — Superseded |
| [`D-017`](docs/decisions-archive.md#d-017) | `discipline` is its own field, not `keywords[0]`. | |
| [`D-016`](docs/decisions-archive.md#d-016) | `year` is a sort key; `completed` is what renders. | |
| [`D-015`](docs/decisions-archive.md#d-015) | Hosting stays on Netlify. Bryan's call. | |
| [`D-014`](docs/decisions-archive.md#d-014) | Deploy discipline. Enforced in netlify.toml. | |
| [`D-013`](docs/decisions-archive.md#d-013) | Motion is not constrained by hosting. | |
| [`D-012`](docs/decisions-archive.md#d-012) | Featured set stays at 4. Bryan's call. | |
| [`D-011`](docs/decisions-archive.md#d-011) | ProjectCard direction. Decided. | |
| [`D-010`](docs/decisions-archive.md#d-010) | Design question house style. Decided (style only). | |
| [`D-009`](docs/decisions-archive.md#d-009) | Every project gets a project page. | |
| [`D-008`](docs/decisions-archive.md#d-008) | Project pages come in two layouts. | |
| [`D-007`](docs/decisions-archive.md#d-007) | Fact labels follow the live site's vocabulary. | |
| [`D-006`](docs/decisions-archive.md#d-006) | Work index is filterable, not grouped. ⚠ | — Partly superseded |
| [`D-005`](docs/decisions-archive.md#d-005) | Responsive display type. | |
| [`D-004`](docs/decisions-archive.md#d-004) | Font weights, REVISED for New Frank: 600 becomes 700. SUPERSEDED — reverted… ⚠ | — Superseded |
| [`D-003`](docs/decisions-archive.md#d-003) | Font weights. SUPERSEDED by the entry above — 600 does not exist in New Frank. ⚠ | — Superseded |
| [`D-002`](docs/decisions-archive.md#d-002) | Active nav item gets a visual treatment. | |
| [`D-001`](docs/decisions-archive.md#d-001) | Earlier | |
