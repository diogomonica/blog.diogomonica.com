/**
 * Build-time AVIF/WebP variants for images already in public/.
 *
 * Originals stay at their current URLs. Variants are written beside them and
 * committed, so Cloudflare Pages does not have to compile libvips or spend the
 * build budget on AVIF. When every output is current this script exits without
 * loading sharp. Run `npm run images` after adding or replacing an image.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const manifestPath = join(root, "src/data/image-variants.json");
const roots = [join(root, "public/content/images"), join(root, "public/images")];
const WIDTHS = [480, 800, 1200, 1600];
const THUMBS = [76, 152];
const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif"]);

const settings = {
  widths: WIDTHS,
  thumbs: THUMBS,
  png: {
    webp: "lossless, or quality 92 when lossless is much larger than AVIF",
    avifQuality: 88,
    avifChroma: "4:4:4",
    avifEffort: 5,
    webpEffort: 6,
  },
  jpeg: {
    webpQuality: 90,
    avifQuality: 80,
    avifChroma: "4:4:4",
    avifEffort: 5,
    webpEffort: 6,
  },
};

const settingsHash = createHash("sha256").update(JSON.stringify(settings)).digest("hex").slice(0, 16);

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

function isGeneratedName(name) {
  return /\.(?:w|t)\d+\.(?:avif|webp)$/i.test(name);
}

function publicUrl(abs) {
  const rel = relative(join(root, "public"), abs).split(sep).join("/");
  return `/${rel}`;
}

function variantPath(abs, kind, width, format) {
  const ext = extname(abs);
  const stem = abs.slice(0, -ext.length);
  const tag = kind === "thumb" ? "t" : "w";
  return `${stem}.${tag}${width}.${format}`;
}

function widthsFor(original) {
  const widths = WIDTHS.filter((width) => width < original);
  if (!widths.includes(original)) widths.push(original);
  return widths.sort((a, b) => a - b);
}

function thumbWidths(original) {
  return THUMBS.filter((width) => width < original);
}

function loadPrevious() {
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return null;
  }
}

function sourceFresh(abs, previousEntry) {
  if (!previousEntry || previousEntry.settingsHash !== settingsHash) return false;
  const stat = statSync(abs);
  if (previousEntry.sourceBytes !== stat.size) return false;
  if (Math.abs(previousEntry.sourceMtimeMs - stat.mtimeMs) > 1) return false;
  const urls = [];
  for (const group of [previousEntry.variants ?? [], previousEntry.thumbs ?? []]) {
    for (const item of group) {
      if (item.avif) urls.push(item.avif);
      if (item.webp) urls.push(item.webp);
    }
  }
  return urls.every((url) => {
    try {
      return statSync(join(root, "public", url.replace(/^\//, ""))).size > 0;
    } catch {
      return false;
    }
  });
}

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default;
  } catch (error) {
    console.error("sharp is not installed, and one or more image variants are missing.");
    console.error("Install dev dependencies and run `npm run images` before building.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function writeBuffer(file, buffer) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, buffer);
  renameSync(tmp, file);
}

async function encodeSet(sharp, abs, width, graphic) {
  const resized = sharp(abs, { animated: false, limitInputPixels: false }).resize({
    width,
    withoutEnlargement: true,
    kernel: "lanczos3",
    fastShrinkOnLoad: true,
  });

  if (graphic) {
    const webpLossless = await resized.clone().webp({ lossless: true, effort: settings.png.webpEffort }).toBuffer();
    const avif = await resized
      .clone()
      .avif({
        quality: settings.png.avifQuality,
        chromaSubsampling: "4:4:4",
        effort: settings.png.avifEffort,
      })
      .toBuffer();
    let webp = webpLossless;
    let webpMode = "lossless";
    if (webpLossless.length > avif.length * 1.4 && webpLossless.length > 60_000) {
      const webpHq = await resized
        .clone()
        .webp({ quality: 92, effort: settings.png.webpEffort, smartSubsample: false })
        .toBuffer();
      if (webpHq.length < webpLossless.length) {
        webp = webpHq;
        webpMode = "q92";
      }
    }
    const avifOk = avif.length + 32 < webp.length;
    return { webp, avif: avifOk ? avif : null, webpMode, avifMode: avifOk ? "q88-444" : null };
  }

  const webp = await resized
    .clone()
    .webp({ quality: settings.jpeg.webpQuality, effort: settings.jpeg.webpEffort, smartSubsample: false })
    .toBuffer();
  const avif = await resized
    .clone()
    .avif({
      quality: settings.jpeg.avifQuality,
      chromaSubsampling: "4:4:4",
      effort: settings.jpeg.avifEffort,
    })
    .toBuffer();
  const avifOk = avif.length + 32 < webp.length;
  return { webp, avif: avifOk ? avif : null, webpMode: "q90", avifMode: avifOk ? "q80-444" : null };
}

async function buildEntry(sharp, abs) {
  const ext = extname(abs).toLowerCase();
  const meta = await sharp(abs, { animated: true, limitInputPixels: false }).metadata();
  const stat = statSync(abs);
  const animated = (meta.pages ?? 1) > 1;
  if (animated) {
    return {
      width: meta.width,
      height: meta.height,
      animated: true,
      sourceBytes: stat.size,
      sourceMtimeMs: stat.mtimeMs,
      settingsHash,
      variants: [],
      thumbs: [],
    };
  }

  const graphic = ext === ".png" || ext === ".gif";
  const original = meta.width;
  const groups = [
    ["variants", widthsFor(original)],
    ["thumbs", thumbWidths(original)],
  ];
  const entry = {
    width: meta.width,
    height: meta.height,
    animated: false,
    sourceBytes: stat.size,
    sourceMtimeMs: stat.mtimeMs,
    settingsHash,
    variants: [],
    thumbs: [],
  };

  for (const [key, widths] of groups) {
    for (const width of widths) {
      const encoded = await encodeSet(sharp, abs, width, graphic);
      const item = { width };
      const fullWidth = width === original;
      const webpSmaller = !fullWidth || encoded.webp.length + 32 < stat.size;
      if (webpSmaller) {
        const file = variantPath(abs, key === "thumbs" ? "thumb" : "full", width, "webp");
        writeBuffer(file, encoded.webp);
        item.webp = publicUrl(file);
        item.webpBytes = encoded.webp.length;
        item.webpMode = encoded.webpMode;
      }
      if (encoded.avif && (!fullWidth || encoded.avif.length + 32 < stat.size)) {
        const file = variantPath(abs, key === "thumbs" ? "thumb" : "full", width, "avif");
        writeBuffer(file, encoded.avif);
        item.avif = publicUrl(file);
        item.avifBytes = encoded.avif.length;
        item.avifMode = encoded.avifMode;
      }
      if (item.webp || item.avif) entry[key].push(item);
    }
  }
  // A browser that supports AVIF never looks at the WebP srcset. If the
  // full-width AVIF was dropped (lossless WebP was smaller), drop the smaller
  // AVIF files too so high-DPR screens still receive the full-width WebP.
  const full = entry.variants.find((item) => item.width === original);
  if (!full?.avif) {
    for (const item of entry.variants) {
      if (!item.avif) continue;
      rmSync(join(root, "public", item.avif.replace(/^\//, "")), { force: true });
      delete item.avif;
      delete item.avifBytes;
      delete item.avifMode;
    }
  }
  return entry;
}

function expectedOutputs(entry, abs) {
  const urls = new Set();
  for (const group of [entry.variants, entry.thumbs]) {
    for (const item of group) {
      if (item.avif) urls.add(item.avif);
      if (item.webp) urls.add(item.webp);
    }
  }
  return urls;
}

async function main() {
  const files = roots.flatMap((dir) => walk(dir)).filter((abs) => {
    const ext = extname(abs).toLowerCase();
    return SOURCE_EXT.has(ext) && !isGeneratedName(abs);
  });
  const previous = loadPrevious();
  const pending = [];
  const images = {};
  for (const abs of files) {
    const url = publicUrl(abs);
    const prior = previous?.images?.[url];
    if (prior && sourceFresh(abs, prior)) images[url] = prior;
    else pending.push(abs);
  }

  if (pending.length === 0 && previous?.settingsHash === settingsHash) {
    const kept = new Set();
    for (const entry of Object.values(images)) {
      for (const url of expectedOutputs(entry)) kept.add(url);
    }
    console.log(`image variants are current (${files.length} sources)`);
    return;
  }

  const sharp = await loadSharp();
  sharp.cache(false);
  sharp.concurrency(2);

  let done = 0;
  const queue = pending.slice();
  async function worker() {
    while (queue.length) {
      const abs = queue.shift();
      const url = publicUrl(abs);
      images[url] = await buildEntry(sharp, abs);
      done += 1;
      if (done % 10 === 0 || done === pending.length) {
        console.log(`optimized ${done}/${pending.length}`);
      }
    }
  }
  await Promise.all([worker(), worker()]);

  const manifest = {
    version: 1,
    settingsHash,
    settings,
    images,
  };
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(manifest)}\n`);

  const kept = new Set();
  for (const entry of Object.values(images)) {
    for (const url of expectedOutputs(entry)) kept.add(join(root, "public", url.replace(/^\//, "")));
  }
  for (const abs of roots.flatMap((dir) => walk(dir))) {
    if (!isGeneratedName(abs)) continue;
    if (!kept.has(abs)) rmSync(abs, { force: true });
  }
  console.log(`wrote ${manifestPath} (${pending.length} regenerated, ${files.length - pending.length} unchanged)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
