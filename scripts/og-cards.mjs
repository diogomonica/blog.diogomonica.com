/**
 * Open Graph cards (1200x630 PNG) for the blog: one default card and one per
 * post, written to public/og/ and committed. Cards are rendered with headless
 * Chrome from the site's own fonts and palette, then recompressed with sharp.
 *
 *   npm run og            # render missing or stale cards
 *   npm run og -- --force # re-render everything
 *
 * Set CHROME=/path/to/chrome if Chrome is not on the default path. The build
 * does not run this; Base.astro falls back to the default card when a post
 * has no card yet.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const postsDir = join(root, "src/content/posts");
const outDir = join(root, "public/og");
const manifestPath = join(root, "src/data/og-cards.json");
const chrome = process.env.CHROME || ["/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
const force = process.argv.includes("--force");
const TEMPLATE_VERSION = "3";

const fontUrl = (name) => pathToFileURL(join(root, "public/fonts", name)).href;

function frontmatter(file) {
  const text = readFileSync(file, "utf8");
  const end = text.indexOf("\n---", 4);
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    try { data[m[1]] = JSON.parse(m[2]); } catch { data[m[1]] = m[2]; }
  }
  return data;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function page({ kicker, title, footer, image }) {
  const art = image
    ? `<div class="art"><img src="${pathToFileURL(join(root, "public", image)).href}" alt=""></div>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"EB Garamond";font-weight:500;src:url("${fontUrl("eb-garamond-latin-500-normal.woff2")}") format("woff2")}
@font-face{font-family:"EB Garamond";font-weight:500;src:url("${fontUrl("eb-garamond-latin-ext-500-normal.woff2")}") format("woff2");unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:"EB Garamond";font-weight:400;font-style:italic;src:url("${fontUrl("eb-garamond-latin-400-italic.woff2")}") format("woff2")}
@font-face{font-family:"Manrope";font-weight:600;src:url("${fontUrl("manrope-latin-600-normal.woff2")}") format("woff2")}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden;background:#f3f2ee;color:#141312}
body{display:flex;padding:72px 80px 64px}
.text{flex:1;display:flex;flex-direction:column;min-width:0}
.kicker{font:600 22px/1 Manrope,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#4a4844}
.bar{width:56px;height:4px;border-radius:9999px;background:#b7cdb4;margin:30px 0 34px}
h1{font:500 76px/1.08 "EB Garamond",serif;letter-spacing:-.01em;text-wrap:balance;padding-bottom:6px}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font:600 22px/1 Manrope,sans-serif;color:#4a4844}
.foot .site{color:#1f7a5a}
.art{width:470px;margin:-8px -24px -8px 48px;display:flex;align-items:center;justify-content:center}
.art img{max-width:100%;max-height:480px;object-fit:contain;mix-blend-mode:darken;border-radius:12px}
</style></head><body><div class="text">
<p class="kicker">${esc(kicker)}</p><div class="bar"></div>
<h1 id="t">${esc(title)}</h1>
<div class="foot">${footer}</div></div>${art}
<script>
const t=document.getElementById("t");
const im=document.querySelector(".art img");if(im)im.decode().then(()=>{im.style.width=Math.min(470,im.naturalWidth*1.25)+"px"}).catch(()=>{});
document.fonts.ready.then(()=>{let s=76;while(t.scrollHeight>340&&s>44){s-=2;t.style.fontSize=s+"px";}});
</script></body></html>`;
}

function render(html, out) {
  const dir = mkdtempSync(join(tmpdir(), "og-"));
  const htmlPath = join(dir, "card.html");
  const shot = join(dir, "card.png");
  writeFileSync(htmlPath, html);
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--allow-file-access-from-files",
    "--force-device-scale-factor=1", "--window-size=1200,630", "--virtual-time-budget=4000",
    `--screenshot=${shot}`, pathToFileURL(htmlPath).href,
  ], { stdio: "ignore" });
  return import("sharp").then(({ default: sharp }) =>
    sharp(shot).resize(1200, 630).png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 }).toFile(out),
  ).finally(() => rmSync(dir, { recursive: true, force: true }));
}

const cards = [{
  id: "default",
  out: join(outDir, "default.png"),
  spec: {
    kicker: "Diogo Mónica",
    title: "Essays on security, AI and digital assets",
    footer: `<span>Security engineer · investor</span><span class="site">blog.diogomonica.com</span>`,
  },
}];
for (const name of readdirSync(postsDir).filter((f) => f.endsWith(".md")).sort()) {
  const fm = frontmatter(join(postsDir, name));
  cards.push({
    id: fm.slug,
    out: join(outDir, "posts", `${fm.slug}.png`),
    spec: {
      kicker: "Diogo Mónica · Essay",
      title: String(fm.title).replace(/[*_`]/g, ""),
      footer: `<span>${esc(formatDate(fm.date))}</span><span class="site">blog.diogomonica.com</span>`,
      image: fm.cardImage,
    },
  });
}

if (!chrome) {
  console.error("og-cards: Chrome not found; set CHROME=/path/to/chrome");
  process.exit(1);
}
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const next = {};
mkdirSync(join(outDir, "posts"), { recursive: true });
let rendered = 0;
for (const card of cards) {
  const imageHash = card.spec.image ? createHash("sha256").update(readFileSync(join(root, "public", card.spec.image))).digest("hex") : "";
  const hash = createHash("sha256").update(TEMPLATE_VERSION + JSON.stringify(card.spec) + imageHash).digest("hex").slice(0, 16);
  next[card.id] = hash;
  if (!force && manifest[card.id] === hash && existsSync(card.out)) continue;
  await render(page(card.spec), card.out);
  rendered += 1;
}
writeFileSync(manifestPath, JSON.stringify(next, null, 2) + "\n");
console.log(`og-cards: ${rendered} rendered, ${cards.length - rendered} current`);
