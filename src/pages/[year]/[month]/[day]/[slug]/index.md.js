import { getCollection } from "astro:content";
import { DISPLAY, SITE } from "../../../../../lib/site";

/** Markdown alternate of each post. _headers marks these noindex with a canonical Link to the HTML page. */
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => {
    const [year, month, day] = post.data.date.split("-");
    return { params: { year, month, day, slug: post.data.slug }, props: { post } };
  });
}

export function GET({ props }) {
  const { post } = props;
  const url = SITE + "/" + post.data.date.replaceAll("-", "/") + "/" + post.data.slug + "/";
  const NL = String.fromCharCode(10);
  const text = [
    "# " + post.data.title,
    "",
    "- Author: " + DISPLAY,
    "- Published: " + post.data.date,
    "- HTML: " + (post.data.canonical ?? url),
    ...(post.data.tags.length ? ["- Tags: " + post.data.tags.join(", ")] : []),
    "",
    "> " + post.data.description,
    "",
    (typeof post.body === "string" ? post.body : "").trim(),
    "",
  ].join(NL);
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
