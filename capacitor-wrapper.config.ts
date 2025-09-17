import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.etarot.wrapper",
  appName: "タロット大全",
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
