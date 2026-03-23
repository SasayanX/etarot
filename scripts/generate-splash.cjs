const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const inputPath = path.resolve('public/new-icon.png');
const outputRoot = path.resolve('android/app/src/main/res');

const splashSizes = [
    { name: 'drawable', width: 2732, height: 2732 },
    { name: 'drawable-land-mdpi', width: 480, height: 320 },
    { name: 'drawable-land-hdpi', width: 800, height: 480 },
    { name: 'drawable-land-xhdpi', width: 1280, height: 720 },
    { name: 'drawable-land-xxhdpi', width: 1600, height: 960 },
    { name: 'drawable-land-xxxhdpi', width: 1920, height: 1280 },
    { name: 'drawable-port-mdpi', width: 320, height: 480 },
    { name: 'drawable-port-hdpi', width: 480, height: 800 },
    { name: 'drawable-port-xhdpi', width: 720, height: 1280 },
    { name: 'drawable-port-xxhdpi', width: 960, height: 1600 },
    { name: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
];

async function generateSplash() {
    console.log('Generating splash screens...');

    for (const size of splashSizes) {
        const minDim = Math.min(size.width, size.height);
        const iconSize = Math.round(minDim * 0.4); // 40% of the smallest dimension

        const iconBuf = await sharp(inputPath)
            .resize(iconSize, iconSize)
            .toBuffer();

        const dir = path.join(outputRoot, size.name);
        await fs.mkdir(dir, { recursive: true });

        await sharp({
            create: {
                width: size.width,
                height: size.height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            }
        })
            .composite([{ input: iconBuf, gravity: 'center' }])
            .png()
            .toFile(path.join(dir, 'splash.png'));

        console.log(`Generated ${size.name}/splash.png (${size.width}x${size.height})`);
    }
}

generateSplash().catch(console.error);
