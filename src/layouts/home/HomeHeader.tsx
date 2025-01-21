"use client";

import { LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

const HomeHeader = () => {
  const router = useRouter();
  return (
    <Header style={{ backgroundColor: "white" }}>
      <div className="flex justify-between items-center py-4">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          AI Tools
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<LoginOutlined />}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default HomeHeader;
