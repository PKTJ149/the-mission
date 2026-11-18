#!/usr/bin/env python3
"""Compare two captured #__nuxt outerHTML files (original vs rebuild) element by element.

Usage: python3 -I dom-diff.py ORIGINAL.html LOCAL.html [--max 40]

Normalisation (things that cannot change what is rendered):
- comments (<!---->) are dropped, whitespace runs in text collapse to one space,
  adjacent text nodes merge;
- style attributes are compared as parsed declarations (order and spacing ignored);
- class order is ignored (reported separately as "class order" only with --order).
Prints the first differences with the element path, then a summary.
"""
import re
import sys
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "path"}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, attrs, parent, []


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs), self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, dict(attrs), self.cur))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        if self.cur.children and isinstance(self.cur.children[-1], str):
            self.cur.children[-1] += data
        else:
            self.cur.children.append(data)


def parse(path):
    b = Builder()
    b.feed(open(path, encoding="utf-8").read())
    return b.root


def norm_children(node):
    out = []
    for c in node.children:
        if isinstance(c, str):
            t = re.sub(r"[ \t\n\r\f]+", " ", c)
            if out and isinstance(out[-1], str):
                out[-1] = re.sub(r" +", " ", out[-1] + t)
            else:
                out.append(t)
        else:
            out.append(c)
    return out


def norm_style(s):
    decl = {}
    for part in s.split(";"):
        if ":" in part:
            k, v = part.split(":", 1)
            decl[k.strip().lower()] = re.sub(r"\s+", " ", v.strip()).replace(", ", ",")
    return decl


def label(node):
    cls = node.attrs.get("class") or ""
    return node.tag + (("#" + node.attrs["id"]) if node.attrs.get("id") else "") + ("." + ".".join(cls.split()[:3]) if cls else "")


def path_of(node):
    p = []
    while node is not None and node.tag != "#root":
        p.append(label(node))
        node = node.parent
    return " > ".join(reversed(p[-6:] if len(p) > 6 else p))[-220:]


diffs = []


def cmp_attrs(a, b):
    out = []
    keys = set(a.attrs) | set(b.attrs)
    for k in sorted(keys):
        va, vb = a.attrs.get(k), b.attrs.get(k)
        if k == "style" and va is not None and vb is not None:
            if norm_style(va) != norm_style(vb):
                out.append(f"style {va!r} != {vb!r}")
        elif k == "class" and va is not None and vb is not None:
            if sorted(va.split()) != sorted(vb.split()):
                out.append(f"class {va!r} != {vb!r}")
        elif va != vb:
            out.append(f"attr {k}: {va!r} != {vb!r}")
    return out


def walk(a, b):
    for d in cmp_attrs(a, b):
        diffs.append(f"{path_of(a)} :: {d}")
    ca, cb = norm_children(a), norm_children(b)
    if len(ca) != len(cb) or any(type(x) is not type(y) for x, y in zip(ca, cb)):
        sa = [x if isinstance(x, str) else "<" + label(x) + ">" for x in ca]
        sb = [x if isinstance(x, str) else "<" + label(x) + ">" for x in cb]
        diffs.append(f"{path_of(a)} :: children differ\n    orig : {sa[:12]}\n    local: {sb[:12]}")
        # still descend into element children pairwise by order
        ea = [x for x in ca if not isinstance(x, str)]
        eb = [x for x in cb if not isinstance(x, str)]
        for x, y in zip(ea, eb):
            if x.tag == y.tag:
                walk(x, y)
        return
    for x, y in zip(ca, cb):
        if isinstance(x, str):
            if x != y:
                diffs.append(f"{path_of(a)} :: text {x!r} != {y!r}")
        elif x.tag != y.tag:
            diffs.append(f"{path_of(a)} :: tag {x.tag} != {y.tag}")
        else:
            walk(x, y)


def main():
    args = sys.argv[1:]
    mx = 40
    if "--max" in args:
        i = args.index("--max")
        mx = int(args[i + 1])
        del args[i : i + 2]
    a, b = parse(args[0]), parse(args[1])
    walk(a, b)
    for d in diffs[:mx]:
        print(d)
    print(f"\n{len(diffs)} difference(s)")


main()
