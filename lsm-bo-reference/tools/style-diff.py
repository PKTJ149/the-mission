#!/usr/bin/env python3
"""Compare two style-dump.js results element by element (same DOM order expected).

Usage: python3 -I style-diff.py ORIGINAL_RESULT LOCAL_RESULT [--max 40]
Each argument is a javascript_tool result file (or a plain text dump). Prints every element whose
geometry (to 0.5 px) or computed style differs, field by field.
"""
import json
import sys

FIELDS = ["el", "rect", "color", "bg", "font", "border", "radius", "shadow", "opacity", "visibility", "align",
          "padding", "margin", "before"]


def load(path):
    text = open(path, encoding="utf-8").read()
    try:
        parts = json.loads(text)
        t = parts[0]["text"]
        cut = t.rfind("\n\n(captured at origin")
        if cut != -1:
            t = t[:cut]
        return json.loads(t)["dump"].split("\n")
    except (ValueError, KeyError, TypeError):
        return text.split("\n")


def close(a, b):
    try:
        return all(abs(float(x) - float(y)) <= 0.5 for x, y in zip(a.split(","), b.split(",")))
    except ValueError:
        return a == b


def main():
    args = sys.argv[1:]
    mx = 40
    if "--max" in args:
        i = args.index("--max")
        mx = int(args[i + 1])
        del args[i:i + 2]
    a, b = load(args[0]), load(args[1])
    print(f"elements: original {len(a)}, local {len(b)}")
    n = 0
    for i, (la, lb) in enumerate(zip(a, b)):
        fa, fb = la.split(" | "), lb.split(" | ")
        bad = []
        for k, (x, y) in enumerate(zip(fa, fb)):
            if FIELDS[k] == "rect":
                if not close(x, y):
                    bad.append(f"rect {x} -> {y}")
            elif x != y:
                bad.append(f"{FIELDS[k]} {x!r} -> {y!r}")
        if bad:
            n += 1
            if n <= mx:
                print(f"#{i} {fa[0][:70]}: " + "; ".join(bad))
    print(f"{n} element(s) differ")


main()
