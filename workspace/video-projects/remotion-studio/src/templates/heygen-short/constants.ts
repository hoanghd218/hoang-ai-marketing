export const FPS = 30;

/* ── Style presets per caption type ── */
export const STYLE_MAP: Record<
  string,
  {
    bg: string;
    border: string;
    glow: string;
    accentColor: string;
  }
> = {
  hook: {
    bg: "rgba(220, 38, 38, 0.85)",
    border: "2px solid rgba(255,100,100,0.6)",
    glow: "0 0 30px rgba(220,38,38,0.5)",
    accentColor: "#ffd700",
  },
  pain: {
    bg: "rgba(0, 0, 0, 0.85)",
    border: "2px solid rgba(239,68,68,0.5)",
    glow: "0 0 20px rgba(239,68,68,0.3)",
    accentColor: "#ef4444",
  },
  solution: {
    bg: "rgba(5, 46, 22, 0.88)",
    border: "2px solid rgba(34,197,94,0.5)",
    glow: "0 0 20px rgba(34,197,94,0.3)",
    accentColor: "#22c55e",
  },
  cta: {
    bg: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(79,70,229,0.9))",
    border: "2px solid rgba(167,139,250,0.6)",
    glow: "0 0 30px rgba(147,51,234,0.5)",
    accentColor: "#a78bfa",
  },
  normal: {
    bg: "rgba(0, 0, 0, 0.78)",
    border: "1px solid rgba(255,255,255,0.15)",
    glow: "none",
    accentColor: "#60a5fa",
  },
};

/* ── Known animated emoji names for auto-detection ── */
export const ANIMATED_EMOJI_NAMES = new Set([
  "smile", "grin", "joy", "rofl", "wink", "heart-eyes", "star-struck",
  "partying-face", "mind-blown", "screaming", "sleep", "sleepy", "yawn",
  "weary", "distraught", "angry", "rage", "sad", "cry", "worried",
  "thinking-face", "raised-eyebrow", "monocle", "nerd-face", "sunglasses-face",
  "money-face", "cowboy", "ghost", "skull", "robot", "alien",
  "fire", "sparkles", "glowing-star", "100", "collision",
  "check-mark", "cross-mark", "exclamation", "question",
  "light-bulb", "alarm-clock", "bell",
  "muscle", "thumbs-up", "thumbs-down", "clap", "wave", "victory",
  "index-finger", "folded-hands", "raising-hands",
  "rocket", "party-popper", "confetti-ball",
  "red-heart", "broken-heart", "fire-heart",
]);
