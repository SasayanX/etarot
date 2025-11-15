# ロリポップへのアップロードガイド

## ✅ アップロード対象ファイル

### **アップロードするフォルダ**
```
D:\project\e-tarot\out\
```

**このフォルダの全内容（143ファイル、約21MB）をロリポップにアップロードします。**

---

## 📦 out フォルダの内容

### **ファイル構成**
```
out/
├── index.html                    ← トップページ
├── 404.html                      ← エラーページ
├── dictionary.html               ← 辞典ページ
├── fortune.html                  ← 占いページ
├── quiz.html                     ← クイズページ
├── game.html                     ← ゲームメニュー
├── settings.html                 ← 設定ページ
├── privacy.html                  ← プライバシーページ
├── download-app.html             ← アプリダウンロードページ
├── app-ads.txt                   ← AdMob用ファイル
├── .htaccess                     ← Apache設定ファイル
│
├── _next/                        ← Next.jsビルドファイル
│   ├── static/                   ← JavaScriptバンドル
│   │   ├── chunks/               ← コード分割されたJSファイル
│   │   └── css/                  ← スタイルシート
│   └── ...
│
├── api/                          ← 静的APIレスポンス
│   └── card-suits/
│
├── debug/                        ← デバッグページ（オプション）
│
├── game/                         ← ゲームモードの各ページ
│   ├── classic.html
│   ├── hard.html
│   ├── time-attack.html
│   └── battle.html
│
└── *.png, *.jpg, *.svg           ← 画像ファイル（カード背景など）
```

### **統計情報**
- **合計ファイル数**: 143ファイル
- **合計サイズ**: 約21MB
- **ページ数**: 24ページ（すべて静的HTML）

---

## 📤 アップロード方法

### **方法1: ロリポップFTP（ブラウザ）- 推奨**

#### **STEP 1: ZIPファイルを作成**
```powershell
# PowerShellで実行
cd D:\project\e-tarot
Compress-Archive -Path "out\*" -DestinationPath "tarot-static.zip" -Force
```

または、Windowsエクスプローラで:
1. `D:\project\e-tarot\out` フォルダを開く
2. フォルダ内の**すべてのファイル・フォルダを選択**（Ctrl+A）
3. 右クリック > **送る > 圧縮（zip形式）フォルダー**
4. `tarot-static.zip` という名前で保存

#### **STEP 2: ロリポップFTPにアップロード**
1. ロリポップ管理画面にログイン: https://user.lolipop.jp/
2. **サーバーの管理・設定 > ロリポップ！FTP**
3. アップロード先ディレクトリに移動:
   - 例: `/tarot/` または `/tarot.kanau-kiryu.com/`
   - ※ 独自ドメイン設定で確認したディレクトリ
4. **アップロード** ボタン
5. `tarot-static.zip` を選択してアップロード
6. アップロード完了後、ZIPファイルを選択して **解凍** ボタン
7. 解凍完了後、ZIPファイルを削除（任意）

#### **注意事項**
- ✅ アップロード先は **tarot.kanau-kiryu.com 用のディレクトリ**
- ✅ ZIP解凍後、`index.html` がルートにあることを確認
- ✅ 既存ファイルは上書きされます（バックアップ推奨）

---

### **方法2: FTPクライアント（FileZilla）**

#### **STEP 1: FileZillaをインストール**
https://filezilla-project.org/download.php?type=client

#### **STEP 2: FTP接続設定**
ロリポップの管理画面で確認した情報を入力:
```
ホスト:       ftp.lolipop.jp
ユーザー名:   your-account-la.jp
パスワード:   ********
ポート:       21
```

#### **STEP 3: 接続してアップロード**
1. FileZillaを起動
2. 上記の設定で接続
3. 右側（リモートサイト）でアップロード先ディレクトリに移動
   - 例: `/tarot/` または `/tarot.kanau-kiryu.com/`
4. 左側（ローカルサイト）で `D:\project\e-tarot\out` を開く
5. `out` フォルダ内の**すべてのファイル・フォルダを選択**（Ctrl+A）
6. 右クリック > **アップロード**
7. アップロード完了まで待つ（5〜10分）

#### **注意事項**
- ✅ **バイナリモード**でアップロード（デフォルト）
- ✅ `.htaccess` も忘れずにアップロード（隠しファイル）
- ✅ アップロード後、ファイル数が143個あるか確認

---

### **方法3: PowerShellスクリプト（上級者向け）**

```powershell
# FTPアップロードスクリプト（WinSCPが必要）
# WinSCP: https://winscp.net/eng/download.php

# WinSCP .NETアセンブリを使用
Add-Type -Path "C:\Program Files (x86)\WinSCP\WinSCPnet.dll"

# FTP接続設定
$sessionOptions = New-Object WinSCP.SessionOptions -Property @{
    Protocol = [WinSCP.Protocol]::Ftp
    HostName = "ftp.lolipop.jp"
    UserName = "your-account-la.jp"
    Password = "********"
}

$session = New-Object WinSCP.Session

try {
    # 接続
    $session.Open($sessionOptions)

    # アップロード
    $transferOptions = New-Object WinSCP.TransferOptions
    $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary

    $transferResult = $session.PutFiles(
        "D:\project\e-tarot\out\*",
        "/tarot/",  # アップロード先ディレクトリ
        $False,     # 削除しない
        $transferOptions
    )

    # 結果確認
    $transferResult.Check()
    Write-Host "アップロード成功！"
}
finally {
    # 接続を閉じる
    $session.Dispose()
}
```

---

## ✅ アップロード後の確認

### **1. ファイル構成の確認**
ロリポップFTPで確認:
```
/tarot/ (または /tarot.kanau-kiryu.com/)
├── index.html              ← あることを確認
├── 404.html
├── _next/                  ← フォルダがあることを確認
├── api/
├── debug/
├── game/
└── *.png, *.jpg            ← 画像ファイルがあることを確認
```

**重要**: `index.html` が**ルートディレクトリ直下**にあることを確認してください。

### **2. .htaccess の確認**
`.htaccess` ファイルがアップロードされているか確認:
- ロリポップFTPで **隠しファイルを表示** に設定
- `.htaccess` が存在することを確認

### **3. ブラウザで動作確認**
```
https://tarot.kanau-kiryu.com/
```
以下を確認:
- □ トップページが表示される
- □ 画像が表示される
- □ CSS/JSが正しく読み込まれる
- □ 辞典ページ (`/dictionary`) が動作する
- □ 占いページ (`/fortune`) が動作する
- □ クイズページ (`/quiz`) が動作する
- □ ゲームページ (`/game`) が動作する

### **4. SSL証明書の設定（必須）**
1. ロリポップ管理画面 > **セキュリティ > 独自SSL証明書導入**
2. `tarot.kanau-kiryu.com` の行で **SSL設定**
3. **無料独自SSLを設定する**
4. 設定完了まで5〜30分待つ
5. `https://tarot.kanau-kiryu.com` でアクセス確認

---

## 🚨 トラブルシューティング

### **問題: 「ページが見つかりません」（404エラー）**

**原因**: ファイルのアップロード先が間違っている

**解決策**:
1. ロリポップ管理画面 > **独自ドメイン設定**
2. `tarot.kanau-kiryu.com` の**公開フォルダ**を確認
3. そのフォルダに `index.html` があるか確認
4. なければ、正しいフォルダにアップロードし直す

### **問題: CSSが効かない・画像が表示されない**

**原因**: `_next/` フォルダがアップロードされていない

**解決策**:
1. ロリポップFTPで `_next/` フォルダが存在するか確認
2. なければ、`out/_next/` フォルダをアップロード
3. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）

### **問題: `.htaccess` がアップロードされていない**

**原因**: 隠しファイルが非表示になっている

**解決策**:
1. ロリポップFTPで **設定** > **隠しファイルを表示**
2. `.htaccess` が見えるようになる
3. なければ、手動でアップロード

### **問題: 「Internal Server Error」（500エラー）**

**原因**: `.htaccess` の設定が間違っている

**解決策**:
1. `.htaccess` をバックアップ
2. `.htaccess` を削除して動作確認
3. 動作すれば、`.htaccess` の内容を修正

---

## 📊 アップロード完了チェックリスト

### **アップロード前**
- □ `npm run build:lolipop` でビルド完了
- □ `out/` フォルダに143ファイルが存在
- □ 合計サイズ約21MBを確認

### **アップロード中**
- □ アップロード先ディレクトリを確認（例: `/tarot/`）
- □ ZIPファイルまたはFTPクライアントでアップロード
- □ すべてのファイルがアップロードされたことを確認

### **アップロード後**
- □ `index.html` がルート直下にあることを確認
- □ `_next/` フォルダが存在することを確認
- □ `.htaccess` がアップロードされていることを確認
- □ ブラウザで `https://tarot.kanau-kiryu.com/` が表示されることを確認
- □ 辞典・占い・クイズ・ゲームページが動作することを確認
- □ 画像・CSS・JSが正しく読み込まれることを確認
- □ SSL証明書が設定されていることを確認（HTTPS）

### **DNS変更前**
- □ 旧Vercelサイトがまだ動作していることを確認（念のため）
- □ 新ロリポップサイトが完全に動作することを確認
- □ 旧アプリ（v23）でテスト（可能なら）

---

## ⏭️ 次のステップ

アップロード完了後、以下の手順に進んでください:

1. ✅ **動作確認**（このガイドの「アップロード後の確認」セクション）
2. ✅ **SSL証明書設定**（ロリポップ管理画面）
3. ⏭️ **DNS設定変更**（`VERCEL-TO-LOLIPOP-MIGRATION.md` の STEP 3）
4. ⏭️ **DNS伝播待ち**（1〜24時間）
5. ⏭️ **Vercelプロジェクト削除**（1週間後推奨）

---

## 📞 サポート

### **ロリポップ サポート**
- マニュアル: https://lolipop.jp/manual/
- お問い合わせ: https://lolipop.jp/contact/
- 電話: 03-6822-4006（スタンダードプラン以上）

---

**アップロード頑張ってください！** 🚀


