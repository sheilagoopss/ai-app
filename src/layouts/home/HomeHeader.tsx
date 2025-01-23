"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

const HomeHeader = () => {
  const router = useRouter();
  const { userData, logout } = useAuth();
  
  return (
    <Header style={{ backgroundColor: "white" }}>
      <div className="flex justify-between items-center py-4">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          AI Tools
        </div>
        <div className="flex items-center gap-2">
          {userData ? (
            <div className="flex items-center gap-2">
            <Popover
              content={
                <Button
                  type="text"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={logout}
                >
                  Logout
                </Button>
              }
              trigger="click"
            >
              <Button shape="circle" icon={<UserOutlined />} />
            </Popover>
          </div>
          ) : (
            <Button
              icon={<LoginOutlined />}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HomeHeader;
