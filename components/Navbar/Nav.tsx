import { useState, useEffect } from 'react';
import { NavLink,Button,Group,Text } from '@mantine/core';
import { GoFileDirectory } from "react-icons/go";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import classes from './Navbar.module.css';
import axios from 'axios';
import { LuLogOut } from "react-icons/lu";
import { MdOutlineContactSupport } from "react-icons/md";
import { IoSettingsOutline, IoHomeSharp } from "react-icons/io5";
import { useGlobalContext } from '../../app/providers/GlobalContext';

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
// 選択したディレクトリ内のファイル一覧取得
const getFileList = (directory_id: number,path: string|null, session: any, setFileList: any,setSelectedDirectory:any,setPageState: any) => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + session?.user?.accessToken
    }}
  const url = axios.post("http://localhost:8000/file/get_all_file",{directory_id: directory_id},config)
  .then((res) => {
      console.log(res.data)
      setFileList(res.data)
      setSelectedDirectory({directory_id:directory_id,
                            path:path})
      setPageState(1)
  })
  .catch(err => {
      console.log("err:", err);
  });
}

// ディレクトリ一覧を取得して表示する。
const DirectoryLinks = ({ directories }: { directories: Directory[] }) => {
  const { data: session  } = useSession();
  const { setFileList,setSelectedDirectory,setPageState } = useGlobalContext();
  return (
    <>
      {directories.map(directory => (
        <NavLink
          className={classes.mainLink}
          label={directory.directory_name}
          childrenOffset={28}
          leftSection={<GoFileDirectory />}
          key={'dir' + directory.directory_id}
          onClick={() => getFileList(directory.directory_id,
                                    (directory.path ?? '') + directory.directory_name, 
                                     session,
                                     setFileList,
                                     setSelectedDirectory,
                                     setPageState)}
        >
          {directory.children && directory.children.length > 0 && (
            <DirectoryLinks directories={directory.children} />
          )}
        </NavLink>
      ))}
    </>
  );
};

// お気に入り一覧を取得して表示する。
const FavoriteLinks = ({ favorites }: { favorites: Favorite[] }) => {
  const { data: session  } = useSession();
  const { setFileList,setSelectedDirectory,setPageState } = useGlobalContext();
    return (
      <>
        {favorites.map(favorites => (
          <NavLink
            className={classes.mainLink}
            label={favorites.favorite_name}
            childrenOffset={28}
            key={'fav' + favorites.directory_id}
            onClick={() => getFileList(favorites.directory_id,
                                      (favorites.directory_path ?? ''),
                                       session,
                                       setFileList,
                                       setSelectedDirectory,
                                       setPageState)}
          />
        ))}
      </>
    );
  };

export function Navbar() {
    const router = useRouter();
    const { data: session,status  } = useSession();
    const [tree, setTree] = useState<Directory[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const { setPageState,FileList,setFileList } = useGlobalContext();

    const config = {
      headers: {
        Authorization: 'Bearer ' + session?.user?.accessToken 
      }}

    //ディレクトリ一覧取得処理 
    const getDirectoryList = () => {
        const url = axios.get("http://localhost:8000/directory/get_all_directory",config)
        .then((res) => {
            setTree(buildTree(res.data));
            setPageState(1)
        })
        .catch(err => {
            console.log("err:", err);
        });
    }

    //お気に入り一覧取得処理 
    const getFavoriteList = () => {
        const url = axios.get("http://localhost:8000/favorite/get_all",config)
        .then((res) => {
            console.log("データ:", res.data);
            setFavorites(res.data);
            setPageState(1)
        })
        .catch(err => {
            console.log("err:", err);
        });

    // 初期化処理
    useEffect(() => {
      getDirectoryList()
      getFavoriteList()
    }, [getDirectoryList, getFavoriteList]);
    }

    return (
      <div className={classes.mainLinks} >
        <Button
            className={classes.mainLink} 
            variant="transparent" 
            onClick={getDirectoryList}>
            ディレクトリ
        </Button>
        <div className={classes.mainLinks} >
            <DirectoryLinks directories={tree} />
        </div>            
        
        <Button
            className={classes.mainLink} 
            variant="transparent" 
            onClick={getFavoriteList}>
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
                onClick={() => setPageState(1)}>
                ホーム
            </Button>
            <Button 
                className={classes.mainLink} 
                leftSection={<IoSettingsOutline size={14} />} 
                variant="transparent"
                onClick={() => setPageState(3)}>                 
                設定
            </Button>
            <Button 
                className={classes.mainLink} 
                leftSection={<MdOutlineContactSupport 
                size={14}/>} 
                variant="transparent"
                onClick={() => setPageState(2)}>
                サポート
            </Button>
            <Button 
                className={classes.mainLink} 
                leftSection={<LuLogOut size={14} />} 
                variant="transparent" 
                onClick={() => (session?.user?.accessToken ? signOut() : signIn())}>
                ログアウト
            </Button>
        </div>
    </div>
  );
}
