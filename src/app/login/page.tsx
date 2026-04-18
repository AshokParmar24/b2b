"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-dark)" }}>
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "var(--brand-primary)" }} />
      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fadeInUp">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black gradient-text">VyapaarBiz</Link>
          <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-gray-300 text-sm mb-1.5 block">Email Address</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
          </div>
          <div>
            <Label className="text-gray-300 text-sm mb-1.5 block">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-glow w-full py-3 rounded-xl flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">Register free</Link>
        </p>
      </div>
    </div>
  );
}
