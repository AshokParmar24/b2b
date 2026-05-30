"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, Lock, Ship, Box, ArrowRightLeft, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function CompanyTradeDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await api.get<any>(`/api/companies/${id}/shipments?limit=15`);
        // Handle API response mapping if wrapped in { data }
        setData(res.data ? res : { data: res });
      } catch (error) {
        console.error("Failed to fetch shipments", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchShipments();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pub-dark flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-teal)]" />
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="pub-dark flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-black mb-2">No Trade Data Found</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any public shipment records for this company. 
          They may not engage in international trade or their records are protected.
        </p>
      </div>
    );
  }

  const shipments = data.data;
  const isUnlocked = data.isUnlocked;
  
  // Prepare Mock Chart Data based on actual shipments
  const chartData = shipments.map((s: any) => ({
    date: format(new Date(s.date), "MMM dd"),
    value: s.valueUSD,
  })).reverse();

  return (
    <div className="pub-dark min-h-screen pb-20">
      <div className="responsive-container pt-10">
        
        {/* Header Section */}
        <div className="glass-card p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="hsn-tag">GLOBAL TRADER</span>
              {!isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <Lock className="h-3 w-3" /> Data Blurred
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
              {data.company?.name || "Unknown Company"}
            </h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <Ship className="h-4 w-4" /> Analyzing {data.pagination?.total || 0} Shipment Records
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            {!isUnlocked && (
              <button className="btn-glow flex-1 md:flex-none h-12 px-8 rounded-xl flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" />
                Unlock Full Report (-1 Credit)
              </button>
            )}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="glass-card p-6 lg:col-span-2 min-h-[300px] flex flex-col">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--brand-teal)]" />
              Trade Volume Trend (USD)
            </h3>
            <div className="flex-1 w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#04050f', border: '1px solid rgba(0,184,148,0.3)', borderRadius: '12px' }}
                    itemStyle={{ color: '#00b894', fontWeight: 900 }}
                  />
                  <Line type="monotone" dataKey="value" stroke="url(#colorUv)" strokeWidth={4} dot={{ fill: '#04050f', stroke: '#00b894', strokeWidth: 2, r: 4 }} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00b894" />
                      <stop offset="100%" stopColor="#003566" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="glass-card p-6 flex flex-col gap-4">
             <h3 className="text-lg font-black mb-2">Trade Summary</h3>
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Value Traded</span>
               <span className="text-3xl font-black text-white">
                 ${(shipments.reduce((sum: number, s: any) => sum + (s.valueUSD || 0), 0) / 1000000).toFixed(2)}M
               </span>
             </div>
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary HS Code</span>
               <span className="text-xl font-black text-[var(--brand-teal)]">
                 {shipments[0]?.hsnCode || "N/A"}
               </span>
             </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Box className="h-5 w-5 text-white/50" />
              Recent Shipments
            </h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product (HS Code)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trading Partner</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.map((shipment: any, idx: number) => (
                  <tr key={shipment._id || idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-300">
                      {format(new Date(shipment.date), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border",
                        shipment.type === "Export" 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {shipment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-300 max-w-[200px] truncate" title={shipment.productDescription}>
                          {shipment.productDescription}
                        </span>
                        <span className="text-[10px] text-[var(--brand-teal)] font-black tracking-wider">
                          HS: {shipment.hsnCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {shipment.isBlurred ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-32 skeleton" />
                          <Lock className="h-3.5 w-3.5 text-amber-500/50" />
                        </div>
                      ) : (
                        <span className="font-bold text-white">{shipment.partnerName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-200">
                      ${shipment.valueUSD?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
