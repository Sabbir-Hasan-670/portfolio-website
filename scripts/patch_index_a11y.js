const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add LLM context alternate link in <head> if missing
if (!html.includes('href="/llms.txt"')) {
    html = html.replace('</head>', '    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context">\n</head>');
}

// 2. Add skip-link after <body>
if (!html.includes('class="skip-link"')) {
    html = html.replace('<body>', '<body>\n\n<a href="#main" class="skip-link">Skip to main content</a>');
}

// 3. Wrap <nav class="navbar" id="navbar"> in <header role="banner"> and add aria-label
if (!html.includes('<header role="banner">')) {
    html = html.replace('<nav class="navbar" id="navbar">', '<header role="banner">\n    <nav class="navbar" id="navbar" aria-label="Main Navigation">');
    // find closing </nav> after dropdown
    // Note: <div class="nav-menu-dropdown" id="navDropdown"> is inside <nav>
    html = html.replace('</div><!-- end nav-inner -->\n    </nav>', '</div><!-- end nav-inner -->\n    </nav>\n    </header>');
    // If comment wasn't there, check for regular closing </nav>
    if (!html.includes('</header>')) {
        // Let's find </nav> that closes the navbar
        html = html.replace('</nav>\n\n    <!-- 01 - HERO -->', '</nav>\n    </header>\n\n    <!-- 01 - HERO -->');
        if (!html.includes('</header>')) {
            html = html.replace('</nav>', '</nav>\n    </header>');
        }
    }
}

// 4. Transform <div class="main-content"> to <main id="main" class="main-content">
// And ensure it closes before <footer>
if (html.includes('<div class="main-content">')) {
    html = html.replace('<div class="main-content">', '<main id="main" class="main-content">');
}

// Check where main-content closes: currently at line 1572 after video modal
// Let's close </main> before <footer class="footer-v5" id="station-footer">
if (html.includes('<footer class="footer-v5"') && !html.includes('</main>\n\n    <!-- FOOTER -->')) {
    // Check if </main> exists before footer
    const footerIdx = html.indexOf('<footer class="footer-v5"');
    const mainCloseIdx = html.indexOf('</main>');
    if (mainCloseIdx === -1 || mainCloseIdx > footerIdx) {
        html = html.replace('<footer class="footer-v5"', '</main>\n\n    <footer class="footer-v5"');
        // and remove the extra </div><!-- end main-content --> at the end if it was replaced with </main>
        html = html.replace('</div><!-- end main-content -->', '');
    }
}

// 5. Update footer headings from h4 to h3
html = html.replace(/<h4 class="footer-col-title">/g, '<h3 class="footer-col-title">');
html = html.replace(/<\/h4>(\s*<ul class="footer-links-list">)/g, '</h3>$1');

// 6. Fix honeypot field label
html = html.replace('<label>// LEAVE THIS EMPTY</label>', '<label for="website_url">// LEAVE THIS EMPTY</label>');

// 7. Fix development-github-graph dimensions and aspect-ratio
html = html.replace(/<img id="development-github-graph" alt="GitHub contribution activity" width="\d+" height="\d+"/g,
    '<img id="development-github-graph" alt="GitHub contribution activity" width="663" height="104"');

// 8. Remove duplicate script <script src="/global-profile.js?v=3"></script>
const scriptTag = '<script src="/global-profile.js?v=3"></script>';
const firstIdx = html.indexOf(scriptTag);
if (firstIdx !== -1) {
    const secondIdx = html.indexOf(scriptTag, firstIdx + scriptTag.length);
    if (secondIdx !== -1) {
        html = html.slice(0, secondIdx) + html.slice(secondIdx + scriptTag.length);
    }
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ public/index.html patched with A11y landmarks & semantic tags');

