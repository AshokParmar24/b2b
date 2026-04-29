import { UserRole } from "./models";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    planId?: string | null;
    planEndDate?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    planId?: string | null;
    planEndDate?: string | null;
  }
}
