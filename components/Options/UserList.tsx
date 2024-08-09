import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Title, Paper, Table, Button } from '@mantine/core';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// ユーザーデータの型を定義
interface User {
  id: number;
  company_id: number;
  company_name: string;
  department_id: number;
  department_name: string;
  user_name: string;
  name_kana: string;
  email: string;
  storage: number;
  age: string;
  sex: string;
  permission: string;
  admin: string;
}

export function UserLists() {
  const { data: session, status } = useSession();
  const backendUrl = process.env.NEXT_PUBLIC_URL as string;
  const [users, setUsers] = useState<User[]>([]);

  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    },
  };

  const getUserList = async () => {
    try {
      const res = await axios.get<User[]>(`${backendUrl}/user/get_all_user`, config);
      console.log(res.data)
      setUsers(res.data);
    } catch (err) {
      console.error("err:", err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      getUserList();
    }
  }, [status]);

  return (
    <Container size={1000} my={40}>
      <Title>ユーザーリスト</Title>
      <Paper withBorder shadow="md" p={10} mt={10} radius="md">
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>会社ID</th>
              <th>会社名</th>
              <th>部署ID</th>
              <th>部署名</th>
              <th>ユーザー名</th>
              <th>かな名</th>
              <th>email</th>
              <th>容量</th>
              <th>生年月日</th>
              <th>性別</th>
              <th>permission</th>
              <th>admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id + user.company_id}>
                <td>{user.id}</td>
                <td>{user.company_id}</td>
                <td>{user.company_name}</td>
                <td>{user.department_id}</td>
                <td>{user.department_name}</td>
                <td>{user.user_name}</td>
                <td>{user.name_kana}</td>
                <td>{user.email}</td>
                <td>{Math.round(user.storage / 1048576) + 'GB'}</td>
                <td>{user.age}</td>
                <td>{user.sex}</td>
                <td>{user.permission.toString()}</td>
                <td>{user.admin.toString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={getUserList}>取得</Button>
      </Paper>
    </Container>
  );
}
