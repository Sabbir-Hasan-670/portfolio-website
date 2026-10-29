const cp = require('child_process');
const fs = require('fs');

console.log('🚀 Launching local server on port 5005 for Lighthouse testing...');
const serverProc = cp.spawn('node', ['server.js'], { stdio: 'pipe' });

serverProc.stdout.on('data', d => {
    // console.log('SERVER:', d.toString());
});

async function main() {
    // Wait 2.5s for server initialization
    await new Promise(r => setTimeout(r, 2500));

    console.log('📱 Running Lighthouse Mobile Audit against http://localhost:5005...');
    const mobileCmd = 'npx.cmd lighthouse http://localhost:5005 --form-factor=mobile --output=json --output-path=./lh-after-mobile.json --chrome-flags="--headless --no-sandbox"';
    try {
        cp.execSync(mobileCmd, { stdio: 'inherit', timeout: 120000 });
        console.log('✅ Mobile audit complete: ./lh-after-mobile.json');
    } catch (e) {
        console.error('❌ Mobile audit error:', e.message);
    }

    console.log('💻 Running Lighthouse Desktop Audit against http://localhost:5005...');
    const desktopCmd = 'npx.cmd lighthouse http://localhost:5005 --preset=desktop --output=json --output-path=./lh-after-desktop.json --chrome-flags="--headless --no-sandbox"';
    try {
        cp.execSync(desktopCmd, { stdio: 'inherit', timeout: 120000 });
        console.log('✅ Desktop audit complete: ./lh-after-desktop.json');
    } catch (e) {
        console.error('❌ Desktop audit error:', e.message);
    }

    serverProc.kill();
    console.log('Server process terminated.');

    // Compare scores
    printComparison();
}

function printComparison() {
    console.log('\n=============================================');
    console.log('📊 LIGHTHOUSE AUDIT RESULTS COMPARISON');
    console.log('=============================================');

    function readScores(filePath) {
        if (!fs.existsSync(filePath)) return null;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const cats = data.categories || {};
        const audits = data.audits || {};
        return {
            performance: Math.round((cats.performance?.score || 0) * 100),
            accessibility: Math.round((cats.accessibility?.score || 0) * 100),
            bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
            seo: Math.round((cats.seo?.score || 0) * 100),
            agentic: cats['agentic-browsing'] ? Math.round((cats['agentic-browsing']?.score || 0) * 100) : 'N/A',
            fcp: audits['first-contentful-paint']?.displayValue,
            lcp: audits['largest-contentful-paint']?.displayValue,
            tbt: audits['total-blocking-time']?.displayValue,
            cls: audits['cumulative-layout-shift']?.displayValue,
            speedIndex: audits['speed-index']?.displayValue
        };
    }

    const beforeMob = readScores('./lh-before-mobile.json');
    const afterMob = readScores('./lh-after-mobile.json');
    const beforeDesk = readScores('./lh-before-desktop.json');
    const afterDesk = readScores('./lh-after-desktop.json');

    console.log('\n📱 MOBILE:');
    console.table({
        'Before (Live)': beforeMob,
        'After (Optimized)': afterMob
    });

    console.log('\n💻 DESKTOP:');
    console.table({
        'Before (Live)': beforeDesk,
        'After (Optimized)': afterDesk
    });
}

main();

