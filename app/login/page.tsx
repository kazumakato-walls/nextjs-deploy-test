"use client";
// pages/auth/signin.tsx
import { signIn, getCsrfToken } from 'next-auth/react'
import { Button, TextInput, Paper, Title, Container } from '@mantine/core';
import { getProviders } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const personal_id = formData.get('personal_id') as string;
    const password = formData.get('password') as string;
    console.log(personal_id)

   const result = await signIn('credentials', {
      redirect: false,
      personal_id,
      password
    });
    
    console.log(result)
    if (result?.error) {
      alert("ログインに失敗しました。");
    } else {
      window.location.href = '/';
    }    
  };
  
  return (
    <Container size={420} my={40}>
      <Title>ログイン</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSignIn}>
          <TextInput
            label="personal_id"
            name="personal_id"
            required
            placeholder="Your Personal ID"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            required
            placeholder="Your Password"
          />
          <Button fullWidth mt="lg" type="submit">
            ログイン
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
