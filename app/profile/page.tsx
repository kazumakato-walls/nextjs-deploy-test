"use client";
// react
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, TextInput, Paper, Title, Container } from '@mantine/core';
// library
import { Grid } from '@mantine/core';

// road file
import { GlobalProvider, useGlobalContext } from '../providers/GlobalContext';
import { Navbar } from '../../components/Navbar/Navbar';
import { CloudDirectory } from '../../components/CloudDirectory/CloudDirectory';
import { Contact } from '../../components/Contact/Contact';
import { Profile } from '../../components/Profile/Profile';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) router.push('/login'); 
  }, [session, status, router]);

  return (
    <GlobalProvider>
          <Profile />
    </GlobalProvider>
  );
}
