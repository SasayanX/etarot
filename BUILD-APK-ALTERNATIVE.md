# 📱 APKビルド - 代替方法
## 既存アプリフォルダからビルドする

---

## 🔍 問題の原因

現在のプロジェクトの`android`フォルダには`gradlew`が存在しません。
これは、Capacitorがまだ完全にAndroidプロジェクトを初期化していないためです。

---

## ✅ 解決策：既存アプリフォルダを使用

既存の完全なAndroidプロジェクトがあります：
```
D:\TarotApp_IconComplete_2025_0619_2016
```

このフォルダで作業する方が確実です。

---

## 🚀 推奨手順

### **オプション1: 既存アプリフォルダで直接ビルド（推奨）** ⭐

#### **Step 1: 静的ファイルを既存アプリにコピー**

現在のプロジェクトの最適化されたビルドを使用します：

```powershell
# プロジェクトルートから実行
Copy-Item -Path "out\*" -Destination "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\assets\public\" -Recurse -Force
```

#### **Step 2: 既存アプリのAndroid Studioで開く**

```powershell
# 既存アプリフォルダをAndroid Studioで開く
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "D:\TarotApp_IconComplete_2025_0619_2016"
```

または手動で：
1. Android Studioを起動
2. **File** → **Open**
3. `D:\TarotApp_IconComplete_2025_0619_2016` を選択

#### **Step 3: MainActivity.javaを更新**

`D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java`

```java
package com.ryuka.kanau_kiryu;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        
        // Netlify URLを読み込む
        webView.loadUrl("https://etarot.netlify.app");
    }
}
```

#### **Step 4: build.gradleのバージョン更新**

`D:\TarotApp_IconComplete_2025_0619_2016\app\build.gradle`

```gradle
defaultConfig {
    applicationId "com.ryuka.kanau_kiryu"
    minSdk 23
    targetSdk 34
    versionCode 24  // 23 → 24
    versionName "2.5"  // 2.4 → 2.5
}
```

#### **Step 5: ビルド実行**

Android Studioで：
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

またはコマンドラインから：
```powershell
cd D:\TarotApp_IconComplete_2025_0619_2016
.\gradlew.bat assembleDebug
```

✅ **出力先**: 
```
D:\TarotApp_IconComplete_2025_0619_2016\app\build\outputs\apk\debug\app-debug.apk
```

---

### **オプション2: Capacitorプロジェクトの完全初期化**

現在のプロジェクトでCapacitorを完全に初期化：

#### **Step 1: Capacitor AndroidプラットフォームをクリーンインストールHere**

```powershell
# 既存のandroidフォルダを削除
Remove-Item -Path "android" -Recurse -Force

# Androidプラットフォームを再追加
npx cap add android
```

#### **Step 2: 再同期**

```powershell
npx cap sync android
```

#### **Step 3: Android Studioで開く**

```powershell
npx cap open android
```

これで完全な`gradlew`を含むAndroidプロジェクトが生成されます。

---

## 🎯 最も簡単な方法（推奨）

既存アプリはすでに完全に動作しているので、**オプション1**が最も確実です：

```powershell
# 1. 既存アプリフォルダに移動
cd D:\TarotApp_IconComplete_2025_0619_2016

# 2. バージョン情報を更新（手動でbuild.gradleを編集）

# 3. ビルド実行
.\gradlew.bat assembleDebug
```

---

## 📋 簡易スクリプト

以下のコマンドを実行してAPKをビルド：

```powershell
# 既存アプリフォルダでビルド
cd D:\TarotApp_IconComplete_2025_0619_2016
.\gradlew.bat assembleDebug

# APKの場所を表示
Write-Host "APKの場所: $PWD\app\build\outputs\apk\debug\app-debug.apk"

# エクスプローラーで開く
explorer.exe app\build\outputs\apk\debug
```

---

## ✅ どちらの方法を選ぶべきか？

### **既存アプリでビルド（オプション1）** ⭐⭐⭐
- ✅ すぐに動作する
- ✅ gradlewが存在する
- ✅ 既存の設定をすべて維持
- ✅ 確実

### **Capacitor再初期化（オプション2）**
- ⚠️ 時間がかかる
- ⚠️ 設定を再度行う必要がある
- ✅ 将来的にはこちらが良い

---

## 🎉 推奨アクション

**今すぐ実行**:

```powershell
cd D:\TarotApp_IconComplete_2025_0619_2016
.\gradlew.bat assembleDebug
```

これが最も早く確実にAPKをビルドできます！

