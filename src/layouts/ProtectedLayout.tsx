"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Spin } from "antd";
import { redirect } from "next/navigation";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { admin, userData, loading } = useAuth();

  if (loading) {
    return <Spin fullscreen />;
  }

  if (!admin && !userData && !loading) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
