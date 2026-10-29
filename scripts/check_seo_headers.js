async function check() {
    const pages = [
        'https://sabbirhasan.com/',
        'https://sabbirhasan.com/blog',
        'https://sabbirhasan.com/resume'
    ];

    for (const p of pages) {
        try {
            const res = await fetch(p);
            const html = await res.text();
            const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
            const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
            console.log(`=== ${p} ===`);
            console.log('Status:', res.status);
            console.log('Robots Meta:', robotsMatch ? robotsMatch[0] : 'None (defaults to index, follow)');
            console.log('Canonical:', canonMatch ? canonMatch[0] : 'None');
        } catch (e) {
            console.error(p, e.message);
        }
    }
}

check();
