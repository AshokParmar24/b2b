import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";

interface PublicNavProps {
  backHref?: string;
  backLabel?: string;
}

export function PublicNav({ backHref, backLabel }: PublicNavProps) {
  return (
    <nav className="pub-nav h-16 sm:h-[72px] flex items-center px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <Logo width={34} height={34} />
          <span
            className="text-xl sm:text-2xl font-black gradient-text tracking-tight group-hover:opacity-90 transition-opacity"
          >
            {SITE_NAME}
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              ← {backLabel}
            </Link>
          )}
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Log In
          </Link>
          <Link href="/register">
            <span className="btn-glow text-sm px-4 py-2 rounded-xl">
              List Business
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
