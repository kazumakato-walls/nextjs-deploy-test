import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Title, Paper, Table, Button, ScrollArea,Notification } from '@mantine/core';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { IoCheckmarkSharp, IoCloseSharp  } from "react-icons/io5";
// ユーザーデータの型を定義
interface User {
  id: number;
  personal_id: string;
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
  const [messageState, setMessageState] = useState<{ title: string, state: string, color: string}>({title:'', state:'', color:''});
  // const [message, setMessage] = useState<{ title: string, massage: string }>({title:'',massage:''})
  const [deleteMessage, setDeleteMessage] = useState<{ user_name: string, personal_ID: string, company_name: string }>({user_name:'', personal_ID:'', company_name:''})
  
  const [alertOpened, setAlertOpened] = useState(false);
  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    },
  };

  const getUserList = async () => {
    console.log(session?.user?.data)
    try {
      const res = await axios.get<User[]>(`${backendUrl}/user/get_all_user`, config);
      console.log(res.data)
      setUsers(res.data);
    } catch (err) {
      console.error("err:", err);
    }
  };

  const deleteUser = async (user: any) => {
    console.log('User_ID:' + user.id)
    try {
      const res = await axios.delete(`${backendUrl}/user/delete_user`,{ ...config, data: { 'user_id': user.id } });      
      setMessageState({title:'削除が完了しました。', state:'OK', color:'teal'})
      setDeleteMessage({user_name:user.user_name, personal_ID:user.personal_id, company_name:user.company_name})      
      setAlertOpened(true)
      getUserList()    
    } catch (err) {
      setMessageState({title:'エラー', state:'NG', color:'red'})
      setAlertOpened(true)    
      console.error("err:", err);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      getUserList();
    }
  }, [status]);

  return (
    <Container size={9000} my={40}>
      <Title>ユーザーリスト</Title>
      {alertOpened && (
          <Notification icon={messageState.title === 'OK' ? <IoCheckmarkSharp /> : <IoCloseSharp />}  
                        color={messageState.color} 
                        title={messageState.title} 
                        onClose={() => setAlertOpened(false)}>
            {messageState.state === 'OK' ? (
            <>
              <p>会社名：{deleteMessage.company_name}</p>
              <p>パーソナルID：{deleteMessage.personal_ID}</p>
              <p>ユーザー名：{deleteMessage.user_name}</p>
            </>
          ) : (
            <p>削除に失敗しました。再試行してください。</p>
          )}              
          </Notification>
      )}

      <Paper withBorder shadow="md" p={10} mt={10} radius="md">
        <Table.ScrollContainer minWidth={2000} h={600}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={60}>ID</Table.Th>
              <Table.Th w={80}>パーソナルID</Table.Th>
              <Table.Th w={80}>会社ID</Table.Th>
              <Table.Th w={350}>会社名</Table.Th>
              <Table.Th w={80}>部署ID</Table.Th>
              <Table.Th w={200}>部署名</Table.Th>
              <Table.Th w={300}>ユーザー名</Table.Th>
              <Table.Th w={200}>かな名</Table.Th>
              <Table.Th w={200}>email</Table.Th>
              <Table.Th w={100}>容量</Table.Th>
              <Table.Th w={100}>生年月日</Table.Th>
              <Table.Th w={70}>性別</Table.Th>
              <Table.Th w={80}>permission</Table.Th>
              <Table.Th w={80}>admin</Table.Th>
              <Table.Th w={80}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.personal_id}>
                <Table.Td>{user.id}</Table.Td>
                <Table.Td>{user.personal_id}</Table.Td>
                <Table.Td>{user.company_id}</Table.Td>
                <Table.Td>{user.company_name}</Table.Td>
                <Table.Td>{user.department_id}</Table.Td>
                <Table.Td>{user.department_name}</Table.Td>
                <Table.Td>{user.user_name}</Table.Td>
                <Table.Td>{user.name_kana}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{Math.round(user.storage / 1048576) + 'GB'}</Table.Td>
                <Table.Td>{user.age}</Table.Td>
                <Table.Td>{user.sex}</Table.Td>
                <Table.Td>{user.permission.toString()}</Table.Td>
                <Table.Td>{user.admin.toString()}</Table.Td>
                <Table.Td><Button onClick={() => deleteUser(user)}>削除</Button></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
        <Button onClick={getUserList}>更新</Button>
      </Paper>
    </Container>
  );
}
