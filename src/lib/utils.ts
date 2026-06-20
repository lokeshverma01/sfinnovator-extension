/**
 * utils.ts — small, pure helper functions reused across the site.
 * Keep these dependency-free and easy to test.
 */

/**
 * Format a date for display, e.g. "Jun 18, 2026".
 * Uses a fixed locale so output is stable across build environments (SEO/SSG).
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Estimate reading time in minutes from raw text content.
 * Assumes ~200 words/minute (typical adult reading speed). Minimum 1 min.
 */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Convert a string into a URL-safe slug, e.g. "Apex CPU Limit!" -> "apex-cpu-limit".
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
