"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@mantine/core';
import Link from "next/link";
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session,status  } = useSession();
  const router = useRouter();
  const handleClick = () => {
    console.log(session)
    console.log(status)
    console.log(router)    
  }
  useEffect(() => {
    if (status === 'loading') return; // ロード中は何もしない
    if (!session) router.push('/login'); // セッションがない場合はログインページへリダイレクト
  }, [session, status, router]);

  return (
    <>
        <div className="mt-10"> 
        ログイン確認おっけー画面         
        <Button onClick={handleClick}>セッション確認</Button>
        <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホームに戻る
        </Link>
        </div>
        
    </>
  );
}
