"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Building2, CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/add", label: "Add Business", icon: Plus },
  { href: "/dashboard/cards", label: "My Cards", icon: Building2 },
  { href: "/dashboard/plan", label: "My Plan", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg-dark)" }}
      >
        <div className="gradient-text animate-pulse text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-dark)" }}>
      {/* Sidebar */}
      <aside
        className="flex w-64 flex-shrink-0 flex-col px-4 py-8"
        style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}
      >
        <Link href="/" className="text-decoration-none mb-10 flex items-center gap-3 px-3">
          <Logo width={32} height={32} />
          <span className="gradient-text text-xl font-black">{SITE_NAME}</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t pt-6" style={{ borderColor: "var(--border-color)" }}>
          <div className="mb-4 flex items-center gap-3 px-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--brand-primary)" }}
            >
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="truncate text-xs text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start gap-2 text-sm text-gray-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
