import {staticFile} from 'remotion';

const fontFaces = `
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('${staticFile('BeVietnamPro-Light.ttf')}') format('truetype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('${staticFile('BeVietnamPro-Regular.ttf')}') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('${staticFile('BeVietnamPro-Medium.ttf')}') format('truetype');
  font-weight: 500;
  font-style: normal;
}
`;

let injected = false;

export function ensureFontLoaded(): void {
  if (injected) return;
  const style = document.createElement('style');
  style.textContent = fontFaces;
  document.head.appendChild(style);
  injected = true;
}
