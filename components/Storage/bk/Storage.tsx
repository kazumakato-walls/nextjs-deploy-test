'use client';
import { useDisclosure, useCounter  } from '@mantine/hooks';
import { Table, Checkbox, TextInput, Group, FileButton, Text,Button, Modal, Badge,Grid,ActionIcon,Drawer } from '@mantine/core';
import { FiDownload } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import classes from './Storage.module.css';
import { FaRegHeart,FaHeart } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useFileList } from '../../app/providers/FileList';
import { useSession, signIn, signOut } from 'next-auth/react';

const elements = [
  { position: '202402_佐藤次郎.xlsx', mass: "828.41KB", symbol: 'エクセルファイル', name: '2024/03/01 19:16' },
  { position: '202402_田中太郎.xlsx', mass: "825.74KB", symbol: 'エクセルファイル', name: '2024/03/01 14:12' },
  { position: '202402_鈴木一郎.xlsx', mass: "810.16KB", symbol: 'エクセルファイル', name: '2024/03/01 18:38' },
  { position: '202402_山田花子.xlsx', mass: "809.01KB", symbol: 'エクセルファイル', name: '2024/04/01 14:25' },
  { position: '202403_佐藤次郎.xlsx', mass: "822.12KB", symbol: 'エクセルファイル', name: '2024/03/18 14:16' },
  { position: '202403_田中太郎.xlsx', mass: "830.98KB", symbol: 'エクセルファイル', name: '2024/03/19 14:12' },
  { position: '202403_鈴木一郎.xlsx', mass: "816.59KB", symbol: 'エクセルファイル', name: '2024/03/19 18:38' },
  { position: '202403_山田花子.xlsx', mass: "819.25KB", symbol: 'エクセルファイル', name: '2024/04/10 14:00' },
  { position: 'README.txt', mass: "1KB", symbol: 'テキストファイル', name: '2024/01/10 14:19' },
  { position: '交通費精算書.doc', mass: "10.18KB", symbol: 'ワードファイル', name: '2024/04/16 9:45' },
  { position: '業務報告.zip', mass: "14.12GB", symbol: '圧縮ファイル', name: '2024/04/17 18:01' }, 
  { position: 'カレンダー.pdf', mass: "2.26MB", symbol: 'pdfファイル', name: '2023/12/17 16:45' }, 
  { position: '有給管理表.xlsx', mass: "28.04KB", symbol: 'エクセルファイル', name: '2024/04/10 14:00' },
];

export function Demo() {
  // const [opened, { close, open }] = useDisclosure(false);
  const [count, { increment, decrement }] = useCounter(3, { min: 0 });
  const router = useRouter();
  const { data: session,status  } = useSession();
  const { setFileList,FileList } = useFileList();
  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken // ここに実際のアクセストークンをセット
    }}

  const badges = Array(count)
    .fill(0)
    .map((_, index) => <Badge key={index}>Badge {index}</Badge>);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const rows = elements.map((element) => (
    <Table.Tr
      key={element.name}
      bg={selectedRows.includes(element.position) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(element.position)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.position]
                : selectedRows.filter((position) => position !== element.position)
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      </Table.Tr>
    ));
  const [file, setFile] = useState<File | null>(null);
  return (
    <>
     {/* <Group> */}
     <Grid>
     <Grid.Col span={10}>
     <TextInput
      label="ファイルパス"
      leftSectionWidth={50}      
      rightSectionWidth={50}
      // placeholder="Box/Walls/管理/"
      value="Walls/01_人事管理_05_勤怠管理"
      size="sm"
      rightSection={<ActionIcon variant="default" radius="xl" aria-label="Settings"><FaRegHeart /></ActionIcon>}
    />
     </Grid.Col>
    
     <Grid.Col span={2} className={classes.downloadButton}>
          <Button rightSection={<FiDownload />}>ダウンロード</Button>
     </Grid.Col>
     </Grid>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>選択</Table.Th>
          <Table.Th>ファイル名</Table.Th>
          <Table.Th>サイズ</Table.Th>
          <Table.Th>種類</Table.Th>
          <Table.Th>更新日時</Table.Th>          
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>

    <Group justify="center">
        <FileButton onChange={setFile} accept="image/png,image/jpeg" >
          {(props) => <Button {...props} >ファイルアップロード</Button>}
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