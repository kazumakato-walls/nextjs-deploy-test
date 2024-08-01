"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession, signIn, signOut } from 'next-auth/react';
import { IoSettingsOutline, IoHomeSharp } from "react-icons/io5";
import { Container, TextInput, Textarea, Button, Title, Box, Notification, Select, Tabs, rem,Paper } from '@mantine/core';

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Walls Cloud System
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