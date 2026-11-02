const LINE = 0.285;
const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealAll() {
  document.querySelectorAll(".fig.plate img").forEach((img) => img.classList.add("is-shown"));
  root.classList.add("revealed");
}

const plates = [...document.querySelectorAll(".fig.plate img")];
if (reduce || !("IntersectionObserver" in window)) {
  plates.forEach((img) => img.classList.add("is-shown"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-shown");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "400px 0px 400px 0px" },
  );
  plates.forEach((img) => io.observe(img));
}
window.setTimeout(revealAll, 4000);

function roman(value: number): string {
  const pairs: [number, string][] = [
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let n = value;
  let out = "";
  for (const [amount, glyph] of pairs) {
    while (n >= amount) {
      out += glyph;
      n -= amount;
    }
  }
  return out || String(value);
}

const article = document.querySelector("article.essay");
const rail = document.querySelector(".rail");
const heads = article ? [...article.querySelectorAll(".prose h2")] : [];

if (rail && heads.length > 0) {
  heads.forEach((head, index) => {
    if (!head.id) head.id = `section-${index + 1}`;
    const stop = document.createElement("a");
    stop.className = "stop";
    stop.href = `#${head.id}`;
    const label = head.textContent?.trim() || `Section ${index + 1}`;
    stop.setAttribute("aria-label", label);
    if (index < 12) {
      const num = document.createElement("span");
      num.className = "stop-n";
      num.textContent = roman(index + 1);
      num.setAttribute("aria-hidden", "true");
      stop.append(num);
    }
    rail.append(stop);
  });
}

const stops = rail ? [...rail.querySelectorAll(".stop")] : [];
let ticking = false;
let lastP = -1;

function topOf(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function measure() {
  ticking = false;
  if (!article) return;
  const start = topOf(article) - window.innerHeight * LINE;
  const end = Math.max(start + 1, topOf(article) + article.offsetHeight - window.innerHeight * 0.35);
  const p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
  if (Math.abs(p - lastP) > 0.0004) {
    root.style.setProperty("--p", p.toFixed(4));
    lastP = p;
  }
  let current = 0;
  heads.forEach((head, index) => {
    if (head.getBoundingClientRect().top < window.innerHeight * LINE) current = index;
  });
  stops.forEach((stop, index) => {
    const head = heads[index];
    if (!head) return;
    const ratio = Math.min(1, Math.max(0, (topOf(head) - window.innerHeight * LINE - start) / (end - start)));
    (stop as HTMLElement).style.top = `${(ratio * 100).toFixed(3)}%`;
    stop.classList.toggle("past", index < current);
    stop.classList.toggle("on", index === current);
    if (index === current) stop.setAttribute("aria-current", "location");
    else stop.removeAttribute("aria-current");
  });
  rail?.classList.toggle("on", window.scrollY + 8 > start);
}

function findEndnotes(rootArticle: Element): HTMLOListElement | null {
  const lists = [...rootArticle.querySelectorAll(".prose ol")].filter(
    (node): node is HTMLOListElement => node instanceof HTMLOListElement,
  );
  for (let index = lists.length - 1; index >= 0; index -= 1) {
    const items = [...lists[index].children].filter((node) => node instanceof HTMLLIElement);
    if (items.length === 0) continue;
    const looksLikeNotes = items.every((item) => /↩|↵/.test(item.textContent ?? "") || !!item.querySelector('a[href*="fn"]'));
    if (looksLikeNotes) return lists[index];
  }
  return null;
}

function noteId(index: number) {
  return `margin-note-${index + 1}`;
}

function setupNotes() {
  if (!article) return;
  const list = findEndnotes(article);
  if (!list) return;
  list.classList.add("endnotes");
  const items = [...list.children].filter((node): node is HTMLLIElement => node instanceof HTMLLIElement);
  const refs = [...article.querySelectorAll(".prose a")].filter((anchor) => {
    if (list.contains(anchor)) return false;
    const href = anchor.getAttribute("href") ?? "";
    return /^#(f+n|fn)\d+/i.test(href);
  });
  refs.forEach((anchor, index) => {
    const item = items[index];
    if (!item) return;
    item.id = item.id || noteId(index);
    item.dataset.n = String(index + 1);
    anchor.classList.add("nref");
    anchor.dataset.note = item.id;
    if (!anchor.hasAttribute("aria-expanded")) anchor.setAttribute("aria-expanded", "false");
  });
}

function placeNotes() {
  const wide = window.matchMedia("(min-width: 1100px)").matches;
  root.classList.toggle("sidenotes", wide);
  if (!article) return;
  const items = [...article.querySelectorAll(".endnotes li")];
  if (!wide) {
    items.forEach((item) => {
      item.classList.remove("note");
      (item as HTMLElement).style.top = "";
    });
    return;
  }
  const base = article.getBoundingClientRect().top;
  const blocks = [...article.querySelectorAll(".fig.wide, .shot-row")].map((el) => {
    const top = el.getBoundingClientRect().top - base;
    return { a: top - 18, b: top + (el as HTMLElement).offsetHeight + 18 };
  });
  let floor = 0;
  article.querySelectorAll("a.nref").forEach((ref) => {
    const id = ref.getAttribute("data-note");
    const note = id ? document.getElementById(id) : null;
    if (!note || !article.contains(note)) return;
    note.classList.add("note");
    let y = Math.max(ref.getBoundingClientRect().top - base - 4, floor);
    const height = note.offsetHeight;
    for (const block of blocks) {
      if (y < block.b && y + height > block.a) y = block.b;
    }
    note.style.top = `${y}px`;
    floor = y + height + 14;
  });
}

setupNotes();

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const ref = target.closest("a.nref");
  if (!(ref instanceof HTMLAnchorElement)) return;
  const wide = window.matchMedia("(min-width: 1100px)").matches;
  if (wide) {
    event.preventDefault();
    return;
  }
  const id = ref.dataset.note;
  const note = id ? document.getElementById(id) : null;
  if (!note) return;
  event.preventDefault();
  const host = ref.closest("p, li, blockquote, h2, h3, h4") ?? ref.parentElement;
  if (!host) return;
  const open = host.nextElementSibling?.classList.contains("nbox") && host.nextElementSibling.getAttribute("data-for") === id;
  document.querySelectorAll(".nbox").forEach((box) => box.remove());
  document.querySelectorAll("a.nref[aria-expanded='true']").forEach((node) => node.setAttribute("aria-expanded", "false"));
  if (open) return;
  const box = document.createElement("div");
  box.className = "nbox";
  box.dataset.for = id;
  box.innerHTML = note.innerHTML;
  host.after(box);
  ref.setAttribute("aria-expanded", "true");
});

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    measure();
    placeNotes();
  });
}

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(measure);
}, { passive: true });

let resizeTimer = 0;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(schedule, 120);
});

function settle() {
  requestAnimationFrame(() => requestAnimationFrame(schedule));
}
if (document.fonts?.ready) document.fonts.ready.then(settle);
else settle();
window.addEventListener("load", settle);
