"use client";
import { useGetUsers } from "@/hooks/useUsers";
import { IUser } from "@/types/account";
import { Table } from "antd";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const { getUsers, isFetchingUsers } = useGetUsers();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getUsers().then((users) => setUsers(users));
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

  return <Table dataSource={users} columns={columns} loading={isFetchingUsers} />;
}
