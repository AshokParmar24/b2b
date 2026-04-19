"use client";

import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<"country" | "state" | "city" | "pincode">("country");
  
  return (
    <div className="animate-fadeInUp">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Location Masters</h1>
          <p className="text-gray-400">Manage cascading location database (Country → State → City → Pincode)</p>
        </div>
        <button className="btn-glow flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" /> Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-px">
        {["country", "state", "city", "pincode"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-all ${
              activeTab === tab 
                ? "border-purple-500 text-purple-400" 
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {/* Table UI */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-black/20 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy row to demonstrate UI */}
              <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                   {activeTab === "country" && "🇮🇳 India"}
                   {activeTab === "state" && "Gujarat"}
                   {activeTab === "city" && "Morbi"}
                   {activeTab === "pincode" && "363641"}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    <Check className="w-3 h-3" /> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-400 hover:text-purple-300 font-medium text-sm">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Empty State / Loading */}
        <div className="p-8 text-center text-gray-500">
          <p>No more data found for {activeTab}.</p>
        </div>
      </div>
    </div>
  );
}
