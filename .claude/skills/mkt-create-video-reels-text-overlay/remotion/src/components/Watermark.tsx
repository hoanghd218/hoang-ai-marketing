import React from 'react';

interface WatermarkProps {
  text: string;
}

export const Watermark: React.FC<WatermarkProps> = ({text}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 40,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 300,
        fontSize: 36,
        color: 'rgba(255, 255, 255, 0.71)',
        textShadow: `
          -2px -2px 0 rgba(0,0,0,0.59),
           2px -2px 0 rgba(0,0,0,0.59),
          -2px  2px 0 rgba(0,0,0,0.59),
           2px  2px 0 rgba(0,0,0,0.59)
        `,
      }}
    >
      {text}
    </div>
  );
};
