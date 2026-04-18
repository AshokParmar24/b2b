"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Building2, Users, CreditCard, MapPin, Upload, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

const adminNav = [
  { href: "/admin",             label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/businesses",  label: "Businesses",  icon: Building2 },
  { href: "/admin/users",       label: "Users",       icon: Users },
  { href: "/admin/plans",       label: "Plans",       icon: CreditCard },
  { href: "/admin/masters",     label: "Masters",     icon: MapPin },
  { href: "/admin/import",      label: "Bulk Import", icon: Upload },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-dark)" }}>
      <div className="gradient-text text-xl font-bold animate-pulse">Loading Admin...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-dark)" }}>
      <aside className="w-64 flex-shrink-0 flex flex-col py-8 px-4"
        style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}>
        
        <div className="px-3 mb-10 flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 text-decoration-none transition-transform hover:scale-105">
            <Logo width={28} height={28} />
            <span className="text-xl font-black gradient-text">VyapaarBiz</span>
          </Link>
          <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider mt-2 ml-10">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
          <p className="text-xs text-gray-500 px-3 mb-3">Signed in as Admin</p>
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start text-gray-400 hover:text-red-400 gap-2 text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
