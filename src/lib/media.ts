import timelineMarkdown from "../pages/media-timeline.md?raw";

export type MediaItem = {
  title: string;
  href: string;
  image: string;
  date: string;
  year: string;
};

export type HomepageMedia = {
  latest: MediaItem[];
  total: number;
  lastDate: string;
};

const LATEST_COUNT = 8;

/** Title-card artwork with no real photo. */
const TITLE_CARD_ONLY = [
  "expresso-bancos",
  "dinheiro-vivo",
  "base-layer",
];

export function dateFromHref(href: string, year: string): string {
  const iso = href.match(/(?:^|[^\d])(\d{4}-\d{2}-\d{2})(?:[^\d]|$)/);
  if (iso) return iso[1];

  const slash = href.match(/\/(\d{4})\/(\d{2})\/(\d{2})(?:\/|$)/);
  if (slash) return `${slash[1]}-${slash[2]}-${slash[3]}`;

  const compact = href.match(/(?:^|[^\d])(\d{4})(\d{2})(\d{2})(?:[^\d]|$)/);
  if (compact) {
    const month = Number(compact[2]);
    const day = Number(compact[3]);
    const parsedYear = Number(compact[1]);
    if (parsedYear >= 2010 && parsedYear <= 2099 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${compact[1]}-${compact[2]}-${compact[3]}`;
    }
  }

  return year;
}

export function isTitleCardOnly(item: Pick<MediaItem, "image" | "title">): boolean {
  const image = item.image.toLowerCase();
  const title = item.title.toLowerCase();
  return TITLE_CARD_ONLY.some((stem) => image.includes(stem))
    || title.startsWith("expresso: os bancos")
    || title.startsWith("dinheiro vivo")
    || title.startsWith("base layer");
}

export function parseMediaTimeline(markdown: string): MediaItem[] {
  const items: MediaItem[] = [];
  let year = "";
  let title = "";

  for (const line of markdown.replaceAll("\r\n", "\n").split("\n")) {
    const yearMatch = line.match(/^### (\d{4})\s*$/);
    if (yearMatch) {
      year = yearMatch[1];
      title = "";
      continue;
    }

    const titleMatch = line.match(/^###### (.+?)\s*$/);
    if (titleMatch) {
      title = titleMatch[1];
      continue;
    }

    const linkMatch = line.match(/^\[!\[\]\(([^)]+)\)\]\(([^)]+)\)\s*$/);
    if (linkMatch && title && year) {
      items.push({
        title,
        image: linkMatch[1],
        href: linkMatch[2],
        year,
        date: dateFromHref(linkMatch[2], year),
      });
      title = "";
    }
  }

  return items;
}

export function buildMediaStats(items: MediaItem[], limit = LATEST_COUNT): HomepageMedia {
  const lastDate = items.reduce((latest, item) => (item.date > latest ? item.date : latest), "");
  return {
    total: items.length,
    lastDate,
    latest: items.filter((item) => !isTitleCardOnly(item)).slice(0, limit),
  };
}

export function loadHomepageMedia(limit = LATEST_COUNT): HomepageMedia {
  return buildMediaStats(parseMediaTimeline(timelineMarkdown), limit);
}
