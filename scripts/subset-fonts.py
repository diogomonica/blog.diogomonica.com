#!/usr/bin/env python3
"""Rebuild the self-hosted faces used by the blog.

Latin files stay byte-for-byte (they already cover Latin, Latin-1, and the
typographic punctuation this site uses, including ó). Latin Extended files are
narrowed to Latin Extended-A (U+0100–017F). Unused EB Garamond 600 italic is
removed. Manrope is instanced at the only weight the nav uses (600).

Requires fonttools and brotli. Not part of the Cloudflare Pages build.
"""

from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts"
EXT_A = "U+0100-017F"

LATIN_EXT = [
    "eb-garamond-latin-ext-400-normal.woff2",
    "eb-garamond-latin-ext-400-italic.woff2",
    "eb-garamond-latin-ext-500-normal.woff2",
    "eb-garamond-latin-ext-500-italic.woff2",
    "eb-garamond-latin-ext-600-normal.woff2",
    "eb-garamond-latin-ext-700-normal.woff2",
    "eb-garamond-latin-ext-700-italic.woff2",
    "source-sans-3-latin-ext-400-normal.woff2",
    "source-sans-3-latin-ext-600-normal.woff2",
]

UNUSED = [
    "eb-garamond-latin-600-italic.woff2",
    "eb-garamond-latin-ext-600-italic.woff2",
    "manrope-latin-wght-normal.v3.woff2",
]


def subset_ext(name: str) -> None:
    src = FONTS / name
    if not src.exists():
        raise SystemExit(f"missing {src}")
    from fontTools.subset import Subsetter, Options

    font = TTFont(src)
    options = Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.desubroutinize = True
    options.flavor = "woff2"
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=range(0x0100, 0x0180))
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(src)
    print(f"{name} -> {src.stat().st_size}")


def instance_manrope() -> None:
    src = FONTS / "manrope-latin-wght-normal.v3.woff2"
    out = FONTS / "manrope-latin-600-normal.woff2"
    font = TTFont(src)
    instantiateVariableFont(font, {"wght": 600}, inplace=True, updateFontNames=True)
    font.flavor = "woff2"
    font.save(out)
    print(f"manrope-latin-600-normal.woff2 -> {out.stat().st_size}")


def main() -> None:
    for name in LATIN_EXT:
        subset_ext(name)
    if (FONTS / "manrope-latin-wght-normal.v3.woff2").exists() and not (
        FONTS / "manrope-latin-600-normal.woff2"
    ).exists():
        instance_manrope()
    elif not (FONTS / "manrope-latin-600-normal.woff2").exists():
        raise SystemExit("Manrope source is already gone and the 600 instance is missing")
    for name in UNUSED:
        path = FONTS / name
        if path.exists():
            path.unlink()
            print(f"removed {name}")


if __name__ == "__main__":
    main()
