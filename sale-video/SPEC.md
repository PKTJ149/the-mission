# Minigames sales video: SPEC

Status: storyboard draft 2 APPROVED by PK, 20-11-2026 (new look after PK's reference; draft 1 kept in storyboard/board-v1.html). Film draft 1 built 20-11-2026 in film/ (HyperFrames): scene cuts 0 / 3.6 / 9.6 / 13.2 / 18 / 31 / 33 / 35.2 / 41.6 / 46.4 / 50 s, timed to the measured voice; VO 7 moved to 35.2 s. End card uses PK's SmartGame logo (film/assets/logo/SmartGame-Logo-1.png). Draft 3 (20-11-2026): a 3.5 s logo teaser (s0) opens the film: the SmartGame mark builds from its parts (PK's SVG, film/assets/logo/SmartGame-Logo.svg), the wordmark arrives, then "มินิเกม สำหรับทุกเทศกาล"; every scene and voice line starts 3.5 s later than in draft 1; film is now 53.5 s, with 5 teaser sound effects (assets/sfx/). Music: HeyGen catalog bgm_003, looped to 53.5 s (assets/music/bgm-003-53s.m4a), volume 0.14 under the voice. Storyboard stills in `storyboard/` wait for PK's approval. Nothing is animated before that.
Draft 5 (20-11-2026, PK's notes): voice 1-3 = PK's new take ("เว็บของคุณ" cut, 1.15x, phrases placed on the picture; film/assets/voice/vo-01-03-v2-timed.wav). Shot 1 opens on the question, then กล่องสุ่ม / เปิดไพ่ / วงล้อ (4.5 s). Shot 2 = PK's stacked layout (wheels, boxes, cards with white name cards; last card on "ซื้อเพิ่ม"; PK's element PNGs in assets/games/stack/). Shot 3 = three real play screens at once. Festival 13 s -> 8.4 s; the wall 2.2 s -> 6 s: games float down into their slots, name cards pop one by one with a soft pop sound. Template-title wheels ("Let's Goal !") removed from the wall. Cuts: 0 / 3.5 / 8 / 13.1 / 16.7 / 21.5 / 29.9 / 31.9 / 37.9 / 44.3 / 49.1 / 52.7 s.
Drafts 6-10 (20-11-2026, PK's notes): shot 7 = one checklist that ticks with the voice; shot 8 = one phone splits into three and changes games three times; festival calendar has a calendar icon and a line left of the pills that grows to each festival; each festival has its own decorations (lanterns + plum, hearts, thrown water + frangipani, castle + moon + bats + pumpkins, fireworks, snow; images from the HeyGen asset search in film/assets/deco/, the rest drawn in code); wall name cards are solid and spring up facing the camera (14 names); shot 1 tapped box/card pop out big; shot 2 items larger; end card builds the logo first, then the button. Film 53.5 s. PK approved the festival part (draft 10).
Sources: storyline A + B in `STORYLINES.md`, voiceover in `VO-SCRIPT.md`, games in `ASSETS-NEEDED.md`.

```text
GOAL:    A merchant ends the film thinking "one system gives me a new game for every festival,
         I don't have to buy another system", and taps to contact the team.
OUTPUT:  HyperFrames, 1080 x 1920 (9:16), 30 fps.
TIME:    50 s x 30 = 1500 frames. Voiceover sets the clock (take a of each line, VO-SCRIPT.md).
         Music: not chosen yet (PK's own track or none). Sound effects: local bank.
LOOK:    Draft 2 (PK, 20-11-2026), after PK's reference film (flashmotion.io, Creative Force).
         The medium is still the product: PK's real game screens, shown in an iPhone that turns in 3D.
         Ground: #090720 with three soft light pools (violet rgba(124,92,255,.55) at 18 % / 8 %,
         magenta rgba(214,58,196,.42) at 92 % / 78 %, indigo rgba(60,40,170,.35) centre) and one
         white light beam from the top left (10-16 % white, blurred 30 px).
         Ink: #FFFFFF with a soft violet glow (text-shadow 0 0 34 px rgba(170,150,255,.65)).
         Accent: cyan #8FE9FF with glow, on one word per shot at most ("ระบบเดียว" shots 3 and 8,
         "หลากหลาย" 6b, "ได้สิทธิ์" 7, the current word in 1 and 4), the active festival pill,
         the tap ring and cursor. CTA button: violet-to-magenta pill (#7B5CFF to #C94FE0).
         Glass: panels at rgba(40,28,90,.45) with a 2 px edge rgba(205,195,255,.75) and a violet glow.
         Pills: fully rounded, cyan edge #84E6FF, cyan glow; inactive pills dim, no glow.
         Typeface: IBM Plex Sans Thai (PK, 20-11-2026), files in assets/fonts/.
         Title: Bold 700, 104 px, centred. Sub line: Medium 500, 50 px, #CFC6FF. Nothing under 32 px.
         Screens keep their own colours, untouched.
LAYOUT:  Top 170 px and bottom 250 px stay free of text (LINE / Telegram controls); the lower part of a
         phone may run into the bottom 250 px. Titles centred, y 200 to 470. Phone at 0.82 to 1.0 scale
         (531 to 648 px wide), top edge y 330 to 470.
OBJECTS: the real game screens (43 games); the lucky wheel; three glass "system" windows (title bar +
         body, no logo, no name); a glowing festival timeline with pills; a glowing tap ring + cursor
         (the only drawn icons); the rights counter cropped from a real screen; a budget gauge; a ticket.
MOTION:  enter: power3.out, 12 f, with a 6 px blur clearing as it lands (as in the reference).
         move: power2.inOut, 18 f.  exit: power2.in, 8 f.
         phone turn: rotateY within +-40 deg (the slab body looks thin past about 60), sine.inOut, 30-45 f.
         camera (wall pull-back, timeline travel): sine.inOut, 24-36 f.
         light sweep across a screen: 14 f.  item pop: spring, damping 0.55, scale and position only.
         Text lands and holds still while it is read.
SHOTS:   see the table below.
BANNED:  the HyperFrames defaults, except what PK's reference uses and only as it uses it (dark ground
         with light pools, glow on text and edges, violet-magenta light, glass panels, centred titles).
         Still banned: floating particles and orbs, lens flares, everything fading in at once, text
         moving while read, corner labels, HUD decoration, three cards in a row, a title over a dimmed
         screenshot, the logo docked in a corner. Plus for this film:
         - the name "AUTO FAST" anywhere;
         - any back office or settings screen, or anything that explains how a game is built;
         - readable prize lists on result screens (only "+1,000 ฿" may be read);
         - naming or showing a competitor; slot machines; scratch cards;
         - on-screen text that repeats a spoken sentence word for word;
         - ครับ / ค่ะ in on-screen text;
         - the URL bar "play.lsm99king.com/deposit" at the bottom of กล่องสุ่มลุ้นล้าน's pick and
           result screens (crop it out).
PHONE:   Single game screens sit in an iPhone drawn in CSS 3D (built by the script in storyboard/board.html), so the
         camera can turn it: titanium band, 64 px body depth (32 slabs x 2 px, close to a real iPhone),
         side buttons half-way into the body, Dynamic Island, iOS status bar, glass sheen, rim light,
         drop shadow. Screen 600 x 1301 = the game's 430 x 932. Turns checked at rotateY -38, -10, +28 deg.
         PK, 20-11-2026: chose this over the flat mockup image because it can rotate. The mockup image and
         tools/phone_mockup.py stay in the repo, unused.
CROPS:   Game screens are shown cropped to the game part: y 0 to 1560 of the 1075 x 2330 export
         (top bar, title, counters, item area, times). The rules text and history below are cut.
         Pick and result screens are cropped to y 0 to 1100 (the item only), so no prize list
         and no URL bar is in frame.
         In the phone a screen shows whole (minus about 4 % at the bottom under the status bar shift).
         Shot 5 (PK, 20-11-2026): each festival game shows its whole 3 x 3 grid screen.
QA:      frames 36, 210, 330, 480, 690, 939, 1014, 1110, 1290, 1440 (one per shot, the storyboard
         stills): titles at least 32 px and outside the top 170 / bottom 250 px, the hero at least 40 %
         of the frame, the phone turned no more than 40 deg, no prize list readable, no "AUTO FAST",
         no "Let's Goal !" template title readable in a close shot.
```

## Shots

Times come from the measured voiceover (take a). Frame = time x 30.

| # | Frames (s) | Hero move | Viewer reads | Voiceover | Hands off by |
|---|---|---|---|---|---|
| 1 Hook | 0-135 (0-4.5) | The phone floats in turning; a glowing cursor taps a box on กล่องสุ่มลุ้นล้าน's grid; it opens to "+1,000 ฿". The same phone flips to ไพ่ปริศนาลุ้นล้าน, then วงล้อนำโชค spins. | "กล่องสุ่ม" → "เปิดไพ่" → "วงล้อ" (one word per game, 1.2 s each) | กล่องสุ่ม... เปิดไพ่... วงล้อ... | the wheel shrinks into the first window of shot 2 |
| 2 Tension | 135-279 (4.5-9.3) | Three glass windows stack top to bottom, one game in each; a dashed glowing fourth slot drops in with "+ ซื้อเพิ่ม". | "ที่อื่น 1 เกม = 1 ระบบ" | [sighs] เว็บไหนก็มี แต่อยากได้เกมใหม่ทีไร... ต้องซื้ออีกระบบ | the stack starts to collapse |
| 3 Reveal | 288-384 (9.6-12.8) | The four windows fold into one phone holding กล่องสุ่มลุ้นล้าน, which turns to face us. | "ของเรา · ระบบเดียว" ("ระบบเดียว" in cyan) | แต่มินิเกมของเรา... ระบบเดียว... | the window grows to the hero screen |
| 4 Transform | 396-540 (13.2-18) | One screen changes in three waves: background, then the items, then the colours of the counters and button. It ends as ถุงทองเงินล้าน. | "พื้นหลัง" → "ตัวเกม" → "สีทั้งหน้า" (one word per wave) | เปลี่ยนโฉมได้ทั้งหน้าจอ... เหมือนได้เกมใหม่ทุกครั้ง | the camera pulls up onto the calendar |
| 5 Festival year | 540-930 (18-31) | The camera travels down a calendar; at each of 6 stops the whole game frame re-skins to that festival's game, about 2.2 s each. | "ปฏิทินเกม ทั้งปี", then the festival name per stop, e.g. "วาเลนไทน์" (the game's own title shows on its screen) | ถึงหน้าเทศกาลเมื่อไหร่... ก็ปล่อยเกมใหม่ได้เลย / ลูกค้าได้เล่นของใหม่... ไม่มีเบื่อ | the camera pulls back from the last stop |
| 6a Run | 930-990 (31-33) | Hard cuts on one fixed frame through 16 of PK's extra games, whole screen each (741 x 1601 px, x 170, y 230), getting faster: 8, 7, 6, 5, 5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2 frames. (PK, 20-11-2026: the extra games must not only appear as tiny tiles; PK supplied them at 1896 x 4096.) | nothing; the games carry it | ทั้งปี... | the last cut pulls back into the wall |
| 6b Payoff wall | 990-1029 (33-34.3) | Pull back to a wall that runs off the sides and bottom: 9 staggered columns of 130 x 282 px tiles (10 px gaps), 55 different images from all 43 games plus one Minigames tile; alternate columns drift up and down about 60 px. (PK, 20-11-2026: a neat 7 x 4 grid looked too few; PK added 16 more games.) | "สร้างสรรค์เกม ได้หลากหลาย ดั่งใจนึก" ("หลากหลาย" in the accent colour; PK, 20-11-2026, replaces "40+ เกม ในระบบเดียว") | ทั้งปี... ไม่ต้องซื้อระบบใหม่สักครั้ง | the wall slides away |
| 7 Also | 1050-1227 (35-40.9) | Three outcome shots, 2 s each: a deposit lands and the rights counter ticks up by itself; a budget gauge fills and stops at its line; a finished mission drops a game ticket. | "ฝากปุ๊บ ได้สิทธิ์ปั๊บ" → "งบไม่บานปลาย" → "ทำภารกิจ ได้สิทธิ์เล่น" | แจกสิทธิ์ให้ลูกค้าอัตโนมัติ... คุมงบได้อยู่มือ... แถมผูกกับภารกิจได้อีก | the ticket flies into the column of shot 8 |
| 8 Claim | 1248-1368 (41.6-45.6) | Games stream into one vertical column that scrolls past a fixed frame. | "ระบบเดียว · เกมไม่ซ้ำ" ("ระบบเดียว" in cyan) | ระบบเดียว... เปลี่ยนเป็นเกมไหนก็ได้ ทุกเทศกาล! | the column closes behind the mark |
| 9 End card | 1392-1500 (46.4-50) | The Minigames mark is carried in, then the button lands. | Minigames mark + "ติดต่อเปิดใช้งาน" | สนใจ... ทักทีมงานได้เลย | end, hold 1 s |

## Open
- Minigames logo: PK sends it. The storyboard uses a placeholder.
- Music: not chosen.
- Shot 4's waves need the game's separate layers (background, items). The Figma export gives each game's raw images; they are pulled after the storyboard is approved.
