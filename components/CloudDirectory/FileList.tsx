import { useState } from 'react';
import { Table, TextInput, ActionIcon, Menu } from '@mantine/core';
import { FileListType } from '../../app/providers/GlobalContextType';
import { useGlobalContext } from '../../app/providers/GlobalContext';
import classes from './CloudDirectory.module.css';
import { BsCloudDownload } from 'react-icons/bs';
import axios from 'axios';
import { useAuthConfig,useAxiosConfigDownloadFile } from '../../app/providers/useAuthConfig';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
// import axios,{ ResponseType } from 'axios';
import { saveAs } from 'file-saver';

interface SelectedFile {
  id: number | null;
  icon_id: number | null;
  file_name: string;
}

export function FileLists() {

  const initialState: SelectedFile = { id: null, icon_id: null, file_name: '' };
  const [SelectedFile, setSelectedFile] = useState<SelectedFile>(initialState);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { FileList, SelectedDirectory, setFileList, setRefreshState } = useGlobalContext();
  const { config } = useAuthConfig();
  const { config: downloadConfig } = useAxiosConfigDownloadFile();
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  // ファイル一覧更新
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

  // ファイル名編集
  const editFileName = async (id: number | null, icon_id: number | null, filename: string) => {
    setSelectedFile({ id, icon_id, file_name: filename });
    setEditValue(filename);
  };

  // ファイル名、フォルダ名の変更処理
  const EnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editValue === SelectedFile.file_name) {
        setEditValue('');
        setSelectedFile(initialState);
        return;
      }
      if (SelectedFile.icon_id === 99) {
        axios.post(backendUrl + '/directory/rename_directory', {
          "directory_id": SelectedFile.id,
          "new_directory_name": editValue
        }, config).then(() => {
            refresh_directory();
        }).catch(console.log);
      } else {
        axios.post(backendUrl + '/file/rename_file', {
          "file_id": SelectedFile.id,
          "new_file_name": editValue
        }, config).then(() => {
            refresh_directory();
        }).catch(console.log);
      }
      setEditValue('');
      setSelectedFile(initialState);
      setRefreshState(prevCount => prevCount + 1)
    } else if (event.key === 'Escape') {
      setEditValue('');
      setSelectedFile(initialState);
    }
  };

  //   ファイル削除処理
  const deleteFile = (id: number,icon_id:number | null) => {
    console.log(icon_id)
    console.log(id)
    if (icon_id == 99) {
        axios.post(backendUrl + '/directory/delete_directory', { "directory_id": id }, config)
        .then(() => {
            refresh_directory()
            setRefreshState(prevCount => prevCount + 1)
        }).catch(err => {
            console.log("err:", err);
        });
    }else{
        axios.post(backendUrl + '/file/delete_file', { "file_id": id }, config)
        .then(() => {
            refresh_directory()
            setRefreshState(prevCount => prevCount + 1)
        }).catch(err => {
            console.log("err:", err);
        });
    }    
  };

  // ファイルダウンロード
  const downloadFile = (id:number) => {
        console.log(id)
        const refresh = axios.post(backendUrl + '/file/download_file',
          {"file_id": id}, 
          downloadConfig)
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

  return (
    FileList && FileList.length > 0 ? FileList.map((element: FileListType) => {
      const keyPrefix = element.icon_id === 99 ? 'directory-' : 'file-';
      return (
        <Table.Tr
          className={classes.mainLink}
          key={keyPrefix + element.id}
          bg={selectedRows.includes(element.file_name) ? 'var(--mantine-color-blue-light)' : undefined}
        >
          <Table.Td>
            {SelectedFile.file_name === element.file_name ? (
              <TextInput value={editValue} onKeyDown={EnterPress} onChange={(e) => setEditValue(e.currentTarget.value)} />
            ) : (
              element.file_name
            )}
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
                <Menu.Item onClick={() => editFileName(element.id, element.icon_id, element.file_name)} leftSection={<CiEdit size={20} />}>
                  編集
                </Menu.Item>
                {element.icon_id !== 99 && (
                  <Menu.Item 
                  onClick={() => downloadFile(element.id)} 
                  leftSection={<BsCloudDownload size={17} />}>
                    ダウンロード
                  </Menu.Item>
                )}
                <Menu.Item color="red" onClick={() => deleteFile(element.id,element.icon_id)} leftSection={<MdDeleteOutline size={21} />}>
                  ファイル削除
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Table.Td>
        </Table.Tr>
      );
    }) : (
      <Table.Tr key="no-data">
        <Table.Td colSpan={5}>ファイルが見つかりません。</Table.Td>
      </Table.Tr>
    )
  );
}
