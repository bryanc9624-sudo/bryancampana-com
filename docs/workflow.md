# How Bryan works on this site

Short version. For editing content, see `README.md`. For how the chat is meant to
behave, see `CLAUDE.md`.

---

## 1. Look at your local copy, not the live site

```
npm run dev
```

Open the address it prints. That is the real, current site. **The live site only
changes when you publish**, so it is normally behind — sometimes by a whole day's work.

---

## 2. Say what you want, in one place

There used to be four chats and a rule about which one to talk to. There is now **one
chat**, and it owns design, code, content and publishing. So say the thing:

- *"This should look different"* — it decides and builds it.
- *"This is broken"* — same chat, same conversation.
- *"Change this word"* — content is in scope too.

If something is genuinely yours to call — a colour, a word, an editorial choice — it
will ask you rather than guess.

You can still open extra chats to get a second opinion. Keep them **read-only**: two
chats writing to the same folder was the thing that caused the most trouble, because
git cannot see a conflict in files nobody has committed yet.

---

## 3. Nothing is live until you say so

Work is committed as it goes, which is just saving with a note attached. **Publishing
is a separate, deliberate step** and it is the only thing that costs money — 15 credits
a time, out of 1,000 a month.

So the normal shape of a session is: make a batch of changes, look at them locally,
then publish once at the end. Ask for a preview whenever you want to see where things
stand; that is free.

---

## 4. What to expect back

- **A recommendation, not a menu.** If there is a real trade-off you will get it in a
  sentence, with a suggested answer.
- **Numbers that were actually measured.** "Verified" should mean it was read back from
  the built page, not assumed from the code.
- **Plain English first.** Ask for more depth on anything mechanical and you will get it
  properly rather than being waved off.

---

## 5. If something looks wrong after publishing

Say so. Rolling back is free — a previous deploy can be restored from Netlify without
spending a build. Nothing you approve is one-way.
