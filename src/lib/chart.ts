const INK = "currentColor";
const MUTED = "var(--muted)";

export function histogramSvg(values: number[], label: string): string {
  const W = 240;
  const H = 36;
  const max = Math.max(...values, 1);
  const gap = 2;
  const barW = Math.max(1.5, (W - gap * (values.length - 1)) / values.length);

  const bars = values
    .map((n, i) => {
      const h = Math.max(1.5, (n / max) * (H - 1));
      const x = round(i * (barW + gap));
      const y = round(H - h);
      return `<rect x="${x}" y="${y}" width="${round(barW)}" height="${round(h)}" fill="${INK}" opacity="${n ? 0.85 : 0.22}"/>`;
    })
    .join("");

  return `<svg class="hist-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(label)}">${bars}</svg>`;
}

export function sparklineSvg(values: number[], label: string): string {
  const W = 88;
  const H = 28;
  const pad = 1;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? (W - pad * 2) / (values.length - 1) : 0;
  const points = values
    .map((n, i) => {
      const x = round(pad + i * step);
      const y = round(H - pad - (n / max) * (H - pad * 2));
      return `${x},${y}`;
    })
    .join(" ");

  return `<svg class="spark-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(label)}"><polyline fill="none" stroke="${INK}" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" points="${points}"/></svg>`;
}

export function yearBarsSvg(values: { year: string; count: number }[]): string {
  const W = 720;
  const H = 160;
  const pad = { t: 8, r: 4, b: 22, l: 4 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = Math.max(...values.map((v) => v.count), 1);
  const gap = 8;
  const barW = Math.max(6, (innerW - gap * (values.length - 1)) / values.length);

  const bars = values
    .map((item, i) => {
      const h = round((item.count / max) * innerH);
      const x = round(pad.l + i * (barW + gap));
      const y = round(pad.t + innerH - h);
      return `<rect x="${x}" y="${y}" width="${round(barW)}" height="${Math.max(h, 1.5)}" fill="${INK}" opacity="0.9"/>
        <text x="${round(x + barW / 2)}" y="${H - 6}" fill="${MUTED}" font-size="11" font-family="Geist Sans, ui-sans-serif, sans-serif" text-anchor="middle">${item.year}</text>`;
    })
    .join("");

  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Posts published per year from ${values[0]?.year ?? ""} to ${values[values.length - 1]?.year ?? ""}">${bars}</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
