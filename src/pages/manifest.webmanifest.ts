/**
 * manifest.webmanifest — PWA/web app manifest, generated so icon/start paths
 * respect the deploy base (root domain vs. the /sfinnovator-extension sub-path).
 *
 * Improves mobile "Add to Home Screen", sets brand colors, and is a small SEO/
 * polish signal. Output path: /manifest.webmanifest
 */
import type { APIRoute } from "astro";
import { siteConfig } from "@/lib/siteConfig";

export const GET: APIRoute = () => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  const manifest = {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: `${base}/favicon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
