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
import type { HeyGenShortProps, BackgroundMusicTrack } from "../types";
import { FPS, ZoomClip, ProgressBar, BRollOverlays } from "./heygen-short";

/* ── Background music with fade in/out ── */
const BGMusic: React.FC<{
  track: BackgroundMusicTrack;
  totalDurationSec: number;
}> = ({ track, totalDurationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseVolume = track.volume ?? 0.12;
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
}) => {
  let offsetFrames = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video clips with zoom, captions, transitions */}
      {clips.map((clip, i) => {
        const durationFrames = Math.round(clip.durationSeconds * FPS);
        const from = offsetFrames;
        const globalStartSec = offsetFrames / FPS;
        offsetFrames +=
          durationFrames - (i < clips.length - 1 ? crossFadeFrames : 0);

        return (
          <Sequence key={i} from={from} durationInFrames={durationFrames}>
            <ZoomClip
              videoPath={clip.videoPath}
              durationFrames={durationFrames}
              globalStartSec={globalStartSec}
              captions={captions}
              totalDuration={durationSeconds}
              isFirst={i === 0}
              zoomPulses={zoomPulses}
              hookBoostSec={hookBoostSec}
              defaultCaptionPosition={defaultCaptionPosition}
            />
          </Sequence>
        );
      })}

      {/* B-roll overlays — on top of clips, under captions */}
      {bRollOverlays && bRollOverlays.length > 0 && (
        <BRollOverlays overlays={bRollOverlays} />
      )}

      {/* Sound effects — each plays at its startSec timestamp */}
      {soundEffects?.map((sfx, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={Math.round(sfx.startSec * FPS)}
        >
          <Audio src={staticFile(sfx.audioPath)} volume={sfx.volume ?? 0.7} />
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
    </AbsoluteFill>
  );
};
