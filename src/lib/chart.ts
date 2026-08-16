import type { TopicCount, YearCount } from "./stats";

const ACCENT = "var(--accent)";
const ACCENT_DIM = "var(--accent-dim)";
const GRID = "var(--line)";
const AXIS = "var(--muted)";
const GLOW = "var(--accent-glow)";

function ticks(max: number): number[] {
  if (max <= 4) return [0, 1, 2, 3, 4].filter((n) => n <= Math.max(max, 1));
  const step = max <= 8 ? 2 : 5;
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let n = 0; n <= top; n += step) out.push(n);
  return out;
}

export function yearBarsSvg(yearCounts: YearCount[]): string {
  const W = 720;
  const H = 220;
  const pad = { t: 22, r: 12, b: 32, l: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = Math.max(...yearCounts.map((y) => y.count), 1);
  const yTicks = ticks(max);
  const yMax = yTicks[yTicks.length - 1] ?? max;
  const gap = 10;
  const barW = Math.max(8, (innerW - gap * yearCounts.length) / yearCounts.length);

  const grid = yTicks
    .map((n) => {
      const y = pad.t + innerH - (n / yMax) * innerH;
      return `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}" stroke="${GRID}" stroke-width="1"/>
        <text x="${pad.l - 6}" y="${y + 3}" fill="${AXIS}" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace" text-anchor="end">${n}</text>`;
    })
    .join("");

  const bars = yearCounts
    .map((item, i) => {
      const h = (item.count / yMax) * innerH;
      const x = pad.l + i * (barW + gap) + gap / 2;
      const y = pad.t + innerH - h;
      const labelY = H - 10;
      const value = item.count
        ? `<text x="${x + barW / 2}" y="${y - 6}" fill="${ACCENT}" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace" text-anchor="middle">${item.count}</text>`
        : "";
      return `<rect class="chart-bar" x="${x}" y="${y}" width="${barW}" height="${Math.max(h, 0)}" rx="2" fill="${ACCENT}" filter="url(#barGlow)"/>
        ${value}
        <text x="${x + barW / 2}" y="${labelY}" fill="${AXIS}" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace" text-anchor="middle">${item.year}</text>`;
    })
    .join("");

  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Posts published per year from ${yearCounts[0]?.year ?? ""} to ${yearCounts[yearCounts.length - 1]?.year ?? ""}">
    <defs>
      <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${grid}
    ${bars}
  </svg>`;
}

export function topicBarsSvg(topics: TopicCount[], limit = 8): string {
  const rows = topics.slice(0, limit);
  const W = 720;
  const rowH = 26;
  const pad = { t: 8, r: 48, b: 8, l: 108 };
  const H = pad.t + pad.b + rows.length * rowH;
  const innerW = W - pad.l - pad.r;
  const max = Math.max(...rows.map((t) => t.count), 1);

  const body = rows
    .map((item, i) => {
      const y = pad.t + i * rowH;
      const w = Math.max(4, (item.count / max) * innerW);
      return `<text x="${pad.l - 10}" y="${y + 14}" fill="${AXIS}" font-size="11" font-family="IBM Plex Mono, ui-monospace, monospace" text-anchor="end">${escapeXml(item.topic)}</text>
        <rect x="${pad.l}" y="${y + 5}" width="${innerW}" height="12" rx="2" fill="${ACCENT_DIM}"/>
        <rect x="${pad.l}" y="${y + 5}" width="${w}" height="12" rx="2" fill="${ACCENT}" style="filter:drop-shadow(0 0 6px ${GLOW})"/>
        <text x="${pad.l + w + 8}" y="${y + 15}" fill="${AXIS}" font-size="10" font-family="IBM Plex Mono, ui-monospace, monospace">${item.count}</text>`;
    })
    .join("");

  const names = rows.map((t) => t.topic).join(", ");
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Most used topics: ${escapeXml(names)}">${body}</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
