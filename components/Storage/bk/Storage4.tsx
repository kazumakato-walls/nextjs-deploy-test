'use client';

import { useCounter } from '@mantine/hooks';
import { Table, TextInput, Group, FileButton, Text, Button, Grid, ActionIcon, Menu } from '@mantine/core';
import { FiDownload, FiFolderPlus } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFileList } from '../../app/providers/FileList';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useSelectedDirectory } from '../../app/providers/SelectedDirectory';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { BsCloudDownload } from 'react-icons/bs';
import classes from './Storage.module.css';

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
  const { setSelectedDirectory, SelectedDirectory } = useSelectedDirectory();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<JSX.Element[]>([]);

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

  useEffect(() => {
    if (FileList && FileList.length > 0) {
      const rowElements = FileList.map((element: FileListType) => (
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
                  <AiOutlineEllipsis size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<CiEdit size={20} />}>
                  編集
                </Menu.Item>
                <Menu.Item leftSection={<BsCloudDownload size={17} />}>
                  ダウンロード
                </Menu.Item>
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
      ));
      setRows(rowElements);
    } else {
      setRows([
        <Table.Tr key="no-data">
          <Table.Td colSpan={5}>ファイルが見つかりません。</Table.Td>
        </Table.Tr>,
      ]);
    }
  }, [FileList, selectedRows]);

  const handleFileUpload = async () => {
    const formData = new FormData();
    if (SelectedDirectory == null || file == null) {
      console.log('データがないため処理終了');
      return;
    }
    formData.append('directory_id', SelectedDirectory.directory_id.toString());
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/file/upload_file', formData, config);
      console.log(response);
    } catch (err) {
      console.log('err:', err);
    }
  };

  const handleAddDirectory = async () => {
    if (!SelectedDirectory) {
      console.log('ディレクトリが選択されていないため処理終了');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/directory/add_directory',
        {
          directory_id: SelectedDirectory.directory_id,
          directory_name: 'フォルダ名テスト3',
          open_flg: false,
        },
        config2
      );
      console.log(response);
    } catch (err) {
      console.log('err:', err);
    }
  };

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
          <Table.Tr>
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
        <Button leftSection={<FiFolderPlus size={20} />} onClick={handleAddDirectory}>
          フォルダ追加
        </Button>
        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => <Button {...props}>ファイルアップロード</Button>}
        </FileButton>
        <Button onClick={handleFileUpload}>アップロード実行</Button>
      </Group>
      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
    </>
  );
}
