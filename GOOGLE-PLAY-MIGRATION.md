# 🚀 Google Play アプリ移行ガイド
## ロリポップ → Netlify への安全な移行戦略

---

## 📊 現在の状況

### **既存環境**
- **Google Playアプリ**: 公開中・既存ユーザーあり
- **参照URL**: `tarot.kanau-kiryu.com`（ロリポップサーバー）
- **状態**: 安定稼働中

### **移行先環境**
- **デプロイ先**: Netlify
- **GitHub連携**: `https://github.com/SasayanX/etarot`
- **ビルド最適化**: 完了（80%バンドルサイズ削減）

---

## 🎯 移行戦略の選択

### **戦略A: 同一ドメイン移行（シンプル）** ⭐

#### **概要**
`tarot.kanau-kiryu.com` をロリポップからNetlifyに切り替え

#### **メリット**
- ✅ アプリコード変更不要
- ✅ URL統一
- ✅ 管理シンプル
- ✅ SEO影響なし

#### **デメリット**
- ⚠️ 既存アプリも即座に新環境参照
- ⚠️ 問題発生時の切り戻しにDNS変更必要

#### **実装手順**
1. **Netlify デプロイ**
   - GitHubからNetlifyへデプロイ
   - 動作確認（仮URLで）

2. **カスタムドメイン設定**
   - Netlifyで `tarot.kanau-kiryu.com` 設定
   - SSL証明書自動発行待機

3. **DNS設定変更**
   - ロリポップのDNS設定削除
   - NetlifyのDNSに変更
   - 伝播待機（最大48時間、通常1-2時間）

4. **動作確認**
   - 既存アプリで動作確認
   - 新規ユーザーで動作確認

---

### **戦略B: 新サブドメイン移行（安全）** 🛡️

#### **概要**
新サブドメイン `tarot-v2.kanau-kiryu.com` をNetlifyで運用

#### **メリット**
- ✅ 既存アプリ完全保護
- ✅ 新旧並行運用
- ✅ 段階的移行可能
- ✅ 即座の切り戻し可能

#### **デメリット**
- ⚠️ アプリコード変更必要
- ⚠️ 2つの環境を一時的に管理

#### **実装手順**
1. **Netlify デプロイ**
   - GitHubからNetlifyへデプロイ
   - 仮URL取得

2. **新サブドメイン設定**
   - DNS で `tarot-v2.kanau-kiryu.com` 追加
   - Netlifyでカスタムドメイン設定

3. **アプリ更新版開発**
   - `app-config.js` で新URLを参照
   - バージョン 2.0.0 としてビルド

4. **段階的リリース**
   ```
   Week 1: 新規ユーザーの10%
   Week 2: 新規ユーザーの50%
   Week 3: 新規ユーザーの100%
   Week 4: 既存ユーザーも段階的移行
   ```

5. **完全移行後**
   - 旧ロリポップサイト停止
   - または `tarot.kanau-kiryu.com` もNetlifyに変更

---

## 📱 Google Play アプリ側の実装

### **アプリ設定ファイル更新**

#### **Android: `config.xml` または `strings.xml`**
```xml
<!-- 既存バージョン 1.x -->
<string name="base_url">https://tarot.kanau-kiryu.com</string>

<!-- 新バージョン 2.0+ -->
<string name="base_url">https://tarot-v2.kanau-kiryu.com</string>
<!-- または -->
<string name="base_url">https://tarot.kanau-kiryu.com</string> <!-- 戦略A -->
```

#### **Capacitor: `capacitor.config.ts`**
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.kanaukiryu.tarot',
  appName: 'E-Tarot',
  webDir: 'out',
  server: {
    // 開発環境
    // url: 'http://localhost:3000',
    
    // 本番環境（新バージョン）
    url: 'https://tarot-v2.kanau-kiryu.com', // 戦略B
    // url: 'https://tarot.kanau-kiryu.com',  // 戦略A
    
    cleartext: false,
    androidScheme: 'https'
  }
};

export default config;
```

### **動的URL切り替え（推奨）**
```javascript
// app-config.js を使用
import { getBaseUrl } from './app-config.js'

const baseUrl = getBaseUrl()
console.log('Using base URL:', baseUrl)

// すべてのAPI呼び出しで使用
fetch(`${baseUrl}/api/fortune`)
```

---

## 🔄 段階的移行スケジュール

### **フェーズ1: 準備期間（1週間）**
- [x] コード最適化完了
- [x] GitHubリポジトリ作成
- [ ] Netlifyデプロイ実行
- [ ] 動作確認（仮URL）

### **フェーズ2: ドメイン設定（2-3日）**
- [ ] カスタムドメイン設定
- [ ] SSL証明書発行
- [ ] DNS設定更新
- [ ] 伝播確認

### **フェーズ3: アプリ更新版開発（1週間）**
- [ ] `app-config.js` 統合
- [ ] 新URL設定
- [ ] ビルド・テスト
- [ ] 内部テスト配布

### **フェーズ4: 段階的リリース（4週間）**
```
Week 1: 新規ユーザーの10% → Netlify
Week 2: 新規ユーザーの50% → Netlify
Week 3: 新規ユーザーの100% → Netlify
Week 4: 既存ユーザーも移行開始
```

### **フェーズ5: 完全移行（移行完了後）**
- [ ] 旧環境の監視継続（1ヶ月）
- [ ] アクセスログ確認（旧環境へのアクセスゼロ確認）
- [ ] ロリポップサーバー停止検討

---

## 🛡️ 安全対策

### **1. フォールバック機能**
```javascript
// Netlify障害時、自動的にロリポップにフォールバック
export const FALLBACK_CONFIG = {
  enabled: true,
  fallbackUrl: 'https://tarot.kanau-kiryu.com',
  maxRetries: 3,
  timeout: 5000,
}
```

### **2. ヘルスチェック**
```javascript
// 定期的に両環境の健全性チェック
const checkHealth = async () => {
  const netlifyHealth = await fetch('https://tarot-v2.kanau-kiryu.com/api/health')
  const legacyHealth = await fetch('https://tarot.kanau-kiryu.com/api/health')
  
  if (!netlifyHealth.ok) {
    console.warn('Netlify unhealthy, using fallback')
    return FALLBACK_CONFIG.fallbackUrl
  }
  
  return getBaseUrl()
}
```

### **3. 監視・アラート**
- **Netlify**: 自動監視（ダッシュボード）
- **ロリポップ**: アクセスログ監視
- **Google Play**: クラッシュレポート監視

### **4. ロールバック計画**
```
1. 問題発覚
2. Google Playで新バージョン非公開
3. 旧バージョンを再公開
4. または DNS設定を戻す（戦略A）
```

---

## 📊 期待されるパフォーマンス改善

### **既存環境（ロリポップ）**
- 読み込み時間: 3-5秒
- バンドルサイズ: 大
- グローバルCDN: なし

### **新環境（Netlify）**
- 読み込み時間: **1.2-2秒（50-60%短縮）**
- バンドルサイズ: **80%削減**
- グローバルCDN: **あり**
- Lighthouse Score: **95+**

---

## ✅ チェックリスト

### **Netlify デプロイ前**
- [x] GitHubリポジトリ作成
- [x] コード最適化完了
- [ ] `app-config.js` 設定確認
- [ ] 環境変数準備

### **Netlify デプロイ**
- [ ] GitHubからデプロイ実行
- [ ] ビルド成功確認
- [ ] 仮URLで動作確認
- [ ] パフォーマンステスト

### **ドメイン設定**
- [ ] 戦略決定（A or B）
- [ ] カスタムドメイン設定
- [ ] SSL証明書確認
- [ ] DNS設定更新

### **アプリ更新**
- [ ] 新URL設定
- [ ] ビルド・テスト
- [ ] 内部テスト
- [ ] Google Play アップロード

### **段階的リリース**
- [ ] 10%ロールアウト
- [ ] 監視・問題確認
- [ ] 50%ロールアウト
- [ ] 100%ロールアウト

### **完全移行**
- [ ] 旧環境アクセスゼロ確認
- [ ] ロリポップ停止検討
- [ ] コスト削減効果確認

---

## 🎯 推奨戦略

### **当面の推奨: 戦略B（新サブドメイン）**

理由：
1. **既存ユーザー保護**: 既存アプリは完全に保護
2. **リスク最小化**: 問題発生時の影響範囲限定
3. **柔軟性**: 移行ペースを自由に調整可能
4. **テスト期間**: 十分なテスト期間確保

### **将来的には戦略A（同一ドメイン）**

移行完了後：
1. Netlify の安定稼働確認（3-6ヶ月）
2. `tarot.kanau-kiryu.com` もNetlifyに統合
3. 管理コスト削減
4. URL統一

---

## 📞 サポート

### **Netlify サポート**
- ドキュメント: https://docs.netlify.com/
- コミュニティ: https://answers.netlify.com/

### **Google Play サポート**
- コンソール: https://play.google.com/console
- ドキュメント: https://support.google.com/googleplay/android-developer

---

**次のステップ**: Netlifyダッシュボードでデプロイを完了させましょう！ 🚀

