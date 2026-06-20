/**
 * generate-og.mjs — rasterize the default OG image SVG → PNG.
 *
 * Why a script (not on-the-fly): the social image rarely changes, so we
 * generate it once and commit the PNG. Social crawlers (Facebook, LinkedIn, X)
 * require a real raster image at a stable URL. Edit src/assets/og-default.svg,
 * then run `pnpm og:image` to regenerate.
 *
 * Run: pnpm og:image
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "src/assets/og-default.svg");
const out = resolve(root, "public/images/og-default.png");

mkdirSync(dirname(out), { recursive: true });

const svg = readFileSync(src);
await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: "cover" })
  .png()
  .toFile(out);

console.log(`✅ OG image written: ${out}`);
