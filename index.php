<?php
// ユーザーエージェントを取得
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$userAgentLower = strtolower($userAgent);

// WebView判定（アプリ内）
$isWebView = (
    strpos($userAgentLower, 'etarotapp') !== false ||
    strpos($userAgentLower, 'tarotapp') !== false ||
    strpos($userAgentLower, 'wv') !== false ||
    preg_match('/capacitor/i', $userAgentLower) ||
    preg_match('/android.*webkit.*version\/[0-9]/i', $userAgentLower) ||
    preg_match('/iphone.*applewebkit(?!.*safari)/i', $userAgentLower) ||
    preg_match('/ipad.*applewebkit(?!.*safari)/i', $userAgentLower)
);

// ボット判定
$isBot = preg_match('/googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com/i', $userAgentLower);

// ボットの場合はアクセス拒否
if ($isBot) {
    http_response_code(403);
    header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex');
    echo 'Access Denied / アクセス拒否';
    exit;
}

// アプリ内の場合はアプリを表示
if ($isWebView) {
    // Netlifyのアプリを表示（iframeまたはリダイレクト）
    header('Location: https://etarot.netlify.app/');
    exit;
}

// ブラウザの場合はダウンロードページを表示
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>アプリダウンロード - 無料タロット占い</title>
    <meta name="description" content="無料タロット占いアプリをGoogle Play Storeからダウンロード！毎日の運勢・恋愛・仕事を本格カード占いで診断。">
    <meta name="robots" content="index, follow">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #e2e8f0;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 500px;
            margin: 20px;
            padding: 40px 30px;
            background: rgba(30, 41, 59, 0.95);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            border: 1px solid rgba(147, 51, 234, 0.2);
            backdrop-filter: blur(10px);
            text-align: center;
        }
        
        .app-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #5b21b6 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }
        
        .app-title {
            font-size: 2.2em;
            font-weight: bold;
            color: #fbbf24;
            margin-bottom: 8px;
            text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
        }
        
        .app-subtitle {
            color: #cbd5e1;
            font-size: 1.1em;
            margin-bottom: 30px;
        }
        
        .device-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
            padding: 12px;
            background: rgba(51, 65, 85, 0.3);
            border-radius: 10px;
            border: 1px solid rgba(168, 85, 247, 0.1);
        }
        
        .device-icon {
            width: 20px;
            height: 20px;
        }
        
        .device-text {
            color: #fbbf24;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .description {
            margin-bottom: 30px;
            line-height: 1.8;
        }
        
        .description p {
            margin-bottom: 12px;
            color: #e2e8f0;
        }
        
        .description .highlight {
            color: #fbbf24;
            font-weight: bold;
        }
        
        .download-button {
            display: inline-block;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
            border: 2px solid #22c55e;
        }
        
        .download-button:hover {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(34, 197, 94, 0.4);
        }
        
        .features {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid rgba(168, 85, 247, 0.1);
        }
        
        .features h3 {
            color: #fbbf24;
            margin-bottom: 15px;
            font-size: 1.2em;
        }
        
        .feature-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            text-align: left;
        }
        
        .feature-item {
            color: #cbd5e1;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(168, 85, 247, 0.3);
            color: #94a3b8;
            font-size: 0.85em;
            line-height: 1.6;
        }
        
        .desktop-warning {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            border: 2px solid #3b82f6;
        }
        
        .desktop-warning h3 {
            margin-bottom: 10px;
            color: #fbbf24;
        }
        
        .steps {
            text-align: left;
            margin: 15px 0;
        }
        
        .step {
            margin-bottom: 8px;
            color: #e2e8f0;
        }
        
        .debug-info {
            margin-top: 20px;
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            font-size: 0.8em;
            color: #94a3b8;
            text-align: left;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 30px 20px;
            }
            
            .app-title {
                font-size: 1.8em;
            }
            
            .feature-list {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="app-icon">🔮</div>
        
        <h1 class="app-title">無料タロット占い</h1>
        <p class="app-subtitle">毎日の運勢とカード占い</p>
        
        <div class="device-info">
            <div class="device-icon"><?php echo (strpos($userAgentLower, 'mobile') !== false || strpos($userAgentLower, 'android') !== false || strpos($userAgentLower, 'iphone') !== false) ? '📱' : '💻'; ?></div>
            <span class="device-text"><?php echo (strpos($userAgentLower, 'mobile') !== false || strpos($userAgentLower, 'android') !== false || strpos($userAgentLower, 'iphone') !== false) ? 'モバイルデバイスを検出しました' : 'デスクトップブラウザを検出しました'; ?></span>
        </div>
        
        <div class="description">
            <p><span class="highlight">🎉 アプリが公開されました！</span></p>
            <p>毎日の運勢・恋愛・仕事を本格的なタロットカードで占えます</p>
            <p>78枚のタロットカード完全収録！辞書・クイズ・ゲームも楽しめます</p>
        </div>
        
        <a href="https://play.google.com/store/apps/details?id=com.ryuka.kanau_kiryu&pcampaignid=web_share" 
           class="download-button" 
           target="_blank" 
           rel="noopener noreferrer">
            📱 Google Play でダウンロード
        </a>
        
        <div class="features">
            <h3>🌟 アプリの特徴</h3>
            <div class="feature-list">
                <div class="feature-item">🔮 毎日の運勢占い</div>
                <div class="feature-item">💕 恋愛・結婚占い</div>
                <div class="feature-item">💼 仕事・転職占い</div>
                <div class="feature-item">💰 金運・財運占い</div>
                <div class="feature-item">📚 78枚カード辞書</div>
                <div class="feature-item">🧠 タロットクイズ</div>
                <div class="feature-item">🎮 記憶ゲーム</div>
                <div class="feature-item">🎨 カードバック</div>
            </div>
        </div>
        
        <?php if (strpos($userAgentLower, 'mobile') === false && strpos($userAgentLower, 'android') === false && strpos($userAgentLower, 'iphone') === false): ?>
        <div class="desktop-warning">
            <h3>💻 デスクトップでアクセス中</h3>
            <p>このアプリはモバイル専用です。スマートフォンでアクセスするか、下のリンクをモバイルに送信してください。</p>
            <div class="steps">
                <div class="step">1. スマートフォンでこのページにアクセス</div>
                <div class="step">2. または下のリンクをモバイルに送信</div>
                <div class="step">3. Google Playからダウンロード</div>
            </div>
        </div>
        <?php endif; ?>
        
        <div class="footer">
            <p>🆓 完全無料でダウンロード可能</p>
            <p>📱 Android 5.0以上が必要です</p>
            <p>開発者: 占い師・金間 麻耶 (カナマ キリュウ)</p>
            <p>© 2025 無料タロット占い. All rights reserved.</p>
        </div>
        
        <!-- デバッグ情報 -->
        <div class="debug-info">
            <p><strong>User Agent:</strong> <?php echo htmlspecialchars(substr($userAgent, 0, 100)); ?>...</p>
            <p><strong>Is WebView:</strong> <?php echo $isWebView ? 'Yes' : 'No'; ?></p>
            <p><strong>Is Bot:</strong> <?php echo $isBot ? 'Yes' : 'No'; ?></p>
            <p><strong>Device Type:</strong> <?php echo (strpos($userAgentLower, 'mobile') !== false || strpos($userAgentLower, 'android') !== false || strpos($userAgentLower, 'iphone') !== false) ? 'Mobile' : 'Desktop'; ?></p>
        </div>
    </div>
    
    <script>
        // モバイルの場合、5秒後に自動リダイレクト
        <?php if (strpos($userAgentLower, 'mobile') !== false || strpos($userAgentLower, 'android') !== false || strpos($userAgentLower, 'iphone') !== false): ?>
        setTimeout(() => {
            if (confirm('Google Play Storeでアプリをダウンロードしますか？')) {
                window.location.href = 'https://play.google.com/store/apps/details?id=com.ryuka.kanau_kiryu&pcampaignid=web_share';
            }
        }, 5000);
        <?php endif; ?>
    </script>
</body>
</html>
