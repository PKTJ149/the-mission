# Minigames sales video: toolkit

Installed skills and tools picked for this video (checked 19-11-2026). Skills are loaded only when their step starts.

## Core (will be used)
| Tool | What it does for this video | Step |
|---|---|---|
| `hyperframes:hyperframes` | The video engine: HTML scenes rendered to MP4, frame-accurate. | Build, render |
| `hyperframes:figma` | Reads Figma frames as states of one screen (grid → selected → result, theme A → theme B) and rebuilds them as motion. | Assets, build |
| Figma MCP (connected as PK's account) | Pulls the sample game screens, backgrounds, item images and colours. | Assets |
| `hyperframes:hyperframes-registry` | About 450 ready-made transitions, kinetic titles and caption blocks, used instead of hand-building. | Build |
| `hyperframes:media-use` | Voiceover (HeyGen Thai voice, needs PK's free sign-in), music catalog, sound effects, loudness. | Sound |
| `tiktok-video-skills:short-form-video` | Vertical 9:16 grammar: the first 3 seconds, retention, safe areas. | Storyboard |
| `tiktok-video-skills:caption-animation` | Word-by-word captions synced to the voice, for muted viewing. Thai word timing needs testing. | Sound, build |
| earshot MCP | "Ears": compares voice takes (real vs synthetic), picks sound effects from its free bank, measures loudness of the final mix. It cannot judge Thai pronunciation. | Sound, review |
| `freelance-motion-skills:video-delivery-specs` | Export settings and a pre-delivery QC checklist. LINE / Telegram limits must be checked separately. | Delivery |

## Craft support (as needed)
- `motion-design-skills:beat-sync-editing`: cut timing to the voice and music, match cuts (the film's main device).
- `kinetic-typography-skills:kinetic-typography`: Thai title reveals.
- `motion-design-skills:animation-principles`, `motion-art-direction`: motion polish and review.
- `motion-design-skills:logo-animation`: the end card mark.

## Not used, and why
- `explainer-video`: explains how things work, which the confidentiality rule forbids.
- `promo-video`: built for discount and price reveals, a different kind of film.
- `soundtrack`: writes music in code; HyperFrames advises against it.
- `motion-background`: glow and particle backgrounds are banned defaults.
- `adobe-for-creativity`: needs an Adobe sign-in; only useful later for extra aspect ratios.

## Notes
- No installed tool gives a better Thai voice than HeyGen. The other voice options stay: a recorded human voice, or the macOS Thai voice as a timing-only scratch track. The on-device voice (Kokoro) does not cover Thai, as far as is known.
- Thai text needs a font file in `assets/fonts/` (HyperFrames bundles Latin fonts only). Use the font from the Figma screens, downloaded from Google Fonts if it is a free font.
