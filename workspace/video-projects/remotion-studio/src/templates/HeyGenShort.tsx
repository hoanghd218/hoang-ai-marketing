import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HeyGenShortProps, BackgroundMusicTrack, OutroCard } from "../types";
import { FPS, ZoomClip, ProgressBar, BRollOverlays, SceneTransition, CaptionRenderer } from "./heygen-short";

/* ── Background music with fade in/out ── */
const BGMusic: React.FC<{
  track: BackgroundMusicTrack;
  totalDurationSec: number;
}> = ({ track, totalDurationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const MAX_BGM_VOLUME = 0.15;
  const baseVolume = Math.min(track.volume ?? 0.12, MAX_BGM_VOLUME);
  const fadeIn = track.fadeInSec ?? 1;
  const fadeOut = track.fadeOutSec ?? 2;
  const endSec = track.endSec ?? totalDurationSec;
  const trackDur = endSec - track.startSec;

  const currentSec = frame / fps;
  const vol = interpolate(
    currentSec,
    [0, fadeIn, Math.max(fadeIn, trackDur - fadeOut), trackDur],
    [0, baseVolume, baseVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <Audio src={staticFile(track.audioPath)} volume={vol} loop />;
};

/* ── Outro end card with fade + scale animation ── */
const OutroEndCard: React.FC<{ outro: OutroCard }> = ({ outro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = Math.round(outro.durationSeconds * fps);

  // Fade in over 0.4s
  const opacity = interpolate(frame, [0, Math.round(0.4 * fps)], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scale from 0.85 → 1.0 with ease
  const scale = interpolate(frame, [0, Math.round(0.5 * fps)], [0.85, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle slides up with slight delay
  const subtitleY = interpolate(
    frame,
    [Math.round(0.2 * fps), Math.round(0.6 * fps)],
    [30, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subtitleOpacity = interpolate(
    frame,
    [Math.round(0.2 * fps), Math.round(0.6 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle glow pulse on title
  const glowIntensity = interpolate(
    frame,
    [0, totalFrames * 0.5, totalFrames],
    [0, 12, 6],
    { extrapolateRight: "clamp" }
  );

  // Profile image scale bounce
  const profileScale = interpolate(
    frame,
    [0, Math.round(0.3 * fps), Math.round(0.5 * fps)],
    [0, 1.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const profileOpacity = interpolate(frame, [0, Math.round(0.3 * fps)], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Ring glow animation
  const ringGlow = interpolate(
    frame,
    [Math.round(0.5 * fps), Math.round(1.5 * fps), Math.round(3 * fps)],
    [0, 15, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: outro.bgColor ?? "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
        zIndex: 200,
        opacity,
      }}
    >
      {/* Decorative glow behind profile */}
      {outro.profileImage && (
        <div
          style={{
            position: "relative",
            width: 380,
            height: 380,
          }}
        >
          {/* Glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1)`,
              opacity: interpolate(frame, [Math.round(0.3 * fps), Math.round(0.8 * fps)], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              filter: `blur(${ringGlow}px)`,
            }}
          />
          {/* Profile photo */}
          <div
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid rgba(255,255,255,0.95)",
              transform: `scale(${profileScale})`,
              opacity: profileOpacity,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
            }}
          >
            <img
              src={staticFile(outro.profileImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      )}

      <span
        style={{
          color: "#fff",
          fontSize: 56,
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          textAlign: "center",
          transform: `scale(${scale})`,
          textShadow: `0 0 ${glowIntensity}px rgba(165,130,255,0.7), 0 2px 8px rgba(0,0,0,0.5)`,
        }}
      >
        {outro.title}
      </span>
      {outro.subtitle && (
        <div
          style={{
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 60,
              height: 3,
              borderRadius: 2,
              background: "linear-gradient(90deg, transparent, rgba(165,130,255,0.8), transparent)",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 34,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              textAlign: "center",
              maxWidth: "85%",
              lineHeight: 1.5,
            }}
          >
            {outro.subtitle}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ── Main composition ── */
export const HeyGenShort: React.FC<HeyGenShortProps> = ({
  clips,
  captions,
  durationSeconds,
  crossFadeFrames = 10,
  showProgressBar = true,
  soundEffects,
  zoomPulses = [],
  bRollOverlays,
  backgroundMusic,
  hookBoostSec = 0,
  defaultCaptionPosition,
  audioPath,
  footerText,
  outro,
  sceneTransition,
}) => {
  let offsetFrames = 0;
  const transitionType = sceneTransition?.type ?? "flash";
  const transitionDur = sceneTransition?.durationFrames ?? 12;

  // Detect absolute-positioning mode: if ANY clip has startSec, treat all clips as absolute.
  // In absolute mode, clips can overlap, sequential crossfades and scene transitions are disabled.
  const isAbsoluteMode = clips.some((c) => c.startSec !== undefined);

  // Pre-calculate clip start frames for transition overlay placement
  const clipStarts: number[] = [];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Full audio track — plays original voiceover continuously */}
      {audioPath && <Audio src={staticFile(audioPath)} volume={1} />}

      {/* Video clips with zoom, captions, transitions */}
      {clips.map((clip, i) => {
        const durationFrames = Math.round(clip.durationSeconds * FPS);
        let from: number;
        if (clip.startSec !== undefined) {
          // Absolute positioning — clip starts at a fixed timeline position
          from = Math.round(clip.startSec * FPS);
        } else {
          // Sequential stacking (legacy) — clips flow one after another with crossfade
          from = offsetFrames;
          offsetFrames +=
            durationFrames - (i < clips.length - 1 ? crossFadeFrames : 0);
        }
        const globalStartSec = from / FPS;
        clipStarts.push(from);

        const zIndex = clip.zIndex ?? 0;
        // Global audioPath mutes all clips (legacy). Otherwise, respect per-clip muted.
        const isMuted = audioPath ? true : (clip.muted ?? false);

        return (
          <Sequence key={i} from={from} durationInFrames={durationFrames}>
            <AbsoluteFill style={{ zIndex }}>
              <ZoomClip
                videoPath={clip.videoPath}
                durationFrames={durationFrames}
                globalStartSec={globalStartSec}
                isFirst={i === 0}
                zoomPulses={zoomPulses}
                hookBoostSec={hookBoostSec}
                muted={isMuted}
                startFromSec={clip.startFromSec}
                disableFlash={isAbsoluteMode}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Scene transitions — visual overlay at each clip boundary (sequential mode only) */}
      {!isAbsoluteMode &&
        clipStarts.map((startFrame, i) =>
          i === 0 ? null : (
            <Sequence
              key={`transition-${i}`}
              from={startFrame}
              durationInFrames={transitionDur}
            >
              <SceneTransition type={transitionType} />
            </Sequence>
          )
        )}

      {/* B-roll overlays — on top of clips, under captions */}
      {bRollOverlays && bRollOverlays.length > 0 && (
        <BRollOverlays overlays={bRollOverlays} />
      )}

      {/* Captions — HIGHEST z-index, always on top of visuals */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        <CaptionRenderer
          captions={captions}
          globalStartSec={0}
          totalDuration={durationSeconds}
          defaultCaptionPosition={defaultCaptionPosition}
          bRollOverlays={bRollOverlays}
        />
      </div>

      {/* Sound effects — each plays at its startSec timestamp */}
      {soundEffects?.map((sfx, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={Math.round(sfx.startSec * FPS)}
          {...(sfx.durationSec ? { durationInFrames: Math.round(sfx.durationSec * FPS) } : {})}
        >
          <Audio
            src={staticFile(sfx.audioPath)}
            volume={sfx.volume ?? 0.7}
            {...(sfx.startFromSec ? { startFrom: Math.round(sfx.startFromSec * FPS) } : {})}
          />
        </Sequence>
      ))}

      {/* Background music — multiple tracks with per-track volume & fade */}
      {backgroundMusic?.map((track, i) => (
        <Sequence
          key={`bgm-${i}`}
          from={Math.round(track.startSec * FPS)}
          durationInFrames={Math.round(
            ((track.endSec ?? durationSeconds) - track.startSec) * FPS
          )}
        >
          <BGMusic track={track} totalDurationSec={durationSeconds} />
        </Sequence>
      ))}

      {showProgressBar && <ProgressBar totalDuration={durationSeconds} />}

      {/* Outro end card — appended AFTER main video, never overlapping */}
      {outro && (
        <Sequence
          from={Math.round(durationSeconds * FPS)}
          durationInFrames={Math.round(outro.durationSeconds * FPS)}
        >
          <OutroEndCard outro={outro} />
        </Sequence>
      )}

      {/* Footer text — centered at bottom */}
      {footerText && (
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 42,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: 1.5,
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            {footerText}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
