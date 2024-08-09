export interface FileListType  {
  id: number;
  file_name: string;
  file_size: string | null;
  filetype_name: string;
  icon_id:number | null;
  file_update_at:string
};

export interface SelectedDirectoryType {
    directory_id: number;
    path: string | null;
  };

export interface DirectoryListType {
  directory_id: number;
  directory_name: string;
  path: string | null;
  directory_class: number;
  children?: DirectoryListType[];
}

export interface FavoriteListType {
  id:number
  directory_id: number;
  favorite_name: string;
  directory_path: string;
  directory_class: number;
}
