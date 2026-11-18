#!/usr/bin/env python3
"""Read a saved javascript_tool result file (JSON array of {type,text}) and print/save the returned value.

Usage: python3 -I tool-result.py RESULT_FILE [KEY OUT_FILE ...]
- Without KEY/OUT pairs: prints the top-level keys and short previews.
- With pairs: writes value[KEY] (string as-is, anything else as pretty JSON) to OUT_FILE
  and checks value['sha'] (SHA-256 of value['html']) when KEY is 'html'.
"""
import hashlib
import json
import sys


def load(path):
    parts = json.load(open(path, encoding="utf-8"))
    text = parts[0]["text"]
    # The tool appends "\n\n(captured at origin …)" after the JSON value.
    cut = text.rfind("\n\n(captured at origin")
    if cut != -1:
        text = text[:cut]
    return json.loads(text)


def main():
    value = load(sys.argv[1])
    pairs = sys.argv[2:]
    if not pairs:
        for k, v in value.items():
            print(k, "=>", (v if isinstance(v, str) else json.dumps(v, ensure_ascii=False))[:300])
        return
    for key, out in zip(pairs[::2], pairs[1::2]):
        v = value[key]
        data = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False, indent=2)
        with open(out, "w", encoding="utf-8") as f:
            f.write(data)
        msg = f"wrote {out} ({len(data)} chars)"
        if key == "html" and "sha" in value:
            ok = hashlib.sha256(v.encode("utf-8")).hexdigest() == value["sha"]
            msg += " sha " + ("OK" if ok else "MISMATCH")
        print(msg)


main()
