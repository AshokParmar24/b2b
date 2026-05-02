import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Link from "next/link";
import { Plus, Building2, MapPin, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function CustomerBusinessesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const userId = (session.user as any).id;
  
  // Fetch only this user's businesses
  const businesses = await Business.find({ userId })
    .populate("cityId", "name")
    .populate("stateId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-black text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            My Businesses
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Manage your registered business cards and listings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard/add" className="w-full sm:w-auto">
            <Button className="w-full h-11 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Plus className="h-5 w-5 mr-2" />
              Add Business
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 w-1"></th>
                <th className="px-4 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Business Name</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Location</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">HSN Codes</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Status</th>
                <th className="px-6 py-5 text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-5 ring-8 ring-background/50">
                      <Building2 className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-xl font-black text-foreground">No businesses listed</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">Click the Add Business button to create your first listing.</p>
                  </td>
                </tr>
              ) : (
                businesses.map((b: any) => (
                  <tr key={b._id.toString()} className="group transition-all duration-300 hover:bg-background/80 relative">
                    {/* Active row indicator */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-emerald-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300 rounded-r-full" />
                    
                    <td className="px-2 py-4"></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-lg shadow-inner",
                          "bg-gradient-to-br from-primary/80 to-blue-600 text-white shadow-primary/20"
                        )}>
                          {b.businessName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{b.businessName}</p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5 truncate">{b.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        {b.cityId?.name || "Unknown City"}, {b.stateId?.name || "Unknown State"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 font-bold text-xs shadow-sm shadow-blue-500/5">
                        {b.hsnCodes?.length || 0} Codes
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.isActive ? (
                        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-destructive/10 text-destructive border border-destructive/20">
                          Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/edit/${b._id}`}>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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
