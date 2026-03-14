import { staticFile } from "remotion";

const FONT_FAMILY = "Be Vietnam Pro";

const fontFaces = [
  { weight: 300, file: "BeVietnamPro-Light.ttf" },
  { weight: 400, file: "BeVietnamPro-Regular.ttf" },
  { weight: 500, file: "BeVietnamPro-Medium.ttf" },
  { weight: 600, file: "BeVietnamPro-SemiBold.ttf" },
  { weight: 700, file: "BeVietnamPro-Bold.ttf" },
  { weight: 800, file: "BeVietnamPro-ExtraBold.ttf" },
  { weight: 900, file: "BeVietnamPro-Black.ttf" },
];

let fontsLoaded = false;

export function loadFonts() {
  if (fontsLoaded) return;
  fontsLoaded = true;

  for (const { weight, file } of fontFaces) {
    const font = new FontFace(
      FONT_FAMILY,
      `url('${staticFile(`media/fonts/Be_Vietnam_Pro/${file}`)}')`,
      { weight: String(weight), style: "normal" }
    );
    font.load().then(() => {
      document.fonts.add(font);
    });
  }
}

export const fontFamily = `"${FONT_FAMILY}", sans-serif`;
