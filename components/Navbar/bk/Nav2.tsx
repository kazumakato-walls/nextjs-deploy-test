import { useState, useEffect } from 'react';
import { NavLink,Button,Group,Text } from '@mantine/core';
import { GoFileDirectory } from "react-icons/go";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useDirectoryTree } from '../../app/providers/DirectoryTree';
import classes from './Navbar.module.css';
import axios from 'axios';
import { LuLogOut } from "react-icons/lu";
import { MdOutlineContactSupport } from "react-icons/md";
import { IoSettingsOutline, IoHomeSharp } from "react-icons/io5";

// ディレクトリ型
interface Directory {
    directory_id: number;
    directory_name: string;
    path: string | null;
    directory_class: number;
    children?: Directory[];
  }
// お気に入り型
interface Favorite {
    directory_id: number;
    favorite_name: string;
    directory_path: string | null;
    directory_class: number;
  }

// ツリー構造を構築する関数
const buildTree = (items: Directory[]) => {
  const tree: Directory[] = [];
  const lookup: { [key: string]: Directory } = {};

  items.forEach(item => {
    lookup[item.directory_name] = item;
    item.children = [];
  });

  items.forEach(item => {
    if (item.path) {
      const parentName = item.path.slice(0, -1).split('/').pop() || '';
      if (lookup[parentName]) {
        lookup[parentName].children!.push(item);
      }
    } else {
      tree.push(item);
    }
  });

  return tree;
};

// 再帰的にNavLinkを生成するコンポーネント
const DirectoryLinks = ({ directories }: { directories: Directory[] }) => {
  return (
    <>
      {directories.map(directory => (
        <NavLink
          className={classes.mainLink}
          key={directory.directory_id}
          label={directory.directory_name}
          childrenOffset={28}
          leftSection={<GoFileDirectory />}
        >
          {directory.children && directory.children.length > 0 && (
            <DirectoryLinks directories={directory.children} />
          )}
        </NavLink>
      ))}
    </>
  );
};

const FavoriteLinks = ({ favorites }: { favorites: Favorite[] }) => {
    return (
      <>
        {favorites.map(favorites => (
          <NavLink
            className={classes.mainLink}
            key={favorites.directory_id}
            label={favorites.favorite_name}
            childrenOffset={28}
          />
        ))}
      </>
    );
  };

export function DirectoryTree() {
    const router = useRouter();
    const { data: session,status  } = useSession();
    const { setDirectoryTree,DirectoryTree } = useDirectoryTree();
    const config = {
      headers: {
        Authorization: 'Bearer ' + session?.user?.accessToken // ここに実際のアクセストークンをセット
      }}

    const [tree, setTree] = useState<Directory[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    
    const handleClick = () => {
        const url = axios.get("http://localhost:8000/directory/get_all_directory",config)
        .then((res) => {
            console.log("ステータスコード:", status);
            console.log("ステータスコード:", url);
            console.log("データ:", res.data);
            setTree(buildTree(res.data));
        // setDirectoryTree(buildTree2(res.data));        
        // console.log(result)
        })
        .catch(err => {
            console.log("err:", err);
        });
    console.log(DirectoryTree)
    }
    const handleClick2 = () => {
        const url = axios.get("http://localhost:8000/favorite/get_all",config)
        .then((res) => {
            console.log("ステータスコード:", status);
            console.log("ステータスコード:", url);
            console.log("データ:", res.data);
            setFavorites(res.data);
        })
        .catch(err => {
            console.log("err:", err);
        });
    }
    const handleClick3 = () => {
        const url = axios.post("http://localhost:8000/file/get_all_file",config)
        .then((res) => {
            console.log("ステータスコード:", status);
            console.log("ステータスコード:", url);
            console.log("データ:", res.data);
            // setFavorites(res.data);
        })
        .catch(err => {
            console.log("err:", err);
        });
    }
    return (
      <div className={classes.mainLinks} >
        <Button
            className={classes.mainLink} 
            variant="transparent" 
            onClick={handleClick}>
            ディレクトリ
        </Button>
        <div className={classes.mainLinks} >
            <DirectoryLinks directories={tree} />
        </div>            
        
        <Button
            className={classes.mainLink} 
            variant="transparent" 
            onClick={handleClick2}>
            お気に入り
        </Button>
        <div className={classes.mainLinks} >
            <FavoriteLinks favorites={favorites} />
        </div>

        <div className={classes.mainLinks} >
            <Text size="xs" fw={500} c="dimmed">
              ユーザー
            </Text>
        </div>
        <div className={classes.mainLinks} >
            <Button 
                className={classes.mainLink} 
                leftSection={<IoHomeSharp size={14} />} 
                variant="transparent"
                onClick={() => router.push('/cloud_directory')}>
                ホーム
            </Button>
            <Button 
                className={classes.mainLink} 
                leftSection={<IoSettingsOutline size={14} />} 
                variant="transparent">
                設定
            </Button>
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
                onClick={handleClick3}>
                ファイル一覧取得
            </Button>
        </div>
    </div>
  );
}
