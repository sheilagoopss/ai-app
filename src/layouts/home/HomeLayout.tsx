"use client";

import HomeHeader from "./HomeHeader";
import { Layout } from "antd";

const { Content } = Layout;

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <HomeHeader />
      <Content>{children}</Content>
    </Layout>
  );
};

export default HomeLayout;
