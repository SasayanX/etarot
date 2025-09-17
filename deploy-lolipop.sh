#!/bin/bash

# ロリポップサーバー用デプロイスクリプト
# 使用方法: ./deploy-lolipop.sh [サブドメイン名]

set -e

echo "🚀 ロリポップサーバーへのデプロイを開始..."

# サブドメイン名の取得
SUBDOMAIN=${1:-tarot}
echo "📁 サブドメイン: $SUBDOMAIN"

# 1. クリーンビルド
echo "🧹 クリーンアップ..."
npm run clean

# 2. 静的サイト生成
echo "🏗️  静的サイト生成..."
npm run build:lolipop

# 3. 出力ディレクトリの確認
if [ ! -d "out" ]; then
    echo "❌ 出力ディレクトリ 'out' が見つかりません"
    exit 1
fi

echo "✅ 静的サイト生成完了"

# 4. デプロイ用ファイルの準備
echo "📦 デプロイファイル準備..."

# .htaccessファイルをoutディレクトリにコピー
cp public/.htaccess out/

# 404ページの作成（Next.jsの404.htmlがない場合）
if [ ! -f "out/404.html" ]; then
    cp out/index.html out/404.html
fi

# 5. ファイルサイズの確認
echo "📊 ファイルサイズ確認..."
du -sh out/
echo "📁 ファイル数: $(find out -type f | wc -l)"

# 6. 重要なファイルの存在確認
echo "🔍 重要ファイル確認..."
if [ -f "out/index.html" ]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html が見つかりません"
    exit 1
fi

if [ -d "out/_next" ]; then
    echo "✅ _next ディレクトリ 存在"
else
    echo "❌ _next ディレクトリが見つかりません"
    exit 1
fi

# 7. デプロイ手順の表示
echo ""
echo "🎉 ビルド完了！以下の手順でデプロイしてください："
echo ""
echo "【ロリポップFTP/ファイルマネージャーでの作業】"
echo "1. ロリポップのユーザー専用ページにログイン"
echo "2. 「サーバーの管理・設定」→「サブドメイン設定」"
echo "3. サブドメイン '$SUBDOMAIN' を作成"
echo "4. FTPまたはファイルマネージャーで '$SUBDOMAIN' フォルダにアクセス"
echo "5. 'out' フォルダ内の全ファイルを '$SUBDOMAIN' フォルダにアップロード"
echo ""
echo "【アップロード対象】"
echo "- out/ フォルダ内のすべてのファイル"
echo "- .htaccess ファイル（重要）"
echo "- _next/ フォルダ（静的アセット）"
echo ""
echo "【アクセスURL】"
echo "https://$SUBDOMAIN.your-domain.com"
echo ""
echo "【FTPアップロードコマンド例】"
echo "lftp -c 'open -u username,password ftp.lolipop.jp; mirror -R out/ /$SUBDOMAIN/'"
echo ""
echo "⚠️  注意事項："
echo "- .htaccess ファイルが正しくアップロードされているか確認"
echo "- ファイルの権限設定（644）を確認"
echo "- サブドメインの設定が反映されるまで数分〜数時間かかる場合があります"

# 8. 圧縮ファイルの作成（オプション）
echo ""
read -p "📦 アップロード用のZIPファイルを作成しますか？ (y/N): " create_zip
if [[ $create_zip =~ ^[Yy]$ ]]; then
    zip_name="${SUBDOMAIN}-deploy-$(date +%Y%m%d-%H%M%S).zip"
    echo "📦 ZIPファイル作成中..."
    cd out && zip -r "../$zip_name" . && cd ..
    echo "✅ ZIPファイル作成完了: $zip_name"
    echo "   このファイルをダウンロードして、ロリポップのファイルマネージャーでアップロード・展開してください"
fi

echo ""
echo "🎊 デプロイ準備完了！"
