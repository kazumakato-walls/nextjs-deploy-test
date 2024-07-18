'use client';

import { useDisclosure, useCounter } from '@mantine/hooks';
import { Table, Checkbox, TextInput, Group, FileButton, Text, Button, Modal, Badge, Grid, ActionIcon, Drawer,Menu,rem } from '@mantine/core';
import { FiDownload } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import classes from './Storage.module.css';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useFileList } from '../../app/providers/FileList';
import { useSession, signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import { useSelectedDirectory } from '../../app/providers/SelectedDirectory';
import { AiOutlineEllipsis } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { BsCloudDownload } from "react-icons/bs";
import { BsCloudUpload } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { FiFolderPlus } from "react-icons/fi";

interface FileListType {
  directory_id: number;
  file_name: string;
  file_size: string | null;
  filetype_name: string;
  icon_id: number | null;
  file_update_at: string;
}

export function Storage() {
  const [count, { increment, decrement }] = useCounter(3, { min: 0 });
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setFileList, FileList } = useFileList();
  const { setSelectedDirectory,SelectedDirectory } = useSelectedDirectory();
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + session?.user?.accessToken
    }
  }
  const config2 = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    }
  }
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  useEffect(() => {
    console.log("FileList:", FileList);
    
  }, [FileList]);

  const rows = FileList && FileList.length > 0 ? FileList.map((element: FileListType) => (
  // const rows = FileList ? FileList.map((element: FileListType) => (
    <Table.Tr
      className={classes.mainLink}
      key={element.file_update_at}
      bg={selectedRows.includes(element.file_name) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>{element.file_name}</Table.Td>
      <Table.Td>{element.file_size}</Table.Td>
      <Table.Td>{element.filetype_name}</Table.Td>
      <Table.Td>{element.file_update_at}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon size={42} variant="default" aria-label="ActionIcon with size as a number">
          <AiOutlineEllipsis size={20}/>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {/* <Menu.Label>Application</Menu.Label> */}
        <Menu.Item leftSection={<CiEdit size={20} />}>
          編集
        </Menu.Item>
        <Menu.Item leftSection={<BsCloudDownload size={17}/>}>
          ダウンロード
        </Menu.Item>
        {/* <Menu.Item leftSection={<CiEdit style={{ width: rem(14), height: rem(14) }} />}>
          権限付与
        </Menu.Item> */}
        {/* <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label> */}
        <Menu.Item
          color="red"
          leftSection={<MdDeleteOutline size={21} />}
        >
          ファイル削除
        </Menu.Item>
        </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  )) : (
    <Table.Tr>
      <Table.Td colSpan={5}>ファイルが見つかりません。</Table.Td>
    </Table.Tr>
  );
  const [file, setFile] = useState<File | null>(null);
  const test = () => {
    const formData = new FormData();
    if (SelectedDirectory != null && file != null){
      formData.append('directory_id', SelectedDirectory.directory_id.toString());
      formData.append('file', file);
    }else{
      console.log('データがないため処理終了')
      return
    }
    const url = axios.post("http://localhost:8000/file/upload_file",formData,config)
    .then((res) => {
        console.log(res)
    })
    .catch(err => {
        console.log("err:", err);
    });
  } 
  // directory
  const test2 = () => {
    console.log(SelectedDirectory)
    const url = axios.post("http://localhost:8000/directory/add_directory",
                          {"directory_id": SelectedDirectory?.directory_id,
                           "directory_name": "フォルダ名テスト3",
                           "open_flg": false
                          },config2)
    .then((res) => {
        console.log(res)
    })
    .catch(err => {
        console.log("err:", err);
    });
  } 
  return (
    <>
      <Grid>
        <Grid.Col span={10}>
          <TextInput
            label="ファイルパス"
            leftSectionWidth={50}
            rightSectionWidth={50}
            value= {SelectedDirectory?.path}
            size="sm"
            rightSection={<ActionIcon variant="default" radius="xl" aria-label="Settings"><FaRegHeart /></ActionIcon>}
          />
        </Grid.Col>
      </Grid>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>　ファイル名</Table.Th>
            <Table.Th>サイズ</Table.Th>
            <Table.Th>種類</Table.Th>
            <Table.Th>更新日時</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify="center">
      <Button 
        leftSection={<FiFolderPlus size={20} />} 
        onClick={test2}>フォルダ追加</Button>
        <FileButton onChange={setFile} accept="image/png,image/jpeg" >
          {(props) => <Button {...props}>ファイルアップロード</Button>}
        </FileButton>
        <Button onClick={test}>アップロード実行</Button>
      </Group>
      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
    </>
  );
}
