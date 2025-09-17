import { NextResponse } from "next/server"

export const dynamic = 'force-static'

export async function GET() {
  const appAdsTxtContent = "google.com, pub-3409171148853394, DIRECT, f08c47fec0942fa0"

  return new NextResponse(appAdsTxtContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // 24時間キャッシュ
    },
  })
}
