#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}eTarot APK ビルドスクリプト${NC}"
echo "==============================="

# 環境チェック
echo -e "${GREEN}環境チェック中...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.jsがインストールされていません${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npmがインストールされていません${NC}"
    exit 1
fi

# 依存関係のインストール
echo -e "${GREEN}依存関係をインストール中...${NC}"
npm install

# Next.jsアプリのビルド
echo -e "${GREEN}Next.jsアプリをビルド中...${NC}"
npm run export

# Capacitorの初期化（初回のみ）
if [ ! -d "android" ]; then
    echo -e "${GREEN}Androidプラットフォームを追加中...${NC}"
    npx cap add android
else
    echo -e "${GREEN}Androidプロジェクトを同期中...${NC}"
    npx cap sync
fi

# APKのビルド
echo -e "${GREEN}APKをビルド中...${NC}"
cd android
./gradlew assembleRelease

# 結果の確認
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo -e "${GREEN}ビルド成功!${NC}"
    echo "APKの場所: android/app/build/outputs/apk/release/app-release.apk"
    # APKのサイズを表示
    APK_SIZE=$(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "APKサイズ: ${APK_SIZE}"
else
    echo -e "${RED}ビルド失敗!${NC}"
    echo "エラーログを確認してください"
fi
