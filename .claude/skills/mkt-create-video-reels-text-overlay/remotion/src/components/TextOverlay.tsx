import React from 'react';
import {AbsoluteFill} from 'remotion';

interface TextOverlayProps {
  message: string;
}

const TEXT_SHADOW = `
  -2px -2px 0 rgba(0,0,0,0.85),
  -2px  0px 0 rgba(0,0,0,0.85),
  -2px  2px 0 rgba(0,0,0,0.85),
   0px -2px 0 rgba(0,0,0,0.85),
   0px  2px 0 rgba(0,0,0,0.85),
   2px -2px 0 rgba(0,0,0,0.85),
   2px  0px 0 rgba(0,0,0,0.85),
   2px  2px 0 rgba(0,0,0,0.85),
   0px  4px 6px rgba(0,0,0,0.5)
`;

export const TextOverlay: React.FC<TextOverlayProps> = ({message}) => {
  const lines = message.split('\n');

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 6,
        }}
      >
        {lines.map((line, i) => {
          const isHeader = line.trim().endsWith(':');
          const isBullet = line.trim().startsWith('•');
          const isEmpty = !line.trim();

          return (
            <div
              key={i}
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: isHeader ? 500 : 400,
                fontSize: isHeader ? 36 : 32,
                color: 'rgba(255, 255, 255, 1)',
                textAlign: 'left',
                lineHeight: 1.5,
                maxWidth: '100%',
                marginTop: isEmpty ? 16 : isHeader && i > 0 ? 24 : 0,
                paddingLeft: isBullet ? 8 : 0,
                textShadow: TEXT_SHADOW,
              }}
            >
              {line || '\u00A0'}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
