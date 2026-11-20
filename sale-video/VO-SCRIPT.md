# Minigames sales video: voiceover script (draft 1)

Status: approved by PK, 20-11-2026. All 9 lines generated on 20-11-2026, 2 takes each, in `sale-video/voice/` (see "Generated takes" below). Next: PK listens and picks take a or b for each line.
Draft 20-11-2026. Follows the A + B storyline in `STORYLINES.md` (vertical, about 45 to 50 s).
Voice: ElevenLabs Eleven v4, "Raccoon - Friendly", stability 50, similarity 80 (approved by PK, 20-11-2026).

## Rules this script follows
- The name "AUTO FAST" never appears. The script says "เรา" (PK, 20-11-2026).
- No settings screen and no "how it is built" (manager's rule). The script talks only about what players see and what the merchant gets.
- No festival names in the voiceover. The festival names go on screen, matched to whichever games are in PK's Figma library.
- On-screen text never repeats a spoken sentence word for word, so the film still makes sense with the sound off. A single keyword ("ระบบเดียว") may appear in both.
- No ครับ / ค่ะ at the end of lines, so the script works with any voice. Add them if wanted.
- Only audio tags already tested with this voice: `[curious]` `[sighs]` `[tired]` `[excited]` `[pause]` `[happily]`.

## Timing estimate
Speaking speed from the two voice tests: about 3.5 to 5 Thai syllables per second, plus about 0.4 s for each `...` or `[pause]` and about 0.8 s for a sigh.
Total speech is about 36 s. With picture-only moments (wave changes, the festival run, the end card) the film comes to about 49 s.
These lengths are estimates (about ±25 %). The real lengths come from the generated files, and each scene is re-timed to the voice.

## Generated takes (20-11-2026)
Generated in PK's ElevenLabs account with the voice and settings above (MP3, 44.1 kHz, 128 kbps, mono). ElevenLabs makes 2 takes per request, so each line has take a and take b.
PK exported all 18 to `voice-tests/ElevenLabs_Export_2026-11-20T02_52_20/` (left there untouched). Copies were renamed into `voice/`.
Which export file is which line comes from generation order: the lines were generated 1 to 9, and the export timestamps run 00:27:50 to 00:29:53 in that order. Take a is the earlier timestamp, or the file without " (1)" when both share a second. The lengths fit (line 1 longest, line 7 second), but lines 2, 4, 5 and 6 are all about 3.2 s, so PK's listen is the real check.

| VO | Take a | Take b | Loudness a / b (LUFS) | Source files (export timestamp) |
|---|---|---|---|---|
| 1 hook | `vo-01-hook-a.mp3` 9.33 s | `vo-01-hook-b.mp3` 9.17 s | -16.7 / -17.5 | 00:27:50 / 00:27:51 |
| 2 reveal | `vo-02-reveal-a.mp3` 3.16 s | `vo-02-reveal-b.mp3` 3.08 s | -12.8 / -12.6 | 00:28:14 / 00:28:15 |
| 3 transform | `vo-03-transform-a.mp3` 3.63 s | `vo-03-transform-b.mp3` 3.63 s | -13.8 / -14.1 | 00:28:33 / 00:28:34 |
| 4 festival | `vo-04-festival-a.mp3` 3.40 s | `vo-04-festival-b.mp3` 3.32 s | -15.0 / -14.1 | 00:28:48 / 00:28:49 |
| 5 festival | `vo-05-festival-a.mp3` 3.16 s | `vo-05-festival-b.mp3` 3.16 s | -12.1 / -12.2 | 00:29:01 / 00:29:01 (1) |
| 6 payoff | `vo-06-payoff-a.mp3` 3.24 s | `vo-06-payoff-b.mp3` 3.32 s | -13.8 / -13.0 | 00:29:13 / 00:29:13 (1) |
| 7 also | `vo-07-also-a.mp3` 5.72 s | `vo-07-also-b.mp3` 5.88 s | -14.1 / -14.1 | 00:29:28 / 00:29:29 |
| 8 claim | `vo-08-claim-a.mp3` 3.97 s | `vo-08-claim-b.mp3` 4.05 s | -15.7 / -15.3 | 00:29:41 / 00:29:41 (1) |
| 9 end | `vo-09-end-a.mp3` 2.69 s | `vo-09-end-b.mp3` 2.51 s | -15.1 / -14.0 | 00:29:52 / 00:29:53 |

Lengths include about 0.06 to 0.15 s of silence at the start and 0.1 to 0.35 s at the end of each file.

Checks (measured, not by ear):
- earshot realness: all 18 read as real or pro-produced (p_real 0.97 to 0.99). This only rules out code-made sound; it does not judge Thai pronunciation.
- No two files are identical. True peak -0.4 to -1.4 dBTP, so no clipping. The final mix brings it to -1 dBTP.
- Loudness differs by up to 5 dB between lines (line 1 is quietest because of the sigh). The lines are levelled in the mix.
- Not checked: pronunciation of อัตโนมัติ, ภารกิจ, เทศกาล, and whether a tag was read aloud. There is no Thai speech-to-text tool installed, so PK's listen covers these.

Total speech with take a is about 38.3 s (estimate was about 36 s).

### Re-timed placement (draft, to be finalised in SPEC.md)
Take a lengths, rounded. Gaps are picture-only moments (transform waves, the festival run, the end card).

| VO | Start | End | Note |
|---|---|---|---|
| 1 | 0.0 | 9.3 | hook + tension, about 0.8 s longer than estimated |
| 2 | 9.6 | 12.8 | reveal |
| 3 | 13.2 | 16.8 | transform, the waves keep running to about 18 s |
| 4 | 18.0 | 21.4 | festival run starts |
| 5 | 24.5 | 27.7 | festival run continues, picture-only before and after |
| 6 | 31.0 | 34.3 | wall of games |
| 7 | 35.0 | 40.9 | also: rights, budget, missions |
| 8 | 41.6 | 45.6 | closing claim |
| 9 | 46.4 | 49.0 | end card, held to about 50 s |

## The script

| VO | Scene (storyline beat) | Time (est.) | Voiceover | On-screen text |
|---|---|---|---|---|
| 1 | Hook + tension (beats 1-2) | 0-8.5 s | กล่องสุ่ม... เปิดไพ่... วงล้อ... เว็บไหนก็มี แต่อยากได้เกมใหม่ทีไร... ต้องซื้ออีกระบบ | "กล่องสุ่ม" → "เปิดไพ่" → "วงล้อ", then "ที่อื่น 1 เกม = 1 ระบบ" and the slot "+ ซื้อเพิ่ม" |
| 2 | Reveal (beat 3) | 8.5-11.5 s | แต่มินิเกมของเรา... ระบบเดียว... | "ของเรา · ระบบเดียว" |
| 3 | Transform (beat 4) | 11.5-17 s | เปลี่ยนโฉมได้ทั้งหน้าจอ... เหมือนได้เกมใหม่ทุกครั้ง | One word per wave: "พื้นหลัง" → "ตัวเกม" → "สีทั้งหน้า" |
| 4 | Festival year, start (beat 5) | 17-21 s | ถึงหน้าเทศกาลเมื่อไหร่... ก็ปล่อยเกมใหม่ได้เลย | "ปฏิทินเกม ทั้งปี" + one label per stop, e.g. "วาเลนไทน์ · กล่องหัวใจ" |
| 5 | Festival year, middle (beat 5) | about 25-28 s | ลูกค้าได้เล่นของใหม่... ไม่มีเบื่อ | (stop labels continue) |
| 6 | Payoff, wall of games (beat 6) | 31-35 s | ทั้งปี... ไม่ต้องซื้อระบบใหม่สักครั้ง | "สร้างสรรค์เกม ได้หลากหลาย ดั่งใจนึก" (PK, 20-11-2026) |
| 7 | Also (beat 7) | 35-42 s | แจกสิทธิ์ให้ลูกค้าอัตโนมัติ... คุมงบได้อยู่มือ... แถมผูกกับภารกิจได้อีก | "ฝากปุ๊บ ได้สิทธิ์ปั๊บ" → "งบไม่บานปลาย" → "ทำภารกิจ ได้สิทธิ์เล่น" |
| 8 | Claim (beat 8) | 42-46 s | ระบบเดียว... เปลี่ยนเป็นเกมไหนก็ได้ ทุกเทศกาล! | "ระบบเดียว · เกมไม่ซ้ำ" |
| 9 | End card (beat 9) | 46-49 s | สนใจ... ทักทีมงานได้เลย | Minigames logo + "ติดต่อเปิดใช้งาน" |

The table shows the words without tags. The paste-ready lines with tags are below.

## Paste into ElevenLabs (one file per line)
Make each line a separate file, all with the same voice and settings. Separate files let one line be redone without redoing the others, and each line can be placed exactly on its scene.
Save them in `sale-video/voice/` with the names below.

`vo-01-hook.mp3` (the same line as the approved test; the test take can be reused if PK prefers it)
```text
[curious] กล่องสุ่ม... เปิดไพ่... วงล้อ... [sighs] เว็บไหนก็มี [tired] แต่อยากได้เกมใหม่ทีไร... ต้องซื้ออีกระบบ
```

`vo-02-reveal.mp3`
```text
[excited] แต่มินิเกมของเรา [pause] ระบบเดียว...
```

`vo-03-transform.mp3`
```text
[happily] เปลี่ยนโฉมได้ทั้งหน้าจอ... เหมือนได้เกมใหม่ทุกครั้ง
```

`vo-04-festival.mp3`
```text
[excited] ถึงหน้าเทศกาลเมื่อไหร่... ก็ปล่อยเกมใหม่ได้เลย
```

`vo-05-festival.mp3`
```text
[happily] ลูกค้าได้เล่นของใหม่... ไม่มีเบื่อ
```

`vo-06-payoff.mp3`
```text
ทั้งปี... ไม่ต้องซื้อระบบใหม่สักครั้ง
```

`vo-07-also.mp3`
```text
[happily] แจกสิทธิ์ให้ลูกค้าอัตโนมัติ... คุมงบได้อยู่มือ... แถมผูกกับภารกิจได้อีก
```

`vo-08-claim.mp3`
```text
[excited] ระบบเดียว... [happily] เปลี่ยนเป็นเกมไหนก็ได้ ทุกเทศกาล!
```

`vo-09-end.mp3`
```text
[happily] สนใจ... ทักทีมงานได้เลย
```

Line 6 has no tag on purpose: a calm, sure line between two lively ones, and fewer strong tags keeps the voice sounding less artificial (voice test 2).

## Why the lines are split this way
- PK's example line ("แต่มินิเกมของเรา... ระบบเดียว... เปลี่ยนเป็นเกมไหนก็ได้ ทุกเทศกาล!") is split in two. The first half is the reveal (VO 2), and the transform picture follows it straight away. The second half is the closing claim (VO 8), so the film ends on PK's own words and "ระบบเดียว" opens and closes the pitch.
- The festival lines (VO 4, 5) leave gaps on purpose. The calendar run is mostly picture and music, with a pop on each theme change.

## Listen for these when generating
Words that Thai text-to-speech often gets wrong. If one sounds off, retype it the way it is said (shown in brackets) and generate that line again:
- อัตโนมัติ (อัด-ตะ-โน-มัด)
- ภารกิจ (พา-ระ-กิด)
- เทศกาล (เทด-สะ-กาน)

Also check that no tag is read aloud as a word.

## Claims to keep an eye on
- "ต้องซื้ออีกระบบ" and "ที่อื่น 1 เกม = 1 ระบบ" are PK's market knowledge, not checked by us. No competitor is named or shown.
- "เปลี่ยนเป็นเกมไหนก็ได้" is true for the look of the game. The picture shows only pick-and-reveal games and the wheel, never slot machines or scratch cards.
- "ฝากปุ๊บ ได้สิทธิ์ปั๊บ" and "งบไม่บานปลาย" come from the selling points (MG-1 automatic rights from deposits, MG-2 budget caps).

## Still open
- Festival stops and the game count: settled 20-11-2026. 43 games (27 in Figma + 16 from PK's extra folder), PK changed the wall headline to "สร้างสรรค์เกม ได้หลากหลาย ดั่งใจนึก" (20-11-2026), so no number is shown on screen. Festival stops in `ASSETS-NEEDED.md`.
- Who "ทีมงาน" is (sales team, account manager, a LINE OA): the end card may need a real contact. Not asked yet.
