# Decisions

Shared ledger between the three Claude Code chats working on this project.
All three live in this folder. Two write to it; the third audits it — see the table.

| Chat | Owns | Writes to |
|---|---|---|
| **Design and Figma** | What the site looks like — layout, type, colour, spacing, card direction | Figma + "Current state" + its own "Open" section |
| **Code and Deploy** | Making the site match — code, tests, build, deploy. Also hosting, DNS, domain and build-credit budget. **Not `src/content/**` — that moved to Content and Copy on 2026-09-07; route content changes to Bryan.** | The repo, except `src/content/**` + "Current state" + its own "Open" section |
| **Content and Copy** | The words — `src/content/**` exclusively, prose inside `.astro` pages, `DESIGN-QUESTIONS.md`, `CONTENT-TODO.md`. **Does not use this ledger at all** — it edits source files directly, the way Bryan does, and the other chats adapt to what they find. Constraints it works inside: `docs/copy-constraints.md` | The content files. **Never this file.** |
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
    before the build starts. Batch work, then tag one commit. The Personal plan is
    1,000 credits per cycle and the cycle runs the 7th to the 6th, not the calendar
    month. See "Hosting and deploys" below for the numbers.

11. **A decision is TWO writes, and both belong in the same commit.**
    (a) Append a full dated entry to the top of `docs/decisions-archive.md`, with the next
    `D-NNN` id and `**Status:** Accepted`.
    (b) Update the affected "Current state" section here to say what is now true.
    Skipping (b) is how this file previously grew to 1,863 lines of history nobody could
    resolve into an answer.

9a. **When you rewrite a section, re-read it at write time.** Never rebuild one from an
    earlier reading, however recent — a clean `git pull` does not make your notes current.
    Design and Figma destroyed a live routed item this way during the 2026-09-07 restructure
    and then reported the file as having no open items. See `D-059`.

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
- **Self-hosted** through Fontsource, not Google's CDN. **Weights in use: SemiBold 600,
  Medium 500, Regular 400, and Serif Italic 400. Nothing else — and every one is already
  loaded, so no font import is outstanding.**
- **Style names have no space** — `SemiBold`, not Inter's `Semi Bold`. The mismatch silently
  drops text to Regular.
- **Size ramp:** xs 13 · sm 15 · base 17 · lg 22 · xl 32 · 2xl 48. `xl` and `2xl` step to 24 and
  32 under 40rem — in Figma that is the `Mobile` variable mode.
- **The display ramp is uniform: Display/2XL, Display/XL and Title/Large are all SemiBold
  600.** A Bold/Medium split was tried on 2026-09-07 and reverted — see `D-064`.
- **The section eyebrow is `--color-fg`, not `--color-muted`.** Ink, so it separates from the
  card keyword, which stays muted at 13px `Label`. The two were never the same style, but they
  read as the same tier until this changed. **It is not `--color-accent`** — accent is the
  charge and marks the selected filter link only; spending it on static labels would make it
  decorative and stop it meaning anything.
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
- **Project pages open on the title.** The `WORK` eyebrow that sat above it is removed — the
  header already routes to the index, and on a project page it carries `aria-current`
  because the path starts with `/work`. The `← All work` link at the foot of the page
  stays: it is a different affordance, offered where the reading ends.
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
- **`FilterLink`'s count sits on the label's baseline**, `--size-xs`, 0.25em to its right —
  not raised above the x-height. It must not grow the line box: the filter's hairline is one
  of the three sanctioned rules and its position is not free to drift.
- **Every state carries two cues — weight *and* colour — never colour alone.** FilterLink selected
  is 600 + `--color-fg`; the current nav item is `Body / Medium` 500 + `--color-fg`.
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
- **Six keywords** — Photography 4 · Identity 4 · New Media 3 · Fine Art 3 · Signage 2 · Digital 1.
  `Art` is not a keyword: the name is **Fine Art**. `Visual Communications` was retired into
  Signage. See `D-059`.
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

# Open decisions — Design and Figma owns these

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

- [ ] **`discipline` still shows the two strings `D-059` retired.** *Raised by Code and Deploy
      2026-09-07 from the deployed page; the vocabulary is Design's to settle.*

      `D-059` settled the **keyword** vocabulary and the content now matches it. But `discipline`
      is a **separate frontmatter field**, rendered as a visible `Discipline` row in the facts
      block on every project page, and it was never part of the consolidation. Two projects now
      contradict the filter that links to them:

      | Project | Filter says | Facts block says |
      |---|---|---|
      | `photopolymer-letterpress` | Fine Art | **Discipline: Art** |
      | `dura-architectural-signage` | Signage | **Discipline: Visual Communications** |

      Both are live now. `Art` is the exact category error `D-059` names — "`Art` beside
      `Photography` and `New Media` is a category error" — and `Visual Communications` is the
      exact string it retired for being the longest label in the set.

      **This may well be intentional and need no change.** `discipline` reads as a longer, prose
      register than `keywords`: the other twelve include `Signage & Wayfinding, Code Signage` and
      `Exhibition Design, New Media Art`, which are plainly descriptions rather than filter
      labels. If the two registers are meant to differ, these two are simply the cases where the
      prose happens to be one word and collides with a retired keyword. Say so and it closes.

      **What is not in question:** `discipline` is display-only. Layout is selected by the
      separate `layout` field (`src/pages/work/[slug].astro:36` — "Layout is chosen by its own
      field, never inferred from content"), so changing a `discipline` string cannot move a
      project between templates. It is a one-line content edit per project with no code change,
      whichever way it goes.

      Code and Deploy will make the edits once Design names the strings. Nothing changed.

Bryan's, not this chat's: video poster stills (the ink ground is a deliberate state, not a gap)
and the 14 design questions.

## Open decisions — Code and Deploy owns these

Routed here rather than through Bryan, per rule 2.

**Nothing open.**

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

## Sync audits — Oversight owns this section

Findings from auditing this ledger against the repo. Newest at top, dated. Written only
when something needs the other chats' attention; a clean audit is not recorded here.

*No audits recorded yet.*

---

---

# Decision index

65 decisions. **⚠ means the entry is superseded or partly superseded — read it for
history, never to decide what to do next.** Full text in
[`docs/decisions-archive.md`](docs/decisions-archive.md).

| ID | Decision | Status |
|---|---|---|
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
