import Link from "next/link";
import { Container, TextInput, Textarea, Button, Title, Box, Notification, Select, Tabs, rem,Paper   } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { IoCheckmarkSharp, IoCloseSharp  } from "react-icons/io5";
export function AddUser() {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState<{ value: string, label: string }[]>([]);
  const [departments, setDepartments] = useState<{ value: string, label: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [alertOpened, setAlertOpened] = useState(false);
  const [message, setMessage] = useState<{ title: string, massage: string,color: string }>({title:'',massage:'',color:''});
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
  const form = useForm({
        initialValues: {company_id: '',
                        department_id: '',
                        personal_id: '',
                        user_name: '',
                        storage: ''
        },    
        validate: {
          company_id: (value) => value.trim().length >= 1 ? null : '所属会社を選択してください。',
          department_id: (value) => value.trim().length >= 1 ? null : '所属部署を選択してください。',
          personal_id: (value) => value.trim().length >= 2 && value.trim().length <= 100 ? null : '会社名は2文字以上100文字以下で入力してください。',
          user_name: (value) => value.trim().length >= 2 && value.trim().length <= 100 ? null : '会社名は2文字以上100文字以下で入力してください。',
          storage: (value) => !isNaN(Number(value)) && Number(value) > 0 ? null : '有効なストレージ容量を入力してください'
        },
  });
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validate().hasErrors) {
      console.log('Validation errors:', form.errors);
      return;
    }
    console.log(form.values)
    const data =  {            
            "company_id": form.values.company_id,
            "department_id": form.values.department_id,
            "personal_id": form.values.personal_id,
            "user_name": form.values.user_name,
            "storage": form.values.storage
            }
        // console.log(data)
        const addcompany = axios.post(backendUrl + '/user/create_user',data,config)
        .then((res) => {
            console.log(res.data)
            setMessage({title: 'Succeeded', massage: 'ユーザー追加のリクエスト受け付けました。',color: 'teal'})
            setAlertOpened(true)    
          })
        .catch(err => {
            console.log("err:", err);
            setMessage({title: 'Error', massage: '入力内容に問題があるためユーザー追加できませんでした。',color: 'red'})
            setAlertOpened(true)
          });
      };

      const SelectedCompany = (value: string | null) => {
        form.setFieldValue('company_id', value ? value: '');
        console.log('companyid:' + value)
        const addcompany = axios.get(backendUrl + '/department/get_all_department?company_id=' + value)
        .then((res) => {
          console.log(res.data)
          setDepartments(res.data.map((department: any) => ({ value: department.id.toString(), label: department.department_name })));
          form.setFieldValue('department_id', '');
        })
        .catch(err => {
          console.log("err:", err);
          setDepartments([])
          form.setFieldValue('department_id', '');
        });
      };
  return (
    <>
    <Container size={1000} my={40}>
      <Title>ユーザー追加</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
           <Select
            label="所属会社"
            placeholder="選択項目"
            data={companies}
            // value= {Test}
            onChange={SelectedCompany}
            // value={form.values.company_id}
            key={form.key('company_id')}
            // {...form.getInputProps('company_id')}
            clearable={true}
            required
          />
          <Select
            label="所属部署"
            placeholder="選択項目"
            data={departments}
            // onChange={SelectedDepartment}
            // value={form.values.department_id}
            clearable={true}
            // key={form.key('department_id')}
            {...form.getInputProps('department_id')}
            required
          />
          <TextInput
            label="パーソナルID"
            name="personal_id"
            required
            placeholder="Your Personal ID"
            key={form.key('personal_id')}
            {...form.getInputProps('personal_id')}
          />
          <TextInput
            label="名前"
            placeholder="おなまえ"
            key={form.key('user_name')}
            {...form.getInputProps('user_name')}
            required
          />
          <Select
            label="ストレージ"
            placeholder="選択項目"
            data={[{ value: '104857600', label: '100GB' },
                   { value: '314572800', label: '300GB' },
                   { value: '1073741824', label: '1TB' },
                  ]}
            value={form.values.storage}
            {...form.getInputProps('storage')}
            clearable={true}
            required
          />
          <Button fullWidth mt="lg" type="submit">
            追加
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
