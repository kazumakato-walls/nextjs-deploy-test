"use client";

import Book from "../components/Book";
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@mantine/core';
import Link from "next/link";
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle'; 

export default function Home() {
  const { data: session } = useSession();
  const handleClick = () => {
    console.log(session)
  }
  return (
    // <main>
    <main className="flex min-h-screen flex-col items-center p-24">
      {/* <h2 className="text-center w-full font-bold text-3xl mb-2">
          Walls Cloud Directory
        </h2>

        <div className="mt-10">
        <Link href="/api/auth/signout"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Linkログアウト
        </Link>          
        <Link href="/logintest"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            セッション保護画面
        </Link>          
        <Button onClick={handleClick}>test</Button>
        </div> */}
        <Welcome />
        <ColorSchemeToggle />
        {/* {books.map((book) => (
          <Book key={book.id} book={book} />
        ))} */}
    </main>
  );
}
