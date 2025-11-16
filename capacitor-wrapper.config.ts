import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.etarot.wrapper",
  appName: "無料タロット占い - 毎日の運勢とカード占い",
  webDir: "wrapper", // 最小限のHTMLのみ
  server: {
    url: "https://your-etarot-domain.com", // あなたのウェブサイト
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
}

export default config
