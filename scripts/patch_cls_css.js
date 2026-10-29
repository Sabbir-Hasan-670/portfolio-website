const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../public/home-v5.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Fix .hero-ambient-glow to prevent CLS
const oldAmbientGlow = `.hero-ambient-glow {
    position: absolute;
    inset: -15% -10% -10%;
    pointer-events: none;
    z-index: -2;
    overflow: hidden;
    contain: paint;
}`;

const newAmbientGlow = `.hero-ambient-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    overflow: hidden;
    contain: strict;
}`;

if (css.includes(oldAmbientGlow)) {
    css = css.replace(oldAmbientGlow, newAmbientGlow);
    console.log('✅ Updated .hero-ambient-glow to contain: strict and 100% dimensions');
} else {
    // If exact match failed, replace by regex
    css = css.replace(/\.hero-ambient-glow\s*\{[^}]+\}/, newAmbientGlow);
    console.log('✅ Replaced .hero-ambient-glow by regex');
}

// 2. Add stable min-heights and typing wrapper constraints
const stabilityStyles = `
/* ================================================= */
/* ⚡ CORE WEB VITALS: ZERO CLS & STABLE MIN-HEIGHTS */
/* ================================================= */
.hero {
    min-height: clamp(680px, 90vh, 900px);
}

.hero-terminal-deck {
    min-height: 80px;
}

.terminal-deck-content {
    min-height: 38px;
}

.deck-typing-wrap {
    display: inline-flex !important;
    align-items: center;
    color: #38bdf8;
    white-space: nowrap;
    min-width: 260px !important;
    min-height: 1.5em;
    vertical-align: middle;
}

#typingText {
    min-height: 1.2em;
    display: inline-block;
}

/* Reserved space for API-driven sections to eliminate CLS */
#projects-grid {
    min-height: 480px;
}

#experience-timeline {
    min-height: 280px;
}

#education-timeline {
    min-height: 220px;
}

#certificates-grid {
    min-height: 260px;
}

#heroVisualStage {
    min-height: 460px;
}

.flank-card {
    min-height: 68px;
}

.portrait-chassis {
    aspect-ratio: 0.86;
}

.portrait-window {
    aspect-ratio: 1 / 1 !important;
    width: 100%;
    overflow: hidden;
}

.portrait-window img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
}

/* Disable layout-shifting animations */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
`;

if (!css.includes('CORE WEB VITALS: ZERO CLS')) {
    css += '\n' + stabilityStyles;
    console.log('✅ Added stability styles to home-v5.css');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('🎉 Successfully updated home-v5.css!');

