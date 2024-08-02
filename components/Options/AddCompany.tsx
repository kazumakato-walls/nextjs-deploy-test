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

export function AddCompany() {
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState<{ value: string, label: string }[]>([]);
  const [industries, setIndustries] = useState<{ value: string, label: string }[]>([]);
  const [regions, setRegions] = useState<{ value: string, label: string }[]>([]);
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
        const [companyResponse, regionResponse, industryResponse] = await Promise.all([
          axios.get(backendUrl + '/company/get_all'),
          axios.get(backendUrl + '/region/get_all'),
          axios.get(backendUrl + '/industry/get_all')
        ]);
        setCompanies(companyResponse.data.map((company: any) => ({ value: company.id.toString(), label: company.company_name }))); // 適切にデータをマッピングします
        setRegions(regionResponse.data.map((region: any) => ({ value: region.id.toString(), label: region.region }))); // 適切にデータをマッピングします
        setIndustries(industryResponse.data.map((industry: any) => ({ value: industry.id.toString(), label: industry.industry_name }))); // 適切にデータをマッピングします
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const form = useForm({
    initialValues: {
      industry_id: '',
      region_id: '',
      storage_name: '',
      company_name: '',
      tell: '',
      storage: ''
    },
    validate: {
      industry_id: (value) => value.trim().length >= 1 ? null : '業種を選択してください。',
      region_id: (value) => value.trim().length >= 1 ? null : '都道府県を選択してください。',
      storage_name: (value) => {
        const isValid = /^[a-z0-9]([-a-z0-9]{1,61}[a-z0-9])?$/.test(value);
        return isValid ? null : '保存先は3文字以上63文字以下、英小文字、数字、ハイフンのみ使用可能で、連続するハイフンおよび先頭と末尾にハイフンを使用できません。';
      },
      company_name: (value) => value.trim().length >= 2 && value.trim().length <= 100 ? null : '会社名は2文字以上100文字以下で入力してください。',
      tell: (value) => /^\d{10,11}$/.test(value) ? null : '有効な電話番号を入力してください',
      storage: (value) => !isNaN(Number(value)) && Number(value) > 0 ? null : '有効なストレージ容量を入力してください'
    },
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validate().hasErrors) {
      console.log('Validation errors:', form.errors);
      return;
    }
    const data =  {            
        "industry_id": form.values.industry_id,
        "region_id": form.values.region_id,
        "storage_name": form.values.storage_name,
        "company_name": form.values.company_name,
        "tell": form.values.tell,
        "storage": form.values.storage
        }
    console.log(data)
    const addcompany = axios.post(backendUrl + '/company/add_company',data,config)
    .then((res) => {
        console.log(res.data)
        setMessage({title: 'Succeeded', massage: '会社追加のリクエスト受け付けました。',color: 'teal'})
        setAlertOpened(true)
      })
    .catch(err => {
        console.log("err:", err);
        setMessage({title: 'Error', massage: '入力内容に問題があるため会社追加できませんでした。',color: 'red'})
        setAlertOpened(true)
      });
  };
  const test = async () => {
    setMessage({title: 'Error', massage: '入力内容に問題があるため会社追加できませんでした。',color: 'red'})
    // setMessage({title: 'Succeeded', massage: '会社追加のリクエスト受け付けました。',color: 'teal'})
    setAlertOpened(true)
}
  return (
    <Container size={1000} my={40}>
      <Title>会社追加</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Azure保存先"
            name="storage_name"
            placeholder="英小文字、数字、ハイフンのみ"
            required
            {...form.getInputProps('storage_name')}
          />
          <TextInput
            label="会社名"
            name="company_name"
            placeholder="会社名"
            required
            {...form.getInputProps('company_name')}
          />
          <Select
            label="業種名"
            placeholder="選択項目"
            data={industries}
            required
            {...form.getInputProps('industry_id')}
          />
          <Select
            label="都道府県"
            placeholder="選択項目"
            data={regions}
            required
            {...form.getInputProps('region_id')}
          />
          <Select
            label="ストレージ容量"
            placeholder="選択項目"
            data={[{ value: '104857600', label: '100GB' },
                   { value: '314572800', label: '300GB' },
                   { value: '1073741824', label: '1TB' },
                  ]}
            {...form.getInputProps('storage')}
            clearable={true}
            required
          />
          <TextInput
            label="電話番号"
            placeholder="ハイフンなし"
            required
            {...form.getInputProps('tell')}
          />
          <Button fullWidth mt="lg" type="submit">
            追加
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
