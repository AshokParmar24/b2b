"use client";

import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<"country" | "state" | "city" | "pincode">("country");

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black text-white">Location Masters</h1>
          <p className="text-gray-400">
            Manage cascading location database (Country → State → City → Pincode)
          </p>
        </div>
        <button className="btn-glow flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm">
          <Plus className="h-4 w-4" /> Add New{" "}
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-800 pb-px">
        {["country", "state", "city", "pincode"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-all ${
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
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="border-b border-gray-800 bg-black/20 text-xs text-gray-300 uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy row to demonstrate UI */}
              <tr className="border-b border-gray-800/50 transition-colors hover:bg-white/5">
                <td className="flex items-center gap-3 px-6 py-4 font-medium text-white">
                  {activeTab === "country" && "🇮🇳 India"}
                  {activeTab === "state" && "Gujarat"}
                  {activeTab === "city" && "Morbi"}
                  {activeTab === "pincode" && "363641"}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                    <Check className="h-3 w-3" /> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-medium text-purple-400 hover:text-purple-300">
                    Edit
                  </button>
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
