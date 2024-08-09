import Link from "next/link";
import { Container, TextInput, Textarea, Button, Title, Box, Notification, Select, Tabs, rem,Paper   } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { IoCheckmarkSharp, IoCloseSharp  } from "react-icons/io5";

export function User() {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState<{ value: string, label: string }[]>([]);
  const [departments, setDepartments] = useState<{ value: string, label: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [alertOpened, setAlertOpened] = useState(false);
  const [message, setMessage] = useState<{ title: string, massage: string,color: string }>({title:'',massage:'',color:''});
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  
  return (
    <>
    <Container size={1000} my={40}>
      <Title>ユーザー一覧</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
       aaaa
      </Paper>
    </Container>
    </>
  );
}
