import Link from "next/link";
import { Container, TextInput, Textarea, Button, Title, Box, Notification, Select, Tabs, rem,Paper   } from '@mantine/core';
import { DateInput, DatePickerInput, Calendar } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { IoCheckmarkSharp, IoCloseSharp  } from "react-icons/io5";
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import '@mantine/dates/styles.css';

export function EditUser() {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState<{ value: string, label: string }[]>([]);
  const [departments, setDepartments] = useState<{ value: string, label: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [alertOpened, setAlertOpened] = useState(false);
  const [message, setMessage] = useState<{ title: string, massage: string,color: string }>({title:'',massage:'',color:''});
  const [value, setValue] = useState<Date | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =  { 
          "company_id": 1
          }
        const [companyResponse, departmentResponse] = await Promise.all([
          axios.get(backendUrl + '/company/get_all',config),
          axios.get(backendUrl + '/department/get_all_department?company_id=1')
        ]);
        console.log(companyResponse.data)
        console.log(departmentResponse.data)
        
        setCompanies(companyResponse.data.map((company: any) => ({ value: company.id.toString(), label: company.company_name }))); 
        setDepartments(departmentResponse.data.map((department: any) => ({ value: department.id.toString(), label: department.department_name }))); 
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateDate = (date: string) => {
    console.log(date)
    console.log(dayjs(date, 'YYYY-MM-DD'))
    console.log(dayjs(date, 'YYYY-MM-DD', true).isValid())
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);
    return isValidFormat && dayjs(date, 'YYYY-MM-DD', true).isValid();
  };

  const form = useForm({
        initialValues: {department_id: '',
                        user_name: '',
                        name_kana: '',
                        email: '',
                        age: '',
                        sex: ''
        },    
        validate: {
          department_id: (value) => !isNaN(Number(value)) && Number(value) > 0 ? null : '所属部署を選択してください。',
          user_name: (value) => value.trim().length >= 2 && value.trim().length <= 50 ? null : 'ユーザー名は2文字以上50文字以下で入力してください。',
          name_kana: (value) => value.trim().length >= 2 && value.trim().length <= 100 ? null : '名前のふりがなは2文字以上100文字以下で入力してください。',
          email: (value) =>validateEmail(value) ? null : '有効なメールアドレスを入力してください。',
          age: (value) => validateDate(value) ? null : '有効な生年月日を入力してください。',
          sex: (value) => ['男', '女', 'その他'].includes(value) ? null : '性別を選択してください。',
        },
  });
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validate().hasErrors) {
      console.log('Validation errors:', form.errors);
      return;
    }
    console.log(form.values)
    const data =  { "department_id": form.values.department_id,
                    "user_name": form.values.user_name,
                    "name_kana": form.values.name_kana,
                    "email": form.values.email,
                    "age": form.values.age,
                    "sex": form.values.sex
    }
    console.log(data)
    const editUser = axios.put(backendUrl + '/user/update_user',data,config)
      .then((res) => {
            console.log(res.data)
            setMessage({title: 'Succeeded', massage: 'ユーザー情報の変更が完了しました。',color: 'teal'})
            setAlertOpened(true)    
      })
      .catch(err => {
            console.log("err:", err);
            setMessage({title: 'Error', massage: 'ユーザー情報の変更に失敗しました。',color: 'red'})
            setAlertOpened(true)
      });
  };

  return (
    <>
    <Container size={1000} my={40}>
      <Title>ユーザー情報変更</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Select
            label="所属部署"
            placeholder="選択項目"
            data={departments}
            clearable={true}
            {...form.getInputProps('department_id')}
            required
          />
          <TextInput
            label="名前"
            name="user_name"
            required
            placeholder="Your User Name"
            key={form.key('user_name')}
            {...form.getInputProps('user_name')}
          />
          <TextInput
            label="かな名"
            placeholder="かな名"
            key={form.key('name_kana')}
            {...form.getInputProps('name_kana')}
            required
          />
          <TextInput
            label="メールアドレス"
            placeholder="メールアドレス"
            key={form.key('email')}
            {...form.getInputProps('email')}
            required
          />
          <DateInput
            label="生年月日"
            placeholder="日付を選択"
            valueFormat="YYYY-MM-DD"
            // {...form.getInputProps('age')}
            onChange={(value) => form.setFieldValue('age', dayjs(value).format('YYYY-MM-DD'))}
            popoverProps={{ withinPortal: true }}
          />
          <Select
            label="性別"
            placeholder="選択項目"
            data={[{ value: '男', label: '男' },
                   { value: '女', label: '女' },
                   { value: 'その他', label: 'その他' },
                  ]}
            value={form.values.sex}
            {...form.getInputProps('sex')}
            clearable={true}
            required
          />
          {/* <Select
            label="ストレージ"
            placeholder="選択項目"
            data={[{ value: '10485760', label: '10GB' },
                   { value: '31457280', label: '30GB' },
                   { value: '52428800', label: '50GB' },
                   { value: '104857600', label: '100GB' },
                   { value: '314572800', label: '300GB' },
                   { value: '1073741824', label: '1TB' },
                  ]}
            value={form.values.storage}
            {...form.getInputProps('storage')}
            clearable={true}
            required
          /> */}
          <Button fullWidth mt="lg" type="submit">
            変更
          </Button>
          {/* <Button fullWidth mt="lg" onClick={handleClear}>
            クリア
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
    </>
  );
}
