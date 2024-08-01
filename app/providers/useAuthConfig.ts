import { useSession } from 'next-auth/react';
import { ResponseType } from 'axios';
// import { useAuthConfig,useAxiosConfigDownloadFile } from '../../app/providers/useAuthConfig';
// const { config } = useAuthConfig();
// const { config: downloadConfig } = useAxiosConfigDownloadFile();

// 基本の設定を取得する関数
const useAuthConfigBase = (additionalHeaders: object = {}, responseType?: ResponseType) => {
  const { data: session } = useSession();
  const headers = {
    Authorization: 'Bearer ' + session?.user?.accessToken,
    ...additionalHeaders,
  };
  const config: any = { headers };
  if (responseType) {
    config.responseType = responseType;
  }
  return { session, config };
};

// Axios通常時の設定
export const useAuthConfig = () => {
  return useAuthConfigBase();
};

// Axiosフォームデータ送信時の設定
export const useAxiosConfigForm = () => {
  return useAuthConfigBase({ 'Content-Type': 'multipart/form-data' });
};

// Axiosダウンロード時の設定
export const useAxiosConfigDownloadFile = () => {
  return useAuthConfigBase({}, 'blob' as ResponseType);
};
