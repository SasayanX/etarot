import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
            プライバシーポリシー
          </CardTitle>
          <CardDescription className="text-gray-400 text-center mt-2">最終更新日: 2025年1月15日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">1. はじめに</h2>
            <p className="text-gray-300 leading-relaxed">
              無料タロット占い - 毎日の運勢とカード占い（以下「当アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
              このプライバシーポリシーでは、当アプリがどのように情報を収集、使用、保護するかについて説明します。
              当アプリを利用することにより、ユーザーはこのプライバシーポリシーに同意したものとみなされます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">2. 収集する情報</h2>
            <p className="text-gray-300 leading-relaxed mb-3">当アプリは、以下の情報を収集することがあります：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>アプリ使用データ</strong> - 機能の使用頻度、エラー情報、パフォーマンスデータ</li>
              <li><strong>デバイス情報</strong> - デバイスの種類、OSのバージョン、画面サイズ</li>
              <li><strong>ゲームプレイデータ</strong> - スコア、進行状況、設定内容</li>
              <li><strong>広告関連データ</strong> - 広告表示回数、クリック情報（Google AdMob経由）</li>
              <li><strong>ユーザー設定</strong> - 言語設定、テーマ設定、通知設定</li>
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
              <li>広告の配信と最適化（Google AdMob）</li>
              <li>アプリ内課金機能の提供（Google Play Billing）</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">4. 第三者サービス</h2>
            <p className="text-gray-300 leading-relaxed mb-3">当アプリは、以下の第三者サービスを使用しています：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Google AdMob</strong> - 広告配信サービス（Googleのプライバシーポリシーが適用）</li>
              <li><strong>Google Play Billing</strong> - アプリ内課金サービス（Googleの利用規約が適用）</li>
              <li><strong>Google Analytics</strong> - 利用状況分析（オプトイン制）</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              これらのサービスは、それぞれのプライバシーポリシーに従って情報を処理します。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">5. 情報の共有</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              当アプリは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>法的要件がある場合</li>
              <li>サービス提供に必要な第三者（Google AdMob、Google Play Billingなど）</li>
              <li>ユーザーの明示的な同意がある場合</li>
              <li>アプリの利用規約に違反した場合の対応</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">6. データの保存</h2>
            <p className="text-gray-300 leading-relaxed mb-3">ユーザーデータは以下の方法で保存されます：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>ローカルストレージ</strong> - デバイス内のブラウザストレージ（設定、進行状況など）</li>
              <li><strong>サーバー</strong> - 匿名化された統計データのみ（個人を特定できない形）</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              データは、サービス提供に必要な期間、または法的要件に基づく期間保存されます。
              当アプリは、保存されたデータを保護するために適切なセキュリティ対策を実施しています。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">7. ユーザーの権利</h2>
            <p className="text-gray-300 leading-relaxed mb-3">ユーザーには以下の権利があります：</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>個人情報へのアクセスと修正</li>
              <li>データの削除（アプリのアンインストールで自動削除）</li>
              <li>データ処理の制限</li>
              <li>同意の撤回</li>
              <li>広告のパーソナライゼーション設定の変更</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">8. クッキーとローカルストレージ</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、ユーザー設定の保存やアプリ機能の提供のために、クッキーやローカルストレージを使用することがあります。
              これらのデータは、ユーザーのデバイス上に保存され、アプリの機能向上やユーザー体験の改善に役立てられます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">9. 子どものプライバシー</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、13歳未満の子どもから意図的に個人情報を収集することはありません。
              13歳未満の子どもの個人情報が収集されていることが判明した場合、速やかに削除するための措置を講じます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">10. セキュリティ</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              当アプリは、収集したデータを保護するために適切なセキュリティ対策を実施しています：
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>データの暗号化</li>
              <li>安全な通信プロトコル（HTTPS）の使用</li>
              <li>定期的なセキュリティ監査</li>
              <li>アクセス制限と認証</li>
            </ul>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">11. 国際的なデータ転送</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、Google AdMob、Google Play Billingなどのサービスを通じて、データが国際的に転送される可能性があります。
              これらの転送は、適切なデータ保護措置に基づいて行われます。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">12. プライバシーポリシーの変更</h2>
            <p className="text-gray-300 leading-relaxed">
              当アプリは、必要に応じてこのプライバシーポリシーを更新することがあります。
              重要な変更がある場合は、アプリ内の通知または当ウェブサイトでお知らせします。
              定期的にこのページを確認することをお勧めします。
            </p>
          </section>

          <Separator className="bg-gray-700" />

          <section>
            <h2 className="text-xl font-semibold text-blue-400 mb-3">13. お問い合わせ</h2>
            <p className="text-gray-300 leading-relaxed">
              このプライバシーポリシーに関するご質問やご意見がある場合は、以下の連絡先までご連絡ください：
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
