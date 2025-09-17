import { NextResponse } from "next/server"

export async function GET() {
  const robotsTxt = `
User-agent: *
Disallow: /

# 特定のボットも明示的に拒否
User-agent: Googlebot
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: Slurp
Disallow: /

User-agent: DuckDuckBot
Disallow: /

User-agent: Baiduspider
Disallow: /

# サイトマップは提供しない
# Sitemap: 
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
