import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionSegment, BRollOverlay as BRollOverlayType, WordTiming } from "../../types";
import { STYLE_MAP } from "./constants";
import { EmojiOverlay } from "./EmojiOverlay";
import { CTAArrow } from "./CTAArrow";
import {
  getWordByWordStyles,
  getDeepGlowShadow,
  getFlickerOpacity,
  getTypewriterStyles,
  getTypewriterCursor,
  getSlamStyles,
  getWaveStyles,
} from "./textEffects";

/* ── Highlighted text with optional effects ── */
const HighlightedText: React.FC<{
  text: string;
  highlights?: string[];
  highlightColor: string;
  textEffect?: string;
  localFrame: number;
  wordTimings?: WordTiming[];
  captionStartSec?: number;
}> = ({ text, highlights, highlightColor, textEffect, localFrame, wordTimings, captionStartSec }) => {
  const words = text.split(/\s+/);

  const BLACK_SHADOW = [
    "-3px -3px 0 #000",
    " 3px -3px 0 #000",
    "-3px  3px 0 #000",
    " 3px  3px 0 #000",
    "-3px  0   0 #000",
    " 3px  0   0 #000",
    " 0   -3px 0 #000",
    " 0    3px 0 #000",
    "0 0 12px rgba(0,0,0,0.95)",
    "0 0 20px rgba(0,0,0,0.9)",
    "0 0 32px rgba(0,0,0,0.85)",
    "0 0 48px rgba(0,0,0,0.7)",
  ].join(", ");

  // Word-by-word mode: each word gets staggered entry
  if (textEffect === "word-by-word") {
    const wordStyles = getWordByWordStyles(text, localFrame, 3, wordTimings, captionStartSec);
    return (
      <>
        {words.map((word, i) => {
          const isHL = highlights?.some(
            (hl) => word.toLowerCase().includes(hl.toLowerCase())
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: wordStyles[i]?.opacity ?? 1,
                transform: wordStyles[i]?.transform ?? "none",
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? BLACK_SHADOW : undefined,
                marginRight: "0.3em",
              }}
            >
              {word}
            </span>
          );
        })}
      </>
    );
  }

  // Typewriter: sharp cut reveal + blinking cursor
  if (textEffect === "typewriter") {
    const wordStyles = getTypewriterStyles(text, localFrame, 4, wordTimings, captionStartSec);
    const cursor = getTypewriterCursor(words.length, localFrame, 4, wordTimings, captionStartSec);
    return (
      <>
        {words.map((word, i) => {
          const isHL = highlights?.some(
            (hl) => word.toLowerCase().includes(hl.toLowerCase())
          );
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  opacity: wordStyles[i]?.opacity ?? 0,
                  fontWeight: isHL ? 900 : undefined,
                  textShadow: isHL ? BLACK_SHADOW : undefined,
                  marginRight: "0.3em",
                }}
              >
                {word}
              </span>
              {cursor.visible && cursor.afterWordIndex === i && (
                <span style={{ display: "inline-block", color: "#fff", fontWeight: 400 }}>|</span>
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  // Slam: words drop in with scale bounce
  if (textEffect === "slam") {
    const wordStyles = getSlamStyles(text, localFrame, 4, wordTimings, captionStartSec);
    return (
      <>
        {words.map((word, i) => {
          const isHL = highlights?.some(
            (hl) => word.toLowerCase().includes(hl.toLowerCase())
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: wordStyles[i]?.opacity ?? 1,
                transform: wordStyles[i]?.transform ?? "none",
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? BLACK_SHADOW : undefined,
                marginRight: "0.3em",
              }}
            >
              {word}
            </span>
          );
        })}
      </>
    );
  }

  // Wave: words ripple with sine-wave motion
  if (textEffect === "wave") {
    const wordStyles = getWaveStyles(text, localFrame, 3, wordTimings, captionStartSec);
    return (
      <>
        {words.map((word, i) => {
          const isHL = highlights?.some(
            (hl) => word.toLowerCase().includes(hl.toLowerCase())
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: wordStyles[i]?.opacity ?? 1,
                transform: wordStyles[i]?.transform ?? "none",
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? BLACK_SHADOW : undefined,
                marginRight: "0.3em",
              }}
            >
              {word}
            </span>
          );
        })}
      </>
    );
  }

  // For deep-glow and flicker, build parts with highlight matching
  if (!highlights || highlights.length === 0) {
    return <>{text}</>;
  }

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  let hlIdx = 0;

  while (remaining.length > 0) {
    let earliestIdx = remaining.length;
    let matchedHL = "";

    for (const hl of highlights) {
      const idx = remaining.toLowerCase().indexOf(hl.toLowerCase());
      if (idx !== -1 && idx < earliestIdx) {
        earliestIdx = idx;
        matchedHL = hl;
      }
    }

    if (matchedHL && earliestIdx < remaining.length) {
      if (earliestIdx > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, earliestIdx)}</span>);
      }

      const currentHlIdx = hlIdx++;
      const hlStyle: React.CSSProperties = {
        fontWeight: 900,
        textShadow: BLACK_SHADOW,
      };

      if (textEffect === "flicker") {
        hlStyle.opacity = getFlickerOpacity(localFrame, currentHlIdx);
      }

      parts.push(
        <span key={key++} style={hlStyle}>
          {remaining.slice(earliestIdx, earliestIdx + matchedHL.length)}
        </span>
      );
      remaining = remaining.slice(earliestIdx + matchedHL.length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      remaining = "";
    }
  }

  return <>{parts}</>;
};

/* ── Main caption renderer ── */
export const CaptionRenderer: React.FC<{
  captions: CaptionSegment[];
  globalStartSec: number;
  totalDuration: number;
  defaultCaptionPosition?: number;
  bRollOverlays?: BRollOverlayType[];
}> = ({ captions, globalStartSec, totalDuration, defaultCaptionPosition, bRollOverlays }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = globalStartSec + frame / fps;

  // Check if any b-roll GIF is active at the current time
  const isBRollActive = bRollOverlays?.some(
    (b) => currentTimeSec >= b.startSec && currentTimeSec < b.endSec
  ) ?? false;

  const activeIdx = captions.findIndex(
    (c) => currentTimeSec >= c.startSec && currentTimeSec < c.endSec
  );
  if (activeIdx === -1) return null;

  const active = captions[activeIdx];
  const captionStyle = active.style || "normal";
  const preset = STYLE_MAP[captionStyle] || STYLE_MAP.normal;
  const textEffect = active.textEffect || "none";
  const captionTop = active.captionPosition ?? defaultCaptionPosition ?? 55;

  // Animate caption entry
  const captionStartFrame = Math.round(
    (active.startSec - globalStartSec) * fps
  );
  const localFrame = frame - captionStartFrame;
  const entrySpring = spring({
    fps,
    frame: Math.max(0, localFrame),
    config: { damping: 12, mass: 0.5 },
  });
  const slideUp = interpolate(entrySpring, [0, 1], [30, 0]);
  const fadeIn = interpolate(entrySpring, [0, 1], [0, 1]);

  const isHook = captionStyle === "hook";
  const isCTA = captionStyle === "cta";

  // Split text into chunks of 10 words, show current chunk based on elapsed time
  const MAX_WORDS = 10;
  const allWords = active.text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < allWords.length; i += MAX_WORDS) {
    chunks.push(allWords.slice(i, i + MAX_WORDS).join(" "));
  }
  const captionDurSec = active.endSec - active.startSec;
  const localSec = localFrame / fps;
  const chunkIdx = Math.min(
    Math.floor((localSec / captionDurSec) * chunks.length),
    chunks.length - 1
  );
  const displayText = chunks[Math.max(0, chunkIdx)];

  // Per-chunk local frame for animation reset on each chunk
  const chunkDurFrames = Math.round((captionDurSec / chunks.length) * fps);
  const chunkLocalFrame = localFrame - chunkIdx * chunkDurFrames;

  return (
    <>
      {/* Emoji overlay — hidden when b-roll GIF is active (mutual exclusion) */}
      {active.emoji && !isBRollActive && <EmojiOverlay emoji={active.emoji} frame={localFrame} />}

      {/* CTA arrow */}
      {isCTA && <CTAArrow frame={frame} />}

      {/* Caption box */}
      <div
        style={{
          position: "absolute",
          top: `${captionTop}%`,
          left: "15%",
          right: "15%",
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            background: "transparent",
            borderRadius: 0,
            padding: 0,
            maxWidth: "100%",
            border: "none",
            boxShadow: "none",
            backdropFilter: "none",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: 60,
              fontWeight: 900,
              fontFamily: "Inter, system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.25,
              display: "block",
              textTransform: "uppercase",
              WebkitTextStroke: "0",
              textShadow: [
                // hard outline
                "-3px -3px 0 #000",
                " 3px -3px 0 #000",
                "-3px  3px 0 #000",
                " 3px  3px 0 #000",
                "-3px  0   0 #000",
                " 3px  0   0 #000",
                " 0   -3px 0 #000",
                " 0    3px 0 #000",
                // dark halo layers
                "0 0 12px rgba(0,0,0,0.95)",
                "0 0 20px rgba(0,0,0,0.9)",
                "0 0 32px rgba(0,0,0,0.85)",
                "0 0 48px rgba(0,0,0,0.7)",
              ].join(", "),
              letterSpacing: "0.5px",
            }}
          >
            <HighlightedText
              text={displayText}
              highlights={active.highlights}
              highlightColor={preset.accentColor}
              textEffect={textEffect}
              localFrame={chunkLocalFrame}
              wordTimings={active.words}
              captionStartSec={active.startSec}
            />
          </span>
        </div>
      </div>
    </>
  );
};
