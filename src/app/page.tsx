"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminPage from "./admin/page";
import { Spin } from "antd";
import Courses from "./courses/page";
import UserLayout from "@/layouts/user/UserLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";
import HomeLayout from "@/layouts/home/HomeLayout";
import Scraper from "./ai-tools/page";

export default function Home() {
  const { admin, userData, loading } = useAuth();
  return loading ? (
    <Spin fullscreen />
  ) : userData ? (
    <UserLayout>
      <Courses />
    </UserLayout>
  ) : admin ? (
    <AdminLayout>
      <AdminPage />
    </AdminLayout>
  ) : (
    <HomeLayout>
      <Scraper />
    </HomeLayout>
  );
}
