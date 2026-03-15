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
                color: isHL ? highlightColor : undefined,
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? `0 0 12px ${highlightColor}40` : undefined,
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
                  color: isHL ? highlightColor : undefined,
                  fontWeight: isHL ? 900 : undefined,
                  textShadow: isHL ? `0 0 12px ${highlightColor}40` : undefined,
                  marginRight: "0.3em",
                }}
              >
                {word}
              </span>
              {cursor.visible && cursor.afterWordIndex === i && (
                <span style={{ display: "inline-block", color: highlightColor, fontWeight: 400 }}>|</span>
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
                color: isHL ? highlightColor : undefined,
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? `0 0 12px ${highlightColor}40` : undefined,
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
                color: isHL ? highlightColor : undefined,
                fontWeight: isHL ? 900 : undefined,
                textShadow: isHL ? `0 0 12px ${highlightColor}40` : undefined,
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
        color: highlightColor,
        fontWeight: 900,
      };

      if (textEffect === "deep-glow") {
        hlStyle.textShadow = getDeepGlowShadow(highlightColor, localFrame);
      } else if (textEffect === "flicker") {
        hlStyle.opacity = getFlickerOpacity(localFrame, currentHlIdx);
        hlStyle.textShadow = `0 0 12px ${highlightColor}40`;
      } else {
        hlStyle.textShadow = `0 0 12px ${highlightColor}40`;
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
          left: 36,
          right: 36,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            background: preset.bg,
            borderRadius: isHook ? 16 : 12,
            padding: isHook ? "20px 28px" : "14px 24px",
            maxWidth: "92%",
            border: preset.border,
            boxShadow: preset.glow,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: isHook ? 44 : 38,
              fontWeight: isHook ? 900 : 700,
              fontFamily: "Inter, system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.35,
              display: "block",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: isHook ? "-0.5px" : "0",
            }}
          >
            <HighlightedText
              text={active.text}
              highlights={active.highlights}
              highlightColor={preset.accentColor}
              textEffect={textEffect}
              localFrame={localFrame}
              wordTimings={active.words}
              captionStartSec={active.startSec}
            />
          </span>
        </div>
      </div>
    </>
  );
};
