#!/usr/bin/env python3
"""Compare two same-size screenshots (staging vs local) and list the regions that differ.

Usage:
  python3 -I shot-diff.py STAGING.jpg LOCAL.jpg OUT_PREFIX [--css-width 1704] [--scroll-y 0]
         [--threshold 40] [--cell 6] [--min-hits 4] [--ignore x0,y0,x1,y1 ...]

- Both screenshots must be taken at the same window size, zoom and scroll position.
- Coordinates in the output are given in screenshot pixels AND in CSS pixels of the page
  (css = img * css_width / img_width; css_y adds --scroll-y), so you can feed them to
  document.elementsFromPoint() on both tabs.
- --ignore takes CSS-pixel boxes (viewport coords) to skip, e.g. a live clock.
- Writes OUT_PREFIX.png: [staging | local | diff heat-map] with numbered red boxes.
- Prints a JSON summary to stdout.
"""
import json
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw


def parse_args(argv):
    if len(argv) < 4:
        print(__doc__)
        sys.exit(2)
    opts = {
        "a": argv[1], "b": argv[2], "out": argv[3],
        "css_width": 1704.0, "scroll_y": 0.0,
        "threshold": 40, "cell": 6, "min_hits": 4, "ignore": [],
    }
    i = 4
    while i < len(argv):
        key = argv[i]
        if key == "--ignore":
            i += 1
            while i < len(argv) and not argv[i].startswith("--"):
                opts["ignore"].append([float(v) for v in argv[i].split(",")])
                i += 1
            continue
        val = argv[i + 1]
        name = key.lstrip("-").replace("-", "_")
        opts[name] = float(val) if name in ("css_width", "scroll_y") else int(val)
        i += 2
    return opts


def components(grid):
    """4-connected components of a boolean 2D grid -> list of (r0, c0, r1, c1, cells)."""
    rows, cols = grid.shape
    seen = np.zeros_like(grid, dtype=bool)
    out = []
    for r in range(rows):
        for c in range(cols):
            if not grid[r, c] or seen[r, c]:
                continue
            q = deque([(r, c)])
            seen[r, c] = True
            r0 = r1 = r
            c0 = c1 = c
            n = 0
            while q:
                y, x = q.popleft()
                n += 1
                r0, r1, c0, c1 = min(r0, y), max(r1, y), min(c0, x), max(c1, x)
                # 8-neighbourhood plus a 1-cell gap bridge so text lines merge into one box
                for dy in (-2, -1, 0, 1, 2):
                    for dx in (-2, -1, 0, 1, 2):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < rows and 0 <= nx < cols and grid[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
            out.append((r0, c0, r1, c1, n))
    return out


def main():
    o = parse_args(sys.argv)
    a = Image.open(o["a"]).convert("RGB")
    b = Image.open(o["b"]).convert("RGB")
    w = min(a.width, b.width)
    h = min(a.height, b.height)
    size_note = None
    if a.size != b.size:
        size_note = f"sizes differ: staging {a.size} vs local {b.size}; compared top-left {w}x{h}"
    a = a.crop((0, 0, w, h))
    b = b.crop((0, 0, w, h))
    A = np.asarray(a).astype(np.int16)
    B = np.asarray(b).astype(np.int16)
    d = np.abs(A - B).max(axis=2)
    hit = d > o["threshold"]

    scale = o["css_width"] / w  # css px per screenshot px
    for x0, y0, x1, y1 in o["ignore"]:
        hit[int(y0 / scale):int(y1 / scale) + 1, int(x0 / scale):int(x1 / scale) + 1] = False

    cell = o["cell"]
    rows, cols = h // cell, w // cell
    counts = hit[: rows * cell, : cols * cell].reshape(rows, cell, cols, cell).sum(axis=(1, 3))
    grid = counts >= o["min_hits"]

    regions = []
    for r0, c0, r1, c1, n in components(grid):
        x0, y0, x1, y1 = c0 * cell, r0 * cell, (c1 + 1) * cell, (r1 + 1) * cell
        patch = d[y0:y1, x0:x1]
        regions.append({
            "img": [x0, y0, x1, y1],
            "css": [round(x0 * scale), round(y0 * scale + o["scroll_y"]),
                    round(x1 * scale), round(y1 * scale + o["scroll_y"])],
            "css_center_viewport": [round((x0 + x1) / 2 * scale), round((y0 + y1) / 2 * scale)],
            "cells": int(n),
            "mean_diff": round(float(patch.mean()), 1),
        })
    regions.sort(key=lambda r: (r["img"][1], r["img"][0]))
    for i, r in enumerate(regions, 1):
        r["id"] = i

    # Composite: staging | local | heat-map, with numbered boxes on all three
    heat = np.zeros((h, w, 3), dtype=np.uint8)
    heat[..., 0] = np.clip(d * 3, 0, 255).astype(np.uint8)
    base = (np.asarray(a).astype(np.float32) * 0.25).astype(np.uint8)
    heat = np.maximum(heat, base)
    comp = Image.new("RGB", (w * 3 + 20, h), (40, 40, 40))
    comp.paste(a, (0, 0))
    comp.paste(b, (w + 10, 0))
    comp.paste(Image.fromarray(heat), (w * 2 + 20, 0))
    draw = ImageDraw.Draw(comp)
    for r in regions:
        x0, y0, x1, y1 = r["img"]
        for off in (0, w + 10, w * 2 + 20):
            draw.rectangle([x0 + off - 1, y0 - 1, x1 + off + 1, y1 + 1], outline=(255, 40, 40), width=2)
            draw.text((x0 + off + 2, max(0, y0 - 11)), str(r["id"]), fill=(255, 255, 0))
    comp.save(o["out"] + ".png")

    summary = {
        "composite": o["out"] + ".png",
        "img_size": [w, h],
        "css_per_img_px": round(scale, 4),
        "diff_pixels": int(hit.sum()),
        "regions": regions,
    }
    if size_note:
        summary["note"] = size_note
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
