import { useId } from "react";
import { cn } from "@/lib/utils";

interface Voice3LogoProps {
  height?: number;
  variant?: "full" | "icon";
  className?: string;
}

// A feather/wave shape: symmetric leaf pointing upward, centered at x=16, bottom y=38, top y=4
const FEATHER_PATH = "M 16,38 C 10,28 10,14 16,4 C 22,14 22,28 16,38 Z";
const ICON_W = 32;
const ICON_H = 40;
// Full logo viewBox: icon (32) + gap (10) + text "VOICE³" (~88) = 130
const FULL_VBW = 130;

const Voice3Logo = ({ height = 32, variant = "full", className }: Voice3LogoProps) => {
  // useId() can produce colons (e.g. ":r0:") which are invalid in SVG id attributes
  const id = useId().replace(/:/g, "");

  if (variant === "icon") {
    const scale = height / ICON_H;
    return (
      <svg
        width={ICON_W * scale}
        height={height}
        viewBox={`0 0 ${ICON_W} ${ICON_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
        aria-label="Voice³"
        role="img"
      >
        <defs>
          <linearGradient id={`${id}g`} x1="16" y1="4" x2="16" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4ba6a" />
            <stop offset="100%" stopColor="#c9ab5a" />
          </linearGradient>
        </defs>
        {/* Back-left feather – dark slate */}
        <path transform="rotate(-22, 16, 38)" d={FEATHER_PATH} fill="#2d3a4f" />
        {/* Back-right feather – medium slate */}
        <path transform="rotate(22, 16, 38)" d={FEATHER_PATH} fill="#4a5f7a" />
        {/* Front centre feather – gold */}
        <path d={FEATHER_PATH} fill={`url(#${id}g)`} />
      </svg>
    );
  }

  // Full variant: icon + "VOICE³" text
  const scale = height / ICON_H;
  const totalWidth = FULL_VBW * scale;

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${FULL_VBW} ${ICON_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="Voice³"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}g`} x1="16" y1="4" x2="16" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d4ba6a" />
          <stop offset="100%" stopColor="#c9ab5a" />
        </linearGradient>
      </defs>
      {/* Back-left feather – dark slate */}
      <path transform="rotate(-22, 16, 38)" d={FEATHER_PATH} fill="#2d3a4f" />
      {/* Back-right feather – medium slate */}
      <path transform="rotate(22, 16, 38)" d={FEATHER_PATH} fill="#4a5f7a" />
      {/* Front centre feather – gold */}
      <path d={FEATHER_PATH} fill={`url(#${id}g)`} />
      {/* "VOICE" text */}
      <text
        x="42"
        y="30"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="21"
        fontWeight="bold"
        letterSpacing="2"
        fill="#c9ab5a"
      >
        VOICE
      </text>
      {/* Superscript ³ */}
      <text
        x="113"
        y="16"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="12"
        fontWeight="bold"
        fill="#d4ba6a"
      >
        ³
      </text>
    </svg>
  );
};

export default Voice3Logo;
