import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImage = path.resolve('src/assets/images/app_icon_probashi_1790497025662.jpg');

const densities = [
  { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

async function generate() {
  const baseResDir = path.resolve('android/app/src/main/res');

  for (const { dir, size, fgSize } of densities) {
    const targetDir = path.join(baseResDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard square ic_launcher.png
    await sharp(sourceImage)
      .resize(size, size)
      .toFormat('png')
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round ic_launcher_round.png with circle mask
    const circleBuffer = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`
    );
    await sharp(sourceImage)
      .resize(size, size)
      .composite([{ input: circleBuffer, blend: 'dest-in' }])
      .toFormat('png')
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground ic_launcher_foreground.png for adaptive icons
    await sharp(sourceImage)
      .resize(Math.round(fgSize * 0.72), Math.round(fgSize * 0.72))
      .extend({
        top: Math.round(fgSize * 0.14),
        bottom: Math.round(fgSize * 0.14),
        left: Math.round(fgSize * 0.14),
        right: Math.round(fgSize * 0.14),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .resize(fgSize, fgSize)
      .toFormat('png')
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated icons for ${dir}`);
  }

  // Also web public icons
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await sharp(sourceImage)
    .resize(192, 192)
    .toFormat('png')
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(sourceImage)
    .resize(512, 512)
    .toFormat('png')
    .toFile(path.join(publicDir, 'icon-512.png'));

  await sharp(sourceImage)
    .resize(64, 64)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
