/**
 * robots.txt — generated dynamically so it is DEPLOY-AWARE.
 *
 * On the real production domain (sfinnovator.com): allow all crawlers and point
 * them to the sitemap. On ANY other origin (the github.io preview, local
 * builds): disallow everything, so the preview is never crawled/indexed and
 * cannot compete with production as duplicate content. This pairs with the
 * <meta name="robots" content="noindex"> emitted by BaseHead on non-prod.
 *
 * Output path: /robots.txt
 */
import type { APIRoute } from "astro";
import { isProductionDomain } from "@/lib/seo";

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.href ?? "https://sfinnovator.com").replace(/\/$/, "");

  const body = isProductionDomain
    ? `# Production — allow all crawlers.
User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
`
    : `# Preview/non-production — block all crawlers to avoid duplicate content.
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
