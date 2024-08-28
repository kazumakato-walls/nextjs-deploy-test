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
      axios.get(backendUrl + '/company/get_company?company_id=' + session?.user?.data.company_id, config)
        .then((res) => {
          console.log(res.data)
          setTitle(res.data?.company_name)
        })
        .catch(err => {
          console.log("err:", err);
          setTitle('Walls Cloud System')
        });
    } else {
      console.log('認証情報なし')
    }
  }, [session]);

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        {/* 左側: タイトル */}
        <div className="flex items-center">
          <Link href={"/"} className="text-xl font-bold">
            {title}
          </Link>
        </div>

        {/* 右側: その他の要素 */}
        <div className="flex flex-col items-end space-y-2">
          <div className="text-gray-300 text-sm font-medium">
            {session?.user?.data?.user_name ? 'こんにちは、'+ session?.user?.data?.user_name +'さん' : ''}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white text-sm font-medium">
              ホーム
            </Link>

            <button
              className="text-gray-300 hover:text-white text-sm font-medium"
              onClick={() => (session?.user?.accessToken ? signOut({redirect: true,callbackUrl: '/'}) : signIn())}
            >
              {session?.user?.accessToken ? 'ログアウト' : 'ログイン'}
            </button>

            {/* {session?.user?.accessToken && (
              <Link href={`/profile`}>
                <Image
                  width={50}
                  height={50}
                  alt="profile_icon"
                  src={"/default_icon.png"}
                />
              </Link>
            )} */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
