import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/models/Inquiry";
import Business from "@/models/Business";
import { MessageSquare, Clock, Building2, User, Phone, Mail, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerInquiriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  // Ensure models are registered
  void Business;
  
  const userId = (session.user as any).id;
  
  // Find all businesses owned by this user
  const userBusinesses = await Business.find({ userId }).select("_id").lean();
  const businessIds = userBusinesses.map(b => b._id);
  
  // Fetch inquiries for these businesses
  const inquiries = await Inquiry.find({ businessId: { $in: businessIds } })
    .populate("businessId", "businessName")
    .sort({ createdAt: -1 })
    .lean();

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i: any) => i.status === "pending").length,
    responded: inquiries.filter((i: any) => i.status === "responded").length,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary">
                <MessageSquare className="h-7 w-7" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-[1000] tracking-tight text-foreground">Inquiries</h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Direct messages from potential buyers and partners.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 rounded-2xl bg-card border border-border/40 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Total</p>
            <p className="text-xl font-black text-foreground">{stats.total}</p>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-primary/5 border border-primary/20 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Pending</p>
            <p className="text-xl font-black text-primary">{stats.pending}</p>
          </div>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="premium-card p-20 text-center">
          <div className="mx-auto h-24 w-24 rounded-[32px] bg-muted/30 flex items-center justify-center mb-6 ring-8 ring-background/50">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black text-foreground">No inquiries yet</h2>
          <p className="text-sm font-medium text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
            When buyers contact your businesses, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 border-b border-border/40">
                <tr>
                  <th className="px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Sender</th>
                  <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Business</th>
                  <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Message</th>
                  <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {inquiries.map((inq: any) => (
                  <tr key={inq._id.toString()} className="group hover:bg-background/80 transition-all duration-300">
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
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary/40" />
                        {inq.businessId?.businessName || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-medium text-muted-foreground truncate max-w-[200px]">
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
                          : "bg-muted/50 text-muted-foreground border-border/40"
                      )}>
                        {inq.status === "pending" ? (
                          <><Clock className="h-3 w-3" /> Pending</>
                        ) : (
                          <><CheckCircle2 className="h-3 w-3" /> {inq.status}</>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="h-9 px-4 rounded-xl bg-foreground text-background text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
