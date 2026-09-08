// src/lib/nav.ts
// The nav links, and the single rule for "is this link the page you are on?".
// One place, for the same reason projects.ts holds the single visibility rule: two
// callers that answer this differently is a bug nobody notices until a screen reader
// reads the wrong thing.

export const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
] as const

/** Trailing slashes depend on build config and on how the URL was typed. Compare
 *  without one, but never reduce the root to an empty string. */
export const normalisePath = (p: string): string => p.replace(/\/+$/, '') || '/'

/**
 * True only when `path` IS `href` — not when it sits underneath it.
 *
 * `aria-current="page"` means *this exact page*. A project page at
 * `/work/dura-architectural-signage/` is not the work index, so the header's Work
 * link must not claim to be current there. It did, because the test was
 * `path.startsWith('/work')`, which every project URL passes.
 *
 * Deliberately no "section" state: marking an ancestor would need `aria-current="true"`
 * and a visual treatment to match, and neither is designed. Nothing is invented here.
 */
export const isCurrentPage = (path: string, href: string): boolean =>
  normalisePath(path) === normalisePath(href)
