import { readFileSync } from "node:fs";
import { join } from "node:path";

export type EncodedVariant = {
  width: number;
  avif?: string;
  webp?: string;
};

export type ImageEntry = {
  width: number;
  height: number;
  animated?: boolean;
  variants: EncodedVariant[];
  thumbs: EncodedVariant[];
};

type Manifest = {
  version: number;
  images: Record<string, ImageEntry>;
};

let cached: Manifest | null = null;

export function loadImageManifest(): Manifest {
  if (cached) return cached;
  const path = join(process.cwd(), "src/data/image-variants.json");
  cached = JSON.parse(readFileSync(path, "utf8")) as Manifest;
  return cached;
}

export function imageEntry(src: string): ImageEntry | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  try {
    return loadImageManifest().images[src] ?? null;
  } catch {
    return null;
  }
}

export function variantList(src: string, kind: "full" | "thumb"): EncodedVariant[] {
  const entry = imageEntry(src);
  if (!entry || entry.animated) return [];
  const list = kind === "thumb" ? entry.thumbs : entry.variants;
  return list.filter((item) => item.avif || item.webp);
}

export function formatSrcset(list: EncodedVariant[], format: "avif" | "webp"): string {
  return list
    .filter((item) => item[format])
    .map((item) => `${item[format]} ${item.width}w`)
    .join(", ");
}

/** Layout widths from global.css. CSS pixels, before device pixel ratio. */
export const IMAGE_SIZES = {
  column: "(max-width: 759px) 100vw, 620px",
  wide: "(max-width: 759px) 100vw, (min-width: 1100px) 908px, 620px",
  portrait: "(max-width: 759px) 100vw, 440px",
  pair: "(max-width: 759px) 100vw, (min-width: 1100px) 443px, 299px",
  thumb: "76px",
} as const;

export type ImageLayout = keyof typeof IMAGE_SIZES;
