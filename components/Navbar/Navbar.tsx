import { useState, useEffect } from 'react';
import { Button, Text } from '@mantine/core';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoHomeSharp, IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineContactSupport } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';
import classes from './Navbar.module.css';
import axios from 'axios';
import { useGlobalContext } from '../../app/providers/GlobalContext';
import { DirectoryLinks } from './DirectoryLinks';
import { FavoriteLinks } from './FavoriteLinks';
import { Directory, Favorite } from './NavbarTypes';
import { useAuthConfig } from '../../app/providers/useAuthConfig'

// ディレクトリ一覧のツリー構造の生成
const buildTree = (items: Directory[]) => {
  const tree: Directory[] = [];
  const lookup: { [key: string]: Directory } = {};
  items.forEach(item => {
    const key = `${item.directory_name}_${item.directory_class}`;
    lookup[key] = item;
    item.children = [];
  });

  items.forEach(item => {
    if (item.path) {
      const parentName = item.path.slice(0, -1).split('/').pop() || '';
      const parentClass = item.directory_class - 1;
      const parentKey = `${parentName}_${parentClass}`;
      if (lookup[parentKey]) {
        lookup[parentKey].children!.push(item);
      }
    } else {
      tree.push(item);
    }
  });

  return tree;
};


export function Navbar() {
  const [tree, setTree] = useState<Directory[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { setPageState, setFileList, setSelectedDirectory,refreshState, setRefreshState,RootDirectoryID, setRootDirectoryID,setFavoriteState } = useGlobalContext();
  const { session, config } = useAuthConfig();
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  // フォルダ追加モーダルの初期値リセット
  useEffect(() => {
    refreshDirectoryList()
    getFavoriteList()
  }, [refreshState]);

  // ディレクトリリストの更新
  const getDirectoryList = () => {
    console.log(backendUrl)
    axios.get(backendUrl + '/directory/get_all_directory', config)
      .then((res) => {
        console.log(res.data);
        setTree(buildTree(res.data));
        getRootDirectoryID()
        setPageState(1);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };
  // ディレクトリリストの更新
  const refreshDirectoryList = () => {
    console.log(backendUrl)
    axios.get(backendUrl + '/directory/get_all_directory', config)
      .then((res) => {
        console.log(res.data);
        setTree(buildTree(res.data));
        setPageState(1);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };
  // ディレクトリリストの更新 ルートディレクトリ移動なし
  const getFavoriteList = () => {
    axios.get(backendUrl + '/favorite/get_all', config)
    .then((res) => {
        console.log(res.data);
        setFavorites(res.data);
        setPageState(1);
    })
      .catch((err) => {
        console.log('err:', err);
    });
  };

  // ルートディレクトリ取得
  const getRootDirectoryID = () => {
    axios.get(backendUrl + '/directory/get_root_directory', config)
    .then((res) => {
        console.log(res.data);
        const directoryID:number = res.data
        setRootDirectoryID(directoryID)
        getFileList(directoryID)
    })
      .catch((err) => {
        console.log('err:', err);
    });
  }

    // ファイル一覧を取得する。
    const getFileList = (directory_id: number) => {
      axios.post(backendUrl + '/file/get_all_file', { directory_id }, config)
      .then((res) => {
          console.log(res.data);
          setFileList(res.data);
          const path = ''
          setSelectedDirectory({ directory_id, path });          
          setFavoriteState(null)
          setPageState(1);
      })
      .catch((err) => {
          console.log('err:', err);
      });
    };


  return (
    <div className={classes.mainLinks}>
      <Button className={classes.mainLink} variant="transparent" onClick={getDirectoryList}>
        ディレクトリ
      </Button>
      {/* <Button className={classes.mainLink} variant="transparent" onClick={getRootDirectoryID}>
        Rootディレクトリ
      </Button> */}
      <div className={classes.mainLinks}>
        <DirectoryLinks directories={tree} />
      </div>

      <Button className={classes.mainLink} variant="transparent" onClick={getFavoriteList}>
        お気に入り
      </Button>
      <div className={classes.mainLinks}>
        <FavoriteLinks favorites={favorites} />
      </div>

      <div className={classes.mainLinks}>
        <Text size="xs" fw={500} c="dimmed">
          ユーザー
        </Text>
      </div>
      <div className={classes.mainLinks}>
        <Button
          className={classes.mainLink}
          leftSection={<IoHomeSharp size={14} />}
          variant="transparent"
          onClick={() => setPageState(1)}
        >
          ホーム
        </Button>
        <Button
          className={classes.mainLink}
          leftSection={<IoSettingsOutline size={14} />}
          variant="transparent"
          onClick={() => setPageState(3)}
        >
          設定
        </Button>
        <Button
          className={classes.mainLink}
          leftSection={<MdOutlineContactSupport size={14} />}
          variant="transparent"
          onClick={() => setPageState(2)}
        >
          サポート
        </Button>
        <Button
          className={classes.mainLink}
          leftSection={<LuLogOut size={14} />}
          variant="transparent"
          onClick={() => (session?.user?.accessToken ? signOut() : signIn())}
        >
          ログアウト
        </Button>
      </div>
    </div>
  );
}
