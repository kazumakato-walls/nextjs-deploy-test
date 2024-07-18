// 'use client';
// import { useDisclosure, useCounter  } from '@mantine/hooks';
// import { Table, Checkbox, TextInput, Group, FileButton, Text,Button, Modal, Badge,Grid,ActionIcon,Drawer } from '@mantine/core';
// import { FiDownload } from "react-icons/fi";
// import { MdDeleteForever } from "react-icons/md";
// import classes from './Storage.module.css';
// import { FaRegHeart,FaHeart } from "react-icons/fa";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'
// import { useFileList } from '../../app/providers/FileList';
// import { useSession, signIn, signOut } from 'next-auth/react';
// // ディレクトリ型
// interface FileList {
//     directory_id: number;
//     file_name: string;
//     file_size: string | null;
//     filetype_name: string;
//     icon_id:number | null;
//     update_at:string
//   }
// const elements = [
//   { file_name: '202402_佐藤次郎.xlsx', file_size: "828.41KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/01 19:16' },
//   { file_name: '202402_田中太郎.xlsx', file_size: "825.74KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/01 14:12' },
//   { file_name: '202402_鈴木一郎.xlsx', file_size: "810.16KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/01 18:38' },
//   { file_name: '202402_山田花子.xlsx', file_size: "809.01KB", filetype_name: 'エクセルファイル', file_update_at: '2024/04/01 14:25' },
//   { file_name: '202403_佐藤次郎.xlsx', file_size: "822.12KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/18 14:16' },
//   { file_name: '202403_田中太郎.xlsx', file_size: "830.98KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/19 14:12' },
//   { file_name: '202403_鈴木一郎.xlsx', file_size: "816.59KB", filetype_name: 'エクセルファイル', file_update_at: '2024/03/19 18:38' },
//   { file_name: '202403_山田花子.xlsx', file_size: "819.25KB", filetype_name: 'エクセルファイル', file_update_at: '2024/04/10 14:00' },
//   { file_name: 'README.txt', file_size: "1KB", filetype_name: 'テキストファイル', file_update_at: '2024/01/10 14:19' },
//   { file_name: '交通費精算書.doc', file_size: "10.18KB", filetype_name: 'ワードファイル', file_update_at: '2024/04/16 9:45' },
//   { file_name: '業務報告.zip', file_size: "14.12GB", filetype_name: '圧縮ファイル', file_update_at: '2024/04/17 18:01' }, 
//   { file_name: 'カレンダー.pdf', file_size: "2.26MB", filetype_name: 'pdfファイル', file_update_at: '2023/12/17 16:45' }, 
//   { file_name: '有給管理表.xlsx', file_size: "28.04KB", filetype_name: 'エクセルファイル', file_update_at: '2024/04/10 14:00' },
// ];

// export function Storage() {
//   // const [opened, { close, open }] = useDisclosure(false);
//   const [count, { increment, decrement }] = useCounter(3, { min: 0 });
//   const router = useRouter();
//   const { data: session,status  } = useSession();
//   const { setFileList,FileList } = useFileList();
//   const config = {
//     headers: {
//       Authorization: 'Bearer ' + session?.user?.accessToken // ここに実際のアクセストークンをセット
//     }}

//   const badges = Array(count)
//     .fill(0)
//     .map((_, index) => <Badge key={index}>Badge {index}</Badge>);
//   const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
//   const rows = FileList? FileList.map((element: FileList) => (
//     <Table.Tr
//       key={element.update_at}
//       bg={selectedRows.includes(element.file_name) ? 'var(--mantine-color-blue-light)' : undefined}
//     >
//       <Table.Td>
//         <Checkbox
//           aria-label="Select row"
//           checked={selectedRows.includes(element.file_name)}
//           onChange={(event) =>
//             setSelectedRows(
//               event.currentTarget.checked
//                 ? [...selectedRows, element.file_name]
//                 : selectedRows.filter((file_name) => file_name !== element.file_name)
//             )
//           }
//         />
//       </Table.Td>
//       <Table.Td>{element.file_name}</Table.Td>
//       <Table.Td>{element.file_size}</Table.Td>
//       <Table.Td>{element.filetype_name}</Table.Td>
//       <Table.Td>{element.update_at}</Table.Td>
//       </Table.Tr>
//     ))
//     const [file, setFile] = useState<File  null>(null);

//   return (
//     <>
//      {/* <Group> */}
//      <Grid>
//      <Grid.Col span={10}>
//      <TextInput
//       label="ファイルパス"
//       leftSectionWidth={50}      
//       rightSectionWidth={50}
//       // placeholder="Box/Walls/管理/"
//       value="Walls/01_人事管理_05_勤怠管理"
//       size="sm"
//       rightSection={<ActionIcon variant="default" radius="xl" aria-label="Settings"><FaRegHeart /></ActionIcon>}
//     />
//      </Grid.Col>
    
//      <Grid.Col span={2} className={classes.downloadButton}>
//           <Button rightSection={<FiDownload />}>ダウンロード</Button>
//      </Grid.Col>
//      </Grid>
//     <Table>
//       <Table.Thead>
//         <Table.Tr>
//           <Table.Th>選択</Table.Th>
//           <Table.Th>ファイル名</Table.Th>
//           <Table.Th>サイズ</Table.Th>
//           <Table.Th>種類</Table.Th>
//           <Table.Th>更新日時</Table.Th>          
//         </Table.Tr>
//       </Table.Thead>
//       <Table.Tbody>{rows}</Table.Tbody>
//     </Table>

//     <Group justify="center">
//         <FileButton onChange={setFile} accept="image/png,image/jpeg" >
//           {(props) => <Button {...props} >ファイルアップロード</Button>}
//         </FileButton>
//     </Group>

//       {file && (
//         <Text size="sm" ta="center" mt="sm">
//           Picked file: {file.name}
//         </Text>
//       )}
//     </>
//   );
// }