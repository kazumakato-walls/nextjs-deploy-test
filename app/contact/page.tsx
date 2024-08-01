"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@mantine/core';
import Link from "next/link";
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation'
import {Grid} from '@mantine/core';
import { Navbar } from '../../components/Navbar/Nav';
import { Contact } from '../../components/Contact/Contact';
import { FileListProvider } from '../providers/FileList';

export default function Home() {
  const { data: session,status  } = useSession();
  const router = useRouter();
//   useEffect(() => {
//     if (status === 'loading') return; // ロード中は何もしない
//     if (!session) router.push('/login'); // セッションがない場合はログインページへリダイレクト
//   }, [session, status, router]);

  return (
    <>
      <Grid>
        <FileListProvider>
          <Grid.Col span={3}><Navbar /></Grid.Col>
          <Grid.Col span={9}><Contact /></Grid.Col>
        </FileListProvider>
      </Grid>        
    </>
  );
}
