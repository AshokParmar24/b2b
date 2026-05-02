import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Link from "next/link";
import { Plus, Building2, MapPin, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

      <div className="rounded-[32px] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/80">Business Name</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/80">Location</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/80">HSN Codes</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/80 text-center">Status</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/80 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-base font-black text-foreground">No businesses listed</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Click the Add Business button to create your first listing.</p>
                  </td>
                </tr>
              ) : (
                businesses.map((b: any) => (
                  <tr key={b._id.toString()} className="transition-colors hover:bg-muted/10 group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-foreground">{b.businessName}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{b.ownerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        {b.cityId?.name || "Unknown City"}, {b.stateId?.name || "Unknown State"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 font-bold text-xs">
                        {b.hsnCodes?.length || 0} Codes
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.isActive ? (
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive font-bold text-xs">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/edit/${b._id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary text-muted-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
