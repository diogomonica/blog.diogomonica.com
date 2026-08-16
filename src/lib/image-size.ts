import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ImageSize = {
  width: number;
  height: number;
};

const cache = new Map<string, ImageSize>();

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function pngSize(data: Buffer): ImageSize | null {
  if (data.length < 24 || !data.subarray(0, 8).equals(PNG_SIG)) return null;
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

function jpegSize(data: Buffer): ImageSize | null {
  if (data.length < 4 || data[0] !== 0xff || data[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 8 < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = data[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }

    const segmentLength = data.readUInt16BE(offset + 2);
    if (segmentLength < 2) break;

    const isSOF =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isSOF && segmentLength >= 7) {
      return {
        height: data.readUInt16BE(offset + 5),
        width: data.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + segmentLength;
  }

  return null;
}

/** Intrinsic pixel size of a file under `public/`. Does not invent dimensions. */
export function readPublicImageSize(src: string): ImageSize {
  const cached = cache.get(src);
  if (cached) return cached;

  const abs = join(process.cwd(), "public", src.replace(/^\//, ""));
  const data = readFileSync(abs);
  const size = pngSize(data) ?? jpegSize(data);
  if (!size || size.width < 1 || size.height < 1) {
    throw new Error(`Could not read image dimensions for ${src}`);
  }

  cache.set(src, size);
  return size;
}
