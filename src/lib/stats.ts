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
  month: string;
};

export type YearCount = { year: string; count: number };
export type TopicCount = { topic: string; count: number };

export type ArchiveStats = {
  posts: PostRow[];
  total: number;
  firstYear: string;
  lastYear: string;
  lastDate: string;
  yearsActive: string;
  yearCounts: YearCount[];
  yearActivity: number[];
  cumulativeByYear: number[];
  topicCounts: number[];
  topics: TopicCount[];
  topicCount: number;
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
      month: post.data.date.slice(0, 7),
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

  const yearCounts = [...yearMap.entries()].map(([year, count]) => ({ year, count }));
  const yearActivity = yearCounts.map((y) => y.count);
  const cumulativeByYear: number[] = [];
  yearActivity.reduce((sum, n) => {
    const next = sum + n;
    cumulativeByYear.push(next);
    return next;
  }, 0);

  const topicMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      topicMap.set(tag, (topicMap.get(tag) ?? 0) + 1);
    }
  }

  const topics = [...topicMap.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));

  return {
    posts,
    total: posts.length,
    firstYear,
    lastYear,
    lastDate,
    yearsActive: `${firstYear}–${lastYear}`,
    yearCounts,
    yearActivity,
    cumulativeByYear,
    topicCounts: topics.slice(0, 12).map((t) => t.count),
    topics,
    topicCount: topics.length,
  };
}

export function monthWindow(posts: PostRow[], centerDate: string, months = 24): number[] {
  const center = parseMonth(centerDate.slice(0, 7));
  const start = addMonths(center, -Math.floor(months / 2));
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.month, (counts.get(post.month) ?? 0) + 1);
  }
  const series: number[] = [];
  for (let i = 0; i < months; i++) {
    series.push(counts.get(formatMonth(addMonths(start, i))) ?? 0);
  }
  return series;
}

function parseMonth(ym: string): { y: number; m: number } {
  const [y, m] = ym.split("-").map(Number);
  return { y, m };
}

function addMonths(base: { y: number; m: number }, delta: number): { y: number; m: number } {
  const abs = base.y * 12 + (base.m - 1) + delta;
  const y = Math.floor(abs / 12);
  const m = ((abs % 12) + 12) % 12;
  return { y, m: m + 1 };
}

function formatMonth(d: { y: number; m: number }): string {
  return `${d.y}-${String(d.m).padStart(2, "0")}`;
}
