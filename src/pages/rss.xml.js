import { getCollection } from "astro:content";
import { SITE, DISPLAY, HOME_DESCRIPTION } from "../lib/site";

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.published.localeCompare(a.data.published));
  const items = posts.map((p) => {
    const loc = `${SITE}/${p.data.date.replaceAll("-", "/")}/${p.data.slug}/`;
    const desc = escape(p.data.description || "");
    const categories = p.data.tags.map((t) => `<category>${escape(t)}</category>`).join("");
    return `<item><title>${escape(p.data.title)}</title><link>${loc}</link><guid isPermaLink="true">${loc}</guid><pubDate>${new Date(p.data.published).toUTCString()}</pubDate><dc:creator>${DISPLAY}</dc:creator>${categories}<description>${desc}</description></item>`;
  }).join("");
  const lastBuild = posts[0] ? new Date(posts[0].data.updated ?? posts[0].data.published).toUTCString() : new Date(0).toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${DISPLAY}</title><link>${SITE}/</link><atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/><description>${escape(HOME_DESCRIPTION)}</description><language>en</language><lastBuildDate>${lastBuild}</lastBuildDate><image><url>${SITE}/favicon.png</url><title>${DISPLAY}</title><link>${SITE}/</link></image>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
function escape(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
