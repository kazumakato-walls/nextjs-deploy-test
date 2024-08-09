"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { IoSettingsOutline, IoHomeSharp } from "react-icons/io5";
import { Container, TextInput, Textarea, Button, Title, Box, Notification, Select, Tabs, rem,Paper } from '@mantine/core';
import { useAuthConfig } from '../app/providers/useAuthConfig';
import axios from 'axios';

const Header = () => {
  const { data: session } = useSession();
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  const { config } = useAuthConfig();
  const [title, setTitle] = useState<string>('Walls Cloud System');
  useEffect(() => {
    if (session != null) {
      const params =  {
        "company_id": session?.user?.data.company_id
        }
      const get_company = axios.get(backendUrl + '/company/get_company?company_id=' + session?.user?.data.company_id, config)
      .then((res) => {
        console.log(res.data)
        setTitle(res.data?.company_name)
      })
      .catch(err => {
        console.log("err:", err);
        setTitle('Walls Cloud System')
      });

      }else{
        console.log('認証情報なし')
      }
    }, [session]);

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          {title}
        </Link>
        <div className="flex items-center gap-1">
        {session?.user?.data?.user_name ? 'こんにちは、'+ session?.user?.data?.user_name +'さん' : ''}
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <button
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => (session?.user?.accessToken ? signOut() : signIn())}
          >
            {session?.user?.accessToken ? 'ログアウト' : 'ログイン'}
          </button>
          <Link href={`/profile`}>          
            <Image
              width={50}
              height={50}
              alt="profile_icon"
              src={"/default_icon.png"}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;