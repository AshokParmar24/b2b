import { Search, Filter, MoreVertical, Eye, Power, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBusinessesPage() {
  // Setup dummy data layout since DB connection might be empty right now
  const dummyBusinesses = [
    { id: 1, name: "Acme Corp", owner: "John Doe", email: "john@acme.com", plan: "Enterprise", status: "active", date: "2024-03-12" },
    { id: 2, name: "Stark Industries", owner: "Tony Stark", email: "tony@stark.com", plan: "Pro", status: "active", date: "2024-03-14" },
    { id: 3, name: "Ollivander's Wands", owner: "Garrick Ollivander", email: "wands@diagon.com", plan: "Basic", status: "inactive", date: "2024-03-15" },
  ];

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Manage Businesses</h1>
          <p className="text-gray-400">View and control all global business listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="pl-9 pr-4 py-2 rounded-lg text-sm text-white outline-none w-64"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            />
          </div>
          <Button variant="outline" className="border-gray-700 text-gray-300 gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Business & Owner</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Subscriber Plan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {dummyBusinesses.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-base">{b.name}</p>
                    <p className="text-gray-500 text-xs mt-1">by {b.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{b.email}</p>
                    <p className="text-gray-500 text-xs mt-1">Joined: {b.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(108,63,255,0.15)", color: "#a78bfa", border: "1px solid rgba(108,63,255,0.3)" }}>
                      {b.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-400" title="View Card"><Eye className="w-4 h-4" /></button>
                      <button className="hover:text-orange-400" title="Toggle Status"><Power className="w-4 h-4" /></button>
                      <button className="hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
