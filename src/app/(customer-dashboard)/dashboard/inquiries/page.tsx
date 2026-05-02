import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { MessageSquare, Clock, CheckCircle, XCircle, ArrowRight, Building2, Phone } from "lucide-react";
import Link from "next/link";

// Placeholder page - Inquiries feature coming soon
export default async function CustomerInquiriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const comingSoonFeatures = [
    {
      icon: MessageSquare,
      title: "Receive Buyer Inquiries",
      desc: "Get notified when potential buyers message your business listings directly.",
    },
    {
      icon: Phone,
      title: "Direct Contact Requests",
      desc: "Manage all incoming call-back and contact requests in one place.",
    },
    {
      icon: CheckCircle,
      title: "Mark & Track Responses",
      desc: "Track which inquiries have been responded to and which are pending.",
    },
    {
      icon: Building2,
      title: "Tied to Your Listings",
      desc: "Each inquiry is linked to a specific business listing you manage.",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Inquiries</h1>
        </div>
        <p className="text-muted-foreground font-medium ml-14">
          Manage buyer messages and contact requests for your listings.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="premium-card p-10 mb-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative text-center py-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 ring-1 ring-primary/20">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary mb-4">
            <Clock className="h-3 w-3 animate-pulse" />
            Coming Soon
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-3">
            Inquiries &amp; Messages
          </h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            This feature is under active development. Once launched, buyers will be able to
            contact you directly through your business profile, and all messages will appear here.
          </p>
        </div>
      </div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {comingSoonFeatures.map(({ icon: Icon, title, desc }, idx) => (
          <div
            key={title}
            className="premium-card p-6 group animate-in fade-in zoom-in-95 duration-700"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-black text-sm text-foreground mb-1">{title}</p>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="premium-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-black text-foreground mb-1">Want to receive more inquiries?</p>
          <p className="text-sm text-muted-foreground font-medium">
            Make sure your business listings are complete and verified.
          </p>
        </div>
        <Link
          href="/dashboard/businesses"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-black text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Manage Listings <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
