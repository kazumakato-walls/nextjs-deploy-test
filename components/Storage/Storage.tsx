'use client';
// react
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// library
import { useCounter, useDisclosure } from '@mantine/hooks';
import { Table, TextInput, Group, FileButton, Text, Button, Grid, ActionIcon, Menu, Modal } from '@mantine/core';
import axios from 'axios';
import { saveAs } from 'file-saver';

// road file
import classes from './Storage.module.css';
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
export function Storage() {
  // グローバル変数
  const { setFileList, FileList, setSelectedDirectory, SelectedDirectory } = useGlobalContext();
  // use
  const [count, { increment, decrement }] = useCounter(3, { min: 0 });
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [tableKey, setTableKey] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [fileEdit_opened, handlers] = useDisclosure(false);
  const [value, setValue] = useState('');
  const [editValue, setEditValue] = useState<string>('');
  const [EditOpen, setEditOpen] = useState<string | null>(null);
  const [SelectedFileID, setSelectedFileID] = useState<number | null>(null);
  const [SelectedDirectoryID, setSelectedDirectoryID] = useState<number | null>(null);
  const initialState: SelectedFile = { id: null, icon_id: null, file_name: '' };
  const [SelectedFile, setSelectedFile] = useState<SelectedFile>(initialState);
  const [fileButtonKey, setFileButtonKey] = useState<number>(0);
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + session?.user?.accessToken,
    },
  };

  const config2 = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken,
    },
  };

  
  // アップロード時の処理
  useEffect(() => {
    if (file == null){
      return
    }

    const formData = new FormData();
    if (SelectedDirectory == null || file == null) {
      console.log('データがないため処理終了');
      return;
    }
    formData.append('directory_id', SelectedDirectory.directory_id.toString());
    formData.append('file', file);

    const addcompany = axios.post("http://localhost:8000/file/upload_file",formData,config)
    .then((res) => {
          console.log(res.data)
          const addcompany = axios.post("http://localhost:8000/file/get_all_files",
                                        {"directory_id": SelectedDirectory.directory_id}, 
                                          config2)
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
    if (!SelectedDirectory) {
      console.log('ディレクトリが選択されていないため処理終了');
      return;
    }
    const data =  {            
      "directory_id": SelectedDirectory.directory_id,
      "directory_name": value,
      "open_flg": false
      }
    const add_directory = axios.post("http://localhost:8000/directory/add_directory",data,config2)
    .then((res) => {
        console.log(res.data)
        refresh_directory() 
      })
    .catch(err => {
        console.log("err:", err);
      });
    close()
  };

  // ファイル名編集画面表示
  const editFileName = async (id:number|null,icon_id:number|null,filename:string) => {
    console.log(FileList)
    setSelectedFile({id: id,
                     icon_id: icon_id,
                     file_name: filename
                    })
    setEditValue(filename)
    console.log(id)
  }
  const config3 = {
    headers: {
      'Authorization': 'Bearer ' + session?.user?.accessToken,
    },
    responseType: 'blob'
  };
  // ファイルダウンロード
  const downloadFile = async (id:number) => {
    console.log(id)
    const refresh = axios.post("http://localhost:8000/file/download_file",
      {"file_id": id}, 
      config3)
    .then((res) => {
      console.log(res)
      console.log(decodeURI(res.headers['content-disposition']))
      let contentDisposition = res.headers['content-disposition']
      let fileName = decodeURI(contentDisposition.substring(contentDisposition.indexOf("''") + 2,
        contentDisposition.length
      )).replace(/\+/g, " ");
      console.log(fileName)
      const blob = new Blob([res.data], {
        type: 'application/octet-stream'
      });
      saveAs(blob, fileName);

    })
    .catch(err => {
      console.log("err:", err);
    });
  }

  // 画面更新
  const refresh_directory = async () => {
    if (!SelectedDirectory) {
      console.log('ディレクトリが選択されていないため処理終了');
      return;
    }
  const refresh = axios.post("http://localhost:8000/file/get_all_file",
    {"directory_id": SelectedDirectory.directory_id}, 
      config2)
  .then((res) => {
    setFileList(res.data);         
  })
  .catch(err => {
    console.log("err:", err);
  });
  }

  // イベントハンドラ
  // エンターキー押下時の処理
  const EnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key)
    if (event.key === 'Enter') {
      console.log(editValue)
      if(editValue == SelectedFile.file_name){
        setEditValue('')
        setSelectedFile(initialState)
        return
      }
      if (SelectedFile.icon_id == 99){
        // ディレクトリーのリネーム
        const rename = axios.post("http://localhost:8000/directory/rename_directory",
          {"directory_id": SelectedFile.id,
            "new_directory_name": editValue
          }, 
            config2)
          .then((res) => {
            refresh_directory()         
          })
          .catch(err => {
            console.log("err:", err);
          });
      }else{
        // ファイルのリネーム
        const rename = axios.post("http://localhost:8000/file/rename_file",
        {"file_id": SelectedFile.id,
          "new_file_name": editValue
        }, 
          config2)
        .then((res) => {
          refresh_directory()         
        })
        .catch(err => {
          console.log("err:", err);
        });
      }
      setEditValue('')
      setSelectedFile(initialState)
      console.log(editValue)
      console.log(SelectedFile)
    }else if(event.key === 'Escape') {
      setEditValue('')
      setSelectedFile(initialState);
    };
  }

  // ファイル削除
  const delete_file = (id :number) =>{
    const delete_file = axios.post("http://localhost:8000/file/delete_file",
      {"file_id": id}, 
        config2)
    .then((res) => {
      console.log(res.data)
      refresh_directory()
    })
    .catch(err => {
      console.log("err:", err);
    });
  }

  const rows = FileList && FileList.length > 0 ? FileList.map((element: FileListType) => (
    <Table.Tr
      className={classes.mainLink}
      key={'file' + element.id}
      bg={selectedRows.includes(element.file_name) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        {(() => {
          // ファイルオープン条件
          if(SelectedFile.file_name == element.file_name){
            return <TextInput value={editValue}
                              onKeyDown={EnterPress} 
                              onChange={(event) => setEditValue(event.currentTarget.value)} />
          }else{
            return element.file_name
          }
        })() }
      </Table.Td>
      <Table.Td>{element.file_size}</Table.Td>
      <Table.Td>{element.filetype_name}</Table.Td>
      <Table.Td>{element.file_update_at}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200} trigger="hover">
          <Menu.Target>
            <ActionIcon size={42} variant="default" aria-label="ActionIcon with size as a number">
              <AiOutlineEllipsis size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
                 onClick={() => editFileName(element.id,element.icon_id,element.file_name)}
                 leftSection={<CiEdit size={20}/>}>
                 編集
            </Menu.Item>
            {(() => {
            // ダウンロード機能追加条件
            if(element.icon_id != 99){
              return <Menu.Item 
                onClick={() => downloadFile(element.id)}
                leftSection={<BsCloudDownload size={17} />}>
                ダウンロード
            </Menu.Item>
            }else{
              return ''
            }
            })() }            
            <Menu.Item
                color="red"
                onClick={() => delete_file(element.id)}
                leftSection={<MdDeleteOutline size={21} />}
            >
              ファイル削除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  )) : (
    <Table.Tr key="no-data">
      <Table.Td colSpan={5}>ファイルが見つかりません。</Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <Grid>
        <Grid.Col span={10}>
          <TextInput
            label="ファイルパス"
            leftSectionWidth={50}
            rightSectionWidth={50}
            value={SelectedDirectory?.path ?? ''}
            size="sm"
            rightSection={<ActionIcon variant="default" radius="xl" aria-label="Settings"><FaRegHeart /></ActionIcon>}
          />
        </Grid.Col>
      </Grid>
      <Table>
        <Table.Thead>
          <Table.Tr key={0}>
            <Table.Th>ファイル名</Table.Th>
            <Table.Th>サイズ</Table.Th>
            <Table.Th>種類</Table.Th>
            <Table.Th>更新日時</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
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
                    
        <Modal opened={fileEdit_opened} onClose={handlers.close} title="ファイル名変更" centered>
                <TextInput 
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}>
                </TextInput>
                <Button leftSection={<FiFolderPlus size={20} />} >
                    変更
                </Button>
        </Modal>
        <Button leftSection={<FiFolderPlus size={20} />} onClick={open}>フォルダ追加</Button>
        <FileButton key={fileButtonKey} onChange={setFile}>
          {(props) => <Button {...props}>ファイルアップロード</Button>}
        </FileButton>
      </Group>
      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
    </>
  );
}
