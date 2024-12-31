import { useAuth } from "@/contexts/AuthContext";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { Header } from "antd/es/layout/layout";

const UserHeader = () => {
  const { logout } = useAuth();
  return (
    <Header style={{ backgroundColor: "white" }}>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">AI Tools</div>
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
      </div>
    </Header>
  );
};

export default UserHeader;
