import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

export async function GET() {
  const posts = await getCollection("posts");
  const urls = ["/", "/archive/", "/media-timeline/", ...posts.map((p) => `/${p.data.date.replaceAll("-", "/")}/${p.data.slug}/`)];
  const body = urls.map((u) => `<url><loc>${SITE}${u}</loc></url>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
