import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),

    // `year` is a sort key only. `completed` is what renders — the live site says
    // "September 2025" for Dura and "2019" for Oscuro, which a number cannot hold.
    year: z.number().nullable().default(null),
    completed: z.string().nullable().default(null),

    // A label only. Appears in the facts list as "Discipline". It does NOT select the
    // layout — see `layout` below. Naming a field for its content and then using it for
    // presentation is what this pair was split apart to avoid.
    discipline: z.string().nullable().default(null),

    // Which project-page layout to use. Named for the layout, not for the kind of work,
    // so an identity project can be image-first and a photography project can be
    // standard without either having to misdescribe itself.
    //   standard    - sticky text rail on the left, wide image column on the right
    //   image-first - image-led: header, then the images two-up, then the facts
    layout: z.enum(['standard', 'image-first']).default('standard'),

    // How many images across, on image-first pages only. Leave it out and the layout
    // picks a count from how many images the project has; set it to override that for
    // this one project. Ignored by the standard layout, which is a single media column.
    // A value outside 1-4 fails the build rather than rendering a broken grid.
    columns: z.number().int().min(1).max(4).nullable().default(null),

    // Many per project. Drives the /work filter. Seeded from the disciplines shown on
    // the Cargo site; Bryan adds real keywords later without a schema change.
    keywords: z.array(z.string()).default([]),

    scope: z.string(),
    designQuestion: z.string().nullable().default(null),

    // Archive fields. Photography projects carry most of these.
    medium: z.string().nullable().default(null),
    prints: z.string().nullable().default(null),
    dimensions: z.string().nullable().default(null),

    // Work in progress. A draft is hidden from the work index, the landing page and the
    // sitemap, and gets no page at all in a production build — so an unfinished project
    // cannot leak by someone guessing its URL. It still renders in `npm run dev`, marked
    // as a draft, so it can be worked on and previewed.
    draft: z.boolean().default(false),

    // `featured` controls presentation only — which projects show on the landing page.
    // Every project gets a page (spec §3).
    featured: z.boolean().default(false),
    // Tiebreak only. Projects sort by `year` descending; `order` decides the sequence
    // WITHIN a year, where two projects share one. It stopped being the primary sort in
    // CD-007 — a hand-set sequence read as noise under the keyword filter, which hides
    // cards rather than reordering them, so every filtered view inherited it.
    order: z.number().default(0),
    aspect: z.string().default('3/2'),
    // Which image represents the project on cards. A filename from the project's folder
    // in src/assets/projects/<slug>/, e.g. "03.jpg". Defaults to the first file in
    // filename order when unset.
    cover: z.string().nullable().default(null),

    // A single embedded video. Rendered as a facade — poster plus a play button — so no
    // third-party script loads until a visitor actually asks for the video.
    video: z.object({
      provider: z.enum(['youtube', 'vimeo']),
      id: z.string(),
      title: z.string().optional(),
    }).nullable().default(null),

    images: z.array(z.object({
      aspect: z.string().default('3/2'),
      caption: z.string().optional(),
    })).default([]),
  }),
})

export const collections = { projects }
