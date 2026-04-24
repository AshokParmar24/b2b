import { CustomerLayout } from "@/components/layouts/customer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <CustomerLayout>{children}</CustomerLayout>;
}
