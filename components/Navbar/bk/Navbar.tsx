"use client";
import {
    TextInput,
    Code,
    UnstyledButton,
    Badge,
    Text,
    Group,
    ActionIcon,
    Tooltip,
    rem,
    Button,
    NavLink 
  } from '@mantine/core';
  import { IoSettingsOutline, IoHomeSharp } from "react-icons/io5";
//   import { UserButton } from '../UserButton/UserButton';
  import classes from './Navbar.module.css';
  import { LuLogOut } from "react-icons/lu";
  import { GoFileDirectory } from "react-icons/go";
  import { MdOutlineContactSupport } from "react-icons/md";
  import Link from "next/link";
  import { useEffect,useContext } from 'react';
  import { useSession, signIn, signOut } from 'next-auth/react';
  import { useRouter } from 'next/navigation'
  import { useDirectoryTree } from '../../app/providers/DirectoryTree';
  import { GetServerSideProps } from 'next';
  import axios from 'axios';

  // export const NavbarSearch: GetServerSideProps = async (context) => {
  export function NavbarSearch() {  
    const router = useRouter();
    const { data: session,status  } = useSession();
    const { setDirectoryTree,DirectoryTree } = useDirectoryTree();
    const config = {
      headers: {
        Authorization: 'Bearer ' + session?.user?.accessToken // ここに実際のアクセストークンをセット
      }}

    useEffect(() => {
      console.log(DirectoryTree) 
      const url = axios.get("http://localhost:8000/directory/get_all_directory",config)

       // thenで成功した場合の処理
      .then((res) => {
      console.log("ステータスコード:", status);
      console.log("ステータスコード:", url);
      console.log("データ:", res.data);
        })
        // catchでエラー時の挙動を定義
        .catch(err => {
        console.log("err:", err);
        });

       },[DirectoryTree]);

  // useEffect(() => {
  //   if (status === 'loading') return; // ロード中は何もしない
  //   if (!session) router.push('/login'); // セッションがない場合はログインページへリダイレクト
  // }, [session, status, router]);

  // const url = axios.get("http://localhost:3000/")

  // // thenで成功した場合の処理
  // .then(() => {
  //     console.log("ステータスコード:", status);
  // })
  // // catchでエラー時の挙動を定義
  // .catch(err => {
  //     console.log("err:", err);
  // });


  const handleClick = () => {
    // setDirectoryTree({username:"aa"})
    console.log(DirectoryTree)
  }

  const handleClickAuth = () =>{
    console.log(session?.user?.accessToken)
  }
    return (
      <nav className={classes.navbar}>
        <div className={classes.section}>
        </div>

        {/* <TextInput
          placeholder="検索"
          size="xs"
          leftSection={<IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />}
          rightSectionWidth={70}
        //   rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
          styles={{ section: { pointerEvents: 'none' } }}
          mb="sm"
        /> */}
  
        <div className={classes.section}>
          <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              ディレクトリ
            </Text>
          </Group>

        <NavLink href="#required-for-focus" label="Walls" leftSection={<GoFileDirectory />} childrenOffset={28} defaultOpened>
             <NavLink label="01_人事管理" childrenOffset={28} href="#required-for-focus" >
                <NavLink label="01_雇用契約" href="#required-for-focus" />
                <NavLink label="02_給与" href="#required-for-focus" />
                <NavLink label="03_福利厚生" href="#required-for-focus" />
                <NavLink label="04_人事評価" href="#required-for-focus" />
                <NavLink label="05_勤怠管理" href="#required-for-focus" />
            </NavLink>
            <NavLink label="02_経理" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_会社帳簿" href="#required-for-focus" />
                <NavLink label="02_請求書" href="#required-for-focus" />
                <NavLink label="03_支払い記録" href="#required-for-focus" />
                <NavLink label="04_税務関連" href="#required-for-focus" />
            </NavLink>
            <NavLink label="03_営業" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_見積依頼" href="#required-for-focus" />
                <NavLink label="02_契約書" href="#required-for-focus" />
                <NavLink label="03_打合せ" href="#required-for-focus" />
                <NavLink label="04_成果物" href="#required-for-focus" />
            </NavLink>
            <NavLink label="04_プロジェクト管理" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_プロジェクト計画" href="#required-for-focus" />
                <NavLink label="02_進捗管理" href="#required-for-focus" />
                <NavLink label="03_タスクリスト" href="#required-for-focus" />
                <NavLink label="04_リソース管理" href="#required-for-focus" />
            </NavLink>
        </NavLink>
        <NavLink href="#required-for-focus"label="Walls Dev"leftSection={<GoFileDirectory />}childrenOffset={28}>
        <NavLink label="01_プロジェクト" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_勤怠管理システム" href="#required-for-focus" />
                <NavLink label="02_e-ラーニング販売システム" href="#required-for-focus" />
                <NavLink label="03_ホームページ作成" href="#required-for-focus" />
                <NavLink label="04_ファイル共有システム" href="#required-for-focus" />
        </NavLink>
        <NavLink label="02_要件定義" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_要件定義書" href="#required-for-focus" />
                <NavLink label="02_設計" href="#required-for-focus" />
                <NavLink label="03_コーディング" href="#required-for-focus" />
                <NavLink label="04_テスト" href="#required-for-focus" />
                <NavLink label="05_デプロイ" href="#required-for-focus" />
        </NavLink>
        <NavLink label="03_設計書" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_システム設計" href="#required-for-focus" />
                <NavLink label="02_アーキテクチャ図" href="#required-for-focus" />
                <NavLink label="03_データベース設計" href="#required-for-focus" />
                <NavLink label="04_基本設計" href="#required-for-focus" />
                <NavLink label="05_詳細設計" href="#required-for-focus" />
        </NavLink>
        <NavLink label="04_コーディング" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_コードベース" href="#required-for-focus" />
                <NavLink label="02_ソースコード" href="#required-for-focus" />
                <NavLink label="03_テストコード" href="#required-for-focus" />
                <NavLink label="04_ライブラリ" href="#required-for-focus" />
                <NavLink label="05_バージョン管理" href="#required-for-focus" />
                <NavLink label="06_テスト" childrenOffset={28} href="#required-for-focus">
                    <NavLink label="01_単体テスト" href="#required-for-focus" />
                    <NavLink label="02_結合テスト" href="#required-for-focus" />
                    <NavLink label="03_自動化テスト" href="#required-for-focus" />
                    <NavLink label="04_運用単体テスト" href="#required-for-focus" />
                    
                </NavLink>
                <NavLink label="07_デプロイ" href="#required-for-focus" />
        </NavLink>
        <NavLink label="05_ツール" childrenOffset={28} href="#required-for-focus">
                <NavLink label="01_開発ツール" href="#required-for-focus" />
                <NavLink label="02_ライブラリ" href="#required-for-focus" />
                <NavLink label="03_テンプレート" href="#required-for-focus" />
                <NavLink label="04_開発マニュアル" href="#required-for-focus" />
                <NavLink label="05_セキュリティ管理" href="#required-for-focus" />
        </NavLink>
      </NavLink>
        </div>
        <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              お気に入り
            </Text>
        </Group>
            <div className={classes.mainLinks} >
                <Button className={classes.mainLink} variant="transparent">Walls/01_人事管理/03_福利厚生</Button>
                <Button className={classes.mainLink} variant="transparent">Walls Dev/04_コーディング/06_テスト/02_結合テスト</Button>
                <Button className={classes.mainLink} variant="transparent">Walls Dev/05_ツール/01_開発ツール</Button>
            </div>
        </div>

        <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              ユーザー
            </Text>
        </Group>
          <div className={classes.mainLinks} >
          <Button 
            className={classes.mainLink} 
            leftSection={<IoHomeSharp size={14} />} 
            variant="transparent"
            onClick={() => router.push('/cloud_directory')}>
            ホーム
          </Button>

          <Button className={classes.mainLink} leftSection={<IoSettingsOutline size={14} />} variant="transparent">設定</Button>

          <Button 
            className={classes.mainLink} 
            leftSection={<MdOutlineContactSupport 
            size={14}/>} 
            variant="transparent"
            onClick={() => router.push('/contact')} >    
            サポート
          </Button>
          <Button 
            className={classes.mainLink} 
            leftSection={<LuLogOut size={14} />} 
            variant="transparent" 
            onClick={() => (session?.user?.accessToken ? signOut() : signIn())}>
            ログアウト
          </Button>
          <Button 
            className={classes.mainLink} 
            leftSection={<LuLogOut size={14} />} 
            variant="transparent" 
            onClick={handleClick}>
            リクエスト
          </Button>
          <Button 
            className={classes.mainLink} 
            leftSection={<LuLogOut size={14} />} 
            variant="transparent" 
            onClick={handleClickAuth}>
            Auth
          </Button>
          </div>
        </div>
      </nav>
    );
  }