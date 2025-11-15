# DNS伝播状況チェックスクリプト

Write-Host "=== DNS伝播状況チェック ===" -ForegroundColor Cyan
Write-Host "日時: $(Get-Date -Format 'yyyy/MM/dd HH:mm:ss')`n"

# DNSクエリ
$result = nslookup tarot.kanau-kiryu.com 8.8.8.8 2>&1 | Out-String

Write-Host $result

# IPアドレスを抽出
if ($result -match "64\.29\.17") {
    Write-Host "❌ まだVercelを向いています（DNS伝播待ち）" -ForegroundColor Yellow
} else {
    Write-Host "✅ ロリポップに切り替わりました！" -ForegroundColor Green
    Write-Host "`nブラウザで確認してください:" -ForegroundColor Green
    Write-Host "https://tarot.kanau-kiryu.com/" -ForegroundColor Cyan
}

Write-Host "`n次回チェック: 1時間後を推奨" -ForegroundColor Gray


