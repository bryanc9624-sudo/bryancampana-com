# Decisions

Shared ledger between the three Claude Code chats working on this project.
All three live in this folder. Two write to it; the third audits it — see the table.

| Chat | Owns | Writes to |
|---|---|---|
| **Design and Figma** | What the site looks like — layout, type, colour, spacing, card direction | Figma + "Current state" + its own "Open" section |
| **Code and Deploy** | Making the site match — code, tests, build, deploy. Also hosting, DNS, domain and build-credit budget: Bryan folded those in on 2026-09-07 rather than run a third owner. | The repo + "Current state" + its own "Open" section |
| **Oversight** | Nothing. Audits the other two against the repo and reports to Bryan. Read-only on code and on both chats' sections. Charter: `docs/oversight-charter.md` | The "Sync audits" section below, and nothing else |

## The rules

1. **Read this file before asking Bryan anything.** If the answer is here, use it.
2. **Never ask a question the other chat owns.** Route it instead: add it to "Open
   decisions" and tell Bryan which chat it belongs to. He is not a message bus.
3. **Design decisions are not real until they are written here or visible in Figma.**
   A decision made only in conversation is invisible to the other chat forever.
4. **Code and Deploy never invents design.** If Figma doesn't say, it stays a placeholder.
5. **Preview before pushing.** Bryan reviews a local build before anything deploys.
6. **"Live site" means bryancampana.netlify.app.** bryancampana.com is still served by
   Cargo. The DNS cutover is Phase 5 and needs Bryan's explicit go-ahead.

## Keeping this file in sync — both chats follow this

This file lives on `main` and both chats commit to it directly. Bryan gave standing
permission for that on 2026-09-07, precisely so it stops going stale on a side branch.
That removes the worst failure mode but not all of them, so:

7. **`git pull` before you read it. Push immediately after you write it.** The window
   between your edit and your push is the window where the other chat can be wrong. Keep
   it to seconds, not days.
8. **Anything you read more than a few minutes ago is stale.** Git does not notify you of
   changes — you have to go and fetch them. Re-read before acting on something here,
   especially before telling Bryan a decision is still open.
9. **Edit only your own sections.** Each chat owns its own "Open decisions" section.
   "Current state" is shared — update the part your decision touches, and nothing else.
   Never rewrite the whole file; make targeted edits so conflicts stay small and
   obviously mechanical.
10. **If your push is rejected, pull and re-apply your change.** Never force-push this
    file — a force-push here silently deletes the other chat's work, which is the one
    failure mode git would otherwise have caught for you.
12. **Builds cost money — tag them.** A push only triggers a Netlify build when the
    commit message contains `[deploy]`; `netlify.toml`'s `ignore` command skips the rest
    before the build starts. Batch work, then tag one commit. Free tier is 300 credits
    per cycle and the cycle runs the 7th to the 6th, not the calendar month.

11. **A decision is TWO writes, and both belong in the same commit.**
    (a) Append a full dated entry to the top of `docs/decisions-archive.md`, with the next
    `D-NNN` id and `**Status:** Accepted`.
    (b) Update the affected "Current state" section here to say what is now true.
    Skipping (b) is how this file previously grew to 1,863 lines of history nobody could
    resolve into an answer.

11a. **Archive entries are immutable.** To change a decision, write a new one and set the
    old entry's status to `Superseded by D-NNN`. Never edit an accepted entry's contents —
    that is how "Colour VALUES settled" ended up half true. Adapted from Architecture
    Decision Records; git holds the history either way.

13. **"Sync audits" belongs to Oversight — do not edit it.** A third chat audits this
    ledger against the repo and records what it finds there. Read it; treating one of its
    findings as wrong is fine, but correct the entry it points *at*, in your own section,
    rather than editing the audit. Oversight writes nowhere else in this file.

---

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
- **Self-hosted** through Fontsource, not Google's CDN. Weights in use: SemiBold 600, Medium 500,
  Regular 400, Serif Italic 400. Nothing else.
- **Style names have no space** — `SemiBold`, not Inter's `Semi Bold`. The mismatch silently
  drops text to Regular.
- **Size ramp:** xs 13 · sm 15 · base 17 · lg 22 · xl 32 · 2xl 48. `xl` and `2xl` step to 24 and
  32 under 40rem — in Figma that is the `Mobile` variable mode.
- **`Wordmark`** is serif at body size. It is identity, not navigation, and shares a line with the
  nav, so it must not step up in size — weight separates it, not size.

## Layout and chrome

- **Widths:** `--page-max` 1440; project pages `--page-max-wide` 1600.
- **Header and footer are full bleed.** They span the viewport and pad their contents by
  `--page-pad`. They are *not* `.page` — that was the bug where chrome sat 80px narrower per side
  than the work it framed.
- **No rule on the header or footer.** Chrome is marked by position and space.
- **One rule type, one meaning: a break within content.** Three places only — under the eyebrow,
  above the facts block, under the work-index filter.
- **Rules reference `--color-line` and nothing else.** Never bind a rule to `--color-fg`: that
  token means *the colour of text*, and text and rules do not want the same value in every mode.
- **Header contents:** wordmark, 64px gap, then Work · About · Contact, all flush left. Stacks
  under 40rem — 383px of row does not fit 342px of content width.
- **Radius is 0** on both tokens, derived from Plex's square construction rather than left unset.

## Components

Figma page `04 — Components`: `ProjectCard`, `Placeholder`, `SiteHeader` (Current × Breakpoint,
six variants), `SiteFooter`, `Eyebrow`, `FactPair`, `FilterLink`, `VideoFacade`.

- **Card is image → keyword → title → description.** No year. No design question.
- **Every state carries two cues — weight *and* colour — never colour alone.** FilterLink selected
  is 600 + `--color-fg`; the current nav item is `Body / Medium` 500 + `--color-fg`.
- **VideoFacade's ground is `--color-fg` (ink), not grey** — grey is this site's placeholder
  colour, so a grey video block reads as a missing image rather than something pressable.

## Content and schema

- **Copy is Bryan's**, verbatim from `archive/content/`. Neither chat writes portfolio copy.
- **Six keywords** — Photography 4, Identity 4, New Media 3, Signage 2, Digital 1, Fine Art 1.
- `discipline` selects the project page layout; `keywords` is an unordered set. `year` sorts,
  `completed` renders. `columns` overrides the photography grid, else it is derived from image
  count (≤2 → one column, 4 → two-up, otherwise three-up). `cover.<ext>` is a card-only image.
- **Featured set is 4**; all 14 projects get a page. Design questions are optional and Bryan's.

## Figma

- File `IeY23kkW263ZvuyJqiV2kD`. Pages: `0:1` Foundations, `1:29` Desktop, `1:30` Mobile,
  `12:2` Components.
- Professional. **One collection, modes `Desktop` / `Mobile` — a breakpoint axis, not a theme.**
  Dark mode cannot live in Figma; the palette table above owns dark and has no second check.
- **`get_metadata`'s page listing is wrong** — it reports one page. Use a read-only `use_figma`
  running `figma.root.children`. Full detail in `docs/design-chat-handoff.md`.
- **For photography galleries the code is the source of truth, not Figma.** Figma draws two-up,
  which is now only the four-image case. Do not "correct" the code to match the drawing.

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

# Open decisions — Design and Figma owns these

**Nothing open.** Closed out 2026-09-07 ahead of the first deploy — see `D-056`.

Bryan's, not this chat's: video poster stills (the ink ground is a deliberate state, not a gap)
and the 14 design questions.

## Open decisions — Code and Deploy owns these

Routed here rather than through Bryan, per rule 2.

- [x] ~~**APPLY THE MUTED VALUES.**~~ **DONE 2026-09-07 by Code and Deploy** — all three edits landed and were verified in both schemes; see Settled below. Original text kept for traceability.

- [ ] ~~Superseded:~~ **APPLY THE MUTED VALUES — Bryan asked for this directly, 2026-09-07.** *Raised by Design
      and Figma. Colour is Design's to state; the edits are yours.*

      `--color-muted` is still `#7E6F7E` light and `#A4A4A4` dark. Both are superseded. Bryan
      approved the new values in the design chat and asked that they be applied, so this is not
      a proposal — it is a decision waiting on implementation. **Until it lands, toggling dark
      mode in a browser shows the old neutral grey**, which is the thing he objected to.

      **Edit 1 — `src/styles/tokens.css`, both palettes:**

      ```css
      --color-muted: #75617A;   /* :root — was #7E6F7E */
      --color-muted: #C9BFCD;   /* dark block — was #A4A4A4 */
      ```

      Light gains violet (tint r−g 15 → 20) **and** contrast (4.71 → 5.60:1); it was sitting
      just over the 4.5 floor while carrying captions and card descriptions. Dark was **pure
      neutral, r = g = b exactly** — it never belonged to the palette. It is now tinted
      deliberately, because anything derived from the dark ground comes out neutral: that
      ground is held at chroma 0.006, so diluting white toward it lands at r−g = 1.

      Gaps to the ink differ by mode on purpose — 2.75 light, 1.78 dark. A dark surround
      exaggerates lightness differences, so equal *perceived* separation needs a smaller
      measured step in dark. Do not "fix" them to match.

      **Edit 2 — `src/components/SiteHeader.astro`, one line:**

      ```css
      nav a[aria-current='page'] { font-weight: var(--weight-medium); }
      ```

      This is required, not cosmetic. The nav marks the current page by **colour alone**;
      softening muted pushes that toward invisible. `FilterLink` already carries weight *and*
      colour so its state never rests on colour alone — the nav is where that rule was never
      applied. 500 rather than FilterLink's 600, because the nav sits beside a 600 serif
      wordmark. In Figma this is the new `Body / Medium` text style.

      **Edit 3 — repoint a stale comment.** The dark block in `tokens.css` names
      *"Colour VALUES settled"* as its source of truth. That table is stale for `line` and
      `muted` in both modes. The current authority is **"Current palette — THIS TABLE WINS"**,
      above the Settled log. Please point the comment there; it is the only guard dark has,
      since dark has no Figma to check it against.

      Full reasoning: Settled, "Muted is retuned, and the current nav item gains a weight cue".

- [x] ~~**`tokens.css` still sets body copy in the serif.**~~ **ALREADY FIXED — closed by the chat that raised it, 2026-09-07.** Code and Deploy had resolved it in `0264eef` before this item was read; `--font-body` is `var(--font-sans)`. The routed item was written against a tree that was one commit stale. Figma has now been brought into line from the other side — see Settled, "Figma brought in line with the code's type decisions". Original text kept below for traceability; **do not action it.**

- [ ] ~~Original item:~~ **`tokens.css` still sets body copy in the serif — it contradicts the settled type
      decision.** *Raised by Design and Figma 2026-09-07; typography is Design's to state,
      the CSS edit is Code and Deploy's to make.*

      `src/styles/tokens.css:24` reads `--font-body: var(--font-serif);` and
      `src/styles/base.css:19` applies it to `body`, so **every piece of body copy on the
      built site currently renders in IBM Plex Serif.**

      That is the arrangement Bryan looked at and rejected. The Settled entry
      "Serif/sans pairing: IBM Plex Serif with IBM Plex Sans" is explicit: **serif for
      titles only; sans for everything else** — body, scope, the design question, and the
      small label tier.

      **How it drifted, so it is not read as anyone's error.** Commit `35be25c`
      ("Serif pairing and the redrawn video facade") set `--font-body` to the serif, which
      was correct against the ledger *at that moment*. Bryan reversed the decision
      afterwards, logged in `f027101` ("Scrap the credit line; serif is titles only").
      No commit has touched `tokens.css` since `35be25c`, so the code is simply sitting one
      decision behind. Ordinary drift, not a mistake.

      **The change is two lines:**

      ```css
      --font-body: var(--font-sans);     /* was var(--font-serif) */
      --font-display: var(--font-serif); /* unchanged — titles keep the serif */
      ```

      The comment block above those lines ("Serif for anything read; sans reserved for the
      small label tier") describes the reversed decision and should be rewritten to match,
      or it will pull the values back again.

      Worth a look on the built page rather than only in the diff: this changes the texture
      of every project page and the landing statement at once.

- [x] ~~**Merge `claude/website-design-figma-l3milr` into `main`.**~~ **DONE — verified
      2026-09-07.** `docs/figma-to-code-spec.md` is on `main`; nothing is blocked on it.
- [x] **CLOSED — superseded.** `layout` now selects the project page layout and `discipline` is a label only, so there is no longer a question of deriving layout from content. Original: **Discipline source.** The project page has two layouts (standard / photography) and
      needs one canonical discipline value to switch on. Either `keywords[0]` or a separate
      `discipline` field — do not infer layout from an unordered array. Code and Deploy's
      call; Design and Figma has no preference beyond "it must be deterministic."
- [x] **CLOSED — both exist.** `year` is a numeric sort key, `completed` is the displayed string. Implemented in the schema migration. Original: **`year: number` vs `completed: string`.** The live site shows *September 2025* for
      Dura and *2019* for Oscuro. The current numeric `year` cannot hold the former.
      Widen it, or add `completed` and keep `year` as a sort key.
- [x] ~~**Adobe Fonts domain coverage.**~~ **RETRACTED by the chat that raised it, 2026-09-07.**
      Dead with the move to IBM Plex Sans — a Google font has no allowed-domains list, so
      there is nothing to configure and no silent-failure risk on localhost or either
      domain. Struck rather than deleted only because it is not this chat's section to
      tidy. Original text kept below for traceability; **do not action it.**

      ~~*Raised by Design and Figma 2026-09-07; hosting and
      domains are Code and Deploy's per the ownership table.* The web project
      (`https://use.typekit.net/udc5guh.css`, family `new-frank`) currently covers **one
      domain** — Bryan reports the UI would not accept a second. Three are needed over the
      project's life:

      | Domain | Why | When |
      |---|---|---|
      | `bryancampana.netlify.app` | currently the live site | now |
      | `localhost` | rule 5 requires a local preview before every deploy | now |
      | `bryancampana.com` | the eventual home | at DNS cutover |

      **Adobe Fonts failures are silent** — the page renders in the fallback and nothing
      errors. Without `localhost`, every local preview shows the wrong typeface, which makes
      rule 5 useless for judging type. Worth confirming whether the domains field genuinely
      accepts only one entry (it may accept several separated by newlines) before creating a
      second web project as a workaround.

> *Note from Design and Figma, 2026-09-07:* the three items above this one — the branch
> merge, discipline source, and `year`/`completed` — all appear to have been settled in the
> log below. Not editing them, since this is not my section; flagging so they can be ticked.

---

## Sync audits — Oversight owns this section

Findings from auditing this ledger against the repo. Newest at top, dated. Written only
when something needs the other chats' attention; a clean audit is not recorded here.

*No audits recorded yet.*

---

---

# Decision index

58 decisions. **⚠ means the entry is superseded or partly superseded — read it for
history, never to decide what to do next.** Full text in
[`docs/decisions-archive.md`](docs/decisions-archive.md).

| ID | Decision | Status |
|---|---|---|
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
| [`D-032`](docs/decisions-archive.md#d-032) | Keywords consolidated from eight to six. Bryan's call. Content change. | |
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
