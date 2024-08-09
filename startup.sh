#!/bin/bash

# 環境を設定（開発か本番か）
if [ "$NODE_ENV" = "production" ]; then
  export NEXT_PUBLIC_URL=https://fastapi-deploy-test.azurewebsites.net
else
  export NEXT_PUBLIC_URL=https://fastapi-deploy-test.azurewebsites.net
fi

# アプリケーションを起動
npm run start
