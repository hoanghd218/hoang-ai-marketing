import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS } from "./constants";

export const ProgressBar: React.FC<{ totalDuration: number }> = ({
  totalDuration,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(frame / (totalDuration * FPS), 1);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
          borderRadius: "0 3px 3px 0",
          boxShadow: "0 0 10px rgba(96,165,250,0.5)",
        }}
      />
    </div>
  );
};
