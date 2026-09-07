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

    // Many per project. Drives the /work filter. Seeded from the disciplines shown on
    // the Cargo site; Bryan adds real keywords later without a schema change.
    keywords: z.array(z.string()).default([]),

    scope: z.string(),
    designQuestion: z.string().nullable().default(null),

    // Archive fields. Photography projects carry most of these.
    medium: z.string().nullable().default(null),
    prints: z.string().nullable().default(null),
    dimensions: z.string().nullable().default(null),

    // `featured` controls presentation only — which projects show on the landing page.
    // Every project gets a page (spec §3).
    featured: z.boolean().default(false),
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
