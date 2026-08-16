import { getCollection } from "astro:content";
import { SITE, DISPLAY, BIO } from "../lib/site";

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const items = posts.map((p) => {
    const loc = `${SITE}/${p.data.date.replaceAll("-", "/")}/${p.data.slug}/`;
    const desc = escape(p.data.description || "");
    return `<item><title>${escape(p.data.title)}</title><link>${loc}</link><guid>${loc}</guid><pubDate>${new Date(p.data.published).toUTCString()}</pubDate><description>${desc}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${DISPLAY}</title><link>${SITE}/</link><description>${escape(BIO)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
function escape(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
