"use client";

import React from "react";
import { Button, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  PlusOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Sider from "antd/es/layout/Sider";
import { Footer, Header } from "antd/es/layout/layout";
import { useAuth } from "@/contexts/AuthContext";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSidebar = () => {
  const { logout } = useAuth();
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
    {
      key: ROUTES.ADMIN.USERS,
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => {
        router.push(ROUTES.ADMIN.USERS);
      },
    },
    {
      key: ROUTES.ADMIN.AI_TOOLS,
      icon: <UserOutlined />,
      label: "AI Tools",
      onClick: () => {
        router.push(ROUTES.ADMIN.AI_TOOLS);
      },
    },
  ];

  return (
    <Sider width={280} theme="light">
      <Header style={{ backgroundColor: "white" }}>
        <div className="text-2xl font-bold">AI Tools</div>
      </Header>
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
        <Menu
          mode="inline"
          selectedKeys={[
            currentPath === "/" ? ROUTES.ADMIN.DASHBOARD : currentPath,
          ]}
          style={{
            borderRight: "none",
            flex: 1,
            position: "relative",
            paddingTop: 0,
          }}
          items={adminMenuItems}
        />
      </div>
      <Footer style={{ backgroundColor: "white", position: "fixed", bottom: 0 }}>
        <div className="text-center">
          <Button type="text" danger onClick={logout} icon={<LogoutOutlined />}>
            Logout
          </Button>
        </div>
      </Footer>
    </Sider>
  );
};

export default AdminSidebar;
