const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add </header> after </nav>
if (!html.includes('</nav>\r\n</header>') && !html.includes('</nav>\n</header>')) {
    html = html.replace(/<\/nav>\s*<main id="main"/, '</nav>\n</header>\n\n<main id="main"');
    console.log('✅ Added closing </header> tag before <main>');
}

// 2. Add JetBrains Mono preloads to <head>
if (!html.includes('jetbrains-mono-600-normal.woff2')) {
    const monoPreload = `    <link rel="preload" href="/fonts/jetbrains-mono-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n    <link rel="preload" href="/fonts/jetbrains-mono-600-normal.woff2" as="font" type="font/woff2" crossorigin>\n`;
    html = html.replace('<link rel="preload" href="/fonts/outfit-600-normal.woff2"', monoPreload + '    <link rel="preload" href="/fonts/outfit-600-normal.woff2"');
    console.log('✅ Added JetBrains Mono font preloads to <head>');
}

fs.writeFileSync('public/index.html', html, 'utf8');

