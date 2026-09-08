# How to work on this site

Short version. For details on editing content, see `README.md`.

---

## 1. Look at your local copy, not the live site

```
npm run dev
```

Open <http://localhost:4322>. This is the real, current site. The live site only
updates when you publish, so it is usually behind.

---

## 2. Decide which chat to talk to

| You want to say… | Talk to |
|---|---|
| "This should **look** different" | **Design chat** |
| "This is **broken** / doesn't match what I approved" | **Code chat** |
| Not sure | **Design chat** |

Design can hand work down to Code. Code is not allowed to invent design. So when in
doubt, start with Design — it flows the right way.

---

## 3. Tell ONE chat. Never both.

Say what you noticed. Include:

- the page
- **how wide your browser was** (this matters more than you'd think)
- a screenshot if you have one

That chat writes the decision into `DECISIONS.md`.

---

## 4. Hand off with one sentence

When Design is done, open the Code chat and say:

> Pull — Design routed something to you.

**That's the whole handoff.** Never repeat what Design decided. You say *that* there's
work; the file says *what* it is. You're the scheduler, not the messenger.

---

## 5. Publishing (making it live)

Say to the Code chat:

> Deploy this.

It writes the message correctly and pushes. Nothing else needed.

**What it costs:**

| Thing | Cost |
|---|---|
| Publishing the live site | **15 credits** |
| Preview copies, failed builds, undoing a release | Free |
| Visitors browsing the site | Effectively nothing |

Only publishing costs. You have **1,000 credits/month = 66 publishes** on the current
plan (300 = 20 on the free plan).

**Batch it.** One publish at the end of a work session, not one per change.

---

## 6. Things only you can do

- **Content edits** — project text, photos, keywords. See `README.md`; no chat needed.
- **Downgrade the Netlify plan back to Free in early October**, or it bills again.
- Any payment, ever.

---

## The two rules that keep this from breaking

1. **Never carry a decision between chats yourself.** It goes in `DECISIONS.md` or it
   doesn't exist.
2. **One chat at a time.** Design session, then Code session. Running both at once is
   how they end up working from stale copies of the file.
