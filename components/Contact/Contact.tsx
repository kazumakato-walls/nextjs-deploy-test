'use client';
import { Container, TextInput, Textarea, Button, Title, Box, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

export function Contact() {
    const form = useForm({
        initialValues: {
          name: '',
          email: '',
          message: '',
        },
    
        validate: {
          name: (value) => value.trim().length >= 2,
          email: (value) => /^\S+@\S+$/.test(value),
        },
      });
    
      const [notification, setNotification] = useState<string | null>(null);
    
      const handleSubmit = async (values: typeof form.values) => {
        // API呼び出しやバックエンドにデータを送信するロジックをここに実装します
        setNotification('お問い合わせありがとうございます！');
      };
  return (
    <>
     <Container size="sm" mt="xl">
      <Title>お問い合わせフォーム</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="名前"
          placeholder="お名前"
          {...form.getInputProps('name')}
          required
        />
        <TextInput
          label="メールアドレス"
          placeholder="メールアドレス"
          {...form.getInputProps('email')}
          required
        />
        <Textarea
          label="メッセージ"
          placeholder="お問い合わせ内容"
          {...form.getInputProps('message')}
          required
          minRows={4}
        />
        <Button type="submit" fullWidth mt="md">
          送信
        </Button>
      </form>
      {notification && (
        <Notification mt="md">
          {notification}
        </Notification>
      )}
    </Container>
    </>
  );
}