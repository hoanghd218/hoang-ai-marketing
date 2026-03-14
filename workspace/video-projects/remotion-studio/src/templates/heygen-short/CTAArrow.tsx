import React from "react";
import { interpolate } from "remotion";
import { AnimatedEmoji } from "@remotion/animated-emoji";

export const CTAArrow: React.FC<{ frame: number }> = ({ frame }) => {
  const bounce = interpolate(frame % 30, [0, 15, 30], [0, 8, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div

      >
        <AnimatedEmoji emoji="index-finger" style={{
          width: 48,
          height: 48,
          transform: `translateY(${bounce}px) rotate(180deg)`,
          filter: "drop-shadow(0 2px 8px rgba(147,51,234,0.6))",
        }} />
      </div>
    </div>
  );
};
