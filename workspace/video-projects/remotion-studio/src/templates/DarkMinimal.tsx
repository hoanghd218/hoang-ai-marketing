import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
  staticFile,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import type { DarkMinimalProps } from "../types";
import { loadFonts, fontFamily } from "../fonts";
import { Footer } from "../Footer";

loadFonts();

export const DarkMinimal: React.FC<DarkMinimalProps> = ({
  title,
  items,
  watermark,
  bgVideo,
  bgMusic,
  durationSeconds = 8,
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={staticFile(bgVideo)}
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
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
          bottom: "10%",
          left: "8%",
          right: "8%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily,
        }}
      >
        <Sequence from={0} layout="none">
          <div
            style={{
              color: "white",
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.4,
              opacity: interpolate(frame, [0, fps * 0.3], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            {title}
          </div>
        </Sequence>

        {items.map((item, i) => {
          const itemStart = fps * (0.5 + i * 0.4);
          const itemOpacity = interpolate(
            frame,
            [itemStart, itemStart + fps * 0.3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const itemY = interpolate(
            frame,
            [itemStart, itemStart + fps * 0.3],
            [20, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.ease),
            }
          );
          return (
            <div
              key={i}
              style={{
                color: "white",
                fontSize: 36,
                fontWeight: 400,
                lineHeight: 1.5,
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
              }}
            >
              {i + 1}. {item}
            </div>
          );
        })}
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
