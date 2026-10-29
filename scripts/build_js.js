const fs = require('fs');
const esbuild = require('esbuild');

const files = [
    'public/global-profile.js',
    'public/toast.js',
    'public/main.js',
    'public/home-v5.js'
];

let combinedJs = '';
files.forEach(f => {
    combinedJs += `/* === ${f} === */\n` + fs.readFileSync(f, 'utf8') + '\n;;\n';
});

const minJs = esbuild.transformSync(combinedJs, { minify: true }).code;
fs.writeFileSync('public/dist/home.min.js', minJs, 'utf8');

console.log('✅ Bundled JS written: public/dist/home.min.js, size:', minJs.length, 'bytes (~' + (minJs.length / 1024).toFixed(1) + ' KiB)');

