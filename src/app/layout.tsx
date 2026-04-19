import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "VyapaarBiz — Global B2B Business Directory", template: "%s | VyapaarBiz" },
  description:
    "Find and connect with verified dealers, manufacturers, and distributors across India and the world. Search by HSN codes, products, location, and more.",
  keywords: [
    "B2B directory",
    "business directory",
    "HSN code search",
    "dealer directory",
    "ceramic dealers",
  ],
  metadataBase: new URL("https://vyapaarbiz.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
