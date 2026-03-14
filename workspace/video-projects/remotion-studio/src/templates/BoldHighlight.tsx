import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import type { BoldHighlightProps } from "../types";
import { loadFonts, fontFamily } from "../fonts";
import { Footer } from "../Footer";

loadFonts();

const HighlightedText: React.FC<{
  text: string;
  highlights?: string[];
  color: string;
  fontSize: number;
}> = ({ text, highlights = [], color, fontSize }) => {
  if (highlights.length === 0)
    return <span style={{ fontSize }}>{text}</span>;

  const regex = new RegExp(
    `(${highlights
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <span style={{ fontSize }}>
      {parts.map((part, i) =>
        highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} style={{ fontWeight: 700, color }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const BoldHighlight: React.FC<BoldHighlightProps> = ({
  title,
  bodyLines,
  quote,
  accentColor = "#FFD700",
  watermark,
  bgVideo,
  bgMusic,
  durationSeconds = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const musicVolume = (f: number) =>
    interpolate(
      f,
      [0, fps * 0.3, durationInFrames - fps * 0.5, durationInFrames],
      [0, 0.3, 0.3, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bodyOpacity = interpolate(frame, [fps * 0.6, fps * 1.0], [0, 1], {
    extrapolateRight: "clamp",
  });
  const quoteOpacity = interpolate(frame, [fps * 2.0, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={staticFile(bgVideo)}
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
      {bgMusic && <Audio src={staticFile(bgMusic)} volume={musicVolume} loop />}

      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          color: "white",
          fontSize: 24,
          fontFamily,
          opacity: 0.7,
        }}
      >
        {watermark}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "6%",
          right: "6%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          fontFamily,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.3,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: bodyOpacity,
            lineHeight: 1.5,
          }}
        >
          {bodyLines.map((line, i) => (
            <div key={i}>
              <HighlightedText
                text={line.text}
                highlights={line.highlights}
                color={accentColor}
                fontSize={32}
              />
            </div>
          ))}
        </div>

        {quote && (
          <div
            style={{
              fontSize: 28,
              fontStyle: "italic",
              color: accentColor,
              opacity: quoteOpacity,
              marginTop: 10,
            }}
          >
            {quote}
          </div>
        )}
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
