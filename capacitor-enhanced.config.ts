import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.etarot.app",
  appName: "タロット占い【完全無料】今日の運勢・恋愛占い",
  webDir: "wrapper",
  server: {
    url: "https://your-etarot-domain.com",
    cleartext: true,
    androidScheme: "https",
    errorPath: "offline.html", // オフライン時に表示するページ
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // キャッシュ設定
    initialFocus: true,
    useLegacyBridge: false,
  },
}

export default config
