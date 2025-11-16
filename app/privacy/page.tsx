import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="bg-gray-900 border-gray-700 text-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            プライバシーポリシー
          </CardTitle>
          <CardDescription className="text-gray-400 text-center mt-2">最終更新日: 2025年5月15日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">1. はじめに</h2>
            <p className="text-gray-300 leading-relaxed">
              金雨輝龍の「無料タロット占い - 毎日の運勢とカード占い」（以下「当アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
              このプライバシーポリシーでは、当アプリがどのように情報を収集、使用、保護するかについて説明します。
              当アプリを利用することにより、ユーザーはこのプライバシーポリシーに同意したものとみなされます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">2. 収集する情報</h2>
            <p className="text-gray-300 leading-relaxed mb-3">当アプリは、以下の情報を収集することがあります：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>ユーザーが提供する情報（名前、メールアドレスなど）</li>
              <li>デバイス情報（デバイスの種類、OSのバージョンなど）</li>
              <li>利用状況データ（アプリの使用頻度、機能の利用状況など）</li>
              <li>ゲームプレイデータ（スコア、進行状況など）</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">3. 情報の使用目的</h2>
            <p className="text-gray-300 leading-relaxed mb-3">収集した情報は、以下の目的で使用されます：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>アプリの機能提供とパフォーマンス向上</li>
              <li>ユーザー体験の改善とカスタマイズ</li>
              <li>新機能や更新の通知</li>
              <li>技術的な問題の解決とサポート提供</li>
              <li>利用状況の分析と統計</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">4. 情報の共有</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、法的要件がある場合や、サービス提供に必要な第三者（分析サービス、クラウドサービスなど）を除き、
              ユーザーの個人情報を第三者と共有することはありません。情報を共有する場合でも、適切なデータ保護措置を講じます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">5. データの保存</h2>
            <p className="text-gray-300 leading-relaxed">
              ユーザーデータは、サービス提供に必要な期間、または法的要件に基づく期間保存されます。
              当アプリは、保存されたデータを保護するために適切なセキュリティ対策を実施しています。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">6. ユーザーの権利</h2>
            <p className="text-gray-300 leading-relaxed mb-3">ユーザーには以下の権利があります：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>個人情報へのアクセスと修正</li>
              <li>データの削除（「忘れられる権利」）</li>
              <li>データ処理の制限</li>
              <li>データポータビリティ</li>
              <li>同意の撤回</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">7. クッキーとローカルストレージ</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、ユーザー設定の保存やアプリ機能の提供のために、クッキーやローカルストレージを使用することがあります。
              これらのデータは、ユーザーのデバイス上に保存され、アプリの機能向上やユーザー体験の改善に役立てられます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">8. 子どものプライバシー</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、13歳未満の子どもから意図的に個人情報を収集することはありません。
              13歳未満の子どもの個人情報が収集されていることが判明した場合、速やかに削除するための措置を講じます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">9. プライバシーポリシーの変更</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、必要に応じてこのプライバシーポリシーを更新することがあります。
              重要な変更がある場合は、アプリ内の通知または当ウェブサイトでお知らせします。
              定期的にこのページを確認することをお勧めします。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">10. お問い合わせ</h2>
            <p className="text-gray-300 leading-relaxed">
              このプライバシーポリシーに関するご質問やご意見がある場合は、 kanaukiryu@gmail.com までご連絡ください。
            </p>
          </section>

          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            © 2025 金雨輝龍の「無料タロット占い - 毎日の運勢とカード占い」. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
