import { getCollection } from "astro:content";
import { SITE, DISPLAY, BIO } from "../lib/site";
const NL = String.fromCharCode(10);
export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const list = posts.map((p) => "- [" + p.data.title + "](" + SITE + "/" + p.data.date.replaceAll("-", "/") + "/" + p.data.slug + "/): " + p.data.description).join(NL);
  const text = ["# " + DISPLAY, "", "> " + BIO, "", "## Site", "", "- Home: " + SITE + "/", "- Archive: " + SITE + "/archive/", "- Media timeline: " + SITE + "/media-timeline/", "- RSS: " + SITE + "/rss.xml", "", "## Posts", "", list, ""].join(NL);
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
