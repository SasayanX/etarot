import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ShopProvider } from "@/contexts/shop-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { DebugProvider } from "@/contexts/debug-context"
import { LanguageProvider } from "@/contexts/language-context"
import BottomNavigation from "@/components/bottom-navigation"
import CardSuitInitializer from "@/components/card-suit-initializer"
import PerformanceMonitor from "@/components/performance-monitor"
import Footer from "@/components/footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "無料タロット占い - 毎日の運勢とカード占い",
  description: "完全無料のタロット占い！毎日の運勢・恋愛・仕事を本格カード占いで診断。78枚のタロットカード完全収録。",
  generator: "v0.dev",
  // 検索エンジンインデックス防止
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  // その他のメタタグでも防止
  other: {
    robots: "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
    googlebot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    bingbot: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    keywords: "タロット占い,無料占い,運勢,恋愛占い,仕事占い,毎日占い,カード占い",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* WebView検出用のインラインスクリプト */}
        <Script id="webview-detection" strategy="beforeInteractive">
          {`
            (function() {
              try {
                // WebView検出
                function detectWebView() {
                  var ua = navigator.userAgent.toLowerCase();
                  var isAndroidWebView = ua.indexOf('wv') > -1;
                  var isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua);
                  var isCustomWebView = 
                    ua.includes('tarotapp') || 
                    (typeof window !== 'undefined' && 
                      (window.ReactNativeWebView !== undefined || 
                       window.Android !== undefined));
                  
                  return isAndroidWebView || isIOSWebView || isCustomWebView;
                }
                
                // WebViewの場合、HTMLタグにクラスを追加
                if (detectWebView()) {
                  document.documentElement.classList.add('webview');
                  localStorage.setItem('isWebView', 'true');
                  
                  // 外部リンクの処理をオーバーライド
                  document.addEventListener('click', function(e) {
                    var target = e.target;
                    while (target && target !== document) {
                      // 内部リンクとマークされていないリンクを検出
                      if (target.tagName === 'A' && 
                          !target.hasAttribute('data-internal-link') && 
                          !target.hasAttribute('data-webview-safe')) {
                        
                        var href = target.getAttribute('href');
                        // 外部リンクと思われるものを検出
                        if (href && (href.startsWith('http') || href.startsWith('www'))) {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          console.log('外部リンクのクリックを検出: ' + href);
                          
                          // WebViewに通知
                          if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'externalLink',
                              url: href
                            }));
                          }
                          
                          return false;
                        }
                      }
                      target = target.parentNode;
                    }
                  }, true);
                }
              } catch (e) {
                console.error('WebView検出スクリプトエラー:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-gray-900 to-purple-950 text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <SettingsProvider>
              <ShopProvider>
                <DebugProvider>
                  <CardSuitInitializer />
                  <main className="pb-16">{children}</main>
                  <Footer />
                  <Toaster />
                  <BottomNavigation />
                  <PerformanceMonitor />
                </DebugProvider>
              </ShopProvider>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
