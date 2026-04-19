import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import User from "@/models/User";
import Plan from "@/models/Plan";
import Country from "@/models/Country";
import { Building2, Users, CreditCard, Globe } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") redirect("/login");

  await dbConnect();
  const [totalBusinesses, totalUsers, totalPlans, totalCountries] = await Promise.all([
    Business.countDocuments(),
    User.countDocuments({ role: "subscriber" }),
    Plan.countDocuments({ isActive: true }),
    Country.countDocuments({ isActive: true }),
  ]);

  const stats = [
    {
      label: "Total Businesses",
      value: totalBusinesses.toLocaleString(),
      icon: Building2,
      color: "#6c3fff",
    },
    {
      label: "Total Subscribers",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "#ff6b35",
    },
    { label: "Active Plans", value: totalPlans, icon: CreditCard, color: "#00d4aa" },
    { label: "Countries", value: totalCountries, icon: Globe, color: "#f59e0b" },
  ];

  return (
    <div className="animate-fadeInUp">
      <h1 className="mb-2 text-3xl font-black">Admin Dashboard</h1>
      <p className="mb-8 text-gray-400">VyapaarBiz control center</p>

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">{label}</span>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${color}22` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick navigation cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            href: "/admin/businesses",
            title: "Manage Businesses",
            desc: "View, activate, or deactivate listing cards",
            color: "#6c3fff",
          },
          {
            href: "/admin/users",
            title: "Manage Users",
            desc: "Extend plan dates, activate/deactivate subscribers",
            color: "#ff6b35",
          },
          {
            href: "/admin/plans",
            title: "Manage Plans",
            desc: "Create and edit subscription plan tiers",
            color: "#00d4aa",
          },
          {
            href: "/admin/masters",
            title: "Location Masters",
            desc: "Add or manage Country, State, City, Pincode data",
            color: "#f59e0b",
          },
          {
            href: "/admin/import",
            title: "Bulk Import",
            desc: "Upload CSV to import 100,000+ business cards",
            color: "#ec4899",
          },
        ].map(({ href, title, desc, color }) => (
          <a key={href} href={href} className="glass-card group cursor-pointer p-6">
            <div className="mb-4 h-3 w-3 rounded-full" style={{ background: color }} />
            <h3 className="group-hover:gradient-text mb-1 font-bold text-white transition-all">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
