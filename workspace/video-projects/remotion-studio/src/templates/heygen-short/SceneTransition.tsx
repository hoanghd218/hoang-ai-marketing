import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type TransitionType = "flash" | "fade-black" | "glitch" | "swipe-left" | "swipe-right" | "zoom-blur";

const TRANSITION_FRAMES = 12; // ~0.4s at 30fps

/* ── Flash: bright white burst that fades out ── */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3, TRANSITION_FRAMES], [0.9, 0.4, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#fff", opacity, pointerEvents: "none" }}
    />
  );
};

/* ── Fade through black ── */
const FadeBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const half = TRANSITION_FRAMES / 2;
  const opacity = interpolate(
    frame,
    [0, half, TRANSITION_FRAMES],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000", opacity, pointerEvents: "none" }}
    />
  );
};

/* ── Digital glitch: horizontal slice displacement ── */
const Glitch: React.FC = () => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [0, 3, TRANSITION_FRAMES], [1, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  if (intensity <= 0) return null;

  // Create glitch slices
  const slices = [
    { top: "10%", height: "8%", tx: 30 },
    { top: "25%", height: "5%", tx: -45 },
    { top: "42%", height: "12%", tx: 25 },
    { top: "60%", height: "6%", tx: -35 },
    { top: "75%", height: "10%", tx: 40 },
    { top: "90%", height: "4%", tx: -20 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Overall color aberration overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0, 255, 255, ${0.15 * intensity})`,
          mixBlendMode: "screen",
        }}
      />
      {/* Horizontal displacement bars */}
      {slices.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: 0,
            right: 0,
            height: s.height,
            backgroundColor: i % 2 === 0
              ? `rgba(255, 0, 80, ${0.3 * intensity})`
              : `rgba(0, 200, 255, ${0.25 * intensity})`,
            transform: `translateX(${s.tx * intensity}px)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      {/* Scanline noise */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,${0.1 * intensity}) 2px,
            rgba(0,0,0,${0.1 * intensity}) 4px
          )`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ── Directional swipe wipe ── */
const Swipe: React.FC<{ direction: "left" | "right" }> = ({ direction }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Swipe band moves across screen
  const bandWidth = 25; // percentage
  const bandPos = interpolate(progress, [0, 1], [-bandWidth, 100]);
  const isLeft = direction === "left";

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Leading edge glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: `${bandWidth}%`,
          [isLeft ? "left" : "right"]: `${isLeft ? bandPos : 100 - bandPos - bandWidth}%`,
          background: `linear-gradient(${isLeft ? "90deg" : "270deg"},
            transparent 0%,
            rgba(165, 130, 255, 0.6) 40%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(165, 130, 255, 0.6) 60%,
            transparent 100%)`,
          filter: "blur(8px)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ── Zoom blur: brief zoom burst ── */
const ZoomBlur: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 4, TRANSITION_FRAMES], [1.3, 1.05, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 4, TRANSITION_FRAMES], [0.7, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity * 0.5})`,
        transform: `scale(${scale})`,
        pointerEvents: "none",
        boxShadow: `inset 0 0 ${60 * opacity}px rgba(0,0,0,${opacity})`,
      }}
    />
  );
};

/* ── Main transition dispatcher ── */
export const SceneTransition: React.FC<{
  type?: TransitionType;
  durationFrames?: number;
}> = ({ type = "flash" }) => {
  switch (type) {
    case "flash":
      return <Flash />;
    case "fade-black":
      return <FadeBlack />;
    case "glitch":
      return <Glitch />;
    case "swipe-left":
      return <Swipe direction="left" />;
    case "swipe-right":
      return <Swipe direction="right" />;
    case "zoom-blur":
      return <ZoomBlur />;
    default:
      return <Flash />;
  }
};
