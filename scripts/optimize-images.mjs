
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public/img');
const MAX_WIDTH = 1920;
const QUALITY = 85;
const SIZE_THRESHOLD = 400 * 1024; // 400KB

async function optimizeImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await optimizeImages(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                if (stat.size > SIZE_THRESHOLD) {
                    console.log(`Optimizing: ${filePath} (${(stat.size / 1024).toFixed(2)} KB)`);

                    try {
                        const image = sharp(filePath);
                        const metadata = await image.metadata();

                        if (metadata.width > MAX_WIDTH) {
                            console.log(`  Resizing from ${metadata.width} to ${MAX_WIDTH}`);
                            image.resize(MAX_WIDTH);
                        }

                        // Build pipeline branching by extension to preserve format
                        let pipeline = sharp(filePath);
                        if (metadata.width > MAX_WIDTH) {
                            pipeline = pipeline.resize(MAX_WIDTH);
                        }

                        if (ext === '.webp') {
                            pipeline = pipeline.webp({ quality: QUALITY, effort: 4 });
                        } else if (ext === '.jpg' || ext === '.jpeg') {
                            pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
                        } else if (ext === '.png') {
                            pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
                        }

                        const outputBuffer = await pipeline.toBuffer();

                        if (outputBuffer.length < stat.size) {
                            fs.writeFileSync(filePath, outputBuffer);
                            console.log(`  Saved ${(stat.size - outputBuffer.length) / 1024 / 1024} MB`);
                        } else {
                            console.log(`  Skipped (Optimization result larger)`);
                        }

                    } catch (error) {
                        console.error(`  Error analyzing/optimizing ${filePath}:`, error.message);
                    }
                }
            }
        }
    }
}

console.log('Starting image optimization...');
optimizeImages(PUBLIC_DIR).then(() => console.log('Done.'));
