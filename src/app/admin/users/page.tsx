import { Search, CalendarDays, ShieldAlert, Edit, MoreVertical, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const dummyUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "subscriber", plan: "Enterprise", status: "active", joined: "2023-11-20", planEnd: "2024-11-20" },
    { id: 2, name: "Bob Smith", email: "bob@distributors.com", role: "subscriber", plan: "Pro", status: "active", joined: "2024-01-10", planEnd: "2025-01-10" },
    { id: 3, name: "Admin Setup", email: "admin@vyapaarbiz.com", role: "admin", plan: "N/A", status: "active", joined: "2023-01-01", planEnd: "N/A" },
    { id: 4, name: "Charlie Delta", email: "charlie@test.com", role: "subscriber", plan: "Basic", status: "suspended", joined: "2024-02-15", planEnd: "2024-03-15" },
  ];

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">User Management</h1>
          <p className="text-gray-400">View subscribers, extend their plans manually, or ban accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Find by name or email..." 
              className="pl-9 pr-4 py-2 rounded-lg text-sm text-white outline-none w-64 focus:border-purple-500 transition-colors"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-black/30 text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Current Plan</th>
                <th className="px-6 py-4">Plan Expiry</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {dummyUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-base">{u.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                     {u.role === "admin" ? (
                       <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-1 rounded text-xs border border-orange-500/20">Admin</span>
                     ) : (
                       <span className="text-gray-300 bg-white/5 px-2 py-1 rounded text-xs border border-gray-700">Subscriber</span>
                     )}
                  </td>
                  <td className="px-6 py-4 font-medium text-purple-300">{u.plan}</td>
                  <td className="px-6 py-4">
                     {u.planEnd === "N/A" ? <span className="text-gray-600">Lifetime</span> : (
                       <div className="flex items-center gap-2 text-gray-300">
                         <CalendarDays className="w-4 h-4 text-gray-500" />
                         <span>{u.planEnd}</span>
                       </div>
                     )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                        <Ban className="w-4 h-4" /> Banned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      {u.role !== "admin" && <button className="hover:text-purple-400" title="Extend Plan"><CalendarDays className="w-4 h-4" /></button>}
                      <button className="hover:text-blue-400" title="Edit Profile"><Edit className="w-4 h-4" /></button>
                      {u.role !== "admin" && <button className="hover:text-red-400" title="Suspend User"><ShieldAlert className="w-4 h-4" /></button>}
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
