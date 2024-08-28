"use client";
// react
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

// library
import { Grid } from '@mantine/core';

// road file
import { GlobalProvider, useGlobalContext } from '../providers/GlobalContext';
import { Navbar } from '../../components/Navbar/Navbar';
import { CloudDirectory } from '../../components/CloudDirectory/CloudDirectory';
import { Profile } from '../../components/Profile/Profile';
import { Options } from '../../components/Options/Options';


const HomeContent = () => {
  const { pageState } = useGlobalContext();

  const renderPageContent = () => {
    switch (pageState) {
      case 1:
        return <CloudDirectory />; //ファイル共有画面へ
      case 2:
        return <Profile />; //お問い合わせ画面へ
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
