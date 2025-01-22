"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminPage from "./admin/page";
import { Spin } from "antd";
import Courses from "./courses/page";
import Scraper from "./ai-tools/page";

export default function Home() {
  const { admin, userData, loading } = useAuth();
  return loading ? (
    <Spin fullscreen />
  ) : userData ? (
    <Courses />
  ) : admin ? (
    <AdminPage />
  ) : (
    <Scraper />
  );
}
