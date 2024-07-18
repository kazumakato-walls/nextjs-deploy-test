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
    path: string;
  };
