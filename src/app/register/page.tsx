"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    // Combine names for the current database schema
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email: form.email, password: form.password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="absolute top-0 right-1/3 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--brand-secondary)" }}
      />
      <div className="glass-card animate-fadeInUp relative z-10 my-8 w-full max-w-xl p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="text-decoration-none inline-flex items-center gap-3">
            <Logo width={36} height={36} />
            <span className="gradient-text text-3xl font-black tracking-tight">VyapaarBiz</span>
          </Link>
          <p className="mt-3 text-sm text-gray-400">Create your free business account</p>
        </div>

        {success ? (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
            <p className="text-xl font-bold text-green-400">Account Created!</p>
            <p className="mt-2 text-sm text-gray-400">Redirecting to login dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">First Name</Label>
                <Input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">Last Name</Label>
                <Input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block text-sm text-gray-300">Email Address</Label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">Password</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">Confirm Password</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-3 pt-2 pb-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">State</Label>
                <Input
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Gujarat"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">City</Label>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm text-gray-300">Pincode</Label>
                <Input
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  placeholder="000 000"
                  className="border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-red-900/50 bg-red-900/20 py-2 text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
