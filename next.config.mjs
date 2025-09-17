/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境ではESLintとTypeScriptエラーをチェック
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Capacitor用の設定
    domains: ['vercel.com', 'blob.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    scrollRestoration: true,
  },
  // 圧縮設定
  compress: true,
  // パワードバイヘッダー
  poweredByHeader: false,
  // バンドル分析
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 20,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer',
            chunks: 'all',
            priority: 15,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
  // 本番環境での最適化
  ...(process.env.NODE_ENV === 'production' && {
    output: process.env.BUILD_STANDALONE ? 'standalone' : (process.env.DEPLOY_TARGET === 'netlify' ? undefined : 'export'),
    generateEtags: false,
    httpAgentOptions: {
      keepAlive: true,
    },
    // 静的エクスポート用の設定（ロリポップ用）
    ...(process.env.DEPLOY_TARGET !== 'netlify' && {
      trailingSlash: true,
      skipTrailingSlashRedirect: true,
    }),
  }),
}

export default nextConfig
