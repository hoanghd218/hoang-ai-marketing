import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const FlashTransition: React.FC<{ durationFrames: number }> = ({
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, durationFrames], [0.8, 0, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#fff",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
