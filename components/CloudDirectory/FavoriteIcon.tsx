import { ActionIcon,TextInput,Modal,Button } from '@mantine/core';
import { FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useGlobalContext } from '../../app/providers/GlobalContext';
import { useAuthConfig } from '../../app/providers/useAuthConfig';
import { useCounter, useDisclosure } from '@mantine/hooks';
import { FiDownload, FiFolderPlus } from 'react-icons/fi';
import { useState, useEffect, useCallback } from 'react';

export function FavoriteIcon() {
  const { favoriteState, setFavoriteState, SelectedDirectory, refreshState, setRefreshState} = useGlobalContext();
  const { config } = useAuthConfig();
  const [favorite_opened, favorite_handlers] = useDisclosure(false);
  const [value, setValue] = useState('');
  const [test,setTest] = useState(0);
  const backendUrl = process.env.NEXT_PUBLIC_URL;
  // フォルダ追加モーダルの初期値リセット
  useEffect(() => {
        setValue('')
  }, [favorite_opened]);

  // お気に入り追加
  const add_Favorite = () =>{
    const params =  {
      "directory_id": SelectedDirectory?.directory_id,
      "favorite_name": value
      }
    const add_favorite = axios.post(backendUrl + '/favorite/add_favorite', params, config)
    .then((res) => {
      console.log(res.data)
      setFavoriteState(res.data.id)
      setRefreshState(prevCount => prevCount + 1)
      favorite_handlers.close()
    })
    .catch(err => {
      console.log("err:", err);
    });
  }
  // お気に入り削除   
  const deleteFavorite = () => {
    if (favoriteState == 0) return;
    axios.delete(backendUrl + '/favorite/delete_favorite', { ...config, data: { 'id': favoriteState } })
      .then((res) => {
        console.log(res.data);
        setFavoriteState(0)
        setRefreshState(prevCount => prevCount + 1)
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

  // ファイルパスのお気に入りアイコン 
  const FavoriteIcons = useCallback(() => {
    if (favoriteState == 0){
      return (
        <ActionIcon variant="default" radius="xl" aria-label="Settings" onClick={favorite_handlers.open}>
          <FaRegHeart />
        </ActionIcon>
      );
    }else if(favoriteState == null){
      return 
    }else{
      return (
        <ActionIcon variant="filled" radius="xl" color="skyblue" aria-label="Settings" onClick={deleteFavorite}>
          <FaRegHeart />
        </ActionIcon>
      );
    }

  },[favoriteState])

  return (
    <>
    <TextInput
        label="ファイルパス"
        leftSectionWidth={50}
        rightSectionWidth={50}
        value={SelectedDirectory?.path ?? ''}
        size="sm"
        rightSection={ <FavoriteIcons key={'favorite_icon-' + test} /> }
        readOnly={true}
    />
    <Modal opened={favorite_opened} onClose={favorite_handlers.close} title="お気に入り追加" centered>
        <TextInput 
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}>
        </TextInput>
        <Button leftSection={<FiFolderPlus size={20} />} onClick={add_Favorite}>
            追加
        </Button>
    </Modal>
  </>
  )
}
