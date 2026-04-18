"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Plus, Building2, CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { href: "/dashboard",       label: "Dashboard",     icon: LayoutDashboard },
  { href: "/dashboard/add",   label: "Add Business",  icon: Plus },
  { href: "/dashboard/cards", label: "My Cards",      icon: Building2 },
  { href: "/dashboard/plan",  label: "My Plan",       icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-dark)" }}>
      <div className="gradient-text text-xl font-bold animate-pulse">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-dark)" }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col py-8 px-4"
        style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}>
        
        <Link href="/" className="flex items-center gap-3 px-3 mb-10 text-decoration-none">
          <Logo width={32} height={32} />
          <span className="text-xl font-black gradient-text">VyapaarBiz</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-3 px-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--brand-primary)" }}>
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start text-gray-400 hover:text-red-400 gap-2 text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
