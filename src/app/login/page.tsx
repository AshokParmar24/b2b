"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="absolute top-0 left-1/3 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--brand-primary)" }}
      />
      <div className="glass-card animate-fadeInUp relative z-10 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="gradient-text text-2xl font-black">
            {SITE_NAME}
          </Link>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-1.5 block text-sm text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
            />
          </div>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl py-3"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300">
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
}
