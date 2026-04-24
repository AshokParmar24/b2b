import React from "react";
import { UserRole, ROLE_LABELS } from "@/types";

interface RoleBadgeProps {
  role: UserRole;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <span
      className={
        role === UserRole.ADMIN
          ? "rounded border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-400"
          : "rounded border border-gray-700 bg-white/5 px-2 py-1 text-xs text-gray-300"
      }
    >
      {ROLE_LABELS[role] || "Unknown"}
    </span>
  );
};

export default RoleBadge;
