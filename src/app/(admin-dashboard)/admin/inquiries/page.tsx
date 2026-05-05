import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import Business from "@/models/Business";
import User from "@/models/User";
import { MessageSquare, Clock, Building2, User as UserIcon, Mail, Phone, Trash2, CheckCircle2, ChevronRight, Filter, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await dbConnect();
  // Ensure models are registered
  void Business; void User;
  
  const inquiries = await Inquiry.find()
    .populate("businessId", "businessName")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i: any) => i.status === "pending").length,
    responded: inquiries.filter((i: any) => i.status === "responded").length,
    closed: inquiries.filter((i: any) => i.status === "closed").length,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 max-w-[1400px] mx-auto pb-10">
      
      {/* 🎭 HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground/40 mb-1 text-[9px] font-black uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span className="opacity-20">/</span>
            <span className="text-primary/60">Inquiries</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <MessageSquare className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            Manage Inquiries
          </h2>
          <p className="text-sm font-semibold text-muted-foreground/80 max-w-xl leading-relaxed">
            Monitor and moderate messages sent by potential buyers to registered businesses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-12 rounded-[20px] font-bold px-6 border-border/40 hover:bg-foreground hover:text-background transition-all">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* 📊 STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Inquiries", value: stats.total, icon: MessageSquare, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20" },
          { label: "Responded", value: stats.responded, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
          { label: "Closed", value: stats.closed, icon: Trash2, color: "text-muted-foreground", bg: "bg-muted/5", border: "border-border/20" },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-[32px] border bg-card/40 p-1 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5",
            stat.border
          )}>
             <div className="relative rounded-[28px] bg-background/50 p-6 h-full border border-white/5">
              <div className="flex items-center gap-5">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">{stat.label}</p>
                  <p className="text-3xl font-[1000] text-foreground tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── DATA TABLE ── */}
      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Sender</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Business Target</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Message Snippet</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Status</th>
                <th className="px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-5 ring-8 ring-background/50">
                      <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-xl font-black text-foreground">No inquiries found</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                      All messages from the public directory will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq: any) => (
                  <tr key={inq._id.toString()} className="group hover:bg-background/80 transition-all duration-300 relative">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-foreground group-hover:text-primary transition-colors">{inq.name}</span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                            <Mail className="h-3 w-3" /> {inq.email}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                            <Phone className="h-3 w-3" /> {inq.mobile}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary/40" />
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                          {inq.businessId?.businessName || "Deleted Business"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-medium text-muted-foreground truncate max-w-[250px]">
                        {inq.message}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        inq.status === "pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : inq.status === "responded"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {inq.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-primary hover:text-white transition-all shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
