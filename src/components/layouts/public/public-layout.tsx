import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar mode="public" />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
