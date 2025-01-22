"use client";

import UserHeader from "./UserHeader";
import { Layout } from "antd";

const { Content } = Layout;

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <UserHeader />
      <Content>{children}</Content>
    </Layout>
  );
};

export default UserLayout;
