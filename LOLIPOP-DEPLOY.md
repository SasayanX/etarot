# 🍭 ロリポップサーバーデプロイガイド

完璧に最適化されたE-Tarotアプリをロリポップサーバーのサブドメインで公開する手順です。

## 📋 事前準備

### 必要なもの
- ロリポップのレンタルサーバー契約
- 独自ドメインまたはロリポップドメイン
- FTPクライアントまたはファイルマネージャーへのアクセス

### 推奨プラン
- **ハイスピードプラン以上**（SSD、高速表示）
- **スタンダードプラン以上**（独自ドメイン、サブドメイン設定）

## 🚀 デプロイ手順

### Step 1: 静的サイトのビルド

#### Windows の場合
```batch
# デプロイスクリプト実行
deploy-lolipop.bat tarot

# または手動で
npm run build:lolipop
```

#### Mac/Linux の場合
```bash
# デプロイスクリプト実行
chmod +x deploy-lolipop.sh
./deploy-lolipop.sh tarot

# または手動で
npm run build:lolipop
```

### Step 2: ロリポップでサブドメイン設定

1. **ロリポップユーザー専用ページにログイン**
   - https://user.lolipop.jp/

2. **サブドメイン設定**
   - 「サーバーの管理・設定」→「サブドメイン設定」
   - サブドメイン名: `tarot`（お好みで変更可能）
   - 公開フォルダ: `tarot`（サブドメイン名と同じ）

3. **DNS設定の確認**
   - 設定後、数分〜数時間で反映

### Step 3: ファイルのアップロード

#### 方法1: ロリポップFTP（推奨）

1. **ロリポップFTPにログイン**
   - ユーザー専用ページから「ロリポップ！FTP」をクリック

2. **サブドメインフォルダに移動**
   - `/tarot/` フォルダを開く

3. **ファイルアップロード**
   - `out` フォルダ内の**すべてのファイル**をアップロード
   - **重要**: `.htaccess` ファイルも忘れずにアップロード

#### 方法2: FTPクライアント

```bash
# FTP接続情報（ロリポップから取得）
ホスト名: ftp.lolipop.jp
ユーザー名: [あなたのFTPユーザー名]
パスワード: [あなたのFTPパスワード]
ポート: 21

# アップロード先
/tarot/ フォルダ
```

#### 方法3: ZIPアップロード

1. デプロイスクリプトでZIPファイルを作成
2. ロリポップFTPの「ファイルアップロード」でZIP選択
3. アップロード後、ZIPファイルを展開

### Step 4: 動作確認

1. **アクセスURL**
   ```
   https://tarot.your-domain.com
   ```

2. **確認項目**
   - ✅ トップページが表示される
   - ✅ 占い機能が動作する
   - ✅ ゲーム機能が動作する
   - ✅ 画像が正しく表示される
   - ✅ CSS/JSが読み込まれている

## 🔧 トラブルシューティング

### よくある問題と解決法

#### 1. ページが表示されない
**原因**: `.htaccess` ファイルがない、または設定が間違っている
**解決法**:
- `.htaccess` ファイルがアップロードされているか確認
- ファイル権限を644に設定
- ロリポップの場合、`.htaccess` の一部機能が制限されている場合があります

#### 2. CSS/JSが読み込まれない
**原因**: パスの問題、MIMEタイプの問題
**解決法**:
```apache
# .htaccess に以下を追加
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType image/svg+xml .svg
</IfModule>
```

#### 3. 画像が表示されない
**原因**: 画像パスの問題、ファイル権限の問題
**解決法**:
- 画像ファイルの権限を644に設定
- パスが正しいか確認（大文字小文字の区別）

#### 4. サブページにアクセスできない
**原因**: SPAルーティングの問題
**解決法**:
- `.htaccess` のRewriteRuleが正しく設定されているか確認
- ロリポップでmod_rewriteが有効か確認

### ロリポップ特有の制限

1. **PHP制限**: 静的サイトなので影響なし
2. **mod_rewrite**: 利用可能（一部制限あり）
3. **ファイル数制限**: 大量のファイルがある場合は注意
4. **転送量制限**: プランに応じた制限あり

## 📊 パフォーマンス最適化

### ロリポップでの最適化設定

#### 1. .htaccess 最適化
```apache
# 圧縮の有効化
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# キャッシュ設定
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>
```

#### 2. CDN併用（オプション）
- CloudflareやAmazon CloudFrontとの併用
- 画像配信の高速化

### 期待できるパフォーマンス

| 項目 | 値 |
|------|-----|
| **ページサイズ** | 501kB（初回） |
| **読み込み時間** | 1-2秒（国内） |
| **Lighthouse Score** | 95+（予想） |

## 🔄 更新手順

### アプリ更新時の手順

1. **ローカルで更新作業**
   ```bash
   # コード修正後
   npm run build:lolipop
   ```

2. **ファイル差分アップロード**
   - 変更されたファイルのみアップロード
   - `_next/static/` フォルダは毎回更新

3. **キャッシュクリア**
   - ブラウザのハードリロード（Ctrl+Shift+R）
   - CDN使用時はCDNキャッシュもクリア

## 🌐 複数サブドメイン対応

### 用途別サブドメイン例
- `tarot.your-domain.com` - メインアプリ
- `tarot-dev.your-domain.com` - 開発版
- `tarot-en.your-domain.com` - 英語版

### 設定手順
各サブドメインごとに同じ手順を繰り返し

## 📞 サポート

### ロリポップサポート
- サポートサイト: https://lolipop.jp/support/
- 電話サポート: プランにより利用可能
- チャットサポート: 平日10:00-18:00

### アプリ固有の問題
- GitHub Issues
- 開発者コミュニティ

## 🎉 デプロイ完了後

### 公開設定
1. **SEO設定**
   - Google Search Consoleに登録
   - サイトマップ送信

2. **アクセス解析**
   - Google Analytics設定
   - パフォーマンス監視

3. **セキュリティ**
   - SSL証明書の確認（Let's Encrypt）
   - セキュリティヘッダーの確認

---

**ロリポップサーバーでの公開が完了しました！** 🎊

完璧に最適化されたE-Tarotアプリを多くのユーザーにお楽しみいただけます。
