'use client';
// react
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// library
import { useCounter, useDisclosure } from '@mantine/hooks';
import { Table, TextInput, Group, FileButton, Text, Button, Grid, ActionIcon, Menu, Modal, Paper } from '@mantine/core';
import axios,{ ResponseType } from 'axios';
import { saveAs } from 'file-saver';

// road file
import classes from './CloudDirectory.module.css';
import { useGlobalContext } from '../../app/providers/GlobalContext';

// icons
import { FiDownload, FiFolderPlus } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { BsCloudDownload } from 'react-icons/bs';
import { Input } from 'postcss';
import { BsFiletypeTxt } from "react-icons/bs";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";
import { BsFiletypePptx } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BsFiletypeMp4 } from "react-icons/bs";
import { BsFileEarmarkZip } from "react-icons/bs";
import { BsFolder } from "react-icons/bs";
import { BsFileImage } from "react-icons/bs";
import { BsFileEarmark } from "react-icons/bs";
import { BsFileMusic } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { BsFileEarmarkFont } from "react-icons/bs";
import { RiFolderUploadLine } from "react-icons/ri";
// import { FileList } from './FileList'
import { FileLists } from './FileList';
import { useAuthConfig,useAxiosConfigForm } from '../../app/providers/useAuthConfig';
import dayjs from "dayjs";
import { FavoriteIcon } from './FavoriteIcon'

interface FileListType {
  id: number;
  file_name: string;
  file_size: string | null;
  filetype_name: string;
  icon_id: number | null;
  file_update_at: string;
}
interface SelectedFile {
  id: number | null;
  icon_id: number | null;
  file_name: string;
}
export function CloudDirectory() {
  const { setFileList, FileList, setSelectedDirectory, SelectedDirectory, favoriteState, setFavoriteState,setRefreshState } = useGlobalContext();
  const { data: session, status } = useSession();
  const [count, { increment, decrement }] = useCounter(3, { min: 0 });
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [tableKey, setTableKey] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [favorite_opened, favorite_handlers] = useDisclosure(false);
  const [fileEdit_opened, handlers] = useDisclosure(false);
  const [value, setValue] = useState('');
  const [editValue, setEditValue] = useState<string>('');
  const [EditOpen, setEditOpen] = useState<string | null>(null);
  const [SelectedFileID, setSelectedFileID] = useState<number | null>(null);
  const [SelectedDirectoryID, setSelectedDirectoryID] = useState<number | null>(null);
  const initialState: SelectedFile = { id: null, icon_id: null, file_name: '' };
  const [SelectedFile, setSelectedFile] = useState<SelectedFile>(initialState);
  const [fileButtonKey, setFileButtonKey] = useState<number>(0);
  const { config } = useAuthConfig();
  const { config: FormConfig } = useAxiosConfigForm();
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  
  // アップロード時の処理
  useEffect(() => {
    if (file == null){
      return
    }
    const fileUpdateTime = dayjs(new Date(file.lastModified)).format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData();
    if (SelectedDirectory == null || file == null) {
      console.log('データがないため処理終了');
      return;
    }
    formData.append('directory_id', SelectedDirectory.directory_id.toString());
    formData.append('file', file);
    formData.append('file_update_time', fileUpdateTime);
    console.log(formData)
    const addcompany = axios.post(backendUrl + '/file/upload_file',formData,FormConfig)
    .then((res) => {
          console.log(res.data)
          const addcompany = axios.post(backendUrl + '/file/get_all_file',
                                        {"directory_id": SelectedDirectory.directory_id}, 
                                        config)
          .then((res) => {
            setFileList(res.data);         
          })
          .catch(err => {
            console.log("err:", err);
          });
          setFile(null)
          refresh_directory()
          setFileButtonKey(prevKey => prevKey + 1);
    })
    .catch(err => {
        console.log("err:", err);
        setFile(null)
    });
  }, [file]);

  // 
  useEffect(() => {
    setTableKey(prevKey => prevKey + 1); 
  }, [FileList]);

  // フォルダ追加モーダルの初期値リセット
  useEffect(() => {
    setValue('')
  }, [opened]);

  // フォルダ追加ボタン押下後の処理
  const handleAddDirectory = async () => {
    console.log(SelectedDirectory)
    console.log(value)
    console.log(backendUrl)
    if (!SelectedDirectory) {
      console.log('ディレクトリが選択されていないため処理終了');
      return;
    }
    const data =  {            
      "directory_id": SelectedDirectory.directory_id,
      "directory_name": value,
      "open_flg": false
      }

    const add_directory = axios.post(backendUrl + '/directory/add_directory',data,config)
    .then((res) => {
        console.log(res.data)
        refresh_directory() 
        setRefreshState(prevCount => prevCount + 1)
      })
    .catch(err => {
        console.log("err:", err);
      });
    close()
  };

  // 画面更新
  const refresh_directory = async () => {
    if (!SelectedDirectory) {
      console.log('ディレクトリが選択されていないため処理終了');
      return;
    }
  const refresh = axios.post(backendUrl + '/file/get_all_file',
    {"directory_id": SelectedDirectory.directory_id}, 
    config)
  .then((res) => {
    setFileList(res.data);         
  })
  .catch(err => {
    console.log("err:", err);
  });
  }

  // お気に入り追加
const add_Favorite = () =>{
  const params =  {            
    "directory_id": SelectedDirectory?.directory_id,
    "favorite_name": value
    }
  const add_favorite = axios.post(backendUrl + '/favorite/add_favorite', params, config)
  .then((res) => {
    console.log(res.data)
    refresh_directory()
  })
  .catch(err => {
    console.log("err:", err);
  });
}

  return (
    <>
      <Grid>
      <Grid.Col span={7}>
        <FavoriteIcon />
      </Grid.Col>
    </Grid>
    <Grid mt={-52}>
      <Grid.Col span={7}>
        {/* <FavoriteIcon /> */}
      </Grid.Col>

      <Grid.Col span={5}>
        <Group justify="left">
        <Button leftSection={<FiFolderPlus size={20} />} onClick={open} variant="default">新しいフォルダ</Button>
        <FileButton key={fileButtonKey} onChange={setFile}>
          {(props) => <Button {...props} leftSection={<RiFolderUploadLine size={20}/>} variant="default" >ファイルアップロード</Button>}
        </FileButton>
        </Group>
      </Grid.Col>
    </Grid>
      <Paper withBorder shadow="md" p={'sm'} mt={30} radius="md">
      <Table>
        <Table.Thead>
          <Table.Tr key={0}>
            <Table.Th w={120}>ファイル名</Table.Th>
            <Table.Th w={10}>サイズ</Table.Th>
            <Table.Th w={60}>種類</Table.Th>
            <Table.Th w={60}>更新日時</Table.Th>
            <Table.Th w={60}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody><FileLists /></Table.Tbody>
      </Table>
      <Group justify="center">
        <Modal opened={opened} onClose={close} title="フォルダ追加" centered>
            <TextInput 
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}>
            </TextInput>
            <Button leftSection={<FiFolderPlus size={20} />} onClick={handleAddDirectory}>
                追加
            </Button>
        </Modal>
        <Modal opened={favorite_opened} onClose={favorite_handlers.close} title="お気に入り追加" centered>
                <TextInput 
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}>
                </TextInput>
                <Button leftSection={<FiFolderPlus size={20} />} onClick={add_Favorite}>
                    追加
                </Button>
        </Modal>
      </Group>
      </Paper>
      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
    </>
  );
}
