const fs = require('fs');
const sharp = require('sharp');

async function optimizeFavicon() {
    if (!fs.existsSync('public/favicon-original.png')) {
        fs.copyFileSync('public/favicon.png', 'public/favicon-original.png');
        console.log('Saved backup to public/favicon-original.png');
    }
    await sharp('public/favicon-original.png')
        .resize(64, 64, { fit: 'contain' })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile('public/favicon.png');

    const newSize = fs.statSync('public/favicon.png').size;
    console.log(`✅ Favicon optimized: 1.8 MB -> ${(newSize / 1024).toFixed(1)} KB`);
}

optimizeFavicon();

