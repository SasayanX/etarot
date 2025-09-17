#!/usr/bin/env node

/**
 * 未使用依存関係の分析スクリプト
 * バンドルサイズ最適化のための分析
 */

const fs = require('fs')
const path = require('path')

// 分析対象の依存関係
const dependenciesToAnalyze = [
  '@capacitor/cli',
  '@emotion/is-prop-valid', 
  'canvas-confetti',
  'date-fns',
  'embla-carousel-react',
  'geist',
  'input-otp',
  'react-day-picker',
  'react-resizable-panels',
  'recharts',
  'vaul'
]

// プロジェクトのルートディレクトリ
const projectRoot = process.cwd()

// ファイルを再帰的に検索
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = []
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // node_modulesと.nextをスキップ
        if (!['node_modules', '.next', 'dist', 'out'].includes(item)) {
          traverse(fullPath)
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item)
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  }
  
  traverse(dir)
  return files
}

// ファイル内で依存関係の使用を検索
function analyzeFile(filePath, dependency) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // インポート文を検索
    const importRegex = new RegExp(`import.*from.*['"]${dependency}['"]`, 'g')
    const requireRegex = new RegExp(`require\\(['"]${dependency}['"]\\)`, 'g')
    
    const importMatches = content.match(importRegex) || []
    const requireMatches = content.match(requireRegex) || []
    
    return {
      file: filePath,
      used: importMatches.length > 0 || requireMatches.length > 0,
      importMatches,
      requireMatches
    }
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error.message)
    return { file: filePath, used: false, error: error.message }
  }
}

// メイン分析関数
function analyzeDependencies() {
  console.log('🔍 依存関係の使用状況を分析中...\n')
  
  const allFiles = findFiles(projectRoot)
  console.log(`📁 分析対象ファイル数: ${allFiles.length}`)
  
  const results = {}
  
  for (const dependency of dependenciesToAnalyze) {
    console.log(`\n📦 分析中: ${dependency}`)
    
    const usage = []
    let totalUsage = 0
    
    for (const file of allFiles) {
      const result = analyzeFile(file, dependency)
      if (result.used) {
        usage.push(result)
        totalUsage++
      }
    }
    
    results[dependency] = {
      used: totalUsage > 0,
      usageCount: totalUsage,
      files: usage
    }
    
    console.log(`   ${totalUsage > 0 ? '✅ 使用中' : '❌ 未使用'} (${totalUsage}ファイル)`)
  }
  
  // 結果をファイルに保存
  const reportPath = path.join(projectRoot, 'dependency-analysis-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  
  // 未使用依存関係のレポート
  console.log('\n📊 分析結果:')
  console.log('=' * 50)
  
  const unusedDeps = Object.entries(results)
    .filter(([_, result]) => !result.used)
    .map(([dep, _]) => dep)
  
  const usedDeps = Object.entries(results)
    .filter(([_, result]) => result.used)
    .map(([dep, result]) => ({ dep, count: result.usageCount }))
  
  console.log(`\n❌ 未使用依存関係 (${unusedDeps.length}個):`)
  unusedDeps.forEach(dep => console.log(`   - ${dep}`))
  
  console.log(`\n✅ 使用中依存関係 (${usedDeps.length}個):`)
  usedDeps.forEach(({ dep, count }) => console.log(`   - ${dep} (${count}ファイル)`))
  
  console.log(`\n📄 詳細レポート: ${reportPath}`)
  
  return results
}

// スクリプト実行
if (require.main === module) {
  analyzeDependencies()
}

module.exports = { analyzeDependencies }
