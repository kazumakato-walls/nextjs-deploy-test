import Link from "next/link";
import { Container, TextInput, Button, Title, Paper, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Notification, rem } from '@mantine/core';
import { CiCircleCheck } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCheckmarkSharp, IoCloseSharp  } from "react-icons/io5";

export function EditPassword() {
  const { data: session, status } = useSession();
  const [alertOpened, setAlertOpened] = useState(false);
  const [message, setMessage] = useState<{ title: string, massage: string,color: string }>({title:'',massage:'',color:''});
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    },
  };

  const form = useForm({
    initialValues: {
      password: '',
      new_password: ''
    },
    validate: {
      password: (value) => value.trim().length >= 8 && value.trim().length <= 20 ? null : 'パスワードは8文字以上20文字以下で入力してください。',
      new_password: (value) => validatePassword(value)
    },
  });

  const validatePassword = (value: string) => {
    if (value.trim().length < 8 || value.trim().length > 20) {
      return 'パスワードは8文字以上20文字以下で入力してください。';
    }
    if (!/[A-Z]/.test(value)) {
      return 'パスワードには少なくとも1つの大文字を含める必要があります。';
    }
    if (!/[a-z]/.test(value)) {
      return 'パスワードには少なくとも1つの小文字を含める必要があります。';
    }
    if (!/[0-9]/.test(value)) {
      return 'パスワードには少なくとも1つの数字を含める必要があります。';
    }
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    //   return 'パスワードには少なくとも1つの特殊文字を含める必要があります。';
    // }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validate().hasErrors) {
      console.log('Validation errors:', form.errors);
      return;
    }
    const data =  {            
        "password": form.values.password,
        "new_password": form.values.new_password
        }
    console.log(data)
    const editcompany = axios.put(backendUrl + '/user/update_password',data,config)
    .then((res) => {
        console.log(res.data)
        setMessage({title: 'Succeeded', massage: 'パスワードを変更しました。',color: 'teal'})
        setAlertOpened(true)
      })
    .catch(err => {
        console.log("err:", err);
        setMessage({title: 'Error', massage: 'パスワードの変更に失敗しました。',color: 'red'})
        setAlertOpened(true)
      });
  };
  return (
    <Container size={1000} my={40}>
      <Title>パスワード変更</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="パスワード"
            name="password"
            placeholder="英小文字、数字、ハイフンのみ"
            type='password'
            required
            {...form.getInputProps('password')}
          />
          <TextInput
            label="新しいパスワード"
            name="new_password"
            placeholder="英小文字、数字、ハイフンのみ"
            type='password'
            required
            {...form.getInputProps('new_password')}
          />
          <Button fullWidth mt="lg" type="submit">
            変更
          </Button>
          {/* <Button fullWidth mt="lg" onClick={test}>
            テスト
          </Button> */}          
        </form>
        {alertOpened && (
          <>
          <Notification icon={message.title === 'Succeeded' ? <IoCheckmarkSharp /> : <IoCloseSharp />}  
                        color={message.color} 
                        title={message.title} 
                        onClose={() => setAlertOpened(false)}>
            {message.massage}                
          </Notification>
          </>
          )}
      </Paper>
    </Container>
  );
}
