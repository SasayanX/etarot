import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="text-purple-300 border-purple-700 hover:bg-purple-900/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            アプリに戻る
          </Button>
        </Link>
      </div>

      <Card className="bg-gray-900 border-gray-700 text-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            利用規約
          </CardTitle>
          <CardDescription className="text-gray-400 text-center mt-2">最終更新日: 2025年1月15日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">1. はじめに</h2>
            <p className="text-gray-300 leading-relaxed">
              本利用規約（以下「本規約」）は、カナウ・AIプロダクションの「無料タロット占い - 毎日の運勢とカード占い」（以下「当アプリ」）の利用条件を定めるものです。
              当アプリを利用することにより、ユーザーは本規約に同意したものとみなされます。
              本規約に同意できない場合は、当アプリの利用を中止してください。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">2. サービスの内容</h2>
            <p className="text-gray-300 leading-relaxed mb-3">当アプリは、以下のサービスを提供します：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>タロットカード占い機能（毎日の運勢、恋愛、仕事、決断など）</li>
              <li>タロットカード辞典機能</li>
              <li>タロットカードゲーム機能（メモリーゲーム、タイムアタックなど）</li>
              <li>タロットクイズ機能</li>
              <li>カードバック（スキン）機能</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              当アプリは完全無料で提供されますが、広告表示やアプリ内課金（広告削除など）が含まれる場合があります。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">3. 利用資格</h2>
            <p className="text-gray-300 leading-relaxed mb-3">当アプリを利用するには、以下の条件を満たす必要があります：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>13歳以上であること（13歳未満の場合は保護者の同意が必要）</li>
              <li>本規約に同意すること</li>
              <li>当アプリの利用が禁止されている地域に居住していないこと</li>
              <li>適切なデバイスとインターネット接続を有すること</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">4. ユーザーの責任</h2>
            <p className="text-gray-300 leading-relaxed mb-3">ユーザーは、以下の行為を禁止します：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>当アプリの著作権、商標権、その他の知的財産権を侵害する行為</li>
              <li>当アプリをリバースエンジニアリング、逆コンパイル、逆アセンブルする行為</li>
              <li>当アプリの動作を妨害する行為（ウイルス、マルウェアの送信など）</li>
              <li>他のユーザーや第三者に迷惑をかける行為</li>
              <li>法令や公序良俗に反する行為</li>
              <li>当アプリのサーバーやネットワークに過度な負荷をかける行為</li>
              <li>自動化ツールやボットを使用して当アプリにアクセスする行為</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">5. 知的財産権</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリに含まれるすべてのコンテンツ（テキスト、画像、音声、ソフトウェアコードなど）は、当アプリの開発者または正当な権利者に帰属します。
              ユーザーは、当アプリの利用に必要な範囲でのみ、これらのコンテンツを使用することができます。
              商用利用、複製、改変、再配布などは、明示的な許可がない限り禁止されています。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">6. 広告とアプリ内課金</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              当アプリは、Google AdMobを通じて広告を表示します。また、アプリ内課金（広告削除など）を提供する場合があります。
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>広告の内容は、Google AdMobが決定し、当アプリは制御できません</li>
              <li>アプリ内課金は、Google Play Billingを通じて処理されます</li>
              <li>購入したアイテムの返金は、Google Playの返金ポリシーに従います</li>
              <li>アプリ内課金の価格は、予告なく変更される場合があります</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">7. 免責事項</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              当アプリは、占い結果の正確性、完全性、有用性について一切の保証をいたしません。
              占い結果は、あくまで参考情報であり、実際の判断や行動の責任はユーザー自身にあります。
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              当アプリは、以下の事項について一切の責任を負いません：
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>当アプリの利用により生じた損害（直接損害、間接損害、特別損害、結果的損害を含む）</li>
              <li>当アプリの中断、停止、終了、データの消失</li>
              <li>当アプリのバグ、エラー、セキュリティ上の問題</li>
              <li>第三者による当アプリへの不正アクセスや改ざん</li>
              <li>ユーザーのデバイスやネットワークの問題</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">8. サービスの変更・終了</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、事前の通知なく、サービスの内容を変更、中断、終了することができます。
              これによりユーザーに生じた損害について、当アプリは一切の責任を負いません。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">9. 利用規約の変更</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、必要に応じて本規約を変更することがあります。
              重要な変更がある場合は、アプリ内の通知または当ウェブサイトでお知らせします。
              変更後の規約は、アプリ内またはウェブサイトに掲載された時点で効力を生じます。
              変更後に当アプリを利用した場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">10. 準拠法と管轄裁判所</h2>
            <p className="text-gray-300 leading-relaxed">
              本規約は、日本法に準拠して解釈されます。
              本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">11. お問い合わせ</h2>
            <p className="text-gray-300 leading-relaxed">
              本規約に関するご質問やご意見がある場合は、以下の連絡先までご連絡ください：
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              メールアドレス: <a href="mailto:kanaukiryu@gmail.com" className="text-blue-400 hover:text-blue-300 underline">kanaukiryu@gmail.com</a>
            </p>
          </section>

          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            © 2025 カナウ・AIプロダクション. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

