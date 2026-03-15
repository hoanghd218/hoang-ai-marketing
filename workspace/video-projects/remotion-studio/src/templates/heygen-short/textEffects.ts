import { interpolate, spring } from "remotion";
import { FPS } from "./constants";
import type { WordTiming } from "../../types";

/**
 * Word-by-word fade up: each word staggers in with opacity + translateY.
 * If wordTimings are provided, uses actual Whisper timestamps for precise sync.
 * Otherwise falls back to fixed stagger (3 frames per word).
 */
export function getWordByWordStyles(
  text: string,
  localFrame: number,
  staggerFrames = 3,
  wordTimings?: WordTiming[],
  captionStartSec?: number,
): Array<{ opacity: number; transform: string }> {
  const words = text.split(/\s+/);

  // Precise mode: use actual word timestamps from Whisper
  if (wordTimings && wordTimings.length > 0 && captionStartSec !== undefined) {
    return words.map((_, i) => {
      const timing = wordTimings[i];
      if (!timing) {
        return { opacity: 1, transform: "none" };
      }
      const wordStartFrame = Math.round((timing.start - captionStartSec) * FPS);
      const wordFrame = Math.max(0, localFrame - wordStartFrame);
      const progress = spring({
        fps: FPS,
        frame: wordFrame,
        config: { damping: 14, mass: 0.4 },
      });
      const opacity = interpolate(progress, [0, 1], [0, 1]);
      const translateY = interpolate(progress, [0, 1], [12, 0]);
      return { opacity, transform: `translateY(${translateY}px)` };
    });
  }

  // Fallback: fixed stagger (original behavior)
  return words.map((_, i) => {
    const wordFrame = Math.max(0, localFrame - i * staggerFrames);
    const progress = spring({
      fps: FPS,
      frame: wordFrame,
      config: { damping: 14, mass: 0.4 },
    });
    const opacity = interpolate(progress, [0, 1], [0, 1]);
    const translateY = interpolate(progress, [0, 1], [12, 0]);
    return { opacity, transform: `translateY(${translateY}px)` };
  });
}

/**
 * Deep glow: pulsing multi-layer text-shadow for highlighted keywords.
 * Returns a CSS text-shadow string.
 */
export function getDeepGlowShadow(
  color: string,
  frame: number,
  intensity = 1
): string {
  // Pulse between 0.6 and 1.0 intensity
  const pulse = 0.8 + 0.2 * Math.sin(frame * 0.15);
  const i = intensity * pulse;
  return [
    `0 0 ${10 * i}px ${color}`,
    `0 0 ${20 * i}px ${color}`,
    `0 0 ${40 * i}px ${color}80`,
    `0 0 ${60 * i}px ${color}40`,
  ].join(", ");
}

/**
 * Random flicker: highlighted keywords oscillate opacity.
 * Uses deterministic phase per word index for consistent animation.
 */
export function getFlickerOpacity(
  frame: number,
  wordIndex: number
): number {
  // Each word gets a different frequency and phase
  const freq = 0.3 + (wordIndex % 3) * 0.15;
  const phase = wordIndex * 2.1;
  const flicker = 0.5 + 0.5 * Math.sin(frame * freq + phase);
  // Clamp between 0.3 and 1.0 so text never fully disappears
  return interpolate(flicker, [0, 1], [0.3, 1]);
}

/**
 * Typewriter: words appear one-by-one with a sharp cut (no fade),
 * like someone typing on screen. Later words stay hidden until their turn.
 * Supports word-level timestamps for precise sync.
 */
export function getTypewriterStyles(
  text: string,
  localFrame: number,
  staggerFrames = 4,
  wordTimings?: WordTiming[],
  captionStartSec?: number,
): Array<{ opacity: number; transform: string }> {
  const words = text.split(/\s+/);

  if (wordTimings && wordTimings.length > 0 && captionStartSec !== undefined) {
    return words.map((_, i) => {
      const timing = wordTimings[i];
      if (!timing) return { opacity: 0, transform: "none" };
      const wordStartFrame = Math.round((timing.start - captionStartSec) * FPS);
      const visible = localFrame >= wordStartFrame;
      return { opacity: visible ? 1 : 0, transform: "none" };
    });
  }

  return words.map((_, i) => {
    const visible = localFrame >= i * staggerFrames;
    return { opacity: visible ? 1 : 0, transform: "none" };
  });
}

/**
 * Typewriter cursor: returns opacity for a blinking cursor after the last visible word.
 */
export function getTypewriterCursor(
  totalWords: number,
  localFrame: number,
  staggerFrames = 4,
  wordTimings?: WordTiming[],
  captionStartSec?: number,
): { visible: boolean; afterWordIndex: number } {
  let lastVisibleIdx = -1;

  if (wordTimings && wordTimings.length > 0 && captionStartSec !== undefined) {
    for (let i = 0; i < totalWords; i++) {
      const timing = wordTimings[i];
      if (!timing) break;
      const wordStartFrame = Math.round((timing.start - captionStartSec) * FPS);
      if (localFrame >= wordStartFrame) lastVisibleIdx = i;
    }
  } else {
    for (let i = 0; i < totalWords; i++) {
      if (localFrame >= i * staggerFrames) lastVisibleIdx = i;
    }
  }

  // Blink at ~2Hz (every 15 frames at 30fps)
  const blinkOn = Math.floor(localFrame / 8) % 2 === 0;
  return { visible: blinkOn && lastVisibleIdx < totalWords - 1, afterWordIndex: lastVisibleIdx };
}

/**
 * Slam: words drop in from above with overshoot bounce + scale punch.
 * Each word starts big and slams down to normal size.
 * Supports word-level timestamps.
 */
export function getSlamStyles(
  text: string,
  localFrame: number,
  staggerFrames = 4,
  wordTimings?: WordTiming[],
  captionStartSec?: number,
): Array<{ opacity: number; transform: string }> {
  const words = text.split(/\s+/);

  const getStyle = (wordFrame: number) => {
    const progress = spring({
      fps: FPS,
      frame: wordFrame,
      config: { damping: 8, mass: 0.6, stiffness: 200 },
    });
    const opacity = interpolate(progress, [0, 1], [0, 1]);
    const scale = interpolate(progress, [0, 1], [1.8, 1]);
    const translateY = interpolate(progress, [0, 1], [-40, 0]);
    return { opacity, transform: `translateY(${translateY}px) scale(${scale})` };
  };

  if (wordTimings && wordTimings.length > 0 && captionStartSec !== undefined) {
    return words.map((_, i) => {
      const timing = wordTimings[i];
      if (!timing) return { opacity: 1, transform: "none" };
      const wordStartFrame = Math.round((timing.start - captionStartSec) * FPS);
      return getStyle(Math.max(0, localFrame - wordStartFrame));
    });
  }

  return words.map((_, i) => getStyle(Math.max(0, localFrame - i * staggerFrames)));
}

/**
 * Wave: words float in with a continuous sine-wave vertical offset,
 * creating a ripple/wave motion across the text.
 * Supports word-level timestamps.
 */
export function getWaveStyles(
  text: string,
  localFrame: number,
  staggerFrames = 3,
  wordTimings?: WordTiming[],
  captionStartSec?: number,
): Array<{ opacity: number; transform: string }> {
  const words = text.split(/\s+/);

  const getStyle = (wordFrame: number, i: number) => {
    // Entry animation
    const entry = spring({
      fps: FPS,
      frame: wordFrame,
      config: { damping: 12, mass: 0.5 },
    });
    const opacity = interpolate(entry, [0, 1], [0, 1]);
    // Continuous wave after entry — each word offset by phase
    const waveY = entry * 6 * Math.sin(localFrame * 0.12 + i * 0.8);
    return { opacity, transform: `translateY(${waveY}px)` };
  };

  if (wordTimings && wordTimings.length > 0 && captionStartSec !== undefined) {
    return words.map((_, i) => {
      const timing = wordTimings[i];
      if (!timing) return { opacity: 1, transform: "none" };
      const wordStartFrame = Math.round((timing.start - captionStartSec) * FPS);
      return getStyle(Math.max(0, localFrame - wordStartFrame), i);
    });
  }

  return words.map((_, i) => getStyle(Math.max(0, localFrame - i * staggerFrames), i));
}
