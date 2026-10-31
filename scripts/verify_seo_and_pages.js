const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Comprehensive SEO & Page Audit...\n');

const pages = [
    { file: 'public/index.html', url: '/', expectedH1: 'Sabbir Hasan – Freelance Digital Marketer & Graphic Designer' },
    { file: 'public/social-media-marketing.html', url: '/social-media-marketing', expectedH1: 'Social Media Marketing Services for Small Businesses' },
    { file: 'public/graphic-design.html', url: '/graphic-design', expectedH1: 'Freelance Graphic Design Services' },
    { file: 'public/logo-design.html', url: '/logo-design', expectedH1: 'Custom Logo Design for Your Business' },
    { file: 'public/digital-marketing.html', url: '/digital-marketing', expectedH1: 'Freelance Digital Marketer' },
    { file: 'public/networking.html', url: '/networking', expectedH1: 'Networking Services' },
    { file: 'public/about.html', url: '/about', expectedH1: 'About Sabbir Hasan' },
    { file: 'public/portfolio.html', url: '/portfolio', expectedH1: 'Client Work & Portfolio Showcase' },
    { file: 'public/contact.html', url: '/contact', expectedH1: "Let's Build Something Exceptional Together" },
    { file: 'public/blog.html', url: '/blog', expectedH1: 'Insights, Guides & Practical Resources' },
    { file: 'public/404.html', url: '/404', expectedH1: '404 — Page Not Found' }
];

let totalPassed = 0;
let totalFailed = 0;

for (const p of pages) {
    const filePath = path.join(__dirname, '..', p.file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ [MISSING FILE] ${p.file}`);
        totalFailed++;
        continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');

    // 1. Check lang="en"
    const hasLang = /<html[^>]*lang=["']en["']/i.test(html);

    // 2. Check single H1
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const singleH1 = h1Matches.length === 1;

    // 3. Title tag
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const hasTitle = !!titleMatch && titleMatch[1].trim().length > 0;

    // 4. Meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                      html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
    const hasDesc = !!descMatch && descMatch[1].trim().length > 0;

    // 5. Canonical
    const hasCanonical = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html);

    // 6. Schema JSON-LD (404 doesn't require schema)
    const hasSchema = p.file.includes('404') || /<script\s+type=["']application\/ld\+json["']/i.test(html);

    const passed = hasLang && singleH1 && hasTitle && hasDesc && hasCanonical && hasSchema;
    if (passed) {
        console.log(`✅ [PASS] ${p.url.padEnd(26)} | H1s: ${h1Matches.length} | Title: "${titleMatch[1].slice(0, 40)}..."`);
        totalPassed++;
    } else {
        console.error(`❌ [FAIL] ${p.url.padEnd(26)} | Lang: ${hasLang} | Single H1: ${singleH1} (${h1Matches.length}) | Title: ${hasTitle} | Desc: ${hasDesc} | Canonical: ${hasCanonical} | Schema: ${hasSchema}`);
        totalFailed++;
    }
}

// 7. Check Blog Posts
console.log('\n📄 Checking Starter Markdown Blog Articles:');
const blogPosts = ['how-to-design-a-logo.md', 'how-to-be-a-good-social-media-manager.md'];
for (const postName of blogPosts) {
    const postPath = path.join(__dirname, '..', 'content', 'blog', postName);
    if (!fs.existsSync(postPath)) {
        console.error(`❌ [MISSING POST] ${postName}`);
        totalFailed++;
        continue;
    }
    const content = fs.readFileSync(postPath, 'utf8');
    const wordCount = content.split(/\s+/).length;
    const hasFrontmatter = content.startsWith('---');
    const hasFocusKeyword = content.includes('focusKeyword:');
    if (wordCount >= 800 && hasFrontmatter && hasFocusKeyword) {
        console.log(`✅ [PASS] content/blog/${postName.padEnd(36)} | Words: ${wordCount} (>= 800)`);
        totalPassed++;
    } else {
        console.error(`❌ [FAIL] content/blog/${postName} | Words: ${wordCount} | Frontmatter: ${hasFrontmatter}`);
        totalFailed++;
    }
}

console.log(`\n========================================`);
console.log(`Audit Summary: ${totalPassed} Passed, ${totalFailed} Failed.`);
console.log(`========================================\n`);

if (totalFailed > 0) process.exit(1);
