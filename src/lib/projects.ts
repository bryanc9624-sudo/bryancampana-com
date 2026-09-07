import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

/**
 * Every project that should be visible, sorted by `order`.
 *
 * Drafts are included in `npm run dev` so work in progress can be previewed, and excluded
 * from a production build so it cannot be reached at all. This is the single place that
 * decision is made — the index, the landing page and the route generator all call it, so
 * a draft cannot appear in one and not another.
 */
export async function visibleProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects')
  const visible = import.meta.env.DEV ? all : all.filter(p => !p.data.draft)
  return visible.sort((a, b) => a.data.order - b.data.order)
}

/** True when a draft badge should be shown — dev only, never in a build. */
export const showDraftFlag = import.meta.env.DEV
