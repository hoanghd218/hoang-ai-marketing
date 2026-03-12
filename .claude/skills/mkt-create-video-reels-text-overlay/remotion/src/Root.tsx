import React from 'react';
import {Composition} from 'remotion';
import {ReelsTextOverlay} from './compositions/ReelsTextOverlay';
import type {ReelsProps} from './compositions/ReelsTextOverlay';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ReelsTextOverlay"
      component={ReelsTextOverlay}
      durationInFrames={FPS * 8}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        message: 'Mùa Đông cuộc sống:\n• Khó khăn, thất bại, mất mát\n• Ai cũng phải trải qua\n• Đừng mong nó ngắn hơn\n• Hãy mong mình mạnh hơn\n\nMùa Xuân cuộc sống:\n• Cơ hội mở ra sau mỗi mùa Đông\n• Gieo hạt ngay, đừng chờ hoàn hảo\n• Đọc sách, học kỹ năng mới\n• Mùa Hạ sẽ thử thách bạn\n  bảo vệ những gì đã gieo.',
        videoSrc: '3.mp4',
        musicSrc: 'nhac-truyen-cam-hung.mp3',
        watermark: '@hoang.ai',
        durationInSeconds: 8,
      } satisfies ReelsProps}
      calculateMetadata={({props}) => {
        const duration = props.durationInSeconds ?? 8;
        return {
          durationInFrames: Math.round(duration * FPS),
        };
      }}
    />
  );
};
