/**
 * content/config.ts — the CONTENT SCHEMA (our "data model" without a database).
 *
 * Astro "content collections" validate every Markdown/MDX file against these
 * schemas AT BUILD TIME. This is how we guarantee SEO consistency: a post
 * literally cannot ship without a title, description, and date. Bad frontmatter
 * fails the build instead of silently shipping broken SEO.
 *
 * Two collections:
 *  - blog:      learning posts (implementation / use-case / debugging)
 *  - portfolio: solutions you've built that users can view/validate
 *
 * Folders (created as skeletons now, filled later):
 *  - src/content/blog/*.mdx
 *  - src/content/portfolio/*.mdx
 */
import { defineCollection, z } from "astro:content";

/** Categories double as on-card tags and future filtering. */
const blogCategory = z.enum([
  "Implementation", // end-to-end OOTB feature builds
  "Use case", // scenario implementations
  "Debugging", // error root-cause + fix
  "Concept", // explainers
]);

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().max(70), // keep titles SEO-friendly (~60 chars)
    description: z.string().min(50).max(160), // meta description sweet spot
    category: blogCategory,
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Draft posts are excluded from production builds. */
    draft: z.boolean().default(false),
    /** Optional per-post social image; falls back to site default. */
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const portfolio = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(30).max(160),
    /** Live demo / validation link, if any. */
    demoUrl: z.string().url().optional(),
    /** Source/repo link, if any. */
    repoUrl: z.string().url().optional(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    tech: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, portfolio };
