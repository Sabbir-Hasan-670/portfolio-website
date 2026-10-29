const fs = require('fs');

let js = fs.readFileSync('public/main.js', 'utf8');

const oldCode = `        return {
            section,
            originalIndex,
            sortOrder: Number.isFinite(Number(settings?.sort_order)) ? Number(settings.sort_order) : originalIndex
        };`;

const newCode = `        const defaultSectionSort = {
            hero: 10,
            expertise: 20,
            projects: 30,
            about: 70,
            experience: 80,
            education: 90,
            certificates: 100,
            'explore-more': 105,
            development: 140,
            contact: 150
        };
        const fallbackSort = defaultSectionSort[section.dataset.sectionKey] ?? ((originalIndex + 1) * 10);
        return {
            section,
            originalIndex,
            sortOrder: Number.isFinite(Number(settings?.sort_order)) ? Number(settings.sort_order) : fallbackSort
        };`;

if (js.includes(oldCode)) {
    js = js.replace(oldCode, newCode);
    fs.writeFileSync('public/main.js', js, 'utf8');
    console.log('✅ Successfully patched sortOrder in public/main.js');
} else {
    // CRLF check
    const oldCodeCrlf = oldCode.replace(/\n/g, '\r\n');
    const newCodeCrlf = newCode.replace(/\n/g, '\r\n');
    if (js.includes(oldCodeCrlf)) {
        js = js.replace(oldCodeCrlf, newCodeCrlf);
        fs.writeFileSync('public/main.js', js, 'utf8');
        console.log('✅ Successfully patched sortOrder in public/main.js (CRLF)');
    } else {
        console.error('❌ Could not find oldCode in public/main.js');
    }
}

