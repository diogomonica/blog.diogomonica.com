import { getCollection } from "astro:content";
import { loadHomepageMedia } from "../lib/media";
import { SITE } from "../lib/site";
import { SECURITY_CLUSTERS, SECURITY_TOPIC } from "../lib/topics";

const day = (iso) => iso.slice(0, 10);
const newest = (dates) => dates.reduce((a, b) => (a > b ? a : b));

export async function GET() {
  // Cross-posts whose canonical lives elsewhere (haun.co) stay out of the sitemap.
  const posts = (await getCollection("posts")).filter((p) => !p.data.canonical);
  const postEntries = posts.map((p) => ({
    loc: `/${p.data.date.replaceAll("-", "/")}/${p.data.slug}/`,
    lastmod: day(p.data.updated ?? p.data.published),
  }));
  const bySlug = new Map(posts.map((p) => [p.data.slug, p]));
  const latest = newest(postEntries.map((e) => e.lastmod));
  const securityDates = SECURITY_CLUSTERS.flatMap((c) => c.slugs)
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((p) => day(p.data.updated ?? p.data.published));
  const media = loadHomepageMedia();
  const entries = [
    { loc: "/", lastmod: latest },
    { loc: "/archive/", lastmod: latest },
    { loc: SECURITY_TOPIC.path, lastmod: newest(securityDates) },
    { loc: "/media-timeline/", lastmod: /^\d{4}-\d{2}-\d{2}$/.test(media.lastDate) ? media.lastDate : latest },
    ...postEntries,
  ];
  const body = entries.map((e) => `<url><loc>${SITE}${e.loc}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
