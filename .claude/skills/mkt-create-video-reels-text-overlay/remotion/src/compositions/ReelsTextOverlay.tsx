import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {TextOverlay} from '../components/TextOverlay';
import {Watermark} from '../components/Watermark';
import {ensureFontLoaded} from '../fonts';

export interface ReelsProps {
  message: string;
  videoSrc: string;
  musicSrc?: string;
  watermark?: string;
  durationInSeconds?: number;
}

const FADE_DURATION_SEC = 0.8;

export const ReelsTextOverlay: React.FC<ReelsProps> = ({
  message,
  videoSrc,
  musicSrc,
  watermark,
}) => {
  ensureFontLoaded();

  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const fadeDurationFrames = Math.round(FADE_DURATION_SEC * fps);

  // Master opacity: fade in at start, fade out at end
  const opacity = interpolate(
    frame,
    [0, fadeDurationFrames, durationInFrames - fadeDurationFrames, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Audio volume: same fade curve
  const audioVolume = (f: number) =>
    interpolate(
      f,
      [0, fadeDurationFrames, durationInFrames - fadeDurationFrames, durationInFrames],
      [0, 1, 1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* Layer 1: Background video - darkened */}
      <AbsoluteFill style={{opacity}}>
        <OffthreadVideo
          src={staticFile(videoSrc)}
          loop
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.75) saturate(0.7)',
          }}
        />
      </AbsoluteFill>

      {/* Layer 2: Text overlay */}
      <AbsoluteFill style={{opacity}}>
        <TextOverlay message={message} />
      </AbsoluteFill>

      {/* Layer 3: Watermark */}
      {watermark && (
        <AbsoluteFill style={{opacity}}>
          <Watermark text={watermark} />
        </AbsoluteFill>
      )}

      {/* Layer 4: Background music */}
      {musicSrc && (
        <Audio
          src={staticFile(musicSrc)}
          volume={audioVolume}
        />
      )}
    </AbsoluteFill>
  );
};
