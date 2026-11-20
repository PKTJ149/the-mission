"""Put a game screen into PK's tilted iPhone mockup (assets/mockup/iphone-tilt.webp).

Usage:  python3 -I tools/phone_mockup.py <game.png> <out.png>
Run from sale-video/. The mockup's screen is transparent; this finds its four edges,
warps the game screen (with an iOS status bar on top) onto them, and lays the phone over it.
"""
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent.parent
MOCKUP = HERE / "assets/mockup/iphone-tilt.webp"
FONT = HERE / "assets/fonts/IBMPlexSansThai-SemiBold.ttf"


def screen_mask(alpha):
    """Transparent pixels connected to the middle of the phone = the screen."""
    h, w = alpha.shape
    free = alpha < 40
    seed = (h * 2 // 5, w // 2)
    mask = np.zeros_like(free)
    mask[seed] = True
    q = deque([seed])
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and free[ny, nx] and not mask[ny, nx]:
                mask[ny, nx] = True
                q.append((ny, nx))
    return mask


def fit(xs, ys):
    """Least-squares line ys = a*xs + b."""
    a, b = np.polyfit(xs, ys, 1)
    return a, b


def corners(mask):
    """Fit the 4 straight edges on their middle parts (away from the rounded corners) and intersect."""
    ys, xs = np.nonzero(mask)
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    rows = np.arange(y0 + (y1 - y0) // 4, y1 - (y1 - y0) // 4)
    left = np.array([np.nonzero(mask[r])[0].min() for r in rows])
    right = np.array([np.nonzero(mask[r])[0].max() for r in rows])
    aL, bL = fit(rows, left)    # x = aL*y + bL
    aR, bR = fit(rows, right)
    # top / bottom: use columns around the middle of each edge
    cols = np.arange(x0 + (x1 - x0) * 2 // 5, x1 - (x1 - x0) * 2 // 5)
    top = np.array([np.nonzero(mask[:, c])[0].min() for c in cols])
    aT, bT = fit(cols, top)     # y = aT*x + bT
    cols_b = np.arange(x0 + (x1 - x0) // 4, x0 + (x1 - x0) // 2)
    bot = np.array([np.nonzero(mask[:, c])[0].max() for c in cols_b])
    aB, bB = fit(cols_b, bot)

    def meet(av, bv, ah, bh):  # x = av*y + bv  and  y = ah*x + bh
        y = (ah * bv + bh) / (1 - ah * av)
        return (av * y + bv, y)

    return [meet(aL, bL, aT, bT), meet(aR, bR, aT, bT), meet(aR, bR, aB, bB), meet(aL, bL, aB, bB)]


def perspective_coeffs(dst, src):
    """Coefficients for Image.transform(PERSPECTIVE): maps output (dst) points to input (src) points."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def screen_with_status_bar(game):
    """Game screen with an iOS status bar above it (the Figma screens start at their own top bar)."""
    w, h = game.size
    bar = round(h * 54 / 932)
    out = Image.new("RGB", (w, h), "black")
    out.paste(game.convert("RGB").crop((0, 0, w, h - bar)), (0, bar))
    d = ImageDraw.Draw(out)
    s = w / 430
    f = ImageFont.truetype(str(FONT), round(17 * s))
    d.text((round(52 * s), round(17 * s)), "9:41", font=f, fill="white")
    x = w - round(118 * s)
    for i, bh in enumerate((4, 6, 8, 10)):  # signal bars
        d.rounded_rectangle((x + i * 5 * s, (30 - bh) * s, x + i * 5 * s + 3 * s, 30 * s), radius=s, fill="white")
    bx = w - round(52 * s)  # battery
    d.rounded_rectangle((bx, 20 * s, bx + 25 * s, 32 * s), radius=3 * s, outline=(170, 170, 170), width=max(1, round(s)))
    d.rounded_rectangle((bx + 2 * s, 22 * s, bx + 19 * s, 30 * s), radius=2 * s, fill="white")
    return out


def main(game_path, out_path):
    phone = Image.open(MOCKUP).convert("RGBA")
    mask = screen_mask(np.array(phone)[:, :, 3])
    quad = corners(mask)
    scr = screen_with_status_bar(Image.open(game_path))
    w, h = scr.size
    coeffs = perspective_coeffs(quad, [(0, 0), (w, 0), (w, h), (0, h)])
    warped = scr.transform(phone.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    # 1 px grow of the mask so no gap shows under the bezel
    m = Image.fromarray((mask * 255).astype("uint8")).filter(__import__("PIL.ImageFilter", fromlist=["x"]).MaxFilter(3))
    out = Image.new("RGBA", phone.size, (0, 0, 0, 0))
    out.paste(warped, (0, 0), m)
    out.alpha_composite(phone)
    out.save(out_path)
    print(out_path, [tuple(round(v) for v in p) for p in quad])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
