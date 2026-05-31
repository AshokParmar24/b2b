import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Business from "@/models/Business";
import Inquiry from "@/models/Inquiry";
import City from "@/models/City";
import State from "@/models/State";
import Link from "next/link";
import { 
  Plus, 
  Building2, 
  MapPin, 
  Edit, 
  MessageSquare, 
  ShieldCheck, 
  Globe, 
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function CustomerBusinessesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const userId = (session.user as any).id;
  
  // Ensure referenced models are registered before populate
  void City; void State;
  
  // Fetch only this user's businesses
  const businessesData = await Business.find({ userId })
    .populate("cityId", "name")
    .populate("stateId", "name")
    .sort({ createdAt: -1 })
    .lean();

  // Fetch inquiry counts for each business
  const businesses = await Promise.all(businessesData.map(async (b: any) => {
    const inquiries = await Inquiry.countDocuments({ targetBusinessId: b._id });
    return { ...b, inquiryCount: inquiries };
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-foreground">My Digital Cards</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground ml-14">
            Manage your global business presence and track inquiry performance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard/add" className="w-full sm:w-auto">
            <Button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Card
            </Button>
          </Link>
        </div>
      </div>

      {/* ── BUSINESS CARDS GRID ── */}
      {businesses.length === 0 ? (
        <div className="premium-card py-24 text-center border-dashed">
          <div className="mx-auto h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center mb-6 shadow-xl shadow-primary/5 group hover:scale-110 transition-transform">
            <Building2 className="h-12 w-12 text-primary/40 group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-2xl font-[1000] text-foreground tracking-tight">No Businesses Found</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
            Your global directory starts here. List your first business to connect with thousands of buyers.
          </p>
          <Link href="/dashboard/add" className="mt-8 inline-block">
             <button className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:scale-105 transition-all">
               Get Started Now
             </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((b: any) => (
            <div 
              key={b._id.toString()} 
              className="group premium-card p-1 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Card Header Background */}
              <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[28px] flex items-end px-6 pb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-3 w-3 rounded-full animate-pulse",
                    b.isActive ? "bg-emerald-500" : "bg-destructive"
                  )} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                    {b.isActive ? "Live on Global Network" : "Inactive / Draft"}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 pt-0 -mt-8 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center font-[1000] text-2xl shadow-2xl",
                    "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-transform"
                  )}>
                    {b.businessName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/edit/${b._id}`}>
                      <button className="h-10 w-10 rounded-xl bg-background border border-border/50 text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center transition-all">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button className="h-10 w-10 rounded-xl bg-background border border-border/50 text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center transition-all">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors truncate">
                    {b.businessName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {b.cityId?.name || "City"}, {b.stateId?.name || "State"}
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 group-hover:bg-primary/5 transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Inquiries</p>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-lg font-black text-foreground">{b.inquiryCount}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 group-hover:bg-primary/5 transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Categories</p>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="text-lg font-black text-foreground">{b.hsnCodes?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/businesses/${b._id}`} className="w-full">
                  <button className="w-full h-12 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                    Card Analytics <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LOGIC EXPLANATION (Informative Section) ── */}
      <div className="premium-card p-10 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground">How Business Cards Work</h3>
            <p className="text-sm font-medium text-muted-foreground">Understanding the core logic of the HETNEX ecosystem.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Identity Association</h4>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              Every business you create is uniquely tied to your <span className="text-primary font-bold">userId</span> in our MongoDB database. This ensures only you can manage your cards, and buyers always know who they are contacting.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Dynamic Inquiries</h4>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              The "Inquiry Number" on each card is fetched in real-time. Our server counts every message where the <span className="text-primary font-bold">targetBusinessId</span> matches that card, giving you instant performance feedback.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Global Visibility</h4>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              Once marked <span className="text-primary font-bold">Active</span>, your card enters our public global directory. Buyers can search by your HSN categories or location to find your products instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
