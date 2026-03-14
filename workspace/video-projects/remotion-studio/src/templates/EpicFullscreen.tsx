import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import type { EpicFullscreenProps } from "../types";
import { loadFonts, fontFamily } from "../fonts";
import { Footer } from "../Footer";

loadFonts();

export const EpicFullscreen: React.FC<EpicFullscreenProps> = ({
  lines,
  accentColor = "#FFD700",
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
      [0, 0.35, 0.35, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  const textScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: fps,
  });
  const textOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
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
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />
      {bgMusic && <Audio src={staticFile(bgMusic)} volume={musicVolume} loop />}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: textOpacity * fadeOut,
          transform: `scale(${0.8 + textScale * 0.2})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
            textAlign: "center",
            fontFamily,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.2,
                color: line.isHighlight ? accentColor : "white",
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      <Footer />
    </AbsoluteFill>
  );
};
