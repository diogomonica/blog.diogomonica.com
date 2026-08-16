import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export type PostRow = {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  href: string;
  year: string;
};

export type YearCount = { year: string; count: number };

export type ArchiveStats = {
  posts: PostRow[];
  total: number;
  firstYear: string;
  lastYear: string;
  lastDate: string;
  yearsActive: string;
  yearCounts: YearCount[];
};

export function hrefFor(date: string, slug: string): string {
  return `/${date.replaceAll("-", "/")}/${slug}/`;
}

export function toRows(entries: PostEntry[]): PostRow[] {
  return entries
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      slug: post.data.slug,
      tags: post.data.tags,
      href: hrefFor(post.data.date, post.data.slug),
      year: post.data.date.slice(0, 4),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function buildStats(entries: PostEntry[]): ArchiveStats {
  const posts = toRows(entries);
  const years = posts.map((p) => p.year);
  const firstYear = years.reduce((a, b) => (a < b ? a : b), years[0] ?? "");
  const lastYear = years.reduce((a, b) => (a > b ? a : b), years[0] ?? "");
  const lastDate = posts[0]?.date ?? "";

  const yearMap = new Map<string, number>();
  for (let y = Number(firstYear); y <= Number(lastYear); y++) {
    yearMap.set(String(y), 0);
  }
  for (const post of posts) {
    yearMap.set(post.year, (yearMap.get(post.year) ?? 0) + 1);
  }

  return {
    posts,
    total: posts.length,
    firstYear,
    lastYear,
    lastDate,
    yearsActive: `${firstYear}–${lastYear}`,
    yearCounts: [...yearMap.entries()].map(([year, count]) => ({ year, count })),
  };
}
