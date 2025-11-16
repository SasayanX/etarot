'use strict'

const path = require('path')
const fs = require('fs/promises')
const sharp = require('sharp')

const args = process.argv.slice(2)

const getArg = (flag) => {
  const index = args.indexOf(flag)
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1]
  }
  return undefined
}

const projectRoot = process.cwd()
const defaultInput = path.join(projectRoot, 'assets', 'app-icon.png')
const defaultOutput = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res')

const inputPath = path.resolve(getArg('--input') ?? defaultInput)
const outputRoot = path.resolve(getArg('--output') ?? defaultOutput)

const densities = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 },
]

const ADAPTIVE_SCALE = 108 / 48 // Android adaptive icon guideline
const FOREGROUND_SCALE = 0.78
const ADAPTIVE_BACKGROUND = '#080612'

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true })
}

const fileExists = async (target) => {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

const circleMask = (size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${
      size / 2
    }" fill="white"/></svg>`,
  )

const generateIcons = async () => {
  if (!(await fileExists(inputPath))) {
    console.error(`❌ Base icon not found at "${inputPath}".`)
    console.error('   Provide a square PNG (e.g. assets/app-icon.png) or pass --input <path>.')
    process.exit(1)
  }

  console.log('🔧 Generating Android launcher assets...')
  console.log(`   Base icon: ${inputPath}`)
  console.log(`   Output root: ${outputRoot}`)

  for (const density of densities) {
    const densityDir = path.join(outputRoot, `mipmap-${density.name}`)
    await ensureDir(densityDir)

    const legacyBuffer = await sharp(inputPath)
      .resize(density.size, density.size, {
        fit: 'cover',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    await fs.writeFile(path.join(densityDir, 'ic_launcher.png'), legacyBuffer)
    await sharp(legacyBuffer).webp({ quality: 100 }).toFile(path.join(densityDir, 'ic_launcher.webp'))

    const roundBuffer = await sharp(legacyBuffer)
      .composite([{ input: circleMask(density.size), blend: 'dest-in' }])
      .png()
      .toBuffer()
    await sharp(roundBuffer)
      .webp({ quality: 100 })
      .toFile(path.join(densityDir, 'ic_launcher_round.webp'))

    const adaptiveSize = Math.round(density.size * ADAPTIVE_SCALE)
    const adaptiveBackground = await sharp({
      create: {
        width: adaptiveSize,
        height: adaptiveSize,
        channels: 4,
        background: ADAPTIVE_BACKGROUND,
      },
    })
      .png()
      .toBuffer()
    await fs.writeFile(path.join(densityDir, 'ic_launcher_adaptive_back.png'), adaptiveBackground)

    const foregroundSize = Math.round(adaptiveSize * FOREGROUND_SCALE)
    const foregroundIcon = await sharp(inputPath)
      .resize(foregroundSize, foregroundSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    const adaptiveForeground = await sharp({
      create: { width: adaptiveSize, height: adaptiveSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: foregroundIcon, gravity: 'center' }])
      .png()
      .toBuffer()

    await fs.writeFile(path.join(densityDir, 'ic_launcher_adaptive_fore.png'), adaptiveForeground)
    await sharp(adaptiveForeground)
      .webp({ quality: 100 })
      .toFile(path.join(densityDir, 'ic_launcher_foreground.webp'))
  }

  console.log('✅ Android icons updated for densities:', densities.map((d) => d.name).join(', '))
  console.log('   Run "./gradlew assembleRelease" to confirm the new assets in the build.')
}

generateIcons().catch((error) => {
  console.error('❌ Failed to generate Android icons:')
  console.error(error)
  process.exit(1)
})


