# Minigames sales video: game assets needed

For the A + B storyline in `STORYLINES.md`, made as a vertical 9:16 video (1080x1920).
Revised 19-11-2026 after PK shared 3 sample games (treasure chest, Valentine heart box, boxing gloves).
Revised 20-11-2026 after PK shared the full library in Figma (see "Library inventory" below).

## What a "game" is in this video
Each sample game is a whole themed player screen, not just an item:
- a themed **background** (underwater, rose garden, boxing gym)
- the **item** in 3 stages: on the grid (before pick) → enlarged on a blurred screen (on pick) → opened with the prize (result)
- **theme colours** on the counters, history header and buttons (teal, pink, gold)
- optionally a **different item per choice** (boxing: red / black / blue gloves)

The video shows these real player screens full-frame, so the theme change (background + items + colours) is the hero.

## Easiest way: the Figma link
Send the Figma link (file or page) that holds all the sample games. From it, the parts below are pulled per game:
1. The 3 screens: grid, selected, result (e.g. "iPhone 14 & 15 Pro Max - 44 / 47 / 48").
2. The separate layers inside them: background, item images per stage, the colours used.

If the Figma layers are flattened (one image per screen), say so; then the separate parts below are needed as files.

## If sending files instead
One folder per game in `sale-video/assets/games/`, for example `02-valentine-heart-box/`:
- `background.png`: the mobile background without UI, at its full design size
- `item-1-before.png`, `item-2-select.png` (or `.gif`), `item-3-result.png`: transparent PNG, at least 1200 px on the long side
- If choices use different items: `item-a-1-before.png`, `item-b-1-before.png` and so on
- `colours.txt`: the theme colour hex codes (counter border, history header, button)
- `screen-1-grid.png`, `screen-2-select.png`, `screen-3-result.png`: the full screens as exported from Figma, for reference

For a wheel game: `wheel-face.png` (the part that spins), `wheel-frame.png` (rim and pointer), `wheel-button.png`, plus the background and colours.

## Which games
**All sample games in the library.** Every one appears in the "wall of games" shot, The wall headline is "สร้างสรรค์เกม ได้หลากหลาย ดั่งใจนึก" (PK, 20-11-2026); no count is shown.

From them, 9 play on screen. Proposed picks from the library (20-11-2026, not yet confirmed by PK):

| Role | Need | Pick from the library | Why |
|---|---|---|---|
| Hook 1 | a mystery box game | กล่องสุ่มลุ้นล้าน (gold gift boxes) | The three hook games share the black-and-gold look, so they read as "the usual games every site has" and the match cuts stay smooth |
| Hook 2 | a card flip game | ไพ่ปริศนาลุ้นล้าน (gold cards) | Same look as hook 1 |
| Hook 3 | a lucky wheel game | วงล้อนำโชค, gold colourway | Same look as hook 1 |
| Year stop 1 | Chinese New Year | ถุงทองเงินล้าน (red money pouch) | Also the end screen of the transform (beat 4) |
| Year stop 2 | Valentine's Day | ดวงใจลุ้นโชค (heart box) | |
| Year stop 3 | Songkran | สาดน้ำรับทรัพย์ (silver water bowl) | |
| Year stop 4 | Halloween | หีบสมบัติผีให้โชค (pumpkin chest) | PK, 20-11-2026: replaces the purple wheel, so all 6 stops share the same 3 x 3 grid layout and show a real game title |
| Year stop 5 | Loy Krathong | กระทงเสี่ยงทาย (krathong) | |
| Year stop 6 | Christmas | ของขวัญจากซานต้า (chest by the fireplace) | |

Each stop is a different item on the same 3 x 3 grid (pouch, heart box, bowl, pumpkin chest, krathong, fireplace chest): the layout holds, the theme changes. That is the point of the shot, and it answers the risk in `STORYLINES.md` that festivals read as "just new colours".
On screen: the festival name in the caption band; the game's own title is on its screen.
Spare festival games if PK prefers: อั่งเปาร้อยล้าน and ดอกไม้ไฟนำโชค (both fit Chinese New Year or New Year), หมัดเด็ด ลุ้นวย (boxing season).

PK's notes (20-11-2026):
- Use every game, including หีบร้อยล้าน (the underwater chest). Its screens 2 and 3 are unfinished in Figma; the video rebuilds them from the game's own art (the item from screen 1 on a 3 x 3 grid, the enlarged chest from screen 4). The Figma file is not edited. (Claude's call, as PK allowed.)
- Game names come from the title at the top of each play screen.
- No screen shows "AUTO FAST". PK sends the end-card logo separately.
- Each game is 4 frames side by side. The first frame of each game can serve as its cover wherever many games show at once (the wall of games, the festival run).

## Library inventory (Figma, 20-11-2026)
File `kHa9WnKLn6dOYLMnRiJ4Cv`, "Section 2" (node `1:651`). All screens are iPhone Pro Max size (430 x 932 or 430 x 944).
Game names are the title at the top of each play screen (PK, 20-11-2026), read from the Figma text layers. The canvas labels above each row are only rough theme notes (for example the label above ไพ่ปริศนาลุ้นล้าน reads "ไพ่ลุ้นล้าน"). The balloon game and 6 of the 7 wheels still carry the template title "Let's Goal !" (checked on the screen render), so they have no real name yet; they are described by what they show.

**Pick-and-reveal games: 20.** Each has 4 screens: intro (the cover), 3 x 3 grid, picked item enlarged on a blurred screen, result. Node IDs are listed left to right; the first is the cover.

| # | Game (title on screen) | Theme | Screens (node IDs) |
|---|---|---|---|
| 1 | หีบร้อยล้าน | underwater chest with a pearl, teal | 9:15403, 1:652, 9:15873, 9:16088 (screens 2 and 3 are unfinished; rebuilt in the video) |
| 2 | หมุนปั๊บรับโชค | neon claw machine, star capsules, purple | 9:18491, 1:739, 1:1333, 1:1774 |
| 3 | ดวงดาวนำทาง | planets, dark blue | 9:16699, 1:816, 1:1412, 1:1899 |
| 4 | กระทงเสี่ยงทาย | Loy Krathong, krathong on night water | 9:18711, 1:893, 1:1491, 1:2024 |
| 5 | สาดน้ำรับทรัพย์ | Songkran, silver water bowl, teal | 9:17167, 1:970, 1:1570, 9:17639 |
| 6 | กล่องขนมให้โชค | cupcake houses on clouds, lilac | 9:18932, 1:2614, 9:19263, 9:19468 |
| 7 | ของขวัญจากซานต้า | Christmas, chest by the fireplace | 9:20208, 1:2691, 1:3467, 1:4145 |
| 8 | หมัดเด็ด ลุ้นวย | boxing gloves in red, black and blue | 9:20433, 1:3127, 1:3783, 1:4645 (title as written in Figma; "ลุ้นวย" may be a typo of "ลุ้นรวย") |
| 9 | หีบสมบัติผีให้โชค | Halloween, pumpkin chest | 9:20662, 1:2778, 1:3546, 1:4270 |
| 10 | ลูกกวาดเสี่ยงโชค | pink candy jars | 9:21494, 1:3214, 1:3862, 1:4770 |
| 11 | ถุงทองเงินล้าน | Chinese New Year, red money pouch | 9:21274, 1:2865, 1:3625, 1:4395 |
| 12 | ผลไม้วัดดวง | fruit basket, green | 9:21721 and 9:21942 (two intro screens on top of each other), 1:3301, 1:3941, 1:4895 |
| 13 | ดวงใจลุ้นโชค | Valentine, heart box, pink | 9:22378, 1:2952, 1:3704, 1:4520 |
| 14 | ดอกไม้ไฟนำโชค | fireworks rockets, night sky | 9:22605, 8:12001, 8:12631, 8:12871 |
| 15 | ไข่ทองคำนำโชค | gold eggs in a dark forest | 9:22878, 1:3039, 2:17048, 2:17415 |
| 16 | (no name: "Let's Goal !") | blue and yellow balloons, circus tent | 11:26488, 11:25353, 11:25512, 11:25674 |
| 17 | อั่งเปาร้อยล้าน | red envelopes | 9:23318, 2:18508, 2:18835, 2:19077 |
| 18 | รถด่วนขบวนร้อยล้าน | steam train in a snowy forest | 10:24350, 9:24057, 10:24589, 10:24813 |
| 19 | ไพ่ปริศนาลุ้นล้าน | gold cards, black | 9:23597, 9:13656, 9:14305, 9:14687 |
| 20 | กล่องสุ่มลุ้นล้าน | gold gift boxes with balloons, black | 11:29353, 11:26812, 11:28738, 11:26878 |

**Wheels: 7.** Each is one player screen plus the wheel as a separate image (useful for spinning it).

| # | Game (title on screen) | Theme | Screen + wheel image (node IDs) |
|---|---|---|---|
| 21 | วงล้อนำโชค, gold | gold rim with bulbs, black | 11:27729 + 11:29573 |
| 22 | (no name: "Let's Goal !") | the same wheel in blue | 11:27360 + 11:29890 |
| 23 | (no name: "Let's Goal !") | the same wheel in pink | 11:26991 + 11:30207 |
| 24 | (no name: "Let's Goal !"; canvas label โซดาผลไม้) | fruit slices, teal | 1:1047 + 1:1115 |
| 25 | (no name: "Let's Goal !") | Thai temple fair: lanterns, Ferris wheel, red and teal | 1:1116 + 1:2309 |
| 26 | (no name: "Let's Goal !") | green and gold wheel with sunflowers and honey | 1:1184 + 1:1252 |
| 27 | (no name: "Let's Goal !") | purple wheel with pumpkins, bats and a witch hat | 1:5029 + 1:5097 |

Figma count: 27 themed games (20 pick-and-reveal, 7 wheels).

**PK's extra games (20-11-2026):** 18 more 3 x 3 grid screens in `~/Desktop/workbitch /minigame /minigames tyheme/` (474 x 1024 px, about 1x). PK confirmed they are real games in the system and count toward the total. 16 are copied to `sale-video/assets/games/extra/` (git-ignored):
กล่องของขวัญคริสต์มาสให้โชค (x162), lantern-street chest (x163) and neon chest (x164) (both titled "หีบสมบัติผีให้โชค" on screen, likely a template title), Songkran bowls with water guns (x165), โหลสลากนำโชคงานวัด (x166), มะพร้าวอ่อนนำโชค (x167), ปิ่นโตเจนำโชค (x168), อุปกรณ์อวกาศนำโชค (x169), ผลไม้ตลาดน้ำนำโชค (x170), ของขวัญวันเด็กนำโชค (x172), เหมืองเพชรนำโชค (x173), ซูชินำโชค (x174), เซียมซีนำโชค (x175), เหมียวเหมียวนำโชค (x176), เอเลี่ยนนำโชค (x177), รถแข่งนำโชค (x181).
Left out (Claude's call, PK may overrule): พรีเมียร์ลีค (x180: real club shirts and names, other companies' trademarks) and พุทธศรัทธานำโชค (x182: Buddha images and amulets in a game-of-chance promo).
At about 1x they are fine as wall tiles, too soft to show full screen.

**Count for the film: 43 games** (27 from Figma + 16 extra), so a claim such as "40+ เกม" would be true if it is ever needed.
The wall of games (beat 6): PK found a neat 7 x 4 grid of the 27 covers too sparse (20-11-2026). It is now a wall that runs off the edges, 9 staggered columns, 55 different images (from Figma: 20 covers, 7 wheel screens, 8 grid screens, 4 wheel images; plus the 16 extra grid screens) and one Minigames tile. No image repeats. Layout in SPEC.md, shot 6.

Also on the canvas: `capsule-open-reveal-once 1` (node 1:2312), probably an opening frame for the claw machine capsule.

**Exported 20-11-2026** (PK approved): 44 PNGs at 2.5x (screens 1075 x 2330, ถุงทองเงินล้าน's pick and result 1075 x 2360, wheels 1241 to 1530 px square), 111 MB, in `sale-video/assets/games/<nn>-<name>/`. The folder is in `sale-video/.gitignore`, so it stays on this Mac only; re-export from the node IDs above if it is lost.
- Every game: `screen-1-cover.png` (pick games) or `screen.png` + `wheel.png` (wheels).
- Extra screens: กล่องสุ่มลุ้นล้าน, ไพ่ปริศนาลุ้นล้าน and ถุงทองเงินล้าน have all 4 (`screen-2-grid`, `screen-3-pick`, `screen-4-result`); หีบร้อยล้าน has `screen-4-result` for the rebuild.
- Festival grids (PK chose the 3 x 3 grid screen for shot 5, 20-11-2026): `screen-2-grid.png` added for ดวงใจลุ้นโชค, สาดน้ำรับทรัพย์, หีบสมบัติผีให้โชค, กระทงเสี่ยงทาย and ของขวัญจากซานต้า (ถุงทองเงินล้าน already had one). 49 PNGs in all.
- Not exported yet: each game's raw layers (background, item images, a GIF on หีบร้อยล้าน). Shot 4 (transform) needs them after the storyboard is approved.
- Found on กล่องสุ่มลุ้นล้าน's pick and result screens: a browser URL bar "play.lsm99king.com/deposit" at the bottom. It is cropped out of every shot (SPEC.md, CROPS).

Still to check when the screens are exported at full size: what the result screens' prize lists show (see the note on result screens below).

## End card logo
The Minigames logo as SVG or transparent PNG. Not the AUTO FAST logo: that name never appears in the film (PK, 20-11-2026). PK sends the logo separately (20-11-2026).

## Note on the result screens
The sample result screens list prizes such as +500 pt, +1 โปร, +50 สปิน and a physical item. The captured back office lets a minigame slice give only credit (fixed or %) and minigame rights. Unless PK confirms the system now gives the others, the video's result screens show only credit and game rights.
Checked on ถุงทองเงินล้าน's result screen (node 1:4395, 20-11-2026): under "รางวัลที่คุณได้รับ" it lists +1,000 ฿, +500 pt., three kinds of "+2 สิทธิ์", +1 โปร, +50 สปิน and "แก้วเก็บความเย็น - ร้อน 1 ใบ". The other result screens use the same layout.
Plan until PK confirms (Claude's call): result shots frame the opened item and crop the prize list out, or show it only blurred in the background. The one prize ever readable on screen is "+1,000 ฿" (credit).
