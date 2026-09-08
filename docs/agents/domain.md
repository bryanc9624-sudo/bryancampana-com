# Domain Docs

How the engineering skills should consume this repo's domain documentation when
exploring the codebase.

## Before exploring, read these

- **`DECISIONS.md`** at the repo root. This is the domain doc. "Current state"
  is what is true now; "Do not reopen" is what was already rejected and why —
  read it before proposing anything.
- **`docs/decisions-archive.md`** for why. Frozen history; entries contradict
  each other in places. `DECISIONS.md` wins, always.
- **`src/styles/tokens.css`** for every colour, size and weight.

**Do not create `CONTEXT.md`, `CONTEXT-MAP.md`, or `docs/adr/`.** This repo
already has a decision record and a second one would split the truth. If
`/domain-modeling` wants to write a decision, it goes in `DECISIONS.md`.

## File structure

Single-context. There is one package, one decision record, one token file.

```
/
├── CLAUDE.md                   ← how the project is run
├── DECISIONS.md                ← current state + what not to reopen
├── docs/
│   ├── decisions-archive.md    ← frozen history, superseded by DECISIONS.md
│   └── agents/                 ← this directory; skill configuration
└── src/
    ├── styles/tokens.css       ← every colour, size, weight
    └── lib/projects.ts         ← the single visibility rule
```

## Use the project's vocabulary

When your output names a project concept (in an issue title, a refactor
proposal, a hypothesis, a test name), use the term as it appears in
`DECISIONS.md` and `tokens.css`. Don't drift to synonyms.

Token names are the vocabulary that matters most here: `--color-line` is not
"the border colour", `--color-accent` is not "the hover colour but also focus".
The distinctions are load-bearing and CLAUDE.md explains why.

If the concept you need isn't written down yet, that's a signal: either you're
inventing language the project doesn't use (reconsider) or there's a real gap
(note it, and write it into `DECISIONS.md` — a conclusion reached only in chat
is gone when the chat ends).

## Flag conflicts

If your output contradicts something in `DECISIONS.md`, surface it explicitly
rather than silently overriding:

> _Contradicts "Do not reopen → four-chat split", but worth reopening because…_

The same applies when code and Figma diverge: say which one is stale in the same
message. Code wins; Figma is a sketchpad.
