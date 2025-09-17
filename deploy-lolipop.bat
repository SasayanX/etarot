@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ロリポップサーバー用デプロイスクリプト (Windows版)
REM 使用方法: deploy-lolipop.bat [サブドメイン名]

echo 🚀 ロリポップサーバーへのデプロイを開始...

REM サブドメイン名の取得
set SUBDOMAIN=%1
if "%SUBDOMAIN%"=="" set SUBDOMAIN=tarot
echo 📁 サブドメイン: %SUBDOMAIN%

REM 1. クリーンビルド
echo 🧹 クリーンアップ...
call npm run clean
if errorlevel 1 (
    echo ❌ クリーンアップに失敗しました
    pause
    exit /b 1
)

REM 2. 静的サイト生成
echo 🏗️  静的サイト生成...
call npm run build:lolipop
if errorlevel 1 (
    echo ❌ ビルドに失敗しました
    pause
    exit /b 1
)

REM 3. 出力ディレクトリの確認
if not exist "out" (
    echo ❌ 出力ディレクトリ 'out' が見つかりません
    pause
    exit /b 1
)

echo ✅ 静的サイト生成完了

REM 4. デプロイ用ファイルの準備
echo 📦 デプロイファイル準備...

REM .htaccessファイルをoutディレクトリにコピー
copy "public\.htaccess" "out\.htaccess" >nul
if errorlevel 1 (
    echo ⚠️  .htaccess ファイルのコピーに失敗しました
)

REM 404ページの作成（Next.jsの404.htmlがない場合）
if not exist "out\404.html" (
    copy "out\index.html" "out\404.html" >nul
    echo ✅ 404.html を作成しました
)

REM 5. ファイルサイズの確認
echo 📊 ファイルサイズ確認...
for /f %%i in ('dir /s /b out ^| find /c /v ""') do set file_count=%%i
echo 📁 ファイル数: !file_count!

REM 6. 重要なファイルの存在確認
echo 🔍 重要ファイル確認...
if exist "out\index.html" (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html が見つかりません
    pause
    exit /b 1
)

if exist "out\_next" (
    echo ✅ _next ディレクトリ 存在
) else (
    echo ❌ _next ディレクトリが見つかりません
    pause
    exit /b 1
)

REM 7. デプロイ手順の表示
echo.
echo 🎉 ビルド完了！以下の手順でデプロイしてください：
echo.
echo 【ロリポップFTP/ファイルマネージャーでの作業】
echo 1. ロリポップのユーザー専用ページにログイン
echo 2. 「サーバーの管理・設定」→「サブドメイン設定」
echo 3. サブドメイン '%SUBDOMAIN%' を作成
echo 4. FTPまたはファイルマネージャーで '%SUBDOMAIN%' フォルダにアクセス
echo 5. 'out' フォルダ内の全ファイルを '%SUBDOMAIN%' フォルダにアップロード
echo.
echo 【アップロード対象】
echo - out\ フォルダ内のすべてのファイル
echo - .htaccess ファイル（重要）
echo - _next\ フォルダ（静的アセット）
echo.
echo 【アクセスURL】
echo https://%SUBDOMAIN%.your-domain.com
echo.
echo ⚠️  注意事項：
echo - .htaccess ファイルが正しくアップロードされているか確認
echo - ファイルの権限設定（644）を確認
echo - サブドメインの設定が反映されるまで数分〜数時間かかる場合があります

REM 8. 圧縮ファイルの作成（オプション）
echo.
set /p create_zip="📦 アップロード用のZIPファイルを作成しますか？ (y/N): "
if /i "%create_zip%"=="y" (
    set zip_name=%SUBDOMAIN%-deploy-%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%.zip
    set zip_name=!zip_name: =0!
    echo 📦 ZIPファイル作成中...
    
    REM PowerShellを使用してZIPファイルを作成
    powershell -command "Compress-Archive -Path 'out\*' -DestinationPath '!zip_name!' -Force"
    if errorlevel 1 (
        echo ❌ ZIPファイルの作成に失敗しました
    ) else (
        echo ✅ ZIPファイル作成完了: !zip_name!
        echo    このファイルをダウンロードして、ロリポップのファイルマネージャーでアップロード・展開してください
    )
)

echo.
echo 🎊 デプロイ準備完了！
pause
