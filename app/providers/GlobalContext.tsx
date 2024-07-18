import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileListType, SelectedDirectoryType } from './GlobalContextType';

interface GlobalContextList {
  // ユーザー情報

  // 表示画面 1:ファイル共有 2:お問い合わせ 3:設定
  pageState: number;
  setPageState: React.Dispatch<React.SetStateAction<number>>;

  // お気に入り 1:登録なし 2: 登録済み 3: 編集ボタン表示
  favoriteState: number;
  setFavoriteState: React.Dispatch<React.SetStateAction<number>>;

  // 選択ディレクトリ
  SelectedDirectory: SelectedDirectoryType | null
  setSelectedDirectory: React.Dispatch<React.SetStateAction<SelectedDirectoryType | null>>;

  // 選択ディレクトリ内のファイル一覧
  FileList: FileListType[] | null
  setFileList: React.Dispatch<React.SetStateAction<FileListType[] | null>>;
}

const GlobalContext = createContext<GlobalContextList | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageState, setPageState] = useState<number>(1);
  const [favoriteState, setFavoriteState] = useState<number>(1);
  const [FileList, setFileList] = useState<FileListType[] | null>(null);
  const [SelectedDirectory, setSelectedDirectory] = useState<SelectedDirectoryType | null>(null);
  
  return (
    <GlobalContext.Provider value={{ pageState, setPageState,
                                     favoriteState,setFavoriteState,
                                     FileList, setFileList,
                                     SelectedDirectory, setSelectedDirectory
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
