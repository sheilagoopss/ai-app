"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminPage from "./admin/page";
import Login from "./login/page";
import { Spin } from "antd";
import Courses from "./courses/page";

export default function Home() {
  const { admin, userData, loading } = useAuth();
  return loading ? (
    <Spin fullscreen />
  ) : userData ? (
    <Courses />
  ) : admin ? (
    <AdminPage />
  ) : (
    <div className="flex justify-center items-center h-screen w-full">
      <Login />
    </div>
  );
}
