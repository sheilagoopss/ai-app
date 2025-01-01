"use client";
import { useGetUsers } from "@/hooks/useUsers";
import { IUser } from "@/types/account";
import { Input, Table } from "antd";
import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { caseInsensitiveSearch } from "@/utils/caseInsensitveMatch";

export default function AdminUsersPage() {
  const { getUsers, isFetchingUsers } = useGetUsers();
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
      setFilteredUsers(users);
    });
  }, [getUsers]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const handleSearch = (searchTerm?: string) => {
    const filterColumns: (keyof IUser)[] = ["email", "name"];
    const filtered = users?.filter((val) =>
      filterColumns.some((v) =>
        caseInsensitiveSearch(val[v] || "", searchTerm),
      ),
    );
    setFilteredUsers(filtered);
  };

  return (
    <Content className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "50ch" }}
        />
      </div>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        loading={isFetchingUsers}
      />
    </Content>
  );
}
