"use client";

import React from "react";
import { Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, PlusOutlined, BookOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Sider from "antd/es/layout/Sider";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSidebar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const adminMenuItems: MenuItem[] = [
    {
      key: ROUTES.ADMIN.DASHBOARD,
      icon: <UserOutlined />,
      label: "Dashboard",
      onClick: () => {
        router.push(ROUTES.ADMIN.DASHBOARD);
      },
    },
    {
      key: ROUTES.ADMIN.NEW_COURSE,
      icon: <PlusOutlined />,
      label: "New Course",
      onClick: () => {
        router.push(ROUTES.ADMIN.NEW_COURSE);
      },
    },
    {
      key: ROUTES.ADMIN.COURSES,
      icon: <BookOutlined />,
      label: "Courses",
      onClick: () => {
        router.push(ROUTES.ADMIN.COURSES);
      },
    },
  ];

  return (
    <Sider width={280} theme="light">
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          position: "fixed",
          width: "280px",
        }}
      >
        <div style={{ padding: "4px 24px 0" }}>
          {/* <Image
            src={"/images/logo.png"}
            alt="goopss logo"
            style={{ height: 64, marginBottom: 0 }}
            width={100}
            height={64}
          /> */}
          <Typography.Title level={3}>Course</Typography.Title>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          style={{
            borderRight: "none",
            flex: 1,
            position: "relative",
            paddingTop: 0,
          }}
          items={adminMenuItems}
        />
      </div>
    </Sider>
  );
};

export default AdminSidebar;
