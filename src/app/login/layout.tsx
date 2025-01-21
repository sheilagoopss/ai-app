import { AuthProvider } from "@/contexts/AuthContext";
import HomeLayout from "@/layouts/home/HomeLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HomeLayout>{children}</HomeLayout>
    </AuthProvider>
  );
}
