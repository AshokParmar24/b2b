import React from "react";
import { SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
  isSpan?: boolean;
}

/**
 * 🏷️ DYNAMIC BRAND NAME COMPONENT
 * Renders the SITE_NAME with the signature "Teal Last Letter" aesthetic.
 * Centralizes the brand identity across the entire project.
 */
export function BrandName({ className, isSpan = false }: BrandNameProps) {
  const name = SITE_NAME.toUpperCase();
  const mainPart = name.slice(0, -1);
  const lastLetter = name.slice(-1);

  const content = (
    <>
      {mainPart}
      <span className="text-[var(--brand-teal, #00b894)]">{lastLetter}</span>
    </>
  );

  const baseStyles = cn("font-[1000] tracking-tighter uppercase leading-none text-slate-900", className);

  if (isSpan) {
    return <span className={baseStyles}>{content}</span>;
  }

  return <h1 className={baseStyles}>{content}</h1>;
}
