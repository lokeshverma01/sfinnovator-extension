/**
 * rss.xml — the blog's RSS feed endpoint.
 *
 * Lets readers and aggregators subscribe to new posts. Reads published
 * (non-draft) entries from the `blog` content collection, newest first. Works
 * correctly while empty (valid feed, no items) and auto-populates as posts are
 * added — no changes needed later.
 *
 * Output path: /rss.xml   (linked from BaseHead <link rel="alternate">)
 */
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { siteConfig } from "@/lib/siteConfig";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: `${siteConfig.name} — Blog`,
    description: siteConfig.description,
    // context.site respects the configured origin + base for absolute item links.
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      categories: [post.data.category, ...post.data.tags],
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>${siteConfig.locale.replace("_", "-")}</language>`,
  });
}
