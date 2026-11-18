#!/usr/bin/env python3
"""Recover the exact <style> tags of the live LSM page from its downloaded Nuxt bundles.

The page is a Nuxt 2 SPA: vue-style-loader injects each CSS module as a <style> tag at runtime, so the CSS
only exists as JS string literals inside /_nuxt/*.js. This script reads every string literal in the bundles
(never runs them), hashes each one and matches the hashes the live page reported for its <style> tags
(SHA-256, first 16 hex chars, in document order).

Usage: python3 -I extract-css.py BUNDLE_DIR HASHES_FILE OUT_DIR
  HASHES_FILE: one "index hash" per line, in <style> order.
Writes OUT_DIR/NN-<hash>.css for every match and prints what is missing.
"""
import hashlib
import json
import os
import sys


def js_strings(src):
    """Yield the decoded value of every '…' / "…" string literal in JS source (no template literals)."""
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if c in "\"'":
            quote, j, buf = c, i + 1, []
            while j < n and src[j] != quote:
                if src[j] == "\\" and j + 1 < n:
                    e = src[j + 1]
                    if e == "n":
                        buf.append("\n"); j += 2
                    elif e == "t":
                        buf.append("\t"); j += 2
                    elif e == "r":
                        buf.append("\r"); j += 2
                    elif e == "u" and src[j + 2:j + 3] == "{":
                        end = src.index("}", j)
                        buf.append(chr(int(src[j + 3:end], 16))); j = end + 1
                    elif e == "u":
                        buf.append(chr(int(src[j + 2:j + 6], 16))); j += 6
                    elif e == "x":
                        buf.append(chr(int(src[j + 2:j + 4], 16))); j += 4
                    elif e == "\n":
                        j += 2
                    else:
                        buf.append(e); j += 2
                elif src[j] == "\n":
                    break  # not a string (e.g. a quote inside a regex); resync
                else:
                    buf.append(src[j]); j += 1
            if j < n and src[j] == quote:
                yield "".join(buf)
                i = j + 1
                continue
            i += 1
            continue
        if c == "/" and src[i + 1:i + 2] == "/":
            nl = src.find("\n", i)
            i = n if nl < 0 else nl
            continue
        if c == "/" and src[i + 1:i + 2] == "*":
            end = src.find("*/", i + 2)
            i = n if end < 0 else end + 2
            continue
        i += 1


def css_module_strings(src):
    """Yield CSS module texts: css-loader emits n.push([t.i,"<css>",""]). Parse only the string that
    starts right after each `.i,` (a full-file tokenizer desyncs on regex literals in minified code).
    String pieces joined with + (url() of bundled fonts/images) are kept with a {{EXPR}} marker."""
    start = 0
    while True:
        k = src.find(".i,", start)
        if k < 0:
            return
        start = k + 3
        q = src[start:start + 1]
        if q not in "\"'" or not q:
            continue
        parts, j = [], start
        while True:
            value, j = read_string(src, j)
            parts.append(value)
            if src[j:j + 1] != "+":
                break
            # "...url("+o+")..." : skip the expression up to the next +"
            nxt = src.find("+", j + 1)
            if nxt < 0 or src[nxt + 1:nxt + 2] not in "\"'":
                break
            parts.append("{{EXPR:" + src[j + 1:nxt] + "}}")
            j = nxt + 1
        yield "".join(parts)


def read_string(src, i):
    quote, j, buf = src[i], i + 1, []
    n = len(src)
    while j < n and src[j] != quote:
        if src[j] == "\\" and j + 1 < n:
            e = src[j + 1]
            if e == "n":
                buf.append("\n"); j += 2
            elif e == "t":
                buf.append("\t"); j += 2
            elif e == "r":
                buf.append("\r"); j += 2
            elif e == "u":
                buf.append(chr(int(src[j + 2:j + 6], 16))); j += 6
            elif e == "x":
                buf.append(chr(int(src[j + 2:j + 4], 16))); j += 4
            else:
                buf.append(e); j += 2
        else:
            buf.append(src[j]); j += 1
    return "".join(buf), j + 1


def fix_surrogates(s):
    # JS strings are UTF-16: join 😀-style pairs into one character before encoding
    return s.encode("utf-16", "surrogatepass").decode("utf-16")


def main():
    bundle_dir, hashes_file, out_dir = sys.argv[1:4]
    wanted = {}
    for line in open(hashes_file, encoding="utf-8"):
        if line.strip():
            idx, h = line.split()[:2]
            wanted[h] = int(idx)
    os.makedirs(out_dir, exist_ok=True)
    found = {}
    for name in sorted(os.listdir(bundle_dir)):
        if not name.endswith(".js"):
            continue
        src = open(os.path.join(bundle_dir, name), encoding="utf-8", errors="surrogatepass").read()
        for s in css_module_strings(src):
            if "{" not in s:
                continue
            if "{{EXPR:" in s:
                with open(os.path.join(out_dir, f"_concat-{name}-{len(s)}.txt"), "w", encoding="utf-8") as f:
                    f.write(s)
                continue
            try:
                text = fix_surrogates(s)
            except UnicodeError:
                text = s
            h = hashlib.sha256(text.encode("utf-8", "surrogatepass")).hexdigest()[:16]
            if h in wanted and h not in found:
                found[h] = name
                with open(os.path.join(out_dir, f"{wanted[h]:02d}-{h}.css"), "w", encoding="utf-8") as f:
                    f.write(text)
    missing = sorted((i, h) for h, i in wanted.items() if h not in found)
    print(json.dumps({"matched": len(found), "wanted": len(wanted), "missing": missing}))


if __name__ == "__main__":
    main()
