"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter, usePathname } from "next/navigation";

const UserHeader = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Header style={{ backgroundColor: "white" }}>
      <div className="flex justify-between items-center py-4">
        <div className="text-2xl font-bold">AI Tools</div>
        <div className="flex items-center gap-2">
          <Button
            type="text"
            style={
              pathname === "/ai-tools"
                ? { fontSize: "1rem", fontWeight: "bolder" }
                : {}
            }
            onClick={() => router.push("/ai-tools")}
          >
            Tools
          </Button>
          <Button
            type="text"
            style={
              pathname === "/courses"
                ? { fontSize: "1rem", fontWeight: "bolder" }
                : {}
            }
            onClick={() => router.push("/courses")}
          >
            Courses
          </Button>
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
      </div>
    </Header>
  );
};

export default UserHeader;
