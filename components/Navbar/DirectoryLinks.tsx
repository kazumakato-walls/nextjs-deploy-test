// DirectoryLinks.tsx
import { NavLink } from '@mantine/core';
import { GoFileDirectory } from 'react-icons/go';
import { useSession } from 'next-auth/react';
import { useGlobalContext } from '../../app/providers/GlobalContext';
import { Directory } from './NavbarTypes';
import classes from './Navbar.module.css';
import axios from 'axios';
import { useAuthConfig } from '../../app/providers/useAuthConfig'
import { Favorite } from './NavbarTypes';

export const DirectoryLinks = ({ directories }: { directories: Directory[] }) => {
  const { setFileList, setSelectedDirectory, setPageState, setFavoriteState } = useGlobalContext();
  const { session, config } = useAuthConfig();
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  // お気に入り登録済みかどうかのチェックを行い、登録済みの場合はお気に入りボタンに色をつける。
  const getfavoriteList = (path: string) => {
    axios.get(backendUrl + '/favorite/get_all', config)
    .then((res) => {
        console.log(res.data);
        const favorites: Favorite[] = res.data;
        const favoriteid = favorites.filter(favorite => {
          return favorite.directory_path === path
        })
        if(favoriteid.length == 0){
          setFavoriteState(0)
        }else{
          setFavoriteState(favoriteid[0].id)
        }
        // const isFavorite = favorites.some(favorite => favorite.directory_path === path);
        // setFavoriteState(isFavorite ? 2 : 1);
    })
      .catch((err) => {
        console.log('err:', err);
    });
  }
  // ファイル一覧を取得する。
  const getFileList = (directory_id: number,path: string) => {
    axios.post(backendUrl + '/file/get_all_file', { directory_id }, config)
    .then((res) => {
        console.log(res.data);
        setFileList(res.data);
        setSelectedDirectory({ directory_id, path });
        setPageState(1);
        getfavoriteList(path)
    })
    .catch((err) => {
        console.log('err:', err);
    });
  };
  return (
    <>
      {directories.map((directory) => (
        <NavLink
          className={classes.mainLink}
          label={directory.directory_name}
          childrenOffset={28}
          leftSection={<GoFileDirectory />}
          key={'directory' + directory.directory_id}
          onClick={() =>
            getFileList(
              directory.directory_id,
              (directory.path ?? '') + directory.directory_name
            )
          }
        >
          {directory.children && directory.children.length > 0 && (
            <DirectoryLinks directories={directory.children} />
          )}
        </NavLink>
      ))}
    </>
  );
};
