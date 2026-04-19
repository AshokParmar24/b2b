import React from "react";

export function Logo({
  className = "",
  width = 32,
  height = 32,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6c3fff" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <filter
          id="logo-glow"
          x="-8"
          y="-8"
          width="56"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur" />
        </filter>
      </defs>

      {/* Outer Glow Box */}
      <rect width="40" height="40" rx="12" fill="url(#logo-grad)" />

      {/* Abstract 'V' / Architecture Shape */}
      <path
        d="M12 14L20 28L28 14H24L20 22L16 14H12Z"
        fill="white"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
      />
      <circle cx="20" cy="11" r="2.5" fill="#00d4aa" />
    </svg>
  );
}
