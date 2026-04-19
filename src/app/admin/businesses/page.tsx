import { Search, Filter, MoreVertical, Eye, Power, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBusinessesPage() {
  // Setup dummy data layout since DB connection might be empty right now
  const dummyBusinesses = [
    {
      id: 1,
      name: "Acme Corp",
      owner: "John Doe",
      email: "john@acme.com",
      plan: "Enterprise",
      status: "active",
      date: "2024-03-12",
    },
    {
      id: 2,
      name: "Stark Industries",
      owner: "Tony Stark",
      email: "tony@stark.com",
      plan: "Pro",
      status: "active",
      date: "2024-03-14",
    },
    {
      id: 3,
      name: "Ollivander's Wands",
      owner: "Garrick Ollivander",
      email: "wands@diagon.com",
      plan: "Basic",
      status: "inactive",
      date: "2024-03-15",
    },
  ];

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-black text-white">Manage Businesses</h1>
          <p className="text-gray-400">View and control all global business listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-64 rounded-lg py-2 pr-4 pl-9 text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-color)" }}
            />
          </div>
          <Button variant="outline" className="gap-2 border-gray-700 text-gray-300">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-800 bg-black/30 text-xs text-gray-500 uppercase">
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
                <tr key={b.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    <p className="text-base font-bold text-white">{b.name}</p>
                    <p className="mt-1 text-xs text-gray-500">by {b.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{b.email}</p>
                    <p className="mt-1 text-xs text-gray-500">Joined: {b.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(108,63,255,0.15)",
                        color: "#a78bfa",
                        border: "1px solid rgba(108,63,255,0.3)",
                      }}
                    >
                      {b.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                        <CheckCircle className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                        <XCircle className="h-3.5 w-3.5" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-400" title="View Card">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="hover:text-orange-400" title="Toggle Status">
                        <Power className="h-4 w-4" />
                      </button>
                      <button className="hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
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
