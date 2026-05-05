/**
 * 🛠️ CORE REUSABLE TYPES
 * Centralized definitions for shared data structures across the Hetnex platform.
 */

import React from "react";
export * from "./models";

// --- Navigation ---

export type NavVariant = "ghost" | "outline" | "default";
export type NavMode = "public" | "admin" | "customer";

export interface NavLink {
  label: string;
  href: string;
  variant?: NavVariant;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavbarProps {
  mode?: NavMode;
  links?: NavLink[];
}

// --- Data Entities ---

export interface BusinessProfile {
  id?: string;
  name: string;
  location: string;
  hsnCode: string;
  imageUrl: string;
  isVerified?: boolean;
  slug?: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// --- Layout & Components ---

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BrandingProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: "default" | "white" | "dark";
}
