import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { PromptTypingProps } from "../types";

const GRID_SIZE = 40;
const GRID_COLOR = "rgba(255,255,255,0.04)";
const BG_COLOR = "#0a0a0a";

const GridBackground: React.FC = () => (
  <AbsoluteFill>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid"
          width={GRID_SIZE}
          height={GRID_SIZE}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`}
            fill="none"
            stroke={GRID_COLOR}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={BG_COLOR} />
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </AbsoluteFill>
);

const CursorBlink: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: 32,
        backgroundColor: "#60a5fa",
        marginLeft: 2,
        verticalAlign: "middle",
        opacity,
      }}
    />
  );
};

export const PromptTyping: React.FC<PromptTypingProps> = ({
  text,
  durationSeconds,
  title = "Prompt",
  startDelaySec = 0.5,
  endPauseSec = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round(startDelaySec * fps);
  const endPauseFrames = Math.round(endPauseSec * fps);
  const totalFrames = Math.round(durationSeconds * fps);
  const typingFrames = totalFrames - startFrame - endPauseFrames;

  const charsToShow = Math.floor(
    interpolate(frame, [startFrame, startFrame + typingFrames], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const visibleText = text.slice(0, charsToShow);
  const isTypingDone = charsToShow >= text.length;

  // Fade in the whole card
  const cardOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(frame, [0, 10], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GridBackground />

      {/* Subtle gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(96,165,250,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Centered card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${cardY}px)`,
          opacity: cardOpacity,
          width: "85%",
          maxWidth: 920,
        }}
      >
        {/* Title label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            paddingLeft: 8,
          }}
        >
          <span style={{ fontSize: 28 }}>💬</span>
          <span
            style={{
              fontFamily: "SF Pro Display, Inter, system-ui, sans-serif",
              fontSize: 26,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
        </div>

        {/* Input card */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "36px 40px",
            minHeight: 200,
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 0 40px rgba(96,165,250,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontFamily: "SF Mono, JetBrains Mono, Fira Code, monospace",
              fontSize: 30,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.9)",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {visibleText}
            {!isTypingDone && <CursorBlink />}
            {isTypingDone && (
              <CursorBlink />
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <div
          style={{
            marginTop: 20,
            paddingLeft: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isTypingDone ? "#22c55e" : "#60a5fa",
              boxShadow: isTypingDone
                ? "0 0 8px #22c55e"
                : "0 0 8px #60a5fa",
            }}
          />
          <span
            style={{
              fontFamily: "SF Pro Display, Inter, system-ui, sans-serif",
              fontSize: 20,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {isTypingDone ? "Done" : "Typing..."}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
