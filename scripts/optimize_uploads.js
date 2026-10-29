const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

async function run() {
    const files = fs.readdirSync(uploadsDir);
    console.log(`Scanning ${files.length} items in ${uploadsDir}...`);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
        const base = path.basename(file, ext);
        const inputPath = path.join(uploadsDir, file);

        const webpPath = path.join(uploadsDir, `${base}.webp`);
        const avifPath = path.join(uploadsDir, `${base}.avif`);
        const thumb400Path = path.join(uploadsDir, `${base}-400.webp`);

        try {
            if (!fs.existsSync(webpPath)) {
                await sharp(inputPath).webp({ quality: 82 }).toFile(webpPath);
                console.log(`Generated ${base}.webp`);
            }
            if (!fs.existsSync(avifPath)) {
                await sharp(inputPath).avif({ quality: 75 }).toFile(avifPath);
                console.log(`Generated ${base}.avif`);
            }
            if (!fs.existsSync(thumb400Path)) {
                await sharp(inputPath).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(thumb400Path);
                console.log(`Generated ${base}-400.webp`);
            }
        } catch (e) {
            console.warn(`Error processing ${file}:`, e.message);
        }
    }
    console.log('✅ All uploads processed.');
}

run();

