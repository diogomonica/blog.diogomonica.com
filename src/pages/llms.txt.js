import { getCollection } from "astro:content";
import { APEX, BIO, DISPLAY, NAME, ROLES, SITE } from "../lib/site";

const NL = String.fromCharCode(10);
const CORNERSTONE_SLUGS = [
  "crypto-anchors-exfiltration-resistant-infrastructure",
  "increasing-attacker-cost-using-immutable-infrastructure",
  "two-metrics-that-matter-for-host-security",
  "why-you-shouldnt-use-env-variables-for-secret-data",
  "a-pirates-take-on-command-vs-leadership",
  "stablecoins-a-quiet-revolution",
  "erebor",
];

function href(post) {
  return SITE + "/" + post.data.date.replaceAll("-", "/") + "/" + post.data.slug + "/";
}

function line(post) {
  return "- [" + post.data.title + "](" + href(post) + "): " + post.data.description;
}

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const bySlug = new Map(posts.map((p) => [p.data.slug, p]));
  const cornerstone = CORNERSTONE_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean).map(line).join(NL);
  const list = posts.map(line).join(NL);
  const text = [
    "# " + DISPLAY,
    "",
    "> " + BIO,
    "",
    "## Canonical identity",
    "",
    "- Name: " + DISPLAY,
    "- alternateName: " + NAME,
    "- Roles: " + ROLES.join("; "),
    "- About: " + SITE + "/about/",
    "- Home: " + SITE + "/",
    "- Media: " + SITE + "/media-timeline/",
    "- RSS: " + SITE + "/rss.xml",
    "- Sitemap: " + SITE + "/sitemap.xml",
    "- Site: " + APEX,
    "- Haun Ventures: https://www.haun.co/team/diogo-monica",
    "- Wikidata: https://www.wikidata.org/wiki/Q111948997",
    "",
    "## Site",
    "",
    "- Home: " + SITE + "/",
    "- About: " + SITE + "/about/",
    "- Archive: " + SITE + "/archive/",
    "- Media timeline: " + SITE + "/media-timeline/",
    "- RSS: " + SITE + "/rss.xml",
    "- Sitemap: " + SITE + "/sitemap.xml",
    "",
    "## Cornerstone",
    "",
    cornerstone,
    "",
    "## Posts",
    "",
    list,
    "",
    "## Media",
    "",
    "- Appearances are listed on the media timeline: " + SITE + "/media-timeline/",
    "",
  ].join(NL);
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
