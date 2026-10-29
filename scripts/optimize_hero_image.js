const fs = require('fs');
const sharp = require('sharp');

async function processHeroImages() {
    const src = 'public/sabbir_profile.jpg';

    // 400px width WebP
    await sharp(src)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 82, effort: 6 })
        .toFile('public/uploads/hero-portrait-400.webp');

    // 400px width AVIF
    await sharp(src)
        .resize(400, 400, { fit: 'cover' })
        .avif({ quality: 75, effort: 6 })
        .toFile('public/uploads/hero-portrait-400.avif');

    // Standard webp
    await sharp(src)
        .webp({ quality: 85 })
        .toFile('public/uploads/hero-portrait.webp');

    const sWebp = fs.statSync('public/uploads/hero-portrait-400.webp').size;
    const sAvif = fs.statSync('public/uploads/hero-portrait-400.avif').size;
    console.log(`✅ Generated WebP (${(sWebp/1024).toFixed(1)} KB) and AVIF (${(sAvif/1024).toFixed(1)} KB)`);
}

processHeroImages();

