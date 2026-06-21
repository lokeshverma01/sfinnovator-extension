/**
 * posts.ts — shared helpers for querying the blog collection.
 *
 * Centralizes "get published posts, newest first" and related-post selection so
 * every page (index, [slug], category, tag, RSS, home) uses the same logic.
 * Draft posts are excluded in production but kept in dev for previewing.
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/** Posts per page on the blog index (shared by /blog and /blog/page/[n]). */
export const POSTS_PER_PAGE = 10;

/** All published posts, newest first. (Drafts shown only in `astro dev`.) */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft === false : true,
  );
  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

/**
 * Up to `limit` posts related to the given one — same category or shared tags,
 * scored by overlap, newest as a tiebreaker. Excludes the post itself.
 */
export function getRelatedPosts(
  current: BlogPost,
  all: BlogPost[],
  limit = 3,
): BlogPost[] {
  const curTags = new Set(current.data.tags);
  const curCats = new Set(current.data.category);

  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0;
      for (const t of p.data.tags) if (curTags.has(t)) score += 2;
      for (const c of p.data.category) if (curCats.has(c)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.p.data.publishDate.valueOf() - a.p.data.publishDate.valueOf(),
    )
    .slice(0, limit)
    .map((x) => x.p);
}

/** Reading time in minutes from a post's raw body (~200 wpm, min 1). */
export function postReadingTime(post: BlogPost): number {
  const words = post.body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
