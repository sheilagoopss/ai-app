"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "./admin/AdminLayout";
import UserLayout from "./user/UserLayout";
import HomeLayout from "./home/HomeLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { admin, userData } = useAuth();

  return (
    <>
      {admin ? (
        <AdminLayout>{children}</AdminLayout>
      ) : userData ? (
        <UserLayout>{children}</UserLayout>
      ) : (
        <HomeLayout>{children}</HomeLayout>
      )}
    </>
  );
};

export default Layout;
