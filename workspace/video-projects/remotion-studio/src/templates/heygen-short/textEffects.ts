import { interpolate, spring } from "remotion";
import { FPS } from "./constants";

/**
 * Word-by-word fade up: each word staggers in with opacity + translateY.
 * Returns per-word style arrays for a given local frame.
 */
export function getWordByWordStyles(
  text: string,
  localFrame: number,
  staggerFrames = 3
): Array<{ opacity: number; transform: string }> {
  const words = text.split(/\s+/);
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
