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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2.5 tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </span>
            User Management
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Manage administrators and platform users — live from database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchUsers}
            className="h-10 w-10 rounded-2xl border-border/50 hover:bg-primary/5 hover:text-primary" title="Refresh">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Link href={AppRoutes.ADMIN_USERS_ADD}>
            <Button className="h-10 rounded-2xl bg-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all px-5">
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur p-4 flex items-center gap-3">
            <div className={cn("h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center", bg)}>
              <Icon className={cn("h-5 w-5", color)} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
              <p className="text-xl font-black text-foreground tabular-nums">{loading ? "—" : value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="h-10 w-64 rounded-2xl bg-muted/30 border border-border/40 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/20 border border-border/40 rounded-2xl p-1">
          {(["all", "1", "2"] as FilterRole[]).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn("h-8 rounded-xl px-3 text-xs font-black transition-all",
                roleFilter === r ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground")}>
              {r === "all" ? "All Roles" : r === "1" ? "Admin" : "Member"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-muted/20 border border-border/40 rounded-2xl p-1">
          {(["all", "active", "inactive"] as FilterStatus[]).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("h-8 rounded-xl px-3 text-xs font-black transition-all capitalize",
                statusFilter === s ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground")}>
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>

        {(search || roleFilter !== "all" || statusFilter !== "all") && (
          <button onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}
            className="text-xs font-black text-muted-foreground hover:text-primary transition-colors underline underline-offset-2">
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 animate-in slide-in-from-top-2 duration-300">
          <span className="text-sm font-black text-primary">{selectedIds.size} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => bulkAction("activate")} disabled={bulkLoading}
              className="h-8 rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 font-bold text-xs px-3">
              <UserCheck className="h-3.5 w-3.5 mr-1.5" /> Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkAction("suspend")} disabled={bulkLoading}
              className="h-8 rounded-xl border-amber-500/30 text-amber-600 hover:bg-amber-500/10 font-bold text-xs px-3">
              <UserX className="h-3.5 w-3.5 mr-1.5" /> Suspend
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkAction("delete")} disabled={bulkLoading}
              className="h-8 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 font-bold text-xs px-3">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs font-black text-muted-foreground hover:text-foreground ml-1">✕ Deselect</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-[28px] border border-border/40 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border/30">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                    className="h-4 w-4 rounded accent-primary cursor-pointer" />
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">User</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 hidden md:table-cell">Contact</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 hidden lg:table-cell">Location</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Role</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 hidden sm:table-cell">Plan</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Status</th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Loader2 className="h-7 w-7 animate-spin mx-auto text-primary/40" />
                    <p className="mt-3 text-sm font-bold text-muted-foreground/60">Loading users…</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                      <Users className="h-7 w-7 text-muted-foreground/30" />
                    </div>
                    <p className="text-base font-black text-foreground">No users found</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      {search || roleFilter !== "all" || statusFilter !== "all"
                        ? "No users match the current filters."
                        : "Add your first user to get started."}
                    </p>
                    {(search || roleFilter !== "all" || statusFilter !== "all") && (
                      <button onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}
                        className="mt-3 text-xs font-black text-primary hover:underline">
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className={cn("group transition-colors hover:bg-primary/[0.02]", selectedIds.has(u._id) && "bg-primary/5")}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selectedIds.has(u._id)} onChange={() => toggleSelect(u._id)}
                        className="h-4 w-4 rounded accent-primary cursor-pointer" />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm uppercase">
                          {u.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-foreground truncate">{u.name}</p>
                          <p className="text-[11px] font-medium text-muted-foreground mt-0.5 truncate max-w-[180px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {u.mobile ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-primary/50" />
                          {u.mobileCode} {u.mobile}
                        </span>
                      ) : <span className="text-[11px] text-muted-foreground/30 font-bold">—</span>}
                    </td>

                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {u.cityId?.name || u.stateId?.name ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary/50" />
                          {[u.cityId?.name, u.stateId?.name].filter(Boolean).join(", ")}
                        </span>
                      ) : <span className="text-[11px] text-muted-foreground/30 font-bold">—</span>}
                    </td>

                    <td className="px-4 py-3.5"><RoleBadge role={u.role} /></td>

                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {u.planId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 font-bold text-[11px]">
                          <Crown className="h-3 w-3" />{u.planId.name}
                        </span>
                      ) : <span className="text-[11px] font-bold text-muted-foreground/30">No Plan</span>}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => toggleStatus(u._id, u.isActive)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all hover:scale-105 cursor-pointer",
                          u.isActive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        )}>
                        {u.isActive ? <><CheckCircle2 className="h-3.5 w-3.5" /> Active</> : <><Ban className="h-3.5 w-3.5" /> Suspended</>}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Link href={`${AppRoutes.ADMIN_USERS_EDIT}/${u._id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-blue-500/10 hover:text-blue-500">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(u._id, u.isActive)}
                          className={cn("h-8 w-8 rounded-xl", u.isActive ? "hover:bg-amber-500/10 hover:text-amber-500" : "hover:bg-emerald-500/10 hover:text-emerald-500")}>
                          {u.isActive ? <ShieldAlert className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(u._id)}
                          className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && (
          <div className="border-t border-border/20 px-6 py-3 flex items-center justify-between bg-muted/10">
            <p className="text-xs font-bold text-muted-foreground">
              {filtered.length === allUsers.length
                ? <><span className="text-foreground">{allUsers.length}</span> total users</>
                : <><span className="text-foreground">{filtered.length}</span> of {allUsers.length} users</>}
              {selectedIds.size > 0 && <> · <span className="text-primary">{selectedIds.size} selected</span></>}
            </p>
            {selectedIds.size > 0 && (
              <button onClick={() => setSelectedIds(new Set())} className="text-xs font-black text-muted-foreground hover:text-foreground">
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
