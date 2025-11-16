import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.etarot.app",
  appName: "無料タロット占い - 毎日の運勢とカード占い",
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
