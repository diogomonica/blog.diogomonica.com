import { getCollection } from "astro:content";
import { ABOUT, APEX, BIO, DISPLAY, NAME, ROLES, SECURITY_BIO, SITE } from "../lib/site";
import { SECURITY_CLUSTERS, SECURITY_TOPIC } from "../lib/topics";

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
  return "- [" + post.data.title + "](" + href(post) + "): " + post.data.description + " Markdown: " + href(post) + "index.md";
}

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const bySlug = new Map(posts.map((p) => [p.data.slug, p]));
  const cornerstone = CORNERSTONE_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean).map(line).join(NL);
  const list = posts.map(line).join(NL);
  const security = SECURITY_CLUSTERS.map((cluster) => {
    const items = cluster.slugs.map((slug) => bySlug.get(slug)).filter(Boolean).map(line);
    return "### " + cluster.name + NL + NL + items.join(NL);
  }).join(NL + NL);
  const text = [
    "# " + DISPLAY,
    "",
    "> " + BIO,
    "",
    SECURITY_BIO,
    "",
    "## Canonical identity",
    "",
    "- Name: " + DISPLAY,
    "- alternateName: " + NAME,
    "- Roles: " + ROLES.join("; "),
    "- Education: BSc, MSc, and PhD, Instituto Superior Técnico, University of Lisbon. Press media kit: " + ABOUT + "#media-kit",
    "- About: " + ABOUT,
    "- Home: " + SITE + "/",
    "- Media: " + SITE + "/media-timeline/",
    "- RSS: " + SITE + "/rss.xml",
    "- Sitemap: " + SITE + "/sitemap.xml",
    "- Site: " + APEX,
    "- Haun Ventures: https://www.haun.co/team/diogo-monica",
    "- Wikidata: https://www.wikidata.org/wiki/Q111948997",
    "",
    "## Security expertise",
    "",
    "- Security engineering background: Security Lead at Docker (2015–2017), Platform Security Lead at Square, member of the Open Container Initiative technical oversight board, PhD in computer science (network security) from Instituto Superior Técnico.",
    "- Topics: infrastructure and container security, software supply chain security, applied cryptography and key management, hardware security modules, exfiltration-resistant infrastructure, AI security and AI agent containment, digital-asset custody.",
    "- Security topic page: " + SITE + SECURITY_TOPIC.path,
    "",
    security,
    "",
    "## Site",
    "",
    "- Home: " + SITE + "/",
    "- About: " + ABOUT,
    "- Archive: " + SITE + "/archive/",
    "- Security essays: " + SITE + SECURITY_TOPIC.path,
    "- Full text of every post: " + SITE + "/llms-full.txt",
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
