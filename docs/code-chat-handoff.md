# Handoff — Code and Deploy chat

**Written:** 2026-09-07, at the end of the first Code and Deploy chat, the day the site
shipped and the domain moved off Cargo.
**For:** whoever picks up the Code and Deploy role next.
**Authority:** this document orients you. **`DECISIONS.md` on `main` is the source of truth.**
Where the two disagree, the ledger wins and this file is wrong.

---

## Read these, in this order, before doing anything

1. **`DECISIONS.md` on `main`** — all of it, including the ⚠ block at the top. It is the only
   channel between this chat, Design and Figma, and Oversight. None of us can see each other's
   conversations. `git pull` before you read it, push immediately after you write it.
2. **`README.md`** — written for Bryan, not for you, which is exactly why you should read it.
   It is the contract you have to keep true.
3. **This file's "Traps" section** — five things that cost real money or real time today.

Then check the live state before you believe anything: `npm run build && npm test && npm run todos`.

---

## What this chat owns

The codebase, the build, tests, deploys, hosting, DNS, the domain and the credit budget.

**Not yours:** layout, typography, colour, spacing, component structure, and which projects are
featured. That is Design and Figma. When you spot something visual, **write it into the ledger
as a routed item — do not fix it and do not ask Bryan.** He is not a message bus.

The one thing that looks visual and is yours: **anything Figma cannot express.** Dark mode is
the standing example — Figma Professional gives this file two variable modes and they are spent
on Desktop/Mobile, so the dark palette lives in `DECISIONS.md` and in `tokens.css`, nowhere else.

---

## Where the project stands

**Shipped.** `[deploy] Ship the rebuilt site` published 2026-09-07. `bryancampana.com` is
delegated to Netlify DNS (`dns1..4.p04.nsone.net`), confirmed at the `.com` registry.

**Check these two before assuming the cutover is finished** — they were open when this was
written:

- **The TLS certificate.** Netlify served HTTP 200 but Let's Encrypt had not issued. Verify with
  the IP-pinned check below, not by hostname.
- **Cargo is still live and must stay live** until that certificate is verified. It holds the
  only valid HTTPS on the domain for anyone resolving through a stale cache. Cancelling it early
  takes down the whole zone, not just the old site.

Everything else is closed: 14 projects with real images, 20 pages, 6/6 tests, no blocking content
markers, zero actionable ledger items, WCAG AA in both colour schemes, zero external JavaScript.

---

## Traps — all five of these happened

**1. The deploy gate is opt-in, and it has bitten twice.**

```toml
ignore = 'git log -1 --pretty=%s "${COMMIT_REF:-HEAD}" | grep -q "^\[deploy\]" && exit 1 || exit 0'
```

A build runs **only** when the commit *subject starts with* the tag. Exit 0 skips, exit 1 builds.

The original read `%B` — the whole message, body included. Commit bodies here discuss the gate,
so a body saying *"not deployed, no tag"* matched its own description and started a build. That
fired 19 unintended builds and spent a 300-credit cycle in one day at 15 credits each. **Bandwidth
and compute were 0.2 credits between them; builds were the entire cost.**

Two consequences for you:

- **Never put the bracketed tag in a commit body.** It is safe now — `%s` and the `^` anchor both
  guard it — but do not rely on that when you do not have to.
- **Check before pushing:**
  `git log -1 --pretty=%s | grep -q "^\[deploy\]" && echo BUILD || echo skip`

**2. The dev server serves stale scoped CSS.** Edit a `<style>` block in an `.astro` component and
Vite's HMR may not reapply it. The page will show the old rule while the built output is correct,
and you will "fix" a bug that does not exist. **Restart the dev server before believing a CSS
result.** Content and frontmatter edits hot-reload reliably; scoped styles do not.

**3. During a DNS cutover, a check by hostname proves nothing.** This chat reported HTTPS as
working after reading a valid certificate for `bryancampana.com` — it was **Cargo's** certificate,
served from Cargo's IP, because DNS was still flapping. Pin the IP and compare both ends:

```bash
curl -s -o /dev/null -w '%{http_code}\n' --resolve "bryancampana.com:443:98.84.224.111" https://bryancampana.com/
echo | openssl s_client -connect 98.84.224.111:443 -servername bryancampana.com 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

Same trick works *before* a cutover: query the new nameservers directly (`dig @dns1.p04.nsone.net`)
and force resolution to the new IPs. That is how this cutover was verified before the registrar
was touched.

**4. HTML comments in a markdown body are rendered into the shipped page.** Astro passes raw HTML
through. A note you leave in a `.md` body is invisible in the editor preview *and* invisible on the
page, but present in view-source. Two of these shipped before being caught. **Put build notes in
frontmatter as YAML `#` comments.** In `.astro` templates use `{/* … */}`, not `<!-- … -->`.

**5. Clearing `.astro` while the dev server runs corrupts the content store.** You get *"The
collection 'projects' does not exist or is empty"* and a silently empty site. Restart the server
after any cache clear.

---

## How the codebase is meant to work

**Every visual value lives in `src/styles/tokens.css`** and mirrors a Figma variable 1:1, each
carrying a WEB `codeSyntax` naming its CSS custom property. Ten CSS properties have no Figma
variable **on purpose** — `--font-serif` is reached through `font/display` and `font/italic`, the
weights and line-heights are properties of the ten text styles, and `--measure-prose` is in `ch`
units Figma cannot express. Do not "fix" those by adding variables.

**Two rules are enforced by comment in `tokens.css` and matter more than they look:**

- **No rule may reference `--color-fg`.** That token means *the colour of text*. Rules point at
  `--color-line`, whose value is derived — a rule holds the same contrast ratio against its ground
  in both modes. Derive any future value; do not pick one by eye.
- **`font-synthesis: none` is set on `html`.** Bryan's rule: italic text uses a drawn italic, never
  an obliqued roman. `--font-italic` routes italics to the serif, the only family here with a real
  italic. If you add an italic in a weight that is not loaded it will render **upright**, and that
  is deliberate — it makes the missing face visible instead of shipping a counterfeit.

**Derive layout from content rather than declaring it.** The photography grid picks its column
count from how many images a project has (1–2 → 1 across, 4 → 2, else 3), with an optional
`columns` frontmatter override. `sizes` and the eager/lazy cutoff are computed from the same
number, because a stale `sizes` costs bandwidth while looking perfectly fine.

**`src/lib/projects.ts` holds the single visibility rule.** The index, the landing page and the
route generator all call it, so a draft cannot appear in one and not another. Keep it that way.

**`cover.<ext>` is card-only** — used for the card and the video poster, excluded from the gallery.

**Images must live under `src/`**, never `public/`. Anything in `public/` is copied through
unoptimised, which is the usual reason portfolio sites are slow. Export sRGB at 2400px; screen
captures arrive tagged with a monitor profile and need `sips --matchTo`.

---

## Working with Bryan

He is a graphic designer, new to git and to the terminal, and he learns fast. What worked:

- **Explain plainly and completely.** He asks good questions about things he has not met before —
  `robots.txt`, social previews, DNS. Answer them properly rather than briefly.
- **Give a recommendation, not a menu.** He overruled several and was right most times.
- **Verify, then report.** Not the other way round. Every claim in this file that carries a number
  was measured.
- **Own mistakes in one sentence and move on.** This chat got the Netlify credit cost wrong, told
  him a `cover` edit had worked when it had not, and misread a certificate. Each cost less than the
  hedging would have.
- **Never invent a design decision.** Route it.

He watches cost. Batch changes and deploy deliberately — the gate exists for that reason, and it
is the single highest-leverage line in the repo.

---

## The commands that matter

```bash
npm run dev        # localhost:4321 — restart it after any CSS edit
npm run build      # 20 pages
npm test           # 6 tests
npm run todos      # content report -> CONTENT-TODO.md
```

*Last actions of this chat: shipped the site, moved DNS off Cargo, and left the TLS certificate
provisioning. Read the ledger's most recent Settled entry before doing anything else.*
