"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ShieldAlert,
  Edit,
  Ban,
  CheckCircle2,
  Plus,
  Loader2,
  Trash2,
  Users,
  Phone,
  MapPin,
  Crown,
  UserCheck,
  UserX,
  RefreshCw,
  LayoutDashboard,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleBadge from "@/components/ui/role-badge";
import { UserRole } from "@/types/models";
import { AppRoutes } from "@/lib/routes";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type FilterRole = "all" | "1" | "2";
type FilterStatus = "all" | "active" | "inactive";

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>("/api/users");
      const list: any[] = Array.isArray(res) ? res : (res?.data ?? []);
      setAllUsers(list);
      setSelectedIds(new Set());
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Client-side filter (instant, no extra network round-trip)
  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      const matchSearch = !search
        || u.name?.toLowerCase().includes(search.toLowerCase())
        || u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === Number(roleFilter);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [allUsers, search, roleFilter, statusFilter]);

  // ── Stats from full unfiltered list
  const stats = useMemo(() => ({
    total: allUsers.length,
    admins: allUsers.filter((u) => u.role === UserRole.ADMIN).length,
    members: allUsers.filter((u) => u.role === UserRole.USER).length,
    active: allUsers.filter((u) => u.isActive).length,
  }), [allUsers]);

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await api.put(`/api/users/${id}`, { isActive: !current });
      toast.success(current ? "User suspended" : "User activated");
      fetchUsers();
    } catch { toast.error("Failed to update status"); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/api/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch { toast.error("Failed to delete user"); }
  };

  const toggleSelect = (id: string) => setSelectedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;
  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(filtered.map((u) => u._id)));

  const bulkAction = async (action: "activate" | "suspend" | "delete") => {
    if (!selectedIds.size) return;
    if (action === "delete" && !confirm(`Delete ${selectedIds.size} user(s)? Cannot be undone.`)) return;
    setBulkLoading(true);
    try {
      if (action === "delete") {
        await Promise.all([...selectedIds].map((id) => api.delete(`/api/users/${id}`)));
        toast.success(`Deleted ${selectedIds.size} user(s)`);
      } else {
        const isActive = action === "activate";
        await Promise.all([...selectedIds].map((id) => api.put(`/api/users/${id}`, { isActive })));
        toast.success(`${action === "activate" ? "Activated" : "Suspended"} ${selectedIds.size} user(s)`);
      }
      fetchUsers();
    } catch { toast.error("Bulk action failed"); }
    finally { setBulkLoading(false); }
  };

  const statCards = [
    { label: "Total Users", value: stats.total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Admins", value: stats.admins, icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Members", value: stats.members, icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active", value: stats.active, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 max-w-[1400px] mx-auto pb-10">

      {/* 🎭 HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-muted-foreground/40 mb-1 text-[9px] font-black uppercase tracking-[0.2em]">
            <Link href={AppRoutes.ADMIN_DASHBOARD} className="hover:text-primary transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-3 w-3" />
              Admin
            </Link>
            <span className="opacity-20">/</span>
            <span className="text-primary/60">Users</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-5 tracking-tight group/title">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/title:opacity-100 transition-opacity duration-700" />
              <div className="relative p-3.5 rounded-[22px] bg-primary/10 text-primary transition-transform duration-500 group-hover/title:scale-110">
                <Users className="h-7 w-7 md:h-8 md:w-8" />
              </div>
            </div>
            Users Directory
          </h2>
          <p className="text-sm font-semibold text-muted-foreground/80 max-w-xl leading-relaxed">
            Manage administrators and members. Activate, suspend, or update permissions directly from the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={fetchUsers} className="h-12 w-12 rounded-[20px] font-bold p-0 border-border/40 hover:bg-foreground hover:text-background transition-all group" title="Refresh Data">
            <RefreshCw className={cn("h-4 w-4 transition-transform group-hover:rotate-180 duration-500", loading && "animate-spin")} />
          </Button>
          <Button variant="outline" className="h-12 rounded-[20px] font-bold px-6 border-border/40 hover:bg-foreground hover:text-background transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href={AppRoutes.ADMIN_USERS_ADD}>
            <Button className="h-12 rounded-[20px] bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black px-6 shadow-xl shadow-black/5 hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* 📊 STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
          { label: "Admins", value: stats.admins, icon: Crown, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20" },
          { label: "Members", value: stats.members, icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
          { label: "Active", value: stats.active, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative overflow-hidden rounded-[32px] border bg-card/40 p-1 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5",
            stat.border
          )}>
            <div className={cn(
              "absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40",
              stat.bg.replace('/5', '')
            )} />
            <div className="relative rounded-[28px] bg-background/50 p-6 h-full border border-white/5">
              <div className="flex items-center gap-5">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-[1000] text-foreground tracking-tighter">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" /> : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 h-14 rounded-[20px] bg-card/40 border-border/40 border focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all text-sm shadow-sm font-bold placeholder:text-muted-foreground/40 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <div className="flex items-center p-1 bg-muted/30 rounded-[20px] border border-border/40">
            {(["all", "1", "2"] as FilterRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all",
                  roleFilter === r
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {r === "all" ? "All Roles" : r === "1" ? "Admins" : "Members"}
              </button>
            ))}
          </div>
          
          <div className="flex items-center p-1 bg-muted/30 rounded-[20px] border border-border/40">
            {(["all", "active", "inactive"] as FilterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all",
                  statusFilter === s
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🛠️ FLOATING BULK ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-6 px-8 py-4 rounded-[32px] bg-foreground text-background shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
            <div className="flex items-center gap-3 pr-6 border-r border-background/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                {selectedIds.size}
              </div>
              <span className="text-sm font-black tracking-wide">Selected</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => bulkAction("activate")} disabled={bulkLoading}
                className="hover:bg-emerald-500/20 hover:text-emerald-400 text-emerald-500 transition-colors rounded-xl px-4 font-bold text-xs h-10">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Activate
              </Button>
              <Button size="sm" variant="ghost" onClick={() => bulkAction("suspend")} disabled={bulkLoading}
                className="hover:bg-amber-500/20 hover:text-amber-400 text-amber-500 transition-colors rounded-xl px-4 font-bold text-xs h-10">
                <UserX className="h-4 w-4 mr-2" /> Suspend
              </Button>
              <Button size="sm" variant="ghost" onClick={() => bulkAction("delete")} disabled={bulkLoading}
                className="hover:bg-destructive/20 hover:text-destructive-foreground text-destructive transition-colors rounded-xl px-4 font-bold text-xs h-10">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
            
            <button onClick={() => setSelectedIds(new Set())} className="ml-4 p-2 rounded-full hover:bg-background/20 transition-colors text-muted-foreground hover:text-background">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Premium Data Table ── */}
      <div className="rounded-[32px] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="w-16 px-6 py-5">
                  <div className="flex items-center justify-center">
                    <div
                      onClick={toggleSelectAll}
                      className={cn(
                        "h-5 w-5 rounded-md flex items-center justify-center cursor-pointer transition-all hover:scale-110",
                        allSelected ? "bg-primary border border-primary shadow-md shadow-primary/20 text-white" : "border-2 border-muted-foreground/30 bg-background"
                      )}
                    >
                      {allSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">User</th>
                <th className="px-6 py-5 text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden lg:table-cell">Contact</th>
                <th className="px-6 py-5 text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden xl:table-cell">Location</th>
                <th className="px-6 py-5 text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Role</th>
                <th className="px-6 py-5 text-left text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60 hidden md:table-cell">Plan</th>
                <th className="px-6 py-5 text-center text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Status</th>
                <th className="px-6 py-5 text-right text-[11px] font-[900] uppercase tracking-[0.2em] text-muted-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-sm font-black text-foreground">Syncing Database…</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Fetching latest user records</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-5 ring-8 ring-background/50">
                      <Users className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-xl font-black text-foreground">No users found</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                      {search || roleFilter !== "all" || statusFilter !== "all"
                        ? "Try adjusting your search query or removing some filters to see more results."
                        : "Your database is empty. Add your first user to get started."}
                    </p>
                    {(search || roleFilter !== "all" || statusFilter !== "all") && (
                      <Button onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}
                        variant="outline" className="mt-6 rounded-xl border-border/50 font-bold px-6">
                        Clear all filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u._id} 
                    className={cn(
                      "group transition-all duration-300 hover:bg-background/80 relative", 
                      selectedIds.has(u._id) && "bg-primary/[0.03] hover:bg-primary/[0.05]"
                    )}
                  >
                    {/* Active row indicator */}
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-emerald-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300 rounded-r-full" />
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div
                          onClick={() => toggleSelect(u._id)}
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center cursor-pointer transition-all hover:scale-110",
                            selectedIds.has(u._id) ? "bg-primary border border-primary text-white" : "border-2 border-muted-foreground/30 bg-background"
                          )}
                        >
                          {selectedIds.has(u._id) && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-12 w-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-[1000] text-lg shadow-inner",
                          u.role === UserRole.ADMIN 
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20" 
                            : "bg-gradient-to-br from-primary/80 to-emerald-500 text-white shadow-primary/20"
                        )}>
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{u.name}</p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5 truncate max-w-[200px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      {u.mobile ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                          <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          {u.mobileCode} {u.mobile}
                        </div>
                      ) : <span className="text-xs text-muted-foreground/30 font-bold">—</span>}
                    </td>

                    <td className="px-6 py-4 hidden xl:table-cell">
                      {u.cityId?.name || u.stateId?.name ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                          <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <span className="truncate max-w-[150px]">
                            {[u.cityId?.name, u.stateId?.name].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      ) : <span className="text-xs text-muted-foreground/30 font-bold">—</span>}
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex scale-95 origin-left">
                        <RoleBadge role={u.role} />
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      {u.planId ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold text-xs shadow-sm shadow-violet-500/5">
                          <Crown className="h-3.5 w-3.5" />
                          {u.planId.name}
                        </div>
                      ) : <span className="text-[11px] font-bold text-muted-foreground/40 bg-muted/30 px-2.5 py-1 rounded-lg">Free / Basic</span>}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleStatus(u._id, u.isActive)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs transition-all duration-300 hover:scale-105 hover:shadow-md",
                          u.isActive 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white" 
                            : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                        )}>
                        {u.isActive ? <><CheckCircle2 className="h-3.5 w-3.5" /> Active</> : <><Ban className="h-3.5 w-3.5" /> Suspended</>}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`${AppRoutes.ADMIN_USERS_EDIT}/${u._id}`}>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/50 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => toggleStatus(u._id, u.isActive)}
                          className={cn("h-9 w-9 rounded-xl border-border/50 transition-all shadow-sm", 
                            u.isActive 
                              ? "hover:bg-amber-500 hover:text-white hover:border-amber-500" 
                              : "hover:bg-emerald-500 hover:text-white hover:border-emerald-500")}>
                          {u.isActive ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => deleteUser(u._id)}
                          className="h-9 w-9 rounded-xl border-border/50 hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 PAGINATION FOOTER */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-border/30 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Showing <span className="text-foreground font-black">{filtered.length}</span> of <span className="text-foreground font-black">{allUsers.length}</span> Results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
