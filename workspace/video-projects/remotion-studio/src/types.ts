export type DarkMinimalProps = {
  title: string;
  items: string[];
  watermark: string;
  bgVideo: string;
  bgMusic?: string;
  durationSeconds?: number;
};

export type BoldHighlightProps = {
  title: string;
  bodyLines: Array<{
    text: string;
    highlights?: string[];
  }>;
  quote?: string;
  accentColor?: string;
  watermark: string;
  bgVideo: string;
  bgMusic?: string;
  durationSeconds?: number;
};

export type EpicFullscreenProps = {
  lines: Array<{
    text: string;
    isHighlight?: boolean;
  }>;
  accentColor?: string;
  bgVideo: string;
  bgMusic?: string;
  durationSeconds?: number;
};

export type ImageKenBurnsProps = {
  imagePath: string;
  bgColor?: string;
  bgMusic?: string;
  durationSeconds?: number;
};

export type TextSection = {
  lines: string[];
  startSec: number;
  durationSec: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  lineHeight?: number;
};

export type WordTiming = {
  word: string;
  start: number; // seconds (from Whisper word_timestamps)
  end: number;
};

export type CaptionSegment = {
  text: string;
  startSec: number;
  endSec: number;
  words?: WordTiming[]; // word-level timestamps for precise sync
  highlights?: string[];
  highlightColor?: string;
  emoji?: string; // AnimatedEmoji name (e.g. "mind-blown") or Unicode fallback
  style?: "normal" | "hook" | "pain" | "solution" | "cta";
  textEffect?: "none" | "word-by-word" | "deep-glow" | "flicker" | "typewriter" | "slam" | "wave";
  captionPosition?: number; // top % position (default 55, near neck area)
};

export type BRollOverlay = {
  mediaPath: string; // image or video path in public/media/
  startSec: number;
  endSec: number;
  position?: "center" | "top-right" | "bottom-left";
  scale?: number; // default 0.6
  borderRadius?: number; // default 20
  label?: string;
};

export type HeyGenClip = {
  videoPath: string;
  durationSeconds: number;
};

export type SoundEffect = {
  audioPath: string;
  startSec: number;
  volume?: number;
};

export type ZoomPulse = {
  timeSec: number;
  scale?: number; // peak scale, default 1.15
  durationFrames?: number; // total pulse duration in frames, default 9 (~0.3s)
  type?: "punch" | "hold" | "slow"; // punch=quick in/out, hold=zoom in + hold + ease out, slow=gradual in/out
  holdSec?: number; // seconds to hold at peak scale (only for "hold" type, default 3)
};

export type BackgroundMusicTrack = {
  audioPath: string;
  startSec: number; // when this track starts playing
  endSec?: number; // when to stop (defaults to end of video)
  volume?: number; // 0.0–1.0 (default 0.12 — subtle background)
  fadeInSec?: number; // fade-in duration (default 1)
  fadeOutSec?: number; // fade-out duration (default 2)
};

export type HeyGenShortProps = {
  clips: HeyGenClip[];
  captions: CaptionSegment[];
  durationSeconds: number;
  crossFadeFrames?: number;
  showProgressBar?: boolean;
  soundEffects?: SoundEffect[];
  zoomPulses?: ZoomPulse[];
  bRollOverlays?: BRollOverlay[];
  backgroundMusic?: BackgroundMusicTrack[]; // multiple tracks with per-track volume & timing
  hookBoostSec?: number; // auto-boost zoom in first N seconds (default 0 = disabled)
  defaultCaptionPosition?: number; // global caption top% (default 55)
};

export type PromptTypingProps = {
  text: string;
  durationSeconds: number;
  title?: string; // label above input box (default "Prompt")
  startDelaySec?: number; // delay before typing starts (default 0.5)
  endPauseSec?: number; // pause after typing finishes (default 1.0)
};

export type ProgressiveReductionProps = {
  sections: TextSection[];
  watermark: string;
  bgVideo: string;
  bgMusic?: string;
  durationSeconds: number;
};
