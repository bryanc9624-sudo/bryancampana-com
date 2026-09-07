# Decisions

Shared ledger between the Claude Code chats working on this project.
All chats live in this folder, so all of them read and write this file.

| Chat | Owns | Writes to |
|---|---|---|
| **Design and Figma** | What the site looks like — layout, type, colour, spacing, card direction | Figma + the "Open" section below |
| **Code and Deploy** | Making the site match — code, tests, build, deploy | The repo + the "Settled" log below |
| **Hosting and Admin** | Domain, DNS, host, billing, deploy configuration | The "Settled" log below |

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
7. **Builds cost money. Tag them.** A push only triggers a Netlify build when the commit
   message contains `[deploy]`. Untagged pushes are free. Batch work, then tag one
   commit. See "Deploy discipline" below.
8. **Every open item Bryan must decide gets an R-number.** Both chats refer to items by
   that number so Bryan never has to re-explain which thing is being discussed.

## Review queue — items waiting on Bryan

Referred to by number. Owner is who acts once Bryan decides.

| # | Item | Where to look | Owner |
|---|---|---|---|
| **R1** | **ProjectCard direction** — A Editorial / B Gallery / C Spec Sheet. No winner marked. | Figma "04 — Components" | Design and Figma |
| **R2** | **Design question length register** — long form vs short form. Sets card height across 14 cards. | Figma "04 — Components" | Design and Figma |
| **R3** | **Typeface** — still Inter. Bryan is supplying an Adobe Font. | Blocks `src/layouts/Base.astro` embed + `--font-sans` | Bryan → Code and Deploy |
| **R4** | **Font weights** — no weight tokens exist; landing h1 renders browser-default bold. | `src/styles/tokens.css` | Design and Figma |
| **R5** | **Colour and radius** — greys are neutral placeholders, both radius tokens are 0. | `src/styles/tokens.css` | Design and Figma |
| **R6** | **Featured set** — currently 4; the Cargo site featured 6. Editorial call. | `src/pages/index.astro` | Bryan |
| **R7** | **The 11 unwritten design questions** — 3 of 14 drafted. The long pole on launch. | `src/content/projects/*.md:7` | Bryan (copy) |
| **R8** | **Résumé file** — `public/resume.pdf` does not exist yet. | `public/` | Bryan |
| **R9** | **Real images** — every project still renders a grey placeholder. Phase 4. | `src/components/Placeholder.astro` | Bryan (assets) |
| **R10** | **Legal copy sign-off** — clauses about contact forms, payments and analytics were removed because the site has none. Confirm what remains is publishable. | `/terms`, `/privacy` | Bryan |
| **R11** | **DNS cutover go-ahead** — Phase 5. Moves bryancampana.com off Cargo onto Netlify. | GoDaddy DNS | Bryan → Hosting and Admin |

## Open decisions — Design and Figma owns these

- [ ] **R1 — ProjectCard direction.** Three explorations sit side by side on Figma page
      "04 — Components": A — Editorial, B — Gallery, C — Spec Sheet. No winner marked.
      Code and Deploy's read: B's structure (image first) with A's hierarchy (design
      question promoted above the scope line, not muted italic underneath). Recorded as
      an opinion, not a decision — Design and Figma decides.
- [ ] **R2 — Design question house style, length.** Two registers are in the file, e.g.
      "Can compliance signage inherit the material language of the room it serves?"
      versus "Can signage inherit a room's materials?". Card height across 14 cards
      depends on this. Pick one register before the remaining 11 get written.
- [ ] **R3 — Typeface.** font/family is still "Inter". Bryan is supplying an Adobe Font.
      Blocks: the embed link in Base.astro and the --font-sans value.
- [ ] **R4 — Font weights.** No font-weight tokens exist. The landing h1 currently renders
      at browser-default bold because of it.
- [ ] **R5 — Colour and radius.** Greys are neutral placeholders; both radius tokens are 0.
- [ ] **R6 — Featured set.** Currently 4 (dura, 590-madison-ave, big-city-volleyball,
      togethereffect). Bryan's old Cargo site featured 6, including re:present and
      Two of Hearts. Editorial call, his to make.

## Settled

- **2026-09-07 — Hosting: staying on Netlify.** GoDaddy is registrar only — the account
  holds bryancampana.com plus WHOIS privacy, with no hosting product on the invoice, so
  it was never an option for a built site. Netlify keeps deploy previews, one-click
  rollback and free forms. Cloudflare Pages is the fallback if credits stay tight; the
  migration cost for a 13-file static site is under an hour, so this is reversible.
- **2026-09-07 — Deploy discipline.** Netlify free tier is 300 credits per billing cycle,
  and the cycle runs the 7th to the 6th, not the calendar month. Builds now run only on
  commits whose message contains `[deploy]`, enforced by the `ignore` command in
  netlify.toml. Untagged pushes are skipped before the build starts and cost nothing.
- **2026-09-07 — Motion is not constrained by hosting.** "Static" describes delivery, not
  behaviour. CSS animation, GSAP, View Transitions, canvas and WebGL all run client-side
  and work identically on any host. Nothing here forecloses animation later.
- **2026-09-07 — Page widths.** --page-max 1440px; case studies --page-max-wide 1600px.
- **2026-09-07 — Case study layout.** Sticky text rail + wide media column at 64rem+,
  stacked text-first below. Rail minmax(280px, 1fr), media 2fr.
- **2026-09-07 — Name as home link.** The wordmark in the nav links home; the landing
  page does not repeat the name. Its h1 is the positioning statement.
- **2026-09-07 — Role removed from previews.** Kept on case study facts, where it may
  legitimately differ.
- **2026-09-07 — Copy comes from Bryan.** All prose is his, taken verbatim from the
  Cargo archive in archive/content/. Neither chat writes portfolio copy for him.

## Design questions written so far

Source of truth is Figma page "04 — Components" until Code and Deploy moves them into
src/content/projects/*.md.

| Project | Question | In code? |
|---|---|---|
| dura-architectural-signage | How does a fabricator keep design intent intact from drawing to installation? | not yet |
| 590-madison-ave | (two length variants — see R2) | not yet |
| photopolymer-letterpress | (two length variants — see R2) | not yet |

11 of 14 projects still need one. This is R7, the long pole on launching.
