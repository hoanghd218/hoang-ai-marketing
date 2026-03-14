import React from "react";
import { spring, interpolate } from "remotion";
import { AnimatedEmoji } from "@remotion/animated-emoji";
import { FPS, ANIMATED_EMOJI_NAMES } from "./constants";

export const EmojiOverlay: React.FC<{ emoji: string; frame: number }> = ({
  emoji,
  frame,
}) => {
  const bounce = spring({ fps: FPS, frame, config: { damping: 8, mass: 0.6 } });
  const scale = interpolate(bounce, [0, 1], [0, 1.2]);
  const isAnimated = ANIMATED_EMOJI_NAMES.has(emoji);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${scale})`,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
        pointerEvents: "none",
      }}
    >
      {isAnimated ? (
        <div >
          <AnimatedEmoji emoji={emoji as any} style={{ width: 386, height: 386 }} />
        </div>
      ) : (
        <span style={{ fontSize: 48 }}>{emoji}</span>
      )}
    </div>
  );
};
