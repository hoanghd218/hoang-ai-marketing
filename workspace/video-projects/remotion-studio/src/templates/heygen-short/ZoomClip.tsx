import React from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";
import type { ZoomPulse } from "../../types";
import { FPS } from "./constants";
import { Vignette } from "./Vignette";
import { FlashTransition } from "./FlashTransition";

/* ── Compute zoom pulse contribution ── */
const getZoomPulseScale = (
  globalFrame: number,
  pulses: ZoomPulse[],
  fps: number
): number => {
  let maxPulse = 0;
  for (const pulse of pulses) {
    const pulseFrame = Math.round(pulse.timeSec * fps);
    const peak = (pulse.scale ?? 1.15) - 1;
    const zoomType = pulse.type ?? "punch";
    const local = globalFrame - pulseFrame;

    if (zoomType === "punch") {
      const dur = pulse.durationFrames ?? 9;
      const half = dur / 2;
      if (local >= 0 && local < dur) {
        const t = local < half ? local / half : (dur - local) / half;
        maxPulse = Math.max(maxPulse, peak * t);
      }
    } else if (zoomType === "hold") {
      const rampIn = pulse.durationFrames ?? 12;
      const holdFrames = Math.round((pulse.holdSec ?? 3) * fps);
      const rampOut = rampIn;
      const totalDur = rampIn + holdFrames + rampOut;
      if (local >= 0 && local < totalDur) {
        let t: number;
        if (local < rampIn) {
          const p = local / rampIn;
          t = p * p;
        } else if (local < rampIn + holdFrames) {
          t = 1;
        } else {
          const p = 1 - (local - rampIn - holdFrames) / rampOut;
          t = p * p;
        }
        maxPulse = Math.max(maxPulse, peak * t);
      }
    } else if (zoomType === "slow") {
      const dur = pulse.durationFrames ?? Math.round(2 * fps);
      if (local >= 0 && local < dur) {
        const t = Math.sin((local / dur) * Math.PI);
        maxPulse = Math.max(maxPulse, peak * t);
      }
    }
  }
  return 1 + maxPulse;
};

export const ZoomClip: React.FC<{
  videoPath: string;
  durationFrames: number;
  globalStartSec: number;
  isFirst: boolean;
  zoomPulses: ZoomPulse[];
  hookBoostSec?: number;
  muted?: boolean;
  /** Skip first N seconds of the source video. */
  startFromSec?: number;
  /** Disable the intro flash transition (used when clips are positioned absolutely and may overlap). */
  disableFlash?: boolean;
}> = ({
  videoPath,
  durationFrames,
  globalStartSec,
  isFirst,
  zoomPulses,
  hookBoostSec = 0,
  muted = false,
  startFromSec,
  disableFlash = false,
}) => {
  const frame = useCurrentFrame();
  const globalFrame = Math.round(globalStartSec * FPS) + frame;
  const globalTimeSec = globalFrame / FPS;

  const baseScale = interpolate(
    frame,
    [0, 15, durationFrames - 15, durationFrames],
    [1, 1.05, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pulseScale = getZoomPulseScale(globalFrame, zoomPulses, FPS);

  // Hook boost: extra 1.08x zoom in first N seconds with fast easing
  let hookScale = 1;
  if (hookBoostSec > 0 && globalTimeSec < hookBoostSec) {
    const hookProgress = globalTimeSec / hookBoostSec;
    hookScale = 1 + 0.08 * (1 - hookProgress * hookProgress);
  }

  const scale = baseScale * pulseScale * hookScale;

  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Video
          src={staticFile(videoPath)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          volume={muted ? 0 : 1}
          {...(startFromSec ? { startFrom: Math.round(startFromSec * FPS) } : {})}
        />
      </div>

      <Vignette />

      {!isFirst && !disableFlash && <FlashTransition durationFrames={durationFrames} />}
    </AbsoluteFill>
  );
};
