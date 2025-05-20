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
    <Header style={{ backgroundColor: "white" }} className="h-16">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-8 h-full">
          <div className="text-2xl font-bold cursor-pointer flex items-center h-full" onClick={() => router.push("/")}>
            betzefer.ai
          </div>
          <Button
            type="text"
            onClick={() => router.push("/tools")}
            className="text-base h-full flex items-center"
          >
            AI Tools Directory
          </Button>
        </div>
        <div className="flex items-center gap-2 h-full">
          {userData ? (
            <div className="flex items-center gap-2 h-full">
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
              className="h-full flex items-center"
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
