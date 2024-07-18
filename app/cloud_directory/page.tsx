"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid } from '@mantine/core';
import { Navbar } from '../../components/Navbar/Nav';
import { Storage } from '../../components/Storage/Storage';
import React from 'react';
import { GlobalProvider, useGlobalContext } from '../providers/GlobalContext';
import { Contact } from '../../components/Contact/Contact';
import { Options } from '../../components/Options/Options';

const HomeContent = () => {
  const { pageState } = useGlobalContext();

  const renderPageContent = () => {
    switch (pageState) {
      case 1:
        return <Storage />; //ファイル共有画面へ
      case 2:
        return <Contact />; //お問い合わせ画面へ
      case 3:
        return <Options />; //設定画面へ
      default:
        return <div>ページが見つかりません</div>;
    }
  };

  return (
    <Grid>
      <Grid.Col span={3}><Navbar /></Grid.Col>
      <Grid.Col span={9}>{renderPageContent()}</Grid.Col>    
    </Grid>
  );
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) router.push('/login'); 
  }, [session, status, router]);

  return (
    <GlobalProvider>
          <HomeContent />
    </GlobalProvider>
  );
}
