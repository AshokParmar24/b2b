import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import User from "@/models/User";
import Plan from "@/models/Plan";
import City from "@/models/City";
import State from "@/models/State";
import Link from "next/link";
import {
  Building2,
  Search,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Tag,
  Users,
  ArrowUpRight,
  Plus,
  RefreshCw,
  MoreVertical,
  LayoutDashboard,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== UserRole.ADMIN) redirect("/login");

  const { q = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr));
  const limit = 20;

  await dbConnect();
  void User; void Plan; void City; void State;

  const filter: Record<string, any> = {};
  if (q) filter.$text = { $search: q };

  const [businesses, total] = await Promise.all([
    Business.find(filter)
      .populate("userId", "name email")
      .populate("cityId", "name")
      .populate("stateId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Business.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  const activeCount = await Business.countDocuments({ ...filter, isActive: true });
  const inactiveCount = total - activeCount;

  const statCards = [
    { label: "Total Listings", value: total, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: activeCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Inactive", value: inactiveCount, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "This Page", value: businesses.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 max-w-[1400px] mx-auto pb-10">

      {/* 🎭 HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground/40 mb-1 text-[9px] font-black uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-3 w-3" />
              Admin
            </Link>
            <span className="opacity-20">/</span>
            <span className="text-primary/60">Businesses</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <Building2 className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            Business Listings
          </h2>
          <p className="text-sm font-semibold text-muted-foreground/80 max-w-xl leading-relaxed">
            Manage all directory listings. View, edit, or remove business profiles, locations, and HSN catalog assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/businesses">
            <Button variant="outline" className="h-12 w-12 rounded-[20px] font-bold p-0 border-border/40 hover:bg-foreground hover:text-background transition-all group" title="Refresh Data">
              <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            </Button>
          </Link>
          <Button variant="outline" className="h-12 rounded-[20px] font-bold px-6 border-border/40 hover:bg-foreground hover:text-background transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/dashboard/add">
            <Button className="h-12 rounded-[20px] bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black px-6 shadow-xl shadow-black/5 hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* 📊 STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Listings", value: total, icon: Building2, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
          { label: "Active", value: activeCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
          { label: "Inactive", value: inactiveCount, icon: XCircle, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20" },
          { label: "This Page", value: businesses.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-[32px] border bg-card/40 p-1 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5",
            stat.border
          )}>
            <div className={cn(
              "absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40",
              stat.bg.replace('/5', '')
            )} />
            <div className="relative rounded-[28px] bg-background/50 p-6 h-full border border-white/5">
              <div className="flex items-center gap-5">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-[1000] text-foreground tracking-tighter">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <form method="GET" action="/admin/businesses" className="w-full">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search business name, owner, or GST..."
              className="w-full pl-12 h-14 rounded-[20px] bg-card/40 border-border/40 border focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-sm font-bold placeholder:text-muted-foreground/40 outline-none"
            />
          </form>
        </div>

        {q && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/admin/businesses">
              <Button variant="ghost" className="h-12 px-6 rounded-[20px] text-xs font-black text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                Clear Search
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* ── Premium Data Table ── */}
      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 w-12"></th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Business</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Owner</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden xl:table-cell">Location</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden lg:table-cell">HSN</th>
                <th className="px-6 py-5 text-center text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Status</th>
                <th className="px-6 py-5 text-center text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden md:table-cell">Date</th>
                <th className="px-6 py-5 text-right text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-5 ring-8 ring-background/50">
                      <Building2 className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-xl font-black text-foreground">No businesses found</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                      {q
                        ? "Try adjusting your search query to see more results."
                        : "Your directory is empty. Add your first business listing to get started."}
                    </p>
                    {q && (
                      <Link href="/admin/businesses">
                        <Button variant="outline" className="mt-6 rounded-xl border-border/50 font-bold px-6">
                          Clear search
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                businesses.map((b: any) => {
                  const city = b.cityId?.name || "";
                  const state = b.stateId?.name || "";
                  const owner = b.userId as any;

                  return (
                    <tr key={b._id.toString()} className="group transition-all duration-300 hover:bg-background/80 relative">
                      {/* Active row indicator */}
                      <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-emerald-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300 rounded-r-full" />
                      
                      <td className="px-6 py-4"></td>

                      {/* Business */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-lg shadow-inner",
                            b.logoUrl 
                                ? "bg-white border border-border/50" 
                                : "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
                          )}>
                            {b.logoUrl ? (
                              <img src={b.logoUrl} alt={b.businessName} className="w-full h-full object-contain p-1 rounded-2xl" />
                            ) : (
                              b.businessName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                            <p className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">{b.businessName}</p>
                            {b.gstNumber && (
                              <p className="text-[11px] font-mono font-bold text-muted-foreground/60 mt-0.5">{b.gstNumber}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground">{b.ownerName}</p>
                        {owner?.email && (
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5">{owner.email}</p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 hidden xl:table-cell">
                        {(city || state) ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                            <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate max-w-[150px]">
                              {[city, state].filter(Boolean).join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/30 font-bold">—</span>
                        )}
                      </td>

                      {/* HSN count */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs shadow-sm shadow-blue-500/5">
                          <Tag className="h-3.5 w-3.5" />
                          {b.hsnCodes?.length || 0}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300",
                          b.isActive 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )}>
                          {b.isActive ? <><CheckCircle className="h-3 w-3" /> Active</> : <><XCircle className="h-3 w-3" /> Inactive</>}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-center text-xs font-bold text-muted-foreground hidden md:table-cell">
                        {new Date(b.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                          <Link href={`/business/${b.slug}`} target="_blank">
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm" title="View Public Profile">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/businesses/${b._id}`}>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm" title="Manage Details">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 PAGINATION FOOTER */}
        {totalPages > 0 && (
          <div className="border-t border-border/30 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Showing Page <span className="text-foreground font-black">{page}</span> of <span className="text-foreground font-black">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/businesses?q=${q}&page=${page - 1}`}>
                  <Button variant="outline" size="sm" className="text-xs rounded-xl font-bold border-border/50 bg-background hover:bg-muted">← Prev</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/businesses?q=${q}&page=${page + 1}`}>
                  <Button variant="outline" size="sm" className="text-xs rounded-xl font-bold border-border/50 bg-background hover:bg-muted">Next →</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
