"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  MapPin,
  Upload,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME } from "@/lib/site-config";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/masters", label: "Masters", icon: MapPin },
  { href: "/admin/import", label: "Bulk Import", icon: Upload },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin")
      router.push("/dashboard");
  }, [status, session, router]);

  if (status === "loading")
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg-dark)" }}
      >
        <div className="gradient-text animate-pulse text-xl font-bold">Loading Admin...</div>
      </div>
    );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-dark)" }}>
      <aside
        className="flex w-64 flex-shrink-0 flex-col px-4 py-8"
        style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}
      >
        <div className="mb-10 flex flex-col gap-1 px-3">
          <Link
            href="/"
            className="text-decoration-none flex items-center gap-3 transition-transform hover:scale-105"
          >
            <Logo width={28} height={28} />
            <span className="gradient-text text-xl font-black">{SITE_NAME}</span>
          </Link>
          <span className="mt-2 ml-10 text-xs font-semibold tracking-wider text-orange-400 uppercase">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
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

        <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
          <p className="mb-3 px-3 text-xs text-gray-500">Signed in as Admin</p>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start gap-2 text-sm text-gray-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
