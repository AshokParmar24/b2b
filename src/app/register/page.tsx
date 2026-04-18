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
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    state: "", city: "", pincode: "" 
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
    
    setLoading(true); setError("");
    
    // Combine names for the current database schema
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email: form.email, password: form.password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-dark)" }}>
      <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "var(--brand-secondary)" }} />
      <div className="glass-card w-full max-w-xl p-8 relative z-10 animate-fadeInUp my-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-3 text-decoration-none">
            <Logo width={36} height={36} />
            <span className="text-3xl font-black gradient-text tracking-tight">VyapaarBiz</span>
          </Link>
          <p className="text-gray-400 mt-3 text-sm">Create your free business account</p>
        </div>
        
        {success ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 font-bold text-xl">Account Created!</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting to login dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">First Name</Label>
                <Input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                  placeholder="John" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Last Name</Label>
                <Input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                  placeholder="Doe" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Email Address</Label>
              <Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@company.com" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Password</Label>
                <Input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min. 6 characters" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Confirm Password</Label>
                <Input type="password" required minLength={6} value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                  placeholder="Confirm password" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 pb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">State</Label>
                <Input required value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                  placeholder="e.g. Gujarat" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">City</Label>
                <Input required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                  placeholder="City" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Pincode</Label>
                <Input required value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})}
                  placeholder="000 000" className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500" />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-md border border-red-900/50">{error}</p>}
            
            <button type="submit" disabled={loading} className="btn-glow w-full py-3.5 mt-2 rounded-xl flex items-center justify-center gap-2 text-base">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
        <p className="text-center text-gray-500 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
