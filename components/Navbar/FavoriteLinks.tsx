// FavoriteLinks.tsx
import { useState, useEffect } from 'react';
import { NavLink, ActionIcon, Menu,Modal,TextInput,Button } from '@mantine/core';
import { useGlobalContext } from '../../app/providers/GlobalContext';
import { Favorite } from './NavbarTypes';
import classes from './Navbar.module.css';
import axios from 'axios';
import { useAuthConfig } from '../../app/providers/useAuthConfig'
import { CiEdit } from 'react-icons/ci';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { useDisclosure } from '@mantine/hooks';

export const FavoriteLinks = ({ favorites }: { favorites: Favorite[] }) => {
  const { setFileList, setSelectedDirectory, setPageState, setFavoriteState, setRefreshState } = useGlobalContext();
  const { session, config } = useAuthConfig();
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string>('');
  const [favoriteId, setFavoriteId] = useState<number>(0);
  const [favoriteName, setFavoriteName] = useState<string>('');
  const [favoritePath, setFavoritePath] = useState<string>('');
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  // ファイル一覧を取得。
  const getFileList = (id:number, directory_id: number,path: string) => {
    console.log(directory_id)
    console.log(id)
    console.log(path)
    axios.post(backendUrl + '/file/get_all_file', { directory_id }, config)
    .then((res) => {
        console.log(res.data);
        setFileList(res.data);
        setSelectedDirectory({ directory_id, path });
        setPageState(1);
        setFavoriteState(id)
        console.log(id)
    })
    .catch((err) => {
        console.log('err:', err);
    });
  };

  // お気に入り名変更のモーダル画面表示
  const favorite_modalopen = (favorite_id:number, favorite_name: string, favorite_path: string) =>{
    setFavoriteId(favorite_id)
    setValue(favorite_name)
    setFavoriteName(favorite_name)
    setFavoritePath(favorite_path)
    open()
  }
  // お気に入り名変更処理
  const updateFavorite = () => {
    const params =  {            
      "id": favoriteId,
      "favorite_name": value
      }
    axios.put(backendUrl + '/favorite/update_favorite',params, config)
    .then((res) => {
        console.log(res.data);
        setRefreshState(prevCount => prevCount + 1)
        close()
    })
    .catch((err) => {
        console.log('err:', err);
    });
    close();
  }

  // お気に入り名削除処理
  const deleteFavorite = (id:number) => {
    axios.delete(backendUrl + '/favorite/delete_favorite',{...config,data: { id }})
    .then((res) => {
        console.log(res.data);
        setFavoriteState(0);
        setRefreshState(prevCount => prevCount + 1)
    })
    .catch((err) => {
        console.log('err:', err);
    });
  }

  return (
    <>
      {favorites.map((favorite) => (
        <NavLink
          className={classes.mainLink}
          label={favorite.favorite_name}
          childrenOffset={28}
          key={'favorite' + favorite.directory_id}
          rightSection={
            <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon size={24} variant="subtle" aria-label="ActionIcon with size as a number">
                <AiOutlineEllipsis size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                   onClick={()=> favorite_modalopen(favorite.id,favorite.favorite_name,favorite.directory_path)}
                   leftSection={<CiEdit size={16}/>}>
                   編集
              </Menu.Item>
              <Menu.Item
                  color="red"
                  onClick={() => deleteFavorite(favorite.id)}
                  leftSection={<MdDeleteOutline size={17} />}
              >
                お気に入り削除
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>          
          }
          onClick={() =>
            getFileList(
              favorite.id,
              favorite.directory_id,
              favorite.directory_path ?? ''
            )
          }
        />
      ))}
        <Modal opened={opened} onClose={close} title="お気に入り名変更" centered>
          <TextInput 
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder={favoriteName}
              description={'ファイルパス：' + favoritePath}
              >
          </TextInput>
          <Button leftSection={<CiEdit size={20} />} onClick={updateFavorite}>
            変更
          </Button>
        </Modal>
    </>
  );
};
