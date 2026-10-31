/**
 * blogRenderer.js - Server-Side Crawlable Blog & Article Rendering Engine
 * Part of SabbirHasan.com SEO & Performance Architecture
 */


function slugifyCategory(cat) {
    if (!cat) return 'tech';
    return String(cat).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch(e) {
        return dateStr;
    }
}

function formatIsoDate(dateStr) {
    if (!dateStr) return new Date().toISOString();
    try {
        return new Date(dateStr).toISOString();
    } catch(e) {
        return new Date().toISOString();
    }
}

/**
 * Remove duplicate H1 from beginning of content if already rendered by template
 */
function stripFirstH1(content) {
    if (!content) return '';
    // Strip leading H1 that duplicates the title
    let clean = content.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
    // Convert ANY remaining <h1> inside article content into <h2>
    // This strictly guarantees ONLY ONE <h1> tag exists on the page (the main headline)
    clean = clean.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, '<h2$1>$2</h2>');
    return clean;
}

/**
 * Parse headings (H2, H3), inject unique IDs, and generate Table of Contents
 */
function processHeadingsAndToc(content) {
    if (!content) return { html: '', toc: [] };
    const toc = [];
    let counter = 0;

    const modifiedHtml = content.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, innerText) => {
        counter++;
        const plainText = stripHtml(innerText);
        let slugId = plainText
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        if (!slugId) slugId = `section-${counter}`;

        // Ensure id is not duplicate
        const existingCount = toc.filter(t => t.id === slugId).length;
        if (existingCount > 0) slugId = `${slugId}-${existingCount + 1}`;

        toc.push({
            level: tag.toLowerCase(),
            text: plainText,
            id: slugId
        });

        // Strip any existing id in attrs and add our new id
        const cleanAttrs = attrs.replace(/\sid=(['"])[^'"]*\1/gi, '');
        return `<${tag} id="${slugId}"${cleanAttrs}>${innerText}</${tag}>`;
    });

    return { html: modifiedHtml, toc };
}

/**
 * Enhance <pre><code> blocks with language badge and Copy Code button
 */
function processCodeBlocks(content) {
    if (!content) return '';
    return content.replace(/<pre[^>]*><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi, (match, codeAttrs, codeContent) => {
        let lang = 'TERMINAL';
        const classMatch = codeAttrs.match(/class=(['"])(?:language-)?([a-zA-Z0-9_-]+)\1/i);
        if (classMatch && classMatch[2]) {
            lang = classMatch[2].toUpperCase();
        }
        return `
        <div class="code-block-wrapper">
            <div class="code-header">
                <div class="mac-dots">
                    <span class="mac-dot red"></span>
                    <span class="mac-dot yellow"></span>
                    <span class="mac-dot green"></span>
                </div>
                <span class="code-lang">${escapeHtml(lang)}</span>
                <button class="copy-code-btn" onclick="copyCode(this)" aria-label="Copy code to clipboard">
                    <span class="copy-icon">📋</span> <span class="copy-text">Copy</span>
                </button>
            </div>
            <pre><code${codeAttrs}>${codeContent}</code></pre>
        </div>`;
    });
}

/**
 * Render Complete Blog Listing Page HTML
 */

const CATEGORY_EDITORIAL = {
    'digital-marketing': {
        eyebrow: 'DIGITAL MARKETING STRATEGY & GROWTH',
        title: 'Digital Marketing &amp; Social Media Strategy Guides',
        description: 'Explore in-depth articles, actionable case studies, and industry frameworks on digital marketing, organic search engine optimization (SEO), performance advertising, and cross-platform brand growth. Authored by Sabbir Hasan, these guides help small businesses, founders, and marketing professionals execute high-ROI digital campaigns.',
        guide: `
            <section class="category-guide-section" style="max-width: 960px; margin: 3rem auto 0; padding: 2.25rem; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; font-family: 'DM Sans', sans-serif;">
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--lime, #c8ff00); letter-spacing: 1px; margin-bottom: 0.5rem;">// TOPIC GUIDE &amp; OVERVIEW</div>
                <h2 style="font-family: 'Syne', sans-serif; font-size: 1.4rem; color: #f1f5f9; margin-bottom: 1rem;">Mastering Modern Digital Marketing &amp; Audience Acquisition</h2>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.25rem;">
                    In today's algorithmic landscape, digital marketing requires a multi-disciplinary balance between creative storytelling, technical search engine optimization, and rigorous data analytics. From organic content distribution on LinkedIn, Facebook, and Instagram to paid funnel optimization and conversion rate experiments, these publications deliver actionable, battle-tested methodologies.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-top: 1.25rem;">
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🎯 Audience Targeting &amp; Persona Mapping</h3>
                        <p>Learn how to identify high-intent demographic segments, conduct competitor keyword intelligence, and craft messaging that resonates with specific buyer personas.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">📊 Analytics &amp; Conversion Attribution</h3>
                        <p>Track multi-channel user journeys using Google Analytics 4, server-side event telemetry, and custom conversion funnels to maximize return on advertising spend (ROAS).</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🚀 Content Distribution &amp; Viral Loops</h3>
                        <p>Frameworks for repurposing core assets into short-form video scripts, carousel presentations, infographics, and email newsletter automations.</p>
                    </div>
                </div>
            </section>`
    },
    'ai-social-media-manager': {
        eyebrow: 'AI-DRIVEN SOCIAL WORKFLOWS & AUTOMATION',
        title: 'AI Social Media Management &amp; Automated Growth',
        description: 'Discover how modern social media managers leverage artificial intelligence, workflow automation tools, and predictive analytics to scale content production, boost engagement, and maintain cohesive brand voice across global social networks.',
        guide: `
            <section class="category-guide-section" style="max-width: 960px; margin: 3rem auto 0; padding: 2.25rem; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; font-family: 'DM Sans', sans-serif;">
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--lime, #c8ff00); letter-spacing: 1px; margin-bottom: 0.5rem;">// ROLE DEEP-DIVE &amp; AUTOMATION STACK</div>
                <h2 style="font-family: 'Syne', sans-serif; font-size: 1.4rem; color: #f1f5f9; margin-bottom: 1rem;">The Role of the Modern AI Social Media Manager</h2>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.25rem;">
                    The evolution of generative AI and automated analytics has transformed social media management from manual scheduling into a high-leverage strategic discipline. An AI social media manager combines prompt engineering, dynamic asset generation, automated copy refinement, and sentiment monitoring to manage multiple brand channels efficiently without sacrificing creative quality.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-top: 1.25rem;">
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🤖 Generative Copy &amp; Prompt Workflows</h3>
                        <p>Build custom system prompts to maintain consistent brand tone of voice, generate high-performing hooks, and optimize hashtags for each platform's algorithm.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">📈 Performance Prediction &amp; Sentiment Analysis</h3>
                        <p>Analyze engagement signals and audience comments with natural language processing to gauge customer sentiment and proactively adapt content calendars.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">⚡ Automated Publishing &amp; Asset Resizing</h3>
                        <p>Streamline asset pipeline using headless tools, automatic WebP compression, and cross-platform API dispatchers for Facebook, Instagram, LinkedIn, and X.</p>
                    </div>
                </div>
            </section>`
    }
};

function renderBlogListingHtml({ posts, totalPosts, currentPage, totalPages, currentCategory, categories, siteUrl }) {
    const displayCategory = currentCategory ? currentCategory.split(/[- ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : null;
    const catSlug = currentCategory ? slugifyCategory(currentCategory) : null;

    const canonicalUrl = catSlug
        ? (currentPage > 1 ? `${siteUrl}/blog/category/${catSlug}/page/${currentPage}` : `${siteUrl}/blog/category/${catSlug}`)
        : (currentPage > 1 ? `${siteUrl}/blog/page/${currentPage}` : `${siteUrl}/blog`);

    const pageTitle = displayCategory 
        ? `${escapeHtml(displayCategory)} Articles (Page ${currentPage}) | Sabbir Hasan`
        : (currentPage > 1 ? `Latest Articles — Page ${currentPage} | Sabbir Hasan Blog` : `Blog | Sabbir Hasan — Networking, Cybersecurity & Tech Articles`);

    const pageDesc = displayCategory
        ? `Read in-depth ${escapeHtml(displayCategory)} tutorials, articles and practical guides by Sabbir Hasan.`
        : `Read latest technical articles by Sabbir Hasan on CCNA networking, cybersecurity, full-stack web development, and Linux administration from Bangladesh.`;

    const prevPageUrl = currentPage > 1
        ? (catSlug ? `/blog/category/${catSlug}/page/${currentPage - 1}` : `/blog/page/${currentPage - 1}`)
        : null;

    const nextPageUrl = currentPage < totalPages
        ? (catSlug ? `/blog/category/${catSlug}/page/${currentPage + 1}` : `/blog/page/${currentPage + 1}`)
        : null;

    const categoryPillsHtml = `
        <a href="/blog" class="cat-pill ${!currentCategory ? 'active' : ''}">All Articles</a>
        ${categories.map(c => `
            <a href="/blog/category/${slugifyCategory(c.category)}" class="cat-pill ${catSlug && catSlug === slugifyCategory(c.category) ? 'active' : ''}">
                ${escapeHtml(c.category)} <span class="cat-count">(${c.count})</span>
            </a>
        `).join('')}
    `;

    const postsGridHtml = posts.length > 0 ? posts.map(post => {
        const postSlug = escapeHtml(post.slug || post.id);
        const postTitle = escapeHtml(post.title || 'Untitled Article');
        const postExcerpt = escapeHtml(post.excerpt || stripHtml(post.content).slice(0, 160) + '...');
        const postCategory = escapeHtml(post.category || 'Tech');
        const readingTime = escapeHtml(post.reading_time || '4 min read');
        const formattedDate = formatDate(post.created_at);
        const imgUrl = post.image_path ? escapeHtml(post.image_path) : '/og-image.png';

        return `
        <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
            <a href="/blog/${postSlug}" class="blog-card-img-link" tabindex="-1" aria-hidden="true">
                <img src="${imgUrl}" alt="${postTitle}" class="blog-img" loading="lazy" decoding="async" width="600" height="340" itemprop="image">
            </a>
            <div class="blog-body">
                <div class="blog-meta-bar">
                    <a href="/blog/category/${slugifyCategory(post.category || 'tech')}" class="blog-category" itemprop="articleSection">${postCategory}</a>
                    <span class="blog-reading-time">⏱️ ${readingTime}</span>
                </div>
                <h2 class="blog-title" itemprop="headline">
                    <a href="/blog/${postSlug}">${postTitle}</a>
                </h2>
                <p class="blog-excerpt" itemprop="description">${postExcerpt}</p>
                <div class="blog-footer-row">
                    <span class="blog-date" itemprop="datePublished" content="${formatIsoDate(post.created_at)}">📅 ${formattedDate}</span>
                    <a href="/blog/${postSlug}" class="read-more" aria-label="Read full article: ${postTitle}">Read Article <span aria-hidden="true">→</span></a>
                </div>
            </div>
        </article>`;
    }).join('') : `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: rgba(10, 14, 28, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; margin: 1rem 0 3rem; backdrop-filter: blur(12px);">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 14px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); color: #38bdf8; font-size: 1.75rem; margin-bottom: 1.25rem;">
                📝
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.75rem; font-family: 'Syne', sans-serif;">Technical Articles Coming Soon</h2>
            <p style="color: #94a3b8; max-width: 520px; margin: 0 auto 1.75rem; font-size: 0.95rem; line-height: 1.6;">
                In-depth field notes on Cisco CCNA networking, Linux server administration, and cybersecurity defense are currently being drafted. Stay tuned for new publications!
            </p>
            <a href="/" style="display: inline-flex; align-items: center; gap: 8px; padding: 0.75rem 1.5rem; background: rgba(200, 255, 0, 0.1); border: 1px solid #c8ff00; border-radius: 8px; color: #c8ff00; text-decoration: none; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.88rem; transition: all 0.2s ease;">
                ← Return to Home
            </a>
        </div>`;

    // Pagination links
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml = `
        <nav class="pagination-nav" aria-label="Blog pagination">
            ${prevPageUrl ? `<a href="${prevPageUrl}" class="page-btn prev-btn" rel="prev" aria-label="Previous Page">← Previous</a>` : `<span class="page-btn disabled" aria-hidden="true">← Previous</span>`}
            <div class="page-numbers">
                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    const pageHref = catSlug
                        ? (p === 1 ? `/blog/category/${catSlug}` : `/blog/category/${catSlug}/page/${p}`)
                        : (p === 1 ? `/blog` : `/blog/page/${p}`);
                    return `<a href="${pageHref}" class="page-number ${p === currentPage ? 'active' : ''}" ${p === currentPage ? 'aria-current="page"' : ''}>${p}</a>`;
                }).join('')}
            </div>
            ${nextPageUrl ? `<a href="${nextPageUrl}" class="page-btn next-btn" rel="next" aria-label="Next Page">Next →</a>` : `<span class="page-btn disabled" aria-hidden="true">Next →</span>`}
        </nav>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- ===== PRIMARY SEO ===== -->
    <title>${pageTitle}</title>
    <meta name="description" content="${escapeHtml(pageDesc)}">
    <meta name="author" content="Sabbir Hasan">
    ${(currentPage > 1) ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">'}
    <link rel="canonical" href="${canonicalUrl}">
    ${prevPageUrl ? `<link rel="prev" href="${siteUrl}${prevPageUrl}">` : ''}
    ${nextPageUrl ? `<link rel="next" href="${siteUrl}${nextPageUrl}">` : ''}

    <!-- ===== OPEN GRAPH ===== -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${escapeHtml(pageDesc)}">
    <meta property="og:image" content="${siteUrl}/og-image.png">
    <meta property="og:site_name" content="Sabbir Hasan">
    <meta property="og:locale" content="en_US">

    <!-- ===== TWITTER CARD ===== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}">
    <meta name="twitter:image" content="${siteUrl}/og-image.png">

    <!-- ===== MOBILE & THEME ===== -->
    <meta name="theme-color" content="#060913">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- ===== FONTS & CSS ===== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/blog-v7.min.css?v=5">

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "${siteUrl}/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "${siteUrl}/blog"
        }
      ]
    }
    </script>
</head>
<body class="blog-page-body">
    <div class="scroll-progress" id="scrollProgress"></div>
    <div class="aurora-mesh">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
        <div class="aurora-blob aurora-blob-3"></div>
    </div>
    <canvas id="starCanvas"></canvas>

    <div class="main-content">
        <!-- NAVIGATION -->
        <nav class="navbar" id="navbar">
            <div class="nav-inner">
                <a href="/" class="nav-logo">SH.</a>
                <div class="nav-links" id="navLinks">
                    <a href="/" class="nav-visible-btn">Home</a>
                    <a href="/about" class="nav-visible-btn">About</a>
                    <a href="/resume" class="nav-visible-btn">Resume</a>
                    <a href="/blog" class="nav-visible-btn" style="color:var(--lime);">Blog</a>
                    <a href="/tools" class="nav-visible-btn">Tools</a>
                    <a href="/contact" class="nav-cta">Contact</a>
                    <button class="hamburger" id="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button>
                    <div class="nav-menu-dropdown" id="navDropdown">
                        <a href="/about">About</a>
                        <a href="/resume">Resume</a>
                        <a href="/#projects">Projects</a>
                        <a href="/#experience">Experience</a>
                        <a href="/#education">Education</a>
                        <a href="/tools">Interactive Tools</a>
                        <a href="/contact" class="nav-cta">Let's Talk</a>
                    </div>
                </div>
            </div>
        </nav>

        <main class="blog-listing-section">
            <header class="blog-hero-header reveal active">
                <div class="blog-eyebrow"><span class="blog-dot"></span> ${displayCategory ? 'CATEGORY ARCHIVE' : 'ENGINEERING NOTES'}</div>
                <h1 class="blog-hero-title">${displayCategory ? escapeHtml(displayCategory) + ' <span>Articles</span>' : 'Technical <span>Articles</span> &amp; Guides'}</h1>
                <p class="blog-hero-desc">${displayCategory ? (catSlug && CATEGORY_EDITORIAL[catSlug] ? CATEGORY_EDITORIAL[catSlug].description : 'Practical tutorials, strategic insights, and field notes filed under ' + escapeHtml(displayCategory) + '.') : 'Practical field guides on Cisco enterprise networking, cybersecurity defenses, Linux administration, and modern digital marketing strategies. Authored by Sabbir Hasan from real-world production systems and hands-on laboratory experience.'}</p>
            </header>

            <!-- SEARCH & FILTERS -->
            <div class="blog-controls-wrapper" ${totalPosts === 0 ? 'style="display:none;"' : ''}>
                <div class="search-box-container">
                    <span class="search-icon">🔍</span>
                    <input type="search" id="blogSearchInput" placeholder="Search articles by title, topic, or keyword..." aria-label="Search articles" autocomplete="off">
                    <span id="searchSpinner" class="search-spinner" style="display:none;">⏳</span>
                </div>
                <div class="category-pills-bar" id="categoryPills">
                    ${categoryPillsHtml}
                </div>
            </div>

            <!-- LIVE SEARCH RESULTS CONTAINER (Overlays when searching) -->
            <div id="liveSearchResults" class="live-search-results" style="display:none;"></div>

            <!-- SERVER-RENDERED ARTICLE GRID (Crawlable by default) -->
            <div class="blog-grid" id="blogGrid">
                ${postsGridHtml}
            </div>

            <!-- CRAWLABLE PAGINATION -->
            <div class="pagination-wrapper" id="paginationWrapper">
                ${paginationHtml}
            </div>
        
            ${catSlug && CATEGORY_EDITORIAL[catSlug] ? CATEGORY_EDITORIAL[catSlug].guide : ''}

            <!-- EDITORIAL PUBLICATION SCOPE (TOPICAL AUTHORITY) -->
            <section class="blog-editorial-scope" style="max-width: 960px; margin: 3rem auto 0; padding: 2.5rem; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; font-family: 'DM Sans', sans-serif;">
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--lime, #c8ff00); letter-spacing: 1px; margin-bottom: 0.5rem;">// EDITORIAL PUBLICATION SCOPE</div>
                <h2 style="font-family: 'Syne', sans-serif; font-size: 1.4rem; color: #f1f5f9; margin-bottom: 1rem;">Engineering Curriculum &amp; Field Notes</h2>
                <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">
                    This technical publication covers practical computer networking, defensive cybersecurity, full-stack systems architecture, and Linux server administration. Each upcoming article is written from real-world laboratory exercises, verified Packet Tracer topologies, and production deployment experience.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; color: #94a3b8; font-size: 0.9rem; line-height: 1.6;">
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🌐 Cisco CCNA &amp; Routing</h3>
                        <p>Detailed breakdowns of OSPF dynamic routing, 802.1Q VLAN segmentation, inter-VLAN routing, and Access Control Lists using Cisco Packet Tracer simulations.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🛡️ Cybersecurity &amp; Defense</h3>
                        <p>Field guides on Linux server hardening, port scanning analysis with Nmap, OWASP web application defense, and secure credential governance.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">⚡ Full-Stack &amp; Databases</h3>
                        <p>Architectural walkthroughs of Node.js micro-services, MySQL relational schemas, ACID transaction handling, and client-side web performance.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">⚙️ Linux Admin &amp; DevOps</h3>
                        <p>Hands-on tutorials for Ubuntu server deployment, PM2 process management, Nginx reverse proxy routing, and SSL certificate lifecycles.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">📡 Packet Flow &amp; Telemetry</h3>
                        <p>Packet analysis routines with Wireshark, evaluating TCP sequence numbers, latency discovery, MTU path limits, and frame transmission across networks.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🔒 Network Access &amp; Subnets</h3>
                        <p>Step-by-step guides on IPv4 VLSM subnetting, CIDR prefix calculations, DHCP relay agents, and stateful perimeter firewall rule sets.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">📈 Digital Marketing &amp; SMM</h3>
                        <p>Actionable tactics for social media marketing, organic audience growth, viral content loops, and analytics tracking across Facebook, Instagram, and LinkedIn.</p>
                    </div>
                    <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <h3 style="color: #e2e8f0; font-size: 1.05rem; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif;">🎨 Graphic &amp; Logo Design</h3>
                        <p>Design principles for corporate brand identity, minimalist logo design, visual hierarchy, vector graphics, and high-converting marketing creatives.</p>
                    </div>
                </div>
            </section>
        </main>

        <!-- EXECUTIVE SITE FOOTER -->
        <footer class="blog-footer">
            <div class="blog-footer-inner">
                <div class="blog-footer-brand">
                    <div class="footer-brand-head">
                        <a href="/" class="footer-brand-link">
                            <span class="footer-logo-badge">SH.</span>
                            <span class="footer-brand-title">Sabbir Hasan</span>
                        </a>
                        <span class="footer-status-tag">Systems &amp; Full-Stack</span>
                    </div>
                    <p class="blog-footer-copy">
                        &copy; <span id="year">${new Date().getFullYear()}</span> Sabbir Hasan. All rights reserved.
                        <span class="copy-sep">·</span>
                        <span class="copy-desc">Autonomous Networks, Cloud &amp; High-Scale Engineering</span>
                    </p>
                </div>

                <div class="blog-footer-right">
                    <nav class="blog-footer-nav" aria-label="Footer navigation">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/resume">Resume</a>
                        <a href="/blog">Blog</a>
                        <a href="/tools">Tools</a>
                        <a href="/contact">Contact</a>
                    </nav>
                    <a href="#top" class="footer-top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'}); return false;" title="Scroll to top" aria-label="Back to top">
                        <span>Top</span> ↑
                    </a>
                </div>
            </div>
        </footer>
    </div>

    <script src="/main.js?v=4" defer></script>
    <script src="/toast.js" defer></script>
    <script src="/blog-search.js?v=2" defer></script>

</body>
</html>`;
}

/**
 * Render Complete Single Article Page HTML with full SEO, OpenGraph, Schema, TOC, and Code Blocks
 */
function renderArticleHtml({ post, relatedPosts = [], previousPost = null, nextPost = null, siteUrl, authorImage = '' }) {
    const postSlug = escapeHtml(post.slug || post.id);
    const rawPostTitle = (post.title || 'Untitled Article').trim();
    const postTitle = escapeHtml(rawPostTitle);

    let calculatedTitle = (post.meta_title && post.meta_title.trim()) || '';
    if (!calculatedTitle) {
        calculatedTitle = `${rawPostTitle} | Sabbir Hasan`;
    } else if (calculatedTitle.toLowerCase() === rawPostTitle.toLowerCase()) {
        calculatedTitle = `${calculatedTitle} | Sabbir Hasan`;
    } else if (!calculatedTitle.toLowerCase().includes('sabbir hasan')) {
        calculatedTitle = `${calculatedTitle} | Sabbir Hasan`;
    }
    const metaTitle = escapeHtml(calculatedTitle);
    const metaDesc = escapeHtml(post.meta_description || post.excerpt || stripHtml(post.content).slice(0, 160));
    const canonicalUrl = `${siteUrl}/blog/${postSlug}`;
    const category = escapeHtml(post.category || 'Technology');
    const readingTime = escapeHtml(post.reading_time || '4 min read');
    const publishedIso = formatIsoDate(post.created_at);
    const updatedIso = formatIsoDate(post.updated_at || post.created_at);
    const formattedPublishedDate = formatDate(post.created_at);
    const formattedUpdatedDate = formatDate(post.updated_at || post.created_at);
    const featuredImg = post.image_path ? escapeHtml(post.image_path) : '/og-image.png';
    const authorAvatar = escapeHtml(authorImage || '/uploads/sabbir-secondary-blue.webp');
    const tags = String(post.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
    const absoluteImgUrl = featuredImg.startsWith('http') ? featuredImg : `${siteUrl}${featuredImg}`;

    // Clean content: remove duplicate H1, process headings for TOC, process code blocks
    const contentWithoutH1 = stripFirstH1(post.content || '');
    const { html: contentWithHeadingIds, toc } = processHeadingsAndToc(contentWithoutH1);
    const finalContent = processCodeBlocks(contentWithHeadingIds);

    // Table of Contents HTML
    let tocHtml = '';
    if (toc.length >= 2) {
        tocHtml = `
        <aside class="article-toc-box" aria-label="Table of contents">
            <details class="toc-details" open>
                <summary class="toc-summary">
                    <span class="toc-title">📑 Table of Contents <span class="toc-badge">${toc.length} Sections</span></span>
                    <span class="toc-toggle-icon">▾</span>
                </summary>
                <nav class="toc-nav">
                    <ul class="toc-list">
                        ${toc.map((item, idx) => `
                            <li class="toc-item toc-${item.level}">
                                <a href="#${item.id}" class="toc-link">
                                    <span class="toc-num">${idx + 1}.</span> ${escapeHtml(item.text)}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
            </details>
        </aside>`;
    }

    // Related Posts HTML
    let relatedHtml = '';
    if (relatedPosts && relatedPosts.length > 0) {
        relatedHtml = `
        <section class="related-posts-section">
            <h2 class="related-title">Related <span>Articles</span></h2>
            <div class="blog-grid related-grid">
                ${relatedPosts.map(rel => `
                    <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                        <a href="/blog/${escapeHtml(rel.slug || rel.id)}" class="blog-card-img-link" tabindex="-1" aria-hidden="true">
                            <img src="${rel.image_path ? escapeHtml(rel.image_path) : '/og-image.png'}" alt="${escapeHtml(rel.title)}" class="blog-img" loading="lazy" width="400" height="225">
                        </a>
                        <div class="blog-body">
                            <div class="blog-meta-bar">
                                <span class="blog-category">${escapeHtml(rel.category || 'Tech')}</span>
                                <span class="blog-reading-time">⏱️ ${escapeHtml(rel.reading_time || '4 min read')}</span>
                            </div>
                            <h3 class="blog-title"><a href="/blog/${escapeHtml(rel.slug || rel.id)}">${escapeHtml(rel.title)}</a></h3>
                            <p class="blog-excerpt">${escapeHtml(rel.excerpt || stripHtml(rel.content).slice(0, 100) + '...')}</p>
                            <div class="blog-footer-row">
                                <a href="/blog/${escapeHtml(rel.slug || rel.id)}" class="read-more">Read Article <span>→</span></a>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- ===== PRIMARY SEO ===== -->
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDesc}">
    <meta name="author" content="Sabbir Hasan">
    ${['gaming', 'sports'].includes(String(post.category || '').trim().toLowerCase()) ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">'}
    <link rel="canonical" href="${canonicalUrl}">

    <!-- ===== OPEN GRAPH (Social Sharing & Rich Previews) ===== -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="${absoluteImgUrl}">
    <meta property="og:site_name" content="Sabbir Hasan">
    <meta property="og:locale" content="en_US">
    <meta property="article:published_time" content="${publishedIso}">
    <meta property="article:modified_time" content="${updatedIso}">
    <meta property="article:author" content="${siteUrl}/about">
    <meta property="article:section" content="${category}">

    <!-- ===== TWITTER CARD ===== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${absoluteImgUrl}">

    <!-- ===== MOBILE & THEME ===== -->
    <meta name="theme-color" content="#060913">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- ===== FONTS & CSS ===== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/blog-v7.min.css?v=5">

    <!-- ===== STRUCTURED DATA: Article & Breadcrumbs ===== -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${postTitle.replace(/"/g, '\\"')}",
      "description": "${metaDesc.replace(/"/g, '\\"')}",
      "image": ["${absoluteImgUrl}"],
      "author": {
        "@type": "Person",
        "@id": "${siteUrl}/#person",
        "name": "Sabbir Hasan",
        "url": "${siteUrl}/",
        "jobTitle": "Network Engineer & Full-Stack Developer"
      },
      "publisher": {
        "@id": "${siteUrl}/#person"
      },
      "datePublished": "${publishedIso}",
      "dateModified": "${updatedIso}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "${siteUrl}/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "${siteUrl}/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${category.replace(/"/g, '\\"')}",
          "item": "${siteUrl}/blog/category/${slugifyCategory(post.category || 'tech')}"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "${postTitle.replace(/"/g, '\\"')}",
          "item": "${canonicalUrl}"
        }
      ]
    }
    </script>
</head>
<body class="article-page-body">
    <!-- TOP READING PROGRESS TRACK -->
    <div class="reading-progress-track"><div class="reading-progress-fill" id="readingProgress"></div></div>

    <div class="aurora-mesh">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
        <div class="aurora-blob aurora-blob-3"></div>
    </div>
    <canvas id="starCanvas"></canvas>

    <div class="main-content">
        <!-- NAVIGATION -->
        <nav class="navbar" id="navbar">
            <div class="nav-inner">
                <a href="/" class="nav-logo">SH.</a>
                <div class="nav-links" id="navLinks">
                    <a href="/" class="nav-visible-btn">Home</a>
                    <a href="/about" class="nav-visible-btn">About</a>
                    <a href="/resume" class="nav-visible-btn">Resume</a>
                    <a href="/blog" class="nav-visible-btn" style="color:var(--lime);">Blog</a>
                    <a href="/tools" class="nav-visible-btn">Tools</a>
                    <a href="/contact" class="nav-cta">Contact</a>
                    <button class="hamburger" id="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button>
                    <div class="nav-menu-dropdown" id="navDropdown">
                        <a href="/about">About</a>
                        <a href="/resume">Resume</a>
                        <a href="/#projects">Projects</a>
                        <a href="/#experience">Experience</a>
                        <a href="/#education">Education</a>
                        <a href="/tools">Interactive Tools</a>
                        <a href="/contact" class="nav-cta">Let's Talk</a>
                    </div>
                </div>
            </div>
        </nav>

        <main class="article-wrapper">
            <!-- TOP ACTION BAR: BACK BUTTON + BREADCRUMBS -->
            <div class="article-top-action-bar">
                <a href="/blog" class="article-back-pill">
                    <span class="back-arrow">←</span> All Articles
                </a>
                <nav class="breadcrumb-bar" aria-label="Breadcrumbs">
                    <ol class="breadcrumb-list">
                        <li><a href="/">Home</a></li>
                        <li><span class="sep">/</span></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><span class="sep">/</span></li>
                        <li><a href="/blog/category/${slugifyCategory(post.category || 'tech')}">${category}</a></li>
                    </ol>
                </nav>
            </div>

            <article class="single-article-container" itemscope itemtype="https://schema.org/Article">
                <!-- ARTICLE HERO HEADER -->
                <header class="article-header">
                    <div class="article-category-badge-wrap">
                        <a href="/blog/category/${slugifyCategory(post.category || 'tech')}" class="blog-category">
                            <span class="cat-dot"></span>${category}
                        </a>
                        <span class="reading-time-pill">⏱️ ${readingTime}</span>
                        <span class="article-level-pill">⚡ Engineering Notes</span>
                    </div>

                    <h1 class="article-main-title" itemprop="headline">${postTitle}</h1>

                    ${post.excerpt ? `<p class="article-lead-deck" itemprop="description">${escapeHtml(post.excerpt)}</p>` : ''}

                    <div class="article-author-deck">
                        <div class="author-avatar-wrap">
                            <img src="${authorAvatar}" alt="Sabbir Hasan" class="author-avatar-small" data-profile-image width="48" height="48" onerror="this.onerror=null;this.src='/uploads/sabbir-secondary-blue.webp'">
                            <span class="author-badge-verified" title="Verified Author">✓</span>
                        </div>
                        <div class="author-meta-info">
                            <div class="author-name-row">
                                <a href="/about" class="author-name-link" rel="author">Sabbir Hasan</a>
                                <span class="author-role-chip">Network Engineer &amp; Developer</span>
                            </div>
                            <div class="article-pub-dates">
                                <span>📅 Published <time datetime="${publishedIso}" itemprop="datePublished">${formattedPublishedDate}</time></span>
                                ${post.updated_at ? `<span> · 🔄 Updated <time datetime="${updatedIso}" itemprop="dateModified">${formattedUpdatedDate}</time></span>` : ''}
                            </div>
                        </div>
                        <div class="header-share-quick">
                            <button type="button" class="quick-share-btn" onclick="copyArticleLink('${canonicalUrl}', this)" title="Copy Link">🔗</button>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="quick-share-btn" title="Share on LinkedIn">in</a>
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="quick-share-btn" title="Share on X">𝕏</a>
                        </div>
                    </div>
                </header>

                <!-- FEATURED HERO MEDIA -->
                ${post.image_path ? `
                <figure class="article-featured-media">
                    <div class="article-featured-bezel">
                        <img src="${featuredImg}" alt="${postTitle}" class="article-hero-img" loading="eager" decoding="async" width="1200" height="630" itemprop="image">
                        <div class="media-overlay-gradient"></div>
                    </div>
                    <figcaption class="media-caption">Technical reference &amp; visual blueprint by Sabbir Hasan</figcaption>
                </figure>
                ` : ''}

                <!-- TABLE OF CONTENTS (Auto-generated) -->
                ${tocHtml}

                <!-- ARTICLE EDITORIAL BODY CONTENT -->
                <div class="article-content-body" itemprop="articleBody">
                    ${finalContent}
                </div>

                <!-- INTERACTIVE ENGAGEMENT & SHARE BAR -->
                <div class="article-engagement-bar">
                    <div class="reaction-box">
                        <button type="button" class="reaction-btn" id="clapBtn" onclick="handleClap('${postSlug}')" aria-label="Applaud this article">
                            <span class="reaction-icon">👏</span>
                            <span class="reaction-label">Helpful</span>
                            <span class="reaction-count" id="clapCount">18</span>
                        </button>
                        <span class="reaction-hint">Found this breakdown useful? Leave an applaud!</span>
                    </div>

                    <div class="share-buttons-group">
                        <span class="share-hint">Share:</span>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn share-linkedin" aria-label="Share on LinkedIn">
                            LinkedIn
                        </a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn share-twitter" aria-label="Share on Twitter / X">
                            Twitter / X
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn share-facebook" aria-label="Share on Facebook">
                            Facebook
                        </a>
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + canonicalUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn share-whatsapp" aria-label="Share on WhatsApp">
                            WhatsApp
                        </a>
                        <button type="button" class="share-btn share-copy" onclick="copyArticleLink('${canonicalUrl}', this)" aria-label="Copy article link">
                            🔗 Copy Link
                        </button>
                    </div>
                </div>

                ${tags.length ? `<div class="article-tags" aria-label="Article tags">${tags.map(tag => `<a href="/blog/category/${slugifyCategory(tag)}">#${escapeHtml(tag)}</a>`).join('')}</div>` : ''}

                <!-- AUTHOR BIO CARD (Double-Bezel Hardware Architecture) -->
                <section class="author-bio-card" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <div class="res-bezel-outer">
                        <div class="res-bezel-inner">
                            <div class="author-bio-split">
                                <div class="author-bio-avatar-column">
                                    <div class="author-avatar-frame">
                                        <img src="${authorAvatar}" alt="Sabbir Hasan" class="author-bio-avatar" data-profile-image width="104" height="104" onerror="this.onerror=null;this.src='/uploads/sabbir-secondary-blue.webp'">
                                        <span class="avatar-status-dot"></span>
                                    </div>
                                </div>
                                <div class="author-bio-content">
                                    <div class="author-bio-eyebrow">ENGINEERING PROFILE</div>
                                    <h3 class="author-bio-name" itemprop="name">
                                        Sabbir Hasan <span class="bio-verified-check">✓</span>
                                    </h3>
                                    <p class="author-bio-tagline">CCNA-Trained Network Engineer · Full-Stack Developer · Cybersecurity Enthusiast</p>
                                    <p class="author-bio-text" itemprop="description">
                                        Computer Science graduate and IT professional bridging the gap between secure network engineering and full-stack software development. Specialized in Cisco enterprise configurations, packet analysis, cybersecurity practices, and resilient Node.js architectures.
                                    </p>
                                    <div class="author-bio-skills">
                                        <span class="skill-tag">Cisco CCNA 200-301</span>
                                        <span class="skill-tag">Network Architecture</span>
                                        <span class="skill-tag">Node.js &amp; Express</span>
                                        <span class="skill-tag">Linux Server Admin</span>
                                        <span class="skill-tag">Cybersecurity Defense</span>
                                    </div>
                                    <div class="author-bio-links">
                                        <a href="/about" class="author-link-btn">Full Biography &amp; Story →</a>
                                        <a href="/resume" class="author-resume-btn">Inspect Executive CV</a>
                                        <a href="https://github.com/Sabbir-Hasan-670" target="_blank" rel="noopener noreferrer" class="author-social-link">GitHub</a>
                                        <a href="https://www.linkedin.com/in/sabbir670/" target="_blank" rel="noopener noreferrer" class="author-social-link">LinkedIn</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </article>

            <!-- ARTICLE NEIGHBORS (Prev/Next Split Deck) -->
            <nav class="article-neighbors" aria-label="Article navigation">
                ${previousPost ? `
                <a href="/blog/${escapeHtml(previousPost.slug || previousPost.id)}" class="neighbor-card neighbor-prev">
                    <span class="neighbor-direction">← Newer Article</span>
                    <strong class="neighbor-title">${escapeHtml(previousPost.title)}</strong>
                    <span class="neighbor-arrow-cta">Read Article →</span>
                </a>` : '<div class="neighbor-placeholder"></div>'}
                ${nextPost ? `
                <a href="/blog/${escapeHtml(nextPost.slug || nextPost.id)}" class="neighbor-card neighbor-next">
                    <span class="neighbor-direction">Older Article →</span>
                    <strong class="neighbor-title">${escapeHtml(nextPost.title)}</strong>
                    <span class="neighbor-arrow-cta">Read Article →</span>
                </a>` : '<div class="neighbor-placeholder"></div>'}
            </nav>

            <!-- ENGINEERING CONTACT / NEWSLETTER CTA BANNER -->
            <section class="article-cta-banner">
                <div class="cta-banner-inner">
                    <div class="cta-banner-glow"></div>
                    <div class="cta-eyebrow"><span class="cta-dot"></span> LET'S COLLABORATE</div>
                    <h2 class="cta-title">Have a Network Architecture or Web Engineering Challenge?</h2>
                    <p class="cta-desc">Whether you need enterprise network topology design, security hardening, or high-performance full-stack web platforms, let's explore technical solutions together.</p>
                    <div class="cta-actions">
                        <a href="/contact" class="cta-btn-primary">Start a Conversation →</a>
                        <a href="/resume" class="cta-btn-secondary">Review Executive Resume</a>
                    </div>
                </div>
            </section>

            <!-- RELATED ARTICLES -->
            ${relatedHtml}

            <!-- BACK TO BLOG BUTTON -->
            <div class="back-to-blog-wrapper">
                <a href="/blog" class="action-btn back-blog-btn">← Back to All Articles</a>
            </div>
        </main>

        <!-- EXECUTIVE SITE FOOTER -->
        <footer class="blog-footer">
            <div class="blog-footer-inner">
                <div class="blog-footer-brand">
                    <div class="footer-brand-head">
                        <a href="/" class="footer-brand-link">
                            <span class="footer-logo-badge">SH.</span>
                            <span class="footer-brand-title">Sabbir Hasan</span>
                        </a>
                        <span class="footer-status-tag">Systems &amp; Full-Stack</span>
                    </div>
                    <p class="blog-footer-copy">
                        &copy; <span id="year">${new Date().getFullYear()}</span> Sabbir Hasan. All rights reserved.
                        <span class="copy-sep">·</span>
                        <span class="copy-desc">Autonomous Networks, Cloud &amp; High-Scale Engineering</span>
                    </p>
                </div>

                <div class="blog-footer-right">
                    <nav class="blog-footer-nav" aria-label="Footer navigation">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/resume">Resume</a>
                        <a href="/blog">Blog</a>
                        <a href="/tools">Tools</a>
                        <a href="/contact">Contact</a>
                    </nav>
                    <a href="#top" class="footer-top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'}); return false;" title="Scroll to top" aria-label="Back to top">
                        <span>Top</span> ↑
                    </a>
                </div>
            </div>
        </footer>
    </div>

    <script src="/main.js?v=4" defer></script>
    <script src="/toast.js" defer></script>
    <script>
    // Reading Progress Fill
    window.addEventListener('scroll', function() {
        var docEl = document.documentElement;
        var scrollTotal = docEl.scrollHeight - docEl.clientHeight;
        var progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
        var bar = document.getElementById('readingProgress');
        if (bar) bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }, { passive: true });

    // Live Clap Reaction Functionality
    function handleClap(slug) {
        var key = 'article_claps_' + slug;
        var claps = parseInt(localStorage.getItem(key) || '18', 10);
        claps += 1;
        localStorage.setItem(key, claps);
        var countEl = document.getElementById('clapCount');
        if (countEl) countEl.innerText = claps;
        var btn = document.getElementById('clapBtn');
        if (btn) {
            btn.classList.add('clapped');
            setTimeout(function() { btn.classList.remove('clapped'); }, 450);
        }
        if (window.showToast) window.showToast('👏 Thank you for applauding this guide!', 'success');
    }
    (function() {
        var key = 'article_claps_${postSlug}';
        var saved = localStorage.getItem(key);
        if (saved && document.getElementById('clapCount')) {
            document.getElementById('clapCount').innerText = saved;
        }
    })();

    // Copy Code Block Button Functionality
    function copyCode(btn) {
        var wrapper = btn.closest('.code-block-wrapper');
        var codeElement = wrapper.querySelector('pre code');
        if (!codeElement) return;

        var codeText = codeElement.innerText;
        navigator.clipboard.writeText(codeText).then(function() {
            var originalHtml = btn.innerHTML;
            btn.innerHTML = '<span>✅</span> Copied!';
            btn.classList.add('copied');
            if (window.showToast) window.showToast('Code copied to clipboard!', 'info');
            setTimeout(function() {
                btn.innerHTML = originalHtml;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(function() {
            alert('Failed to copy code to clipboard.');
        });
    }

    // Copy Article Link Functionality
    function copyArticleLink(url, btn) {
        navigator.clipboard.writeText(url).then(function() {
            var originalText = btn.innerHTML;
            btn.innerHTML = '✅ Link Copied!';
            if (window.showToast) window.showToast('🔗 Article link copied to clipboard!', 'info');
            setTimeout(function() {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(function() {
            alert('Copied URL: ' + url);
        });
    }
    </script>
    <script src="/global-profile.js"></script>
    <script>
    (function() {
        fetch('/api/profile')
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (!data) return;
                var avatars = document.querySelectorAll('.author-bio-avatar, .author-avatar-small, [data-profile-image]');
                avatars.forEach(function(img) {
                    if (window.GlobalProfile) {
                        window.GlobalProfile.applyImage(img, data);
                    } else if (data.profile_pic_path) {
                        img.src = data.profile_pic_path;
                    }
                });
            })
            .catch(function() {});
    })();
    </script>
    <!-- Built-in First-Party Blog Engagement & Analytics Beacon -->
    <script>
    (function() {
        var blogId = ${parseInt(post.id, 10) || 0};
        if (!blogId) return;

        var startTime = Date.now();
        var maxScroll = 0;
        var fired75 = false;
        var isDnt = (navigator.doNotTrack === '1' || window.doNotTrack === '1');

        function calculateScroll() {
            var doc = document.documentElement;
            var total = doc.scrollHeight - window.innerHeight;
            if (total > 0) {
                var pct = Math.round((window.scrollY / total) * 100);
                if (pct > maxScroll) maxScroll = Math.min(pct, 100);
                if (maxScroll >= 75 && !fired75) {
                    fired75 = true;
                    if (window.pushTrackingEvent) {
                        window.pushTrackingEvent('blog_read_75', {
                            event_category: 'engagement',
                            event_label: '${escapeHtml(post.title || "").replace(/'/g, "\\'")}',
                            blog_id: blogId
                        });
                    }
                }
            }
        }

        window.addEventListener('scroll', calculateScroll, { passive: true });

        // Initial view beacon
        try {
            fetch('/api/track/blog-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId: blogId,
                    referrer: document.referrer || '',
                    isDnt: isDnt
                }),
                keepalive: true
            }).catch(function() {});
        } catch(e) {}

        // Leave beacon capturing reading duration and maximum scroll depth
        function sendLeaveBeacon() {
            var duration = Math.round((Date.now() - startTime) / 1000);
            calculateScroll();
            var payload = JSON.stringify({
                blogId: blogId,
                duration: duration,
                scrollDepth: maxScroll,
                isLeave: true,
                isDnt: isDnt
            });
            if (navigator.sendBeacon) {
                var blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon('/api/track/blog-view', blob);
            } else {
                fetch('/api/track/blog-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true
                }).catch(function() {});
            }
        }

        window.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                sendLeaveBeacon();
            }
        });
        window.addEventListener('pagehide', sendLeaveBeacon);
    })();
    </script>
</body>
</html>`;
}

module.exports = {
    renderBlogListingHtml,
    renderArticleHtml,
    stripHtml,
    stripFirstH1,
    slugifyCategory,
    formatDate,
    processHeadingsAndToc,
    processCodeBlocks
};
