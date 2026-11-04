import { getCollection } from "astro:content";
import { BIO, DISPLAY, SECURITY_BIO, SITE } from "../lib/site";

const NL = String.fromCharCode(10);

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const sections = posts.map((p) => {
    const url = SITE + "/" + p.data.date.replaceAll("-", "/") + "/" + p.data.slug + "/";
    return [
      "# " + p.data.title,
      "",
      "- URL: " + url,
      ...(p.data.canonical ? ["- Canonical: " + p.data.canonical] : []),
      "- Published: " + p.data.date,
      "- Author: " + DISPLAY,
      ...(p.data.tags.length ? ["- Tags: " + p.data.tags.join(", ")] : []),
      "",
      "> " + p.data.description,
      "",
      (typeof p.body === "string" ? p.body : "").trim(),
    ].join(NL);
  });
  const text = ["# " + DISPLAY + " — full text of every post", "", "> " + BIO, "", SECURITY_BIO, "", ...sections.flatMap((s) => [s, "", "---", ""])].join(NL);
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
