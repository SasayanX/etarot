import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const LYDIA_IMAGE_SRC = "/lydia-reading-message.png"

interface LydiaMessageProps {
  className?: string
}

export function LydiaMessage({ className }: LydiaMessageProps) {
  return (
    <Card className={`bg-gray-900/70 border border-amber-500/60 ${className ?? ""}`}>
      <CardContent className="flex flex-col md:flex-row-reverse items-center gap-6 p-6">
        <div className="w-40 h-40 md:w-48 md:h-48 relative flex-shrink-0 md:ml-4">
          <Image
            src={LYDIA_IMAGE_SRC}
            alt="リディアのイラスト"
            fill
            sizes="(max-width: 768px) 160px, 192px"
            className="object-contain drop-shadow-[0_4px_12px_rgba(250,204,21,0.35)]"
            priority
          />
        </div>
        <div className="text-center md:text-left space-y-4 max-w-xl">
          <p className="text-amber-400 font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
            <span role="img" aria-hidden="true">
              🔮
            </span>
            リディアからのひとこと
          </p>
          <p className="text-white text-lg leading-relaxed">「もっと深く占ってみたい場合は、私がしっかりみますね。」</p>
          <div className="flex flex-col items-center md:items-start gap-1">
            <Button
              asChild
              className="bg-amber-400/90 hover:bg-amber-300 text-black font-semibold shadow-lg"
            >
              <Link href="https://protarot.jp/" target="_blank" rel="noopener noreferrer">
                AI占い師リディアの本格鑑定へ
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

