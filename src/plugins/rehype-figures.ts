import { readPublicImageSize } from "../lib/image-size";
import { IMAGE_SIZES, formatSrcset, variantList, type ImageLayout } from "../lib/responsive-image";

type Text = { type: "text"; value: string };
type Element = {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: Content[];
};
type Content = Element | Text | { type: string; value?: string; children?: Content[] };
type Root = { type: "root"; children: Content[] };

function isElement(node: Content | undefined, tag?: string): node is Element {
  return !!node && node.type === "element" && (!tag || (node as Element).tagName === tag);
}

function classNames(element: Element): string[] {
  const properties = element.properties ?? {};
  const value = properties.className ?? properties.class;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

function nextContent(children: Content[], index: number): { node: Content; index: number } | null {
  for (let cursor = index + 1; cursor < children.length; cursor += 1) {
    const node = children[cursor];
    if (node.type === "text" && !(node.value ?? "").trim()) continue;
    return { node, index: cursor };
  }
  return null;
}

function addClass(element: Element, name: string) {
  const names = classNames(element);
  if (!names.includes(name)) names.push(name);
  element.properties.className = names;
}

function textOf(node: Content): string {
  if (node.type === "text") return node.value ?? "";
  if ("children" in node && node.children) return node.children.map(textOf).join("");
  return "";
}

function significant(children: Content[]): Content[] {
  return children.filter((node) => !(node.type === "text" && !(node.value ?? "").trim()));
}

function imageElement(paragraph: Element): Element | null {
  const nodes = significant(paragraph.children);
  if (nodes.length !== 1) return null;
  const only = nodes[0];
  if (isElement(only, "img")) return only;
  if (isElement(only, "a")) {
    const inner = significant(only.children);
    if (inner.length === 1 && isElement(inner[0], "img")) return inner[0];
  }
  return null;
}

function captionParagraph(node: Content | undefined): Element | null {
  if (!isElement(node, "p")) return null;
  const nodes = significant(node.children);
  if (nodes.length !== 1 || !isElement(nodes[0], "em")) return null;
  const text = textOf(node).trim();
  if (!text || text.length > 360) return null;
  return node;
}

function localSize(src: string): { width: number; height: number } | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  try {
    return readPublicImageSize(src);
  } catch {
    return null;
  }
}

let eagerLeft = true;

function layoutFor(size: { width: number; height: number } | null, inPair: boolean): ImageLayout {
  if (inPair) return "pair";
  if (!size) return "column";
  const ratio = size.width / size.height;
  if (size.width >= 720 && ratio >= 1.45) return "wide";
  if (size.height > size.width * 1.05 && size.width <= 760) return "portrait";
  return "column";
}

function withPicture(img: Element, layout: ImageLayout) {
  const src = typeof img.properties.src === "string" ? img.properties.src : "";
  const list = src ? variantList(src, "full") : [];
  const avif = formatSrcset(list, "avif");
  const webp = formatSrcset(list, "webp");
  if (!avif && !webp) return img;
  const sizes = IMAGE_SIZES[layout];
  const sources: Element[] = [];
  if (avif) {
    sources.push({
      type: "element",
      tagName: "source",
      properties: { type: "image/avif", srcSet: avif, sizes },
      children: [],
    });
  }
  if (webp) {
    sources.push({
      type: "element",
      tagName: "source",
      properties: { type: "image/webp", srcSet: webp, sizes },
      children: [],
    });
  }
  return {
    type: "element" as const,
    tagName: "picture",
    properties: {},
    children: [...sources, img],
  };
}

function decorateImage(img: Element, classPair: boolean, layoutPair: boolean) {
  const src = typeof img.properties.src === "string" ? img.properties.src : "";
  const alt = typeof img.properties.alt === "string" ? img.properties.alt.trim() : "";
  const size = src ? localSize(src) : null;
  if (size && img.properties.width == null) img.properties.width = size.width;
  if (size && img.properties.height == null) img.properties.height = size.height;
  if (img.properties.decoding == null) img.properties.decoding = "async";
  if (img.properties.loading == null) {
    const eager = eagerLeft;
    img.properties.loading = eager ? "eager" : "lazy";
    if (eager) img.properties.fetchPriority = "high";
    eagerLeft = false;
  }

  const classes = ["fig", "plate"];
  const natural = layoutFor(size, false);
  if (!classPair && natural === "wide") classes.push("wide");
  else if (!classPair && natural === "portrait") classes.push("portrait");
  return { alt, classes, layout: layoutPair ? "pair" : natural };
}

function rawHtml(node: Content): string {
  if (node.type !== "raw") return "";
  const value = (node as { value?: string }).value;
  return typeof value === "string" ? value : "";
}

function transform(parent: { children: Content[] }, inPair: boolean) {
  const nextChildren: Content[] = [];
  const children = parent.children;
  let rawShotRow = false;
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const raw = rawHtml(child);
    if (raw) {
      if (/<div\b[^>]*\bshot-row\b/i.test(raw) && !/<\/div>/i.test(raw)) rawShotRow = true;
      else if (/<\/div>/i.test(raw)) rawShotRow = false;
    }
    if (!isElement(child)) {
      nextChildren.push(child);
      continue;
    }

    const pair = inPair || classNames(child).includes("shot-row");
    transform(child, pair);

    if (!isElement(child, "p")) {
      nextChildren.push(child);
      continue;
    }

    const image = imageElement(child);
    if (!image) {
      nextChildren.push(child);
      continue;
    }

    const { alt, classes, layout } = decorateImage(image, pair, pair || rawShotRow);
    const picture = withPicture(image, layout);
    if (picture !== image) {
      const direct = child.children.indexOf(image);
      if (direct >= 0) child.children[direct] = picture;
      else {
        for (const node of child.children) {
          if (!isElement(node)) continue;
          const at = node.children.indexOf(image);
          if (at >= 0) {
            node.children[at] = picture;
            break;
          }
        }
      }
    }
    const figure: Element = {
      type: "element",
      tagName: "figure",
      properties: { className: classes },
      children: significant(child.children).filter((node) => isElement(node)),
    };

    const following = nextContent(children, index);
    const caption = captionParagraph(following?.node);
    if (caption && following) {
      const em = significant(caption.children)[0];
      figure.children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: isElement(em) ? em.children : caption.children,
      });
      index = following.index;
    } else if (alt) {
      figure.children.push({
        type: "element",
        tagName: "figcaption",
        properties: { ariaHidden: "true" },
        children: [{ type: "text", value: alt }],
      });
    }

    nextChildren.push(figure);
  }
  parent.children = nextChildren;
}

function markOpening(nodes: Content[]) {
  let skippedDek = false;
  for (const node of nodes) {
    if (!isElement(node, "p")) continue;
    const text = textOf(node).trim();
    if (!text) continue;
    const nodesIn = significant(node.children);
    const fullyEmphasized = nodesIn.length === 1 && isElement(nodesIn[0], "em");
    if (!skippedDek && fullyEmphasized && text.length < 280) {
      addClass(node, "dek");
      skippedDek = true;
      continue;
    }
    if (text.length < 40) continue;
    if (/^\p{L}/u.test(text)) addClass(node, "lede");
    else addClass(node, "ni");
    return;
  }
}

export default function rehypeFigures() {
  return (tree: Root) => {
    eagerLeft = true;
    transform(tree, false);
    markOpening(tree.children);
  };
}
