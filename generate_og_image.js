const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function generateOG() {
    console.log('Generating high-definition 1200x630 Open Graph banner...');
    
    // Read Sabbir profile image as base64
    const imgPath = path.join(__dirname, 'public', 'sabbir_profile.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgSrc = `data:image/jpeg;base64,${imgBase64}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        width: 1200px;
        height: 630px;
        background: #05090f;
        color: #f3f7f8;
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Architectural Cyber Grid & Gradients */
    .bg-grid {
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(143, 157, 172, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143, 157, 172, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        z-index: 1;
    }

    .ambient-glow-amber {
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(213, 163, 74, 0.18) 0%, transparent 70%);
        top: -150px;
        right: 0px;
        z-index: 2;
        filter: blur(40px);
    }

    .ambient-glow-cyan {
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(117, 185, 198, 0.12) 0%, transparent 70%);
        bottom: -150px;
        left: -100px;
        z-index: 2;
        filter: blur(40px);
    }

    /* Container Frame */
    .og-container {
        position: relative;
        z-index: 10;
        width: 1140px;
        height: 570px;
        background: rgba(10, 17, 27, 0.75);
        border: 1px solid rgba(143, 157, 172, 0.22);
        border-radius: 8px;
        backdrop-filter: blur(20px);
        padding: 44px 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    /* Corner Crosshairs / HUD Markers */
    .corner {
        position: absolute;
        width: 12px;
        height: 12px;
        border-color: #d5a34a;
        border-style: solid;
        z-index: 15;
    }
    .corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    /* Left Content Column */
    .left-col {
        flex: 1;
        max-width: 630px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .top-telemetry {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .telemetry-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(213, 163, 74, 0.1);
        border: 1px solid rgba(213, 163, 74, 0.35);
        padding: 5px 14px;
        border-radius: 999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #f0c875;
        text-transform: uppercase;
    }

    .telemetry-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
    }

    .telemetry-sys {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.06em;
        color: #8f9dac;
    }

    .main-identity {
        margin: auto 0;
    }

    .brand-name {
        font-family: 'Outfit', sans-serif;
        font-size: 58px;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.05;
        background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 70%, #d5a34a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 12px;
    }

    .brand-role {
        font-family: 'JetBrains Mono', monospace;
        font-size: 19px;
        font-weight: 600;
        color: #75b9c6;
        letter-spacing: -0.01em;
        margin-bottom: 22px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .role-sep {
        color: rgba(143, 157, 172, 0.4);
    }

    .skills-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .skill-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: rgba(243, 240, 233, 0.04);
        border: 1px solid rgba(243, 240, 233, 0.12);
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 600;
        color: #e2e8f0;
        letter-spacing: 0.02em;
    }

    .skill-pill.highlight {
        background: rgba(213, 163, 74, 0.08);
        border-color: rgba(213, 163, 74, 0.28);
        color: #f0c875;
    }

    /* Bottom Info Bar */
    .bottom-bar {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-top: 16px;
        border-top: 1px solid rgba(143, 157, 172, 0.15);
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #8f9dac;
    }

    .bottom-item {
        display: flex;
        align-items: center;
        gap: 7px;
    }

    .bottom-item strong {
        color: #f3f7f8;
        font-weight: 600;
    }

    /* Right Column: Portrait Chassis */
    .right-col {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .portrait-chassis {
        position: relative;
        width: 360px;
        height: 440px;
        border-radius: 8px;
        background: #0e1824;
        border: 2px solid rgba(213, 163, 74, 0.45);
        box-shadow: 0 0 35px rgba(213, 163, 74, 0.2), 0 20px 40px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .portrait-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        display: block;
    }

    /* Cyber scanlines overlay */
    .portrait-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 65%, rgba(5, 9, 15, 0.9) 100%);
        pointer-events: none;
    }

    /* Status badge floating on portrait */
    .portrait-badge {
        position: absolute;
        bottom: 16px;
        left: 16px;
        right: 16px;
        background: rgba(10, 17, 27, 0.88);
        border: 1px solid rgba(213, 163, 74, 0.4);
        border-radius: 4px;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(10px);
    }

    .pb-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        color: #f3f7f8;
        letter-spacing: 0.05em;
    }

    .pb-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
    }

    .pb-tag {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        color: #f0c875;
        letter-spacing: 0.08em;
    }
</style>
</head>
<body>

<div class="bg-grid"></div>
<div class="ambient-glow-amber"></div>
<div class="ambient-glow-cyan"></div>

<div class="og-container">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- Left Column: Dossier Information -->
    <div class="left-col">
        <div class="top-telemetry">
            <div class="telemetry-badge">
                <span class="telemetry-dot"></span>
                <span>SYSTEMS ARCHITECT // VERIFIED</span>
            </div>
            <span class="telemetry-sys">// STATION BD-2026</span>
        </div>

        <div class="main-identity">
            <h1 class="brand-name">Sabbir Hasan</h1>
            <div class="brand-role">
                <span>Network Engineer</span>
                <span class="role-sep">&bull;</span>
                <span>Cybersecurity</span>
                <span class="role-sep">&bull;</span>
                <span>Full-Stack</span>
            </div>
            <div class="skills-row">
                <div class="skill-pill highlight">🛡️ Cisco CCNA 200-301</div>
                <div class="skill-pill highlight">🔒 Ethical Hacking &amp; WAF</div>
                <div class="skill-pill">⚡ Node.js &amp; MySQL</div>
                <div class="skill-pill">🐧 Linux &amp; Nginx</div>
            </div>
        </div>

        <div class="bottom-bar">
            <div class="bottom-item">
                <span>🌐</span>
                <strong>sabbirhasan.com</strong>
            </div>
            <div class="bottom-item">
                <span>📍</span>
                <span>Faridpur, BD &middot; Remote / Enterprise</span>
            </div>
            <div class="bottom-item" style="margin-left: auto;">
                <span style="color: #10b981;">●</span>
                <span>TLS 1.3 SECURE</span>
            </div>
        </div>
    </div>

    <!-- Right Column: Profile Portrait Chassis -->
    <div class="right-col">
        <div class="portrait-chassis">
            <img class="portrait-img" src="${imgSrc}" alt="Sabbir Hasan">
            <div class="portrait-overlay"></div>
            <div class="portrait-badge">
                <div class="pb-left">
                    <span class="pb-pulse"></span>
                    <span>SABBIR HASAN</span>
                </div>
                <span class="pb-tag">ACTIVE DOSSIER</span>
            </div>
        </div>
    </div>
</div>

</body>
</html>
    `;

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
        viewport: { width: 1200, height: 630 },
        deviceScaleFactor: 2 // 2x retina sharpness
    });

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Wait for web fonts to load
    await page.evaluate(async () => {
        await document.fonts.ready;
    });

    const outputPath = path.join(__dirname, 'public', 'og-image.png');
    await page.screenshot({ path: outputPath, type: 'png' });
    
    // Also generate og-image.jpg
    const jpgOutputPath = path.join(__dirname, 'public', 'og-image.jpg');
    await page.screenshot({ path: jpgOutputPath, type: 'jpeg', quality: 90 });

    console.log(`✅ Successfully generated 1200x630 OG banner at: ${outputPath}`);
    await browser.close();
}

generateOG().catch(console.error);
