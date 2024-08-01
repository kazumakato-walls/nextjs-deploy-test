// NavbarTypes.ts
export interface Directory {
  directory_id: number;
  directory_name: string;
  path: string | null;
  directory_class: number;
  children?: Directory[];
}

export interface Favorite {
  id:number
  directory_id: number;
  favorite_name: string;
  directory_path: string;
  directory_class: number;
}
