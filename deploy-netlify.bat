@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Netlifyデプロイスクリプト (Windows版)
REM 使用方法: deploy-netlify.bat

echo 🚀 Netlifyへの最適化アプリデプロイを開始...

REM 1. 環境確認
echo 🔍 環境確認...
call netlify --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Netlify CLIがインストールされていません
    echo 📦 インストール: npm install -g netlify-cli
    echo 🔐 ログイン: netlify login
    pause
    exit /b 1
)

REM 2. ログイン確認
echo 🔐 ログイン状態確認...
call netlify status >nul 2>&1
if errorlevel 1 (
    echo ❌ Netlifyにログインしていません
    echo 🔐 ログイン実行: netlify login
    call netlify login
    if errorlevel 1 (
        echo ❌ ログインに失敗しました
        pause
        exit /b 1
    )
)

REM 3. クリーンビルド
echo 🧹 クリーンアップ...
call npm run clean
if errorlevel 1 (
    echo ❌ クリーンアップに失敗しました
    pause
    exit /b 1
)

REM 4. Netlify用ビルド
echo 🏗️  Netlify用最適化ビルド実行...
call npm run build:netlify
if errorlevel 1 (
    echo ❌ ビルドに失敗しました
    pause
    exit /b 1
)

REM 5. ビルド結果確認
if not exist ".next" (
    echo ❌ ビルド出力 '.next' が見つかりません
    pause
    exit /b 1
)

echo ✅ ビルド完了

REM 6. デプロイ実行
echo 🚀 Netlifyへデプロイ中...
call netlify deploy --prod --dir=.next
if errorlevel 1 (
    echo ❌ デプロイに失敗しました
    pause
    exit /b 1
)

echo ✅ デプロイ完了！

REM 7. サイト情報表示
echo 📊 サイト情報取得中...
call netlify status

echo.
echo 🎉 Netlifyデプロイ成功！
echo.
echo 【次のステップ】
echo 1. Netlifyダッシュボードでサイト確認
echo 2. カスタムドメイン設定（必要に応じて）
echo 3. 環境変数設定（必要に応じて）
echo 4. アプリからの接続テスト
echo.
echo 【移行計画】
echo - 段階的移行: 新規ユーザーから開始
echo - A/Bテスト: パフォーマンス比較
echo - 全ユーザー移行: 確認後実施
echo.
echo 【パフォーマンス期待値】
echo - 読み込み時間: 50-60%% 短縮
echo - バンドルサイズ: 80%% 削減
echo - Lighthouse Score: 95+
echo.

set /p open_site="🌐 ブラウザでサイトを開きますか？ (y/N): "
if /i "%open_site%"=="y" (
    call netlify open
)

echo 🎊 デプロイ完了！
pause
