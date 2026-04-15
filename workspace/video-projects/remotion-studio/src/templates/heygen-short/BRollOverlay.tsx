import React from "react";
import {
  Img,
  Video,
  Sequence,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";
import type { BRollOverlay as BRollOverlayType } from "../../types";
import { FPS } from "./constants";

const POSITION_MAP: Record<string, React.CSSProperties> = {
  fullscreen: { top: 0, left: 0, right: 0, bottom: 0 },
  center: { top: "15%", left: "10%", right: "10%" },
  "top-right": { top: "10%", right: "5%", width: "45%" },
  "bottom-left": { bottom: "25%", left: "5%", width: "45%" },
  bottom: { bottom: "10%", left: 0, right: 0, display: "flex", justifyContent: "center" },
};

const BRollItem: React.FC<{
  overlay: BRollOverlayType;
  durationFrames: number;
}> = ({ overlay, durationFrames }) => {
  const frame = useCurrentFrame();
  const fadeFrames = 10;

  const opacity = interpolate(
    frame,
    [0, fadeFrames, durationFrames - fadeFrames, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, fadeFrames],
    [0.95, 1],
    { extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [0, fadeFrames],
    [40, 0],
    { extrapolateRight: "clamp" }
  );

  const pos = POSITION_MAP[overlay.position ?? "center"] ?? POSITION_MAP.center;
  const isVideo = /\.(mp4|webm|mov)$/i.test(overlay.mediaPath);
  const isFullscreen = overlay.position === "fullscreen";
  const borderRadius = isFullscreen ? 0 : (overlay.borderRadius ?? 20);
  const isBottom = overlay.position === "bottom";
  const mediaStyle: React.CSSProperties = isFullscreen
    ? { width: "100%", height: "100%", objectFit: "cover", display: "block" }
    : isBottom
    ? { width: 350, height: "auto", display: "block" }
    : { width: "100%", height: "auto", display: "block" };

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        opacity,
        transform: isFullscreen ? undefined : `scale(${scale}) translateY(${translateY}px)`,
        zIndex: isFullscreen ? 1 : 5,
        filter: isBottom ? "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" : undefined,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          borderRadius,
          overflow: "hidden",
          boxShadow: isBottom ? undefined : "0 8px 32px rgba(0,0,0,0.5)",
          border: isBottom ? undefined : "2px solid rgba(255,255,255,0.15)",
        }}
      >
        {isVideo ? (
          <Video src={staticFile(overlay.mediaPath)} style={mediaStyle} volume={0} />
        ) : (
          <Img src={staticFile(overlay.mediaPath)} style={mediaStyle} />
        )}
      </div>
      {overlay.label && (
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 22,
            fontWeight: 600,
            marginTop: 8,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {overlay.label}
        </div>
      )}
    </div>
  );
};

export const BRollOverlays: React.FC<{
  overlays: BRollOverlayType[];
}> = ({ overlays }) => {
  return (
    <>
      {overlays.map((overlay, i) => {
        const startFrame = Math.round(overlay.startSec * FPS);
        const durationFrames = Math.round(
          (overlay.endSec - overlay.startSec) * FPS
        );
        return (
          <Sequence key={`broll-${i}`} from={startFrame} durationInFrames={durationFrames}>
            <BRollItem overlay={overlay} durationFrames={durationFrames} />
          </Sequence>
        );
      })}
    </>
  );
};
