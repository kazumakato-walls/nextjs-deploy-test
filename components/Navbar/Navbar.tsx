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

export function Navbar() {
  const [tree, setTree] = useState<Directory[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { setPageState, setFileList, setSelectedDirectory,refreshState, setRefreshState } = useGlobalContext();
  const { session, config } = useAuthConfig();
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  // フォルダ追加モーダルの初期値リセット
  useEffect(() => {
    getDirectoryList()
    getFavoriteList()
  }, [refreshState]);

  const getDirectoryList = () => {
    console.log(backendUrl)
    axios
      .get(backendUrl + '/directory/get_all_directory', config)
      .then((res) => {
        console.log(res.data);
        setTree(buildTree(res.data));
        setPageState(1);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

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

  useEffect(() => {
    getDirectoryList();
    getFavoriteList();
  }, []);

  return (
    <div className={classes.mainLinks}>
      <Button className={classes.mainLink} variant="transparent" onClick={getDirectoryList}>
        ディレクトリ
      </Button>
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
