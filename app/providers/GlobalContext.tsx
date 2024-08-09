import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileListType, SelectedDirectoryType, DirectoryListType, FavoriteListType } from './GlobalContextType';

interface GlobalContextList {
  // ユーザー情報

  // 表示画面 1:ファイル共有 2:お問い合わせ 3:設定
  pageState: number;
  setPageState: React.Dispatch<React.SetStateAction<number>>;

  // Class=0のルートディレクトリID
  RootDirectoryID: number;
  setRootDirectoryID: React.Dispatch<React.SetStateAction<number>>;

  // お気に入り null:class=0 0:登録なし 0以外:登録済み(id) 
  favoriteState: number | null;
  setFavoriteState: React.Dispatch<React.SetStateAction<number | null>>;

  // 画面リフレッシュ用カウンタ
  refreshState: number;
  setRefreshState: React.Dispatch<React.SetStateAction<number>>;

  // 選択ディレクトリ
  SelectedDirectory: SelectedDirectoryType | null
  setSelectedDirectory: React.Dispatch<React.SetStateAction<SelectedDirectoryType | null>>;

  // 選択ディレクトリ内のファイル一覧
  FileList: FileListType[] | null
  setFileList: React.Dispatch<React.SetStateAction<FileListType[] | null>>;

  // ディレクトリ一覧
  DirectoryList: DirectoryListType[] |null
  setDirectoryList: React.Dispatch<React.SetStateAction<DirectoryListType[] | null>>;

  // お気に入り一覧
  FavoriteList: FavoriteListType[] |null
  setFavoriteList: React.Dispatch<React.SetStateAction<FavoriteListType[] | null>>;

}

const GlobalContext = createContext<GlobalContextList | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageState, setPageState] = useState<number>(1);
  const [RootDirectoryID, setRootDirectoryID] = useState<number>(0);
  const [favoriteState, setFavoriteState] = useState<number | null>(0);
  const [refreshState, setRefreshState] = useState<number>(0);
  const [FileList, setFileList] = useState<FileListType[] | null>(null);
  const [SelectedDirectory, setSelectedDirectory] = useState<SelectedDirectoryType | null>(null);
  const [DirectoryList, setDirectoryList] = useState<DirectoryListType[] | null>(null);
  const [FavoriteList, setFavoriteList] = useState<FavoriteListType[] | null>(null);
  
  return (
    <GlobalContext.Provider value={{ pageState, setPageState,
                                     RootDirectoryID, setRootDirectoryID,
                                     favoriteState,setFavoriteState,
                                     refreshState, setRefreshState,
                                     FileList, setFileList,
                                     SelectedDirectory, setSelectedDirectory,
                                     DirectoryList, setDirectoryList,
                                     FavoriteList, setFavoriteList
                                   }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextList => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
