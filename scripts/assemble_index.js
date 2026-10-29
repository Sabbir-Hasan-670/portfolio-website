const fs = require('fs');
const path = require('path');

let original = fs.readFileSync(path.join(__dirname, '..', '_removed', 'index.original.html'), 'utf8');
original = original.replace(/\r\n/g, '\n');

function sliceBetween(startStr, endStr) {
    const s = original.indexOf(startStr);
    if (s === -1) throw new Error('Start not found: ' + startStr);
    const e = original.indexOf(endStr, s);
    if (e === -1) throw new Error('End not found: ' + endStr);
    return original.substring(s, e);
}

// 1. Head and Nav
let headAndNav = original.substring(0, original.indexOf('<!-- HERO —'));
// Replace JSON-LD locality
headAndNav = headAndNav.replace(
    '"addressLocality": "Faridpur"',
    '"addressLocality": "Dhaka"'
);
// Replace mobile menu in Nav to be clean and accurate
const navDropdownOld = sliceBetween('<div class="nav-menu-dropdown" id="navDropdown">', '</div>\n        </div>\n    </nav>');
const navDropdownNew = `<div class="nav-menu-dropdown" id="navDropdown">
                <a href="#home">Home</a>
                <a href="#services">Expertise</a>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
                <a href="#experience">Experience</a>
                <a href="#education">Education</a>
                <a href="#certificates">Credentials</a>
                <a href="#explore-more">Explore Hubs</a>
                <a href="#development">Development Pulse</a>
                <a href="/resume">Resume</a>
                <a href="/blog">Blog</a>
                <a href="/tools">Interactive Tools</a>
                <a href="/streams">📡 Streams &amp; Media</a>
                <a href="/Learn/Learn-CCNA/learn-ccna">🌐 CCNA 200-301</a>
                <a href="/contact" class="nav-cta">Contact ↗</a>`;

headAndNav = headAndNav.replace(navDropdownOld, navDropdownNew);

// 2. Hero
let hero = sliceBetween('<!-- HERO —', '<div class="hero-expertise-bridge"');
// Location in status pill
hero = hero.replace('Dhaka, BD · Remote', 'Dhaka, Bangladesh · Remote');
// Primary headline & secondary subtitle
hero = hero.replace(
    '<span class="hero-name-intro">Independent Systems Technologist</span>',
    '<span class="hero-name-intro">Network Engineer &amp; Cybersecurity</span>'
);
// Terminal deck: remove TLS 1.3 SECURE badge
hero = hero.replace(
    '<span class="deck-badge-secure">TLS 1.3 SECURE</span>',
    ''
);
// Terminal deck role text
hero = hero.replace(
    '<span id="typingText">Network Engineer • Cybersecurity • Full-Stack Developer</span>',
    '<span id="typingText">Network Engineer &amp; Cybersecurity</span>'
);
// Add secondary role pill right after terminal deck
const terminalDeckEnd = '</div>\n            </div>\n\n            <p class="hero-bio-text"';
const terminalDeckWithSecondary = `</div>
            </div>

            <div class="hero-secondary-badge" style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 0.85rem; padding: 4px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #94a3b8;">
                <span style="color: #38bdf8;">◈</span> Full-Stack Developer &amp; Systems Architect
            </div>

            <p class="hero-bio-text"`;
hero = hero.replace(terminalDeckEnd, terminalDeckWithSecondary);

// Bio text
hero = hero.replace(
    '<p class="hero-bio-text" id="hero-bio">Building secure networks, scalable applications, and modern digital systems.</p>',
    '<p class="hero-bio-text" id="hero-bio">Building secure network infrastructure, defensive cyber posture, and high-performance full-stack web applications.</p>'
);

// Fiverr link with clear TODO comment
hero = hero.replace(
    '<a href="https://fiverr.com" id="link-fiverr"',
    '<!-- TODO: Set Sabbir Hasan\'s actual Fiverr profile URL when available (e.g. https://www.fiverr.com/username) -->\n                <a href="https://fiverr.com" id="link-fiverr"'
);

// Portrait chassis: remove OPERATIONAL and VERIFIED ACTIVE hype badges
hero = hero.replace(
    '<span class="chassis-badge">OPERATIONAL</span>',
    ''
);
hero = hero.replace(
    '<b><span class="live-pulse-dot"></span>VERIFIED ACTIVE</b>',
    '<b><span class="live-pulse-dot"></span>SABBIR HASAN</b>'
);

// Remove duplicate GitHub mini card from hero
const ghMiniCard = sliceBetween('<!-- Docked Real-Time GitHub Telemetry Activity Card -->', '\n            </div>\n        </div>\n\n        <!-- Tech Stack Marquee');
hero = hero.replace(ghMiniCard, '<!-- GitHub telemetry displayed in dedicated Development Pulse section below -->');

// Marquee: remove duplicate .marquee-group in HTML (initTechMarquee handles single infinite clone)
const duplicateMarqueeGroup = sliceBetween('\n                <div class="marquee-group" aria-hidden="true"', '\n            </div>\n        </div>\n\n    </section>');
hero = hero.replace(duplicateMarqueeGroup, '');

// 3. Bridge
const bridge = sliceBetween('<div class="hero-expertise-bridge"', '<!-- EXPERTISE —');

// 4. Expertise tabs
let expertise = sliceBetween('<!-- EXPERTISE —', '<!-- FEATURED PROJECTS —');
// Replace fake stats in Network HUD
expertise = expertise.replace(
    `<text x="20" y="17" class="hud-item">⚡ PACKET FLOW: <tspan class="hud-val hud-val-stream" id="hud-stream-counter">52.8 kpps</tspan></text>
                            <text x="240" y="17" class="hud-item">⏱ LATENCY: <tspan class="hud-val" id="hud-latency-counter">1.1 ms</tspan></text>
                            <text x="410" y="17" class="hud-item">🛡 LOSS: <tspan class="hud-val">0.00%</tspan></text>
                            <text x="570" y="17" class="hud-item">● TOPOLOGY: <tspan class="hud-val-green" id="hud-topo-status">OPTIMAL</tspan></text>`,
    `<text x="20" y="17" class="hud-item">⚡ PROTOCOL: <tspan class="hud-val">OSPF / BGP</tspan></text>
                            <text x="230" y="17" class="hud-item">🛡 SEGMENTATION: <tspan class="hud-val">802.1Q VLAN</tspan></text>
                            <text x="450" y="17" class="hud-item">🔒 DEFENSE: <tspan class="hud-val">STATEFUL ACL</tspan></text>
                            <text x="640" y="17" class="hud-item">● TOPOLOGY: <tspan class="hud-val-green" id="hud-topo-status">OPTIMAL</tspan></text>`
);
// Replace fake stats in Cybersecurity HUD
expertise = expertise.replace(
    `<text x="20" y="17" class="hud-item">🛡 DEFENSE STATUS: <tspan class="hud-val-green">ARMORED</tspan></text>
                            <text x="230" y="17" class="hud-item">⛔ THREATS BLOCKED: <tspan class="hud-val">1,842</tspan></text>
                            <text x="440" y="17" class="hud-item">🔒 CIPHER: <tspan class="hud-val">TLS 1.3 / AES-GCM</tspan></text>
                            <text x="650" y="17" class="hud-item">● ZERO TRUST: <tspan class="hud-val-green">ENFORCED</tspan></text>`,
    `<text x="20" y="17" class="hud-item">🛡 DEFENSE: <tspan class="hud-val-green">DEFENSE-IN-DEPTH</tspan></text>
                            <text x="240" y="17" class="hud-item">🔍 INSPECTION: <tspan class="hud-val">PACKET &amp; FLOW</tspan></text>
                            <text x="460" y="17" class="hud-item">🔒 ENCRYPTION: <tspan class="hud-val">TLS 1.3 / IPSEC</tspan></text>
                            <text x="650" y="17" class="hud-item">● POSTURE: <tspan class="hud-val-green">LEAST PRIVILEGE</tspan></text>`
);
// Replace fake stats in Full-Stack HUD
expertise = expertise.replace(
    `<text x="20" y="17" class="hud-item">⏱ LATENCY: <tspan class="hud-val-green">14 ms (TTFB)</tspan></text>
                            <text x="240" y="17" class="hud-item">⚡ STATUS: <tspan class="hud-val">200 OK</tspan></text>
                            <text x="440" y="17" class="hud-item">📦 PAYLOAD: <tspan class="hud-val">2.8 KB gzip</tspan></text>
                            <text x="640" y="17" class="hud-item">● CACHE: <tspan class="hud-val-green">EDGE HIT</tspan></text>`,
    `<text x="20" y="17" class="hud-item">⚡ RUNTIME: <tspan class="hud-val-green">NODE.JS / LINUX</tspan></text>
                            <text x="230" y="17" class="hud-item">🛠 ARCHITECTURE: <tspan class="hud-val">MODULAR MVC</tspan></text>
                            <text x="450" y="17" class="hud-item">📦 CACHE: <tspan class="hud-val">IN-MEMORY / PROXY</tspan></text>
                            <text x="670" y="17" class="hud-item">● PROTOCOL: <tspan class="hud-val-green">REST / WS</tspan></text>`
);
// Replace fake stats in Digital Marketing HUD
expertise = expertise.replace(
    `<text x="20" y="17" class="hud-item">📈 ORGANIC TRAFFIC: <tspan class="hud-val-green">+340% YoY</tspan></text>
                            <text x="250" y="17" class="hud-item">⚡ CORE WEB VITALS: <tspan class="hud-val">100 / 100</tspan></text>
                            <text x="470" y="17" class="hud-item">🎯 CTR: <tspan class="hud-val">6.4%</tspan></text>
                            <text x="640" y="17" class="hud-item">● SCHEMA: <tspan class="hud-val-green">INDEXED</tspan></text>`,
    `<text x="20" y="17" class="hud-item">📈 AUDIT: <tspan class="hud-val-green">TECHNICAL SEO</tspan></text>
                            <text x="240" y="17" class="hud-item">⚡ METRICS: <tspan class="hud-val">CORE WEB VITALS</tspan></text>
                            <text x="460" y="17" class="hud-item">🎯 MARKUP: <tspan class="hud-val">SCHEMA / JSON-LD</tspan></text>
                            <text x="650" y="17" class="hud-item">● CRAWL: <tspan class="hud-val-green">INDEX READY</tspan></text>`
);
// Replace fake stats in Database HUD
expertise = expertise.replace(
    `<text x="20" y="17" class="hud-item">💾 ENGINE: <tspan class="hud-val-green">INNODB CLUSTER</tspan></text>
                            <text x="240" y="17" class="hud-item">⚡ QUERY: <tspan class="hud-val">0.3 ms</tspan></text>
                            <text x="440" y="17" class="hud-item">🔄 REPLICATION: <tspan class="hud-val-green">SYNCED (0 LAG)</tspan></text>
                            <text x="650" y="17" class="hud-item">● ACID: <tspan class="hud-val-green">ENFORCED</tspan></text>`,
    `<text x="20" y="17" class="hud-item">💾 ENGINE: <tspan class="hud-val-green">MYSQL / INNODB</tspan></text>
                            <text x="230" y="17" class="hud-item">⚡ OPTIMIZATION: <tspan class="hud-val">INDEXED QUERIES</tspan></text>
                            <text x="450" y="17" class="hud-item">🔄 INTEGRITY: <tspan class="hud-val-green">FOREIGN KEYS</tspan></text>
                            <text x="650" y="17" class="hud-item">● COMPLIANCE: <tspan class="hud-val-green">ACID MODEL</tspan></text>`
);

// 5. Featured Projects
let projects = sliceBetween('<!-- FEATURED PROJECTS —', '<!-- TECHNOLOGY ECOSYSTEM —');
projects = projects.replace(
    '<p class="project-archive-state">Loading live systems from repository database...</p>',
    `<div class="section-fallback-box" style="margin: 2rem 0;">
                <p class="section-fallback-msg">Loading featured systems from repository database...</p>
            </div>`
);

// 6. About
let about = sliceBetween('<!-- ABOUT —', '<!-- EXPERIENCE —');
about = about.replace('<span class="section-label">06 — Profile</span>', '<span class="section-label">03 — Profile</span>');

// 7. Experience
let experience = sliceBetween('<!-- EXPERIENCE —', '<!-- EDUCATION —');
experience = experience.replace('<span class="section-label">07 — Career Log</span>', '<span class="section-label">04 — Career Log</span>');
experience = experience.replace(
    '<p class="section-loading">Career records are loading from the admin system.</p>',
    `<div class="section-fallback-box" style="margin: 2rem 0;">
                <p class="section-fallback-msg">Loading career records from system...</p>
            </div>`
);

// 8. Education
let education = sliceBetween('<!-- EDUCATION —', '<!-- CERTIFICATES -->');
education = education.replace('<span class="section-label">08 — Education</span>', '<span class="section-label">05 — Education</span>');
education = education.replace(
    '<p class="section-loading">Education records are loading from the admin system.</p>',
    `<div class="section-fallback-box" style="margin: 2rem 0;">
                <p class="section-fallback-msg">Loading education records from system...</p>
            </div>`
);

// 9. Certificates
let certificates = sliceBetween('<!-- CERTIFICATES -->', '<!-- LEARNING —');
certificates = certificates.replace('<span class="section-label">09 — Credentials</span>', '<span class="section-label">06 — Credentials</span>');
certificates = certificates.replace(
    '<p class="section-loading">Credentials are loading from the admin system.</p>',
    `<div class="section-fallback-box" style="margin: 2rem 0;">
                <p class="section-fallback-msg">Loading credentials from system...</p>
            </div>`
);

// 10. NEW Explore More Strip (replacing sections 10, 11, 12, 14)
const exploreMore = `
    <!-- 07 — EXPLORE MORE STRIP (Replacing individual preview sections with a lean high-value strip) -->
    <section class="section explore-more-section" id="explore-more" data-section-key="explore-more">
        <div class="section-header reveal">
            <div>
                <span class="section-label">07 — Explore Hubs</span>
                <h2 class="section-title">Specialized <span>Portals &amp; Tools</span></h2>
            </div>
            <p class="section-sidecopy">Dedicated learning tracks, interactive network utilities, technical articles, and broadcast presentations.</p>
        </div>
        <div class="explore-strip-grid reveal">
            <!-- Card 1: Blog -->
            <div class="explore-card">
                <div>
                    <div class="explore-card-top">
                        <span class="explore-card-icon" aria-hidden="true">📝</span>
                        <span class="explore-card-kicker">TECHNICAL JOURNAL</span>
                    </div>
                    <h3 class="explore-card-title">Field Notes &amp; Blog</h3>
                    <p class="explore-card-desc">Practical engineering write-ups on Cisco CCNA, routing protocols, cybersecurity defenses, and modern web systems.</p>
                </div>
                <a href="/blog" class="explore-card-link"><span>Read Articles</span> <span aria-hidden="true">↗</span></a>
            </div>

            <!-- Card 2: Tools -->
            <div class="explore-card">
                <div>
                    <div class="explore-card-top">
                        <span class="explore-card-icon" aria-hidden="true">⚡</span>
                        <span class="explore-card-kicker">ENGINEERING UTILITIES</span>
                    </div>
                    <h3 class="explore-card-title">Interactive Tools</h3>
                    <p class="explore-card-desc">Browser-based IPv4 CIDR subnetting calculator, network mask visualizer, and developer productivity utilities.</p>
                </div>
                <a href="/tools" class="explore-card-link"><span>Launch Utilities</span> <span aria-hidden="true">↗</span></a>
            </div>

            <!-- Card 3: Learning -->
            <div class="explore-card">
                <div>
                    <div class="explore-card-top">
                        <span class="explore-card-icon" aria-hidden="true">🌐</span>
                        <span class="explore-card-kicker">CURATED TRACKS</span>
                    </div>
                    <h3 class="explore-card-title">Learning Hub</h3>
                    <p class="explore-card-desc">Comprehensive curriculum covering Cisco CCNA 200-301 in Bangla, JavaScript A-Z, and MySQL database engineering.</p>
                </div>
                <a href="/Learn/Learn-CCNA/learn-ccna" class="explore-card-link"><span>Start Learning</span> <span aria-hidden="true">↗</span></a>
            </div>

            <!-- Card 4: Streams -->
            <div class="explore-card">
                <div>
                    <div class="explore-card-top">
                        <span class="explore-card-icon" aria-hidden="true">📡</span>
                        <span class="explore-card-kicker">BROADCAST STUDIO</span>
                    </div>
                    <h3 class="explore-card-title">Streams &amp; Media</h3>
                    <p class="explore-card-desc">Live technology presentations, architecture walkthroughs, lab demos, and recorded engineering broadcasts.</p>
                </div>
                <a href="/streams" class="explore-card-link"><span>Watch Streams</span> <span aria-hidden="true">↗</span></a>
            </div>
        </div>
    </section>
`;

// 11. Development Pulse
let development = sliceBetween('<!-- DEVELOPMENT —', '<!-- 14 — BROADCAST STUDIO');
development = development.replace('<span class="section-label">13 — Development Pulse</span>', '<span class="section-label">08 — Development Pulse</span>');
development = development.replace(
    'href="#" target="_blank" rel="noopener"',
    'href="https://github.com/Sabbir-Hasan-670?tab=repositories" target="_blank" rel="noopener"'
);

// 12. Contact
let contact = sliceBetween('<section class="section contact-cta"', '<footer class="site-footer"');
contact = `\n    <!-- 09 — CONTACT & DISPATCH CHANNEL -->\n    ` + contact;
// Remove ENCRYPTED badge in terminal header
contact = contact.replace('<span class="terminal-badge">ENCRYPTED</span>', '');
// Consistent location
contact = contact.replace(
    '<span class="node-val" id="contact-location-display">Faridpur, Bangladesh</span>',
    '<span class="node-val" id="contact-location-display">Dhaka, Bangladesh · Remote</span>'
);
// Phone item hidden initially
contact = contact.replace(
    '<div class="contact-node-card" id="contact-phone-item" hidden>',
    '<div class="contact-node-card" id="contact-phone-item" hidden style="display: none;">'
);

// 13. Footer & End
let footerAndEnd = original.substring(original.indexOf('<footer class="site-footer"'));
// Copyright link to /admin/login removed completely (plain text only)
footerAndEnd = footerAndEnd.replace(
    '&copy; <span id="year">2026</span> <a href="/admin/login" class="footer-owner-link">Sabbir Hasan</a>. All rights reserved.',
    '&copy; <span id="year">2026</span> Sabbir Hasan. All rights reserved.'
);
// Specializations link
footerAndEnd = footerAndEnd.replace('<li><a href="/#cybersecurity">Cybersecurity SOC</a></li>', '<li><a href="/#services">Cybersecurity Systems</a></li>');
// Facebook link in footer
footerAndEnd = footerAndEnd.replace(
    '<li id="footer-item-facebook" style="display: none;"><a href="#" target="_blank" rel="noopener" id="footer-link-facebook">Facebook Network ↗</a></li>',
    '<li id="footer-item-facebook"><a href="https://www.facebook.com/sabbirhasan800" target="_blank" rel="noopener" id="footer-link-facebook">Facebook Network ↗</a></li>'
);
// Station loc
footerAndEnd = footerAndEnd.replace('id="footer-station-loc">Faridpur, BD</span>', 'id="footer-station-loc">Dhaka, Bangladesh · Remote</span>');
// Telemetry row clean up (remove TLS 1.3 SECURE and ZERO-TRUST)
footerAndEnd = footerAndEnd.replace(
    `<div class="telemetry-item">
                    <span class="telemetry-k">ENCRYPTION</span>
                    <span class="telemetry-v">TLS 1.3 SECURE</span>
                </div>
                <div class="telemetry-separator">/</div>
                <div class="telemetry-item">
                    <span class="telemetry-k">ZONE</span>
                    <span class="telemetry-v">ASIA-PACIFIC (BD)</span>
                </div>
                <div class="telemetry-separator">/</div>
                <div class="telemetry-item">
                    <span class="telemetry-k">DISCIPLINE</span>
                    <span class="telemetry-v">ZERO-TRUST</span>
                </div>`,
    `<div class="telemetry-item">
                    <span class="telemetry-k">TIMEZONE</span>
                    <span class="telemetry-v">ASIA/DHAKA (UTC+6)</span>
                </div>
                <div class="telemetry-separator">/</div>
                <div class="telemetry-item">
                    <span class="telemetry-k">LOCATION</span>
                    <span class="telemetry-v">DHAKA, BANGLADESH</span>
                </div>
                <div class="telemetry-separator">/</div>
                <div class="telemetry-item">
                    <span class="telemetry-k">ENGINEERING</span>
                    <span class="telemetry-v">FULL-STACK &amp; NETWORKS</span>
                </div>`
);

// Assemble complete document
const output = [
    headAndNav,
    hero,
    bridge,
    expertise,
    projects,
    about,
    experience,
    education,
    certificates,
    exploreMore,
    development,
    contact,
    footerAndEnd
].join('\n');

const outputPath = path.join(__dirname, '..', 'public', 'index.html');
fs.writeFileSync(outputPath, output, 'utf8');

console.log('Successfully wrote clean public/index.html (' + output.length + ' bytes)');
