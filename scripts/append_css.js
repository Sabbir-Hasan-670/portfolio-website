const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'home-v5.css');
let css = fs.readFileSync(cssPath, 'utf8');

const additions = `
/* ==========================================================================
   HOMEPAGE CLEANUP: EXPLORE MORE STRIP & ROBUST SKELETONS / FALLBACKS
   ========================================================================== */

.explore-more-section {
    position: relative;
    padding: 5.5rem 0;
    width: min(100% - 3rem, 1280px);
    max-width: 1280px;
    margin-inline: auto;
}

.explore-strip-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 2.5rem;
}

.explore-card {
    position: relative;
    background: rgba(12, 18, 30, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
}

.explore-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.08), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.explore-card:hover {
    transform: translateY(-4px);
    border-color: rgba(56, 189, 248, 0.35);
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
}

.explore-card:hover::before {
    opacity: 1;
}

.explore-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.explore-card-icon {
    font-size: 1.75rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.explore-card-kicker {
    font: 600 0.72rem var(--font-mono, monospace);
    color: var(--cyan, #38bdf8);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.explore-card-title {
    font: 700 1.15rem 'Outfit', sans-serif;
    color: #f1f5f9;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.01em;
}

.explore-card-desc {
    font: 400 0.88rem/1.5 'Plus Jakarta Sans', sans-serif;
    color: #94a3b8;
    margin: 0 0 1.5rem 0;
    flex-grow: 1;
}

.explore-card-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font: 600 0.82rem var(--font-mono, monospace);
    color: #f59e0b;
    text-decoration: none;
    transition: color 0.2s ease, gap 0.2s ease;
}

.explore-card-link:hover {
    color: #38bdf8;
    gap: 12px;
}

/* Skeletons & Fallback states */
.section-fallback-box {
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(12, 18, 30, 0.5);
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    width: 100%;
    margin: 1.5rem 0;
}

.section-fallback-msg {
    color: #94a3b8;
    font: 500 0.95rem 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 1rem;
}

.section-fallback-btn, .dev-fallback-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: #f59e0b;
    padding: 8px 18px;
    border-radius: 8px;
    font: 600 0.82rem var(--font-mono, monospace);
    text-decoration: none;
    transition: all 0.2s ease;
}

.section-fallback-btn:hover, .dev-fallback-link:hover {
    background: #f59e0b;
    color: #060913;
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.3);
}

.dev-graph-fallback {
    padding: 2.5rem 1.5rem;
    text-align: center;
    color: #94a3b8;
    font: 400 0.92rem 'Plus Jakarta Sans', sans-serif;
}

.dev-graph-fallback p {
    margin-bottom: 1rem;
}

/* Responsive for Explore Strip & Diagrams */
.expertise-map {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

@media (max-width: 1024px) {
    .explore-strip-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
}

@media (max-width: 640px) {
    .explore-strip-grid {
        grid-template-columns: 1fr;
    }
    .explore-more-section {
        padding: 3.5rem 0;
    }
}
`;

if (!css.includes('.explore-more-section')) {
    css += additions;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Appended additions to home-v5.css');
} else {
    console.log('Already includes .explore-more-section');
}
