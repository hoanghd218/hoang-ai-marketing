import React from "react";
import { fontFamily } from "./fonts";

const FOOTER_TEXT = "@tranvanhoang.com";

export const Footer: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.6 * opacity,
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 22,
          fontFamily,
          fontWeight: 500,
          letterSpacing: 1,
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        {FOOTER_TEXT}
      </div>
    </div>
  );
};
