/**
 * content/config.ts — the CONTENT SCHEMA (our "data model" without a database).
 *
 * This is the "FORM" you fill in to publish. Astro validates every Markdown/MDX
 * file against these schemas AT BUILD TIME, so a post with a missing/invalid
 * field fails the build instead of shipping broken. You never edit template
 * code to publish — you only create a .mdx file with these fields.
 *
 * Two collections:
 *   - blog:      learning posts. THREE post types, each with its own fields,
 *                selected via `postType` (a discriminated union):
 *                  • implementation — end-to-end OOTB feature builds
 *                  • use-case        — business scenario implementations
 *                  • debugging       — error symptom → root cause → resolution
 *   - portfolio: solutions you've built that users can view/validate
 *
 * See docs/publishing-guide.md for the no-code "how to publish" playbook.
 */
import { defineCollection, z } from "astro:content";

/* --------------------------- shared field groups --------------------------- */

/** Role-based categories (top-level navigation), à la Salesforce Ben. */
const CATEGORIES = ["Admin", "Developer", "Architect", "Consultant"] as const;

const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"] as const;

/**
 * Fields common to EVERY blog post, regardless of type.
 * (Spread into each post-type schema below.)
 */
const baseBlogFields = {
  /** H1 + SEO title. Keep ≲ 70 chars. */
  title: z.string().max(70),
  /** TL;DR + meta description. Rendered as the summary block. 50–160 chars. */
  description: z.string().min(50).max(160),
  /** Role-based categories for navigation/filtering. At least one. */
  category: z.array(z.enum(CATEGORIES)).min(1),
  /** Free-form topic tags: ["Flow", "Apex", "LWC", ...]. */
  tags: z.array(z.string()).default([]),
  /** Skill level. Helps readers self-select. */
  difficulty: z.enum(DIFFICULTY).default("Intermediate"),
  /** First published (YYYY-MM-DD). */
  publishDate: z.coerce.date(),
  /** Last meaningful update — shown prominently (Salesforce content ages fast). */
  updatedDate: z.coerce.date().optional(),
  /** Author name. Defaults to the site author if omitted. */
  author: z.string().optional(),
  /** Optional hero/social image (path in /public or absolute URL). */
  featuredImage: z.string().optional(),
  /** Per-post social image override; falls back to featuredImage → site default. */
  ogImage: z.string().optional(),
  /** Draft posts are excluded from production builds and listings. */
  draft: z.boolean().default(false),
  /** Show a generated Table of Contents (recommended for long posts). */
  showToc: z.boolean().default(true),
};

/* ------------------------------ the 3 post types --------------------------- */

/** Type 1 — end-to-end implementation tutorial. */
const implementationPost = z.object({
  postType: z.literal("implementation"),
  ...baseBlogFields,
  /** What the reader must have/know before starting. */
  prerequisites: z.array(z.string()).default([]),
  /** Human estimate, e.g. "45 minutes". */
  estimatedTime: z.string().optional(),
  /** Salesforce edition/release context, e.g. "Enterprise · Summer '26". */
  salesforceEdition: z.string().optional(),
  /** OOTB features/tools used, e.g. ["Flow Builder", "Approval Process"]. */
  featuresUsed: z.array(z.string()).default([]),
  /** Optional source repo / unmanaged package link. */
  repoUrl: z.string().url().optional(),
  /** Optional live demo / scratch-org link. */
  demoUrl: z.string().url().optional(),
});

/** Type 2 — use-case / business-scenario implementation. */
const useCasePost = z.object({
  postType: z.literal("use-case"),
  ...baseBlogFields,
  /** One-sentence business problem being solved. */
  scenario: z.string(),
  /** Who this is for, e.g. ["Sales Manager", "Admin"]. */
  personas: z.array(z.string()).default([]),
  /** Salesforce products/clouds involved, e.g. ["Service Cloud", "Flow"]. */
  products: z.array(z.string()).default([]),
  /** Optional measurable impact, e.g. "Cut case routing time by 40%". */
  businessImpact: z.string().optional(),
});

/** Type 3 — error debugging (symptom → root cause → resolution). */
const debuggingPost = z.object({
  postType: z.literal("debugging"),
  ...baseBlogFields,
  /** Exact error string — quoted verbatim and indexed for search. */
  errorMessage: z.string().optional(),
  /** One-sentence description of what the user observes. */
  symptom: z.string(),
  /** Features/areas affected, e.g. ["Record-Triggered Flow", "Apex Trigger"]. */
  affectedFeatures: z.array(z.string()).default([]),
  /** One-line root-cause summary (the body expands on it). */
  rootCauseSummary: z.string(),
  /** Known-Issues-style status badge. */
  status: z
    .enum(["Investigating", "Workaround Available", "Resolved"])
    .default("Resolved"),
  /** Optional release the fix shipped in, e.g. "Summer '26". */
  resolvedInRelease: z.string().optional(),
});

const blog = defineCollection({
  type: "content",
  // Discriminated union: `postType` picks which field set applies.
  schema: z.discriminatedUnion("postType", [
    implementationPost,
    useCasePost,
    debuggingPost,
  ]),
});

/* -------------------------------- portfolio -------------------------------- */

const portfolio = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(30).max(160),
    /** Short tagline shown on the portfolio tile. */
    summary: z.string().max(120).optional(),
    /** Tech/products used, shown as chips on the tile. */
    tech: z.array(z.string()).default([]),
    /** Live demo / validation link, if any. */
    demoUrl: z.string().url().optional(),
    /** Source/repo link, if any. */
    repoUrl: z.string().url().optional(),
    /** Optional related blog post slug (e.g. the implementation write-up). */
    relatedPost: z.string().optional(),
    /** Thumbnail/cover image for the tile. */
    image: z.string().optional(),
    /** Display order on the portfolio page (lower = first). */
    order: z.number().default(100),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, portfolio };

/* Re-export the enums so UI components share one source of truth. */
export { CATEGORIES, DIFFICULTY };
