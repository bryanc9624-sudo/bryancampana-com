import { describe, it, expect } from 'vitest'
import { readFileSync, globSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

/**
 * Guards the ledger itself, the way rules.test.ts guards the site.
 *
 * The compaction of 2026-09-08 makes `git log` the *why* layer: the archive
 * goes, and a decision id is looked up with `git log --grep`. That only works
 * if every id we cite is actually reachable there. Prose cannot check itself:
 * the audit of 2026-09-08 found an id cited in DECISIONS.md with no entry, no
 * index row and no commit behind it, and nothing had noticed.
 */

const ID = /(?<![A-Za-z])(?:CD|DF|D)-\d{2,3}\b/g

/**
 * Xcode updates can gate `git` behind a licence prompt; the Command Line Tools
 * copy works without it. Cheap to try, and it keeps the suite green on a machine
 * that is mid-update rather than failing for an unrelated reason.
 */
function gitLog(): string {
  for (const bin of ['git', '/Library/Developer/CommandLineTools/usr/bin/git']) {
    try {
      return execFileSync(bin, ['log', '--all', '--format=%B'], {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      })
    } catch {
      /* try the next one */
    }
  }
  throw new Error('git is unavailable, so decision ids cannot be verified')
}

/**
 * The surface that survives the compaction. The archive is excluded because it
 * is the thing being deleted, and DECISIONS.md's decision index with it — that
 * table is a map *into* the archive, so its 92 rows stop being citations the
 * moment their target is gone. Everything above the index is the contract.
 *
 * Once the index is deleted this narrowing is a no-op and can be dropped.
 */
function citedIds(): Map<string, string[]> {
  const files = [
    'CLAUDE.md',
    'netlify.toml',
    ...globSync('src/**/*.{ts,astro,css}'),
    ...globSync('tests/**/*.ts'),
    ...globSync('docs/agents/*.md'),
  ]

  const found = new Map<string, string[]>()
  const record = (id: string, where: string) => {
    const seen = found.get(id) ?? []
    if (!seen.includes(where)) seen.push(where)
    found.set(id, seen)
  }

  for (const file of files) {
    for (const m of readFileSync(file, 'utf8').matchAll(ID)) record(m[0], file)
  }

  // DECISIONS.md, down to the index table only.
  const decisions = readFileSync('DECISIONS.md', 'utf8').split('\n')
  const indexAt = decisions.findIndex(l => /^#+\s*Decision index/i.test(l))
  const contract = (indexAt === -1 ? decisions : decisions.slice(0, indexAt)).join('\n')
  for (const m of contract.matchAll(ID)) record(m[0], 'DECISIONS.md')

  return found
}

describe('every decision id we cite is reachable in git', () => {
  it('resolves each cited id to at least one commit message', () => {
    const log = gitLog()
    const reachable = new Set(Array.from(log.matchAll(ID), m => m[0]))

    const dangling = [...citedIds()]
      .filter(([id]) => !reachable.has(id))
      .map(([id, where]) => `${id} — cited in ${where.join(', ')}, no commit mentions it`)

    expect(dangling).toEqual([])
  })
})
