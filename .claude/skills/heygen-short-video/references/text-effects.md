# Text Effects Reference

Caption text effects controlled via `textEffect` field on each `CaptionSegment`.

## Available Effects

### `word-by-word`
Each word fades up with staggered timing (~3 frames/word). Creates a teleprompter feel.
- Best for: `hook` and `cta` captions — draws attention to each word
- Uses Remotion `spring()` with `{ damping: 14, mass: 0.4 }` per word
- Each word slides up 12px and fades from 0→1 opacity

### `deep-glow`
Highlighted keywords pulse with multi-layer text-shadow (10px, 20px, 40px, 60px layers).
- Best for: `solution` captions with impressive numbers/results
- Glow intensity pulses via `sin(frame * 0.15)` between 60-100%
- Only affects highlighted words — non-highlighted text renders normally

### `flicker`
Highlighted keywords oscillate opacity between 30-100% at different frequencies.
- Best for: `pain` captions — creates unease/urgency on negative keywords
- Each word gets unique frequency (0.3-0.6) and phase (deterministic by word index)
- Non-highlighted text stays at full opacity

### `none` (default)
Standard highlight rendering — bold + accent color + subtle text-shadow.

## When to Use

| Caption Style | Recommended Effect | Why |
|---------------|-------------------|-----|
| `hook` | `word-by-word` | Maximizes attention in first 3 seconds |
| `pain` | `flicker` | Creates visual unease matching negative emotion |
| `solution` | `deep-glow` | Makes positive results feel impressive |
| `cta` | `word-by-word` | Ensures CTA text is fully read |
| `normal` | `none` | Keeps information-dense sections clean |

## Caption Position

`captionPosition` controls vertical placement (top % of frame). Defaults:
- Default: `55` (near neck area of HeyGen avatar — optimal for talking head)
- Range: `40`-`70` depending on avatar framing
- Override per-segment or globally via `defaultCaptionPosition`

## Pacing Tips (J-cuts & Hook Optimization)

### Hook Optimization (first 10s)
- Set `hookBoostSec: 10` to auto-boost zoom by 1.08x with quadratic falloff
- Combine with aggressive `zoomPulses` (type: "hold" or "punch") in first 10s
- Use `textEffect: "word-by-word"` on hook caption
- Add camera-flash sound effect at 0.0s
- Use fast crossFadeFrames (8-10) for snappy transitions

### J-cuts (editorial technique)
Overlap audio from next scene before visual cut. In HeyGen avatar videos, achieve this by:
- Increasing `crossFadeFrames` to 15-20 (audio bleeds across flash transition)
- Adding a riser/whoosh sound effect 0.5s before each clip transition
- These create the perception of seamless flow without actual audio pre-roll
