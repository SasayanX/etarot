import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // 開発環境かどうかをチェック
  const isDevelopment = process.env.NODE_ENV === "development"

  // 検索エンジンボットの検出 (Search engine bot detection)
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || ""
  const isBot =
    /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com/i.test(
      userAgent,
    )

  // WebView検証 (WebView verification)
  const isWebView =
    userAgent.includes("tarotapp") ||
    userAgent.includes("wv") ||
    /iphone|ipod|ipad.*applewebkit(?!.*safari)/i.test(userAgent)

  // 開発環境ではボットチェックをスキップ
  if (!isDevelopment && isBot) {
    return new NextResponse("Access Denied / アクセス拒否", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
    })
  }

  // 開発環境ではWebViewチェックをスキップ
  if (!isDevelopment && !isWebView && !request.nextUrl.pathname.startsWith("/api")) {
    // プライバシーページなど一部は除外 (Exclude privacy page and others)
    if (request.nextUrl.pathname !== "/privacy" && request.nextUrl.pathname !== "/download-app") {
      return NextResponse.redirect(new URL("/download-app", request.url))
    }
  }

  // すべてのレスポンスにnoindexヘッダーを追加 (Add noindex header to all responses)
  // 開発環境ではヘッダーを追加しない
  if (!isDevelopment) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
