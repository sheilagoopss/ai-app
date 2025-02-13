"use client";

import AdminSidebar from "@/layouts/admin/AdminSidebar";
import { Layout, Spin } from "antd";
import { Suspense } from "react";
import ProtectedLayout from "../ProtectedLayout";

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <Layout className="bg-white">
        <AdminSidebar />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen w-full">
              <Spin />
            </div>
          }
        >
          <Content style={{ padding: "2ch" }}>{children}</Content>
        </Suspense>
      </Layout>
    </ProtectedLayout>
  );
}
