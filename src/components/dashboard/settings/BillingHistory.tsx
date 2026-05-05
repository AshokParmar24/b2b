"use client";

import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

interface BillingHistoryProps {
  plan: any;
  planStartDate: string | Date | null;
}

export function BillingHistory({ plan, planStartDate }: BillingHistoryProps) {
  const handleDownload = () => {
    if (!plan) return;
    
    // Simulate invoice generation and download
    toast.loading("Generating your invoice PDF...", { id: "invoice" });
    
    setTimeout(() => {
      // Mock the PDF download with a success message
      toast.success("Invoice downloaded successfully!", { id: "invoice" });
      
      // We can create a simple text/csv file or just open a print window
      const invoiceContent = `
=========================================
          HETNEX PLATFORM INVOICE
=========================================
Date: ${new Date().toLocaleDateString("en-IN")}
Status: PAID

ITEM: ${plan.name} Plan Subscription
PURCHASE DATE: ${planStartDate ? new Date(planStartDate).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}

-----------------------------------------
TOTAL AMOUNT PAID: ₹${plan.price || 0}
-----------------------------------------
Thank you for using Hetnex.
      `;
      
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${plan.name.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="premium-card p-8 space-y-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-border/40 pb-4 flex items-center justify-between">
        <span>Billing History</span>
        <FileText className="h-3.5 w-3.5" />
      </h4>
      
      <div className="space-y-4">
        {plan ? (
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 transition-all hover:bg-muted/50 hover:border-border">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-sm font-black text-foreground">{plan.name} Plan Subscription</h5>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">
                  Purchased on {planStartDate ? new Date(planStartDate).toLocaleDateString("en-IN") : "Unknown Date"}
                </p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black text-[9px] uppercase">
                Paid
              </Badge>
            </div>
            
            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-sm font-black text-foreground">₹{plan.price || 0}</span>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 h-8 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                <Download className="h-3 w-3" />
                Download Bill
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-sm font-bold text-muted-foreground/40">
            No purchase history found.
          </div>
        )}
      </div>
    </div>
  );
}
