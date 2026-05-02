"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserForm } from "@/components/admin/users/UserForm";
import { api } from "@/lib/api";
import { Loader2, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<any>(`/api/users/${id}`);
        setUser(response.data || response);
      } catch (error) {
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Loading Profile</p>
          <p className="text-[10px] font-bold text-muted-foreground/40 mt-1">Retrieving user data from core...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <User className="h-10 w-10 text-destructive opacity-50" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Profile Not Found</p>
          <p className="text-[10px] font-bold text-muted-foreground/40 mt-1">The requested user does not exist in our database.</p>
        </div>
      </div>
    );
  }

  return <UserForm initialData={user} isEdit={true} />;
}
