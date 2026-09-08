import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

/**
 * Every project that should be visible, newest first.
 *
 * Sorted by `year` descending, with `order` breaking ties inside a year. This is the field
 * `year` was separated from `completed` for — `completed` is the string that renders
 * ("September 2025"), `year` is the number that sorts.
 *
 * **Why date and not a hand-picked sequence.** The keyword filter hides cards rather than
 * reordering them, so every filtered view inherits this one order. A hand-set order tuned
 * for the unfiltered page — client work first, then printmaking, video, photography — left
 * the seven filtered views reading as the leftovers of a grouping: under `Art` the years ran
 * 2022, 2021, —, 2019, 2019, 2018, 2021, 2021, 2021, 2019, which is legible as nothing. A
 * date sort is the one ordering that stays true of every subset, because it does not depend
 * on which projects are showing.
 *
 * A project with no `year` sorts last: it has no place in a sequence that means "most recent
 * first", and putting it at the end is the only honest answer. Give it a year to move it.
 *
 * Drafts are included in `npm run dev` so work in progress can be previewed, and excluded
 * from a production build so it cannot be reached at all. This is the single place that
 * decision is made — the index, the landing page and the route generator all call it, so
 * a draft cannot appear in one and not another.
 */
export async function visibleProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects')
  const visible = import.meta.env.DEV ? all : all.filter(p => !p.data.draft)
  return visible.sort((a, b) => {
    const ay = a.data.year ?? -Infinity
    const by = b.data.year ?? -Infinity
    if (ay !== by) return by - ay
    return a.data.order - b.data.order
  })
}

/** True when a draft badge should be shown — dev only, never in a build. */
export const showDraftFlag = import.meta.env.DEV
