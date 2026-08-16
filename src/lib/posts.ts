import type { CollectionEntry } from "astro:content";
import { hrefFor } from "./stats";

export type PostEntry = CollectionEntry<"posts">;

export type RecordNeighbor = {
  title: string;
  date: string;
  href: string;
};

export type PostRecord = {
  post: PostEntry;
  readingTime: string;
  prev: RecordNeighbor | null;
  next: RecordNeighbor | null;
};

const WORDS_PER_MINUTE = 220;

export function plainTextFromBody(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(markdown: string): number {
  const text = plainTextFromBody(markdown);
  return text ? text.split(" ").length : 0;
}

export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(wordCount(markdown) / WORDS_PER_MINUTE));
}

export function formatReadingTime(markdown: string): string {
  return `${readingMinutes(markdown)} min`;
}

function bodyOf(post: PostEntry): string {
  return typeof post.body === "string" ? post.body : "";
}

function toNeighbor(post: PostEntry): RecordNeighbor {
  return {
    title: post.data.title,
    date: post.data.date,
    href: hrefFor(post.data.date, post.data.slug),
  };
}

export function comparePosts(a: PostEntry, b: PostEntry): number {
  const byDate = a.data.date.localeCompare(b.data.date);
  return byDate !== 0 ? byDate : a.data.slug.localeCompare(b.data.slug);
}

/** Oldest-first neighbors for every post in one pass. */
export function buildPostRecords(posts: PostEntry[]): PostRecord[] {
  const sorted = [...posts].sort(comparePosts);
  return sorted.map((post, index) => {
    const older = sorted[index - 1];
    const newer = sorted[index + 1];
    return {
      post,
      readingTime: formatReadingTime(bodyOf(post)),
      prev: older ? toNeighbor(older) : null,
      next: newer ? toNeighbor(newer) : null,
    };
  });
}
