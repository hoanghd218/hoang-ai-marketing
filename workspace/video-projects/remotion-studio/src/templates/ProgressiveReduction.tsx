import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import type { ProgressiveReductionProps } from "../types";
import { loadFonts, fontFamily } from "../fonts";
import { Footer } from "../Footer";

loadFonts();

const FadeInLine: React.FC<{
  text: string;
  delay: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  lineHeight: number;
}> = ({ text, delay, fontSize, fontWeight, color, lineHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fps * 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + fps * 0.3],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  return (
    <div
      style={{
        color,
        fontSize,
        fontWeight,
        lineHeight,
        fontFamily,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const ProgressiveReduction: React.FC<ProgressiveReductionProps> = ({
  sections,
  watermark,
  bgVideo,
  bgMusic,
  durationSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const musicVolume = (f: number) =>
    interpolate(
      f,
      [0, fps * 0.3, durationInFrames - fps * 0.5, durationInFrames],
      [0, 0.25, 0.25, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={staticFile(bgVideo)}
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
      {bgMusic && (
        <Audio src={staticFile(bgMusic)} volume={musicVolume} loop />
      )}

      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          color: "white",
          fontSize: 24,
          fontFamily,
          opacity: 0.7 * fadeOut,
        }}
      >
        {watermark}
      </div>

      <AbsoluteFill
        style={{
          opacity: fadeOut,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sections.map((section, sIdx) => {
          const sectionStart = Math.round(section.startSec * fps);
          const sectionEnd = Math.round(
            (section.startSec + section.durationSec) * fps
          );

          const sectionOpacity = interpolate(
            frame,
            [
              sectionStart,
              sectionStart + fps * 0.3,
              sectionEnd - fps * 0.3,
              sectionEnd,
            ],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (frame < sectionStart - 5 || frame > sectionEnd + 5) return null;

          return (
            <AbsoluteFill
              key={sIdx}
              style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: sectionOpacity,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 60px",
                  gap: 8,
                }}
              >
                {section.lines.map((line, lIdx) => (
                  <FadeInLine
                    key={lIdx}
                    text={line}
                    delay={section.startSec + lIdx * 0.25}
                    fontSize={section.fontSize ?? 44}
                    fontWeight={section.fontWeight ?? 700}
                    color={section.color ?? "white"}
                    lineHeight={section.lineHeight ?? 1.4}
                  />
                ))}
              </div>
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>

      <Footer opacity={fadeOut} />
    </AbsoluteFill>
  );
};
