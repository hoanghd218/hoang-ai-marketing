import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import type { ImageKenBurnsProps } from "../types";
import { loadFonts } from "../fonts";
import { Footer } from "../Footer";

loadFonts();

export const ImageKenBurns: React.FC<ImageKenBurnsProps> = ({
  imagePath,
  bgColor = "#f5f0e8",
  bgMusic,
  durationSeconds = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const translateX = interpolate(frame, [0, durationInFrames], [0, -15], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const translateY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const musicVolume = (f: number) =>
    interpolate(
      f,
      [0, fps * 0.3, durationInFrames - fps * 0.5, durationInFrames],
      [0, 0.3, 0.3, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {bgMusic && <Audio src={staticFile(bgMusic)} volume={musicVolume} loop />}
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeIn * fadeOut,
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          }}
        />
      </div>

      <Footer opacity={fadeIn * fadeOut} />
    </AbsoluteFill>
  );
};
