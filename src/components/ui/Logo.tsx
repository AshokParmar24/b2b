import React from "react";
import { BrandingProps } from "@/types";
import { cn } from "@/lib/utils";

/**
 * 💎 ANIMATED AMBER LOGO
 * Pulsing and shimmering version of the Square 'H' design.
 * Synced with the Amber/Orange theme.
 */
export function Logo({
  className = "",
  width = 32,
  height = 32,
}: BrandingProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-500 hover:scale-110", className)}
    >
      <defs>
        <linearGradient id="amber-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--primary-700, #b45309)" />
          <stop offset="1" stopColor="var(--primary-500, #f59e0b)" />
          <animate 
            attributeName="x1" 
            values="0%;100%;0%" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </linearGradient>
        
        <filter id="h-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Animated Brand Background */}
      <rect 
        width="40" 
        height="40" 
        rx="12" 
        fill="url(#amber-grad)" 
        className="animate-[pulse_4s_ease-in-out_infinite]"
      />

      {/* Shimmering 'H' Shape */}
      <path
        d="M12 12V28M28 12V28M12 20H28"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#h-glow)"
      >
        <animate 
          attributeName="stroke-opacity" 
          values="1;0.6;1" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </path>
    </svg>
  );
}
