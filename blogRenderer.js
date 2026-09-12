/**
 * blogRenderer.js - Server-Side Crawlable Blog & Article Rendering Engine
 * Part of SabbirHasan.com SEO & Performance Architecture
 */

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
    return content.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
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
function renderBlogListingHtml({ posts, totalPosts, currentPage, totalPages, currentCategory, categories, siteUrl }) {
    const displayCategory = currentCategory ? currentCategory.split(/[- ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : null;

    const canonicalUrl = currentCategory
        ? (currentPage > 1 ? `${siteUrl}/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}/page/${currentPage}` : `${siteUrl}/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}`)
        : (currentPage > 1 ? `${siteUrl}/blog/page/${currentPage}` : `${siteUrl}/blog`);

    const pageTitle = displayCategory 
        ? `${escapeHtml(displayCategory)} Articles (Page ${currentPage}) | Sabbir Hasan`
        : (currentPage > 1 ? `Latest Articles — Page ${currentPage} | Sabbir Hasan Blog` : `Blog | Sabbir Hasan — Networking, Cybersecurity & Tech Articles`);

    const pageDesc = displayCategory
        ? `Read in-depth ${escapeHtml(displayCategory)} tutorials, articles and practical guides by Sabbir Hasan.`
        : `Read latest technical articles by Sabbir Hasan on CCNA networking, cybersecurity, full-stack web development, and Linux administration from Bangladesh.`;

    const prevPageUrl = currentPage > 1
        ? (currentCategory ? `/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}/page/${currentPage - 1}` : `/blog/page/${currentPage - 1}`)
        : null;

    const nextPageUrl = currentPage < totalPages
        ? (currentCategory ? `/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}/page/${currentPage + 1}` : `/blog/page/${currentPage + 1}`)
        : null;

    const categoryPillsHtml = `
        <a href="/blog" class="cat-pill ${!currentCategory ? 'active' : ''}">All Articles</a>
        ${categories.map(c => `
            <a href="/blog/category/${encodeURIComponent(c.category.toLowerCase())}" class="cat-pill ${currentCategory && currentCategory.toLowerCase() === c.category.toLowerCase() ? 'active' : ''}">
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
                    <a href="/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}" class="blog-category" itemprop="articleSection">${postCategory}</a>
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
    }).join('') : `<div class="empty-state"><p>No published articles found in this category.</p><a href="/blog" class="action-btn">View All Articles</a></div>`;

    // Pagination links
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml = `
        <nav class="pagination-nav" aria-label="Blog pagination">
            ${prevPageUrl ? `<a href="${prevPageUrl}" class="page-btn prev-btn" rel="prev" aria-label="Previous Page">← Previous</a>` : `<span class="page-btn disabled" aria-hidden="true">← Previous</span>`}
            <div class="page-numbers">
                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    const pageHref = currentCategory
                        ? (p === 1 ? `/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}` : `/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}/page/${p}`)
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
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
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
    <link rel="stylesheet" href="/blog-v7.css?v=4">

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
                <p class="blog-hero-desc">${displayCategory ? 'Practical tutorials and lab breakdowns filed under ' + escapeHtml(displayCategory) + '.' : 'CCNA network guides, cybersecurity defense, Linux administration, and full-stack engineering notes.'}</p>
            </header>

            <!-- SEARCH & FILTERS -->
            <div class="blog-controls-wrapper">
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
    // Live client-side search enhancement
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('blogSearchInput');
        const resultsBox = document.getElementById('liveSearchResults');
        const blogGrid = document.getElementById('blogGrid');
        const paginationWrapper = document.getElementById('paginationWrapper');
        const spinner = document.getElementById('searchSpinner');
        let debounceTimer;

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                const q = e.target.value.trim();
                if (q.length < 2) {
                    resultsBox.style.display = 'none';
                    resultsBox.innerHTML = '';
                    blogGrid.style.display = 'grid';
                    if (paginationWrapper) paginationWrapper.style.display = 'flex';
                    if (spinner) spinner.style.display = 'none';
                    return;
                }

                if (spinner) spinner.style.display = 'inline-block';

                debounceTimer = setTimeout(async () => {
                    try {
                        const res = await fetch('/api/blog/search?q=' + encodeURIComponent(q));
                        const data = await res.json();
                        if (spinner) spinner.style.display = 'none';

                        if (data && data.length > 0) {
                            resultsBox.innerHTML = '<h3>Search Results for "' + q + '" (' + data.length + ')</h3><div class="blog-grid">' + data.map(post => \`
                                <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                                    <a href="/blog/\${post.slug}" class="blog-card-img-link" tabindex="-1" aria-hidden="true">
                                        <img src="\${post.image_path || '/og-image.png'}" alt="\${post.title}" class="blog-img" loading="lazy">
                                    </a>
                                    <div class="blog-body">
                                        <div class="blog-meta-bar">
                                            <span class="blog-category">\${post.category || 'Tech'}</span>
                                            <span class="blog-reading-time">⏱️ \${post.reading_time || '4 min read'}</span>
                                        </div>
                                        <h3 class="blog-title"><a href="/blog/\${post.slug}">\${post.title}</a></h3>
                                        <p class="blog-excerpt">\${post.excerpt || ''}</p>
                                        <div class="blog-footer-row">
                                            <span class="blog-date">📅 \${post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                                            <a href="/blog/\${post.slug}" class="read-more">Read Article <span>→</span></a>
                                        </div>
                                    </div>
                                </article>
                            \`).join('') + '</div>';
                            resultsBox.style.display = 'block';
                            blogGrid.style.display = 'none';
                            if (paginationWrapper) paginationWrapper.style.display = 'none';
                        } else {
                            resultsBox.innerHTML = '<div class="empty-state"><p>No articles matching "<strong>' + q + '</strong>".</p></div>';
                            resultsBox.style.display = 'block';
                            blogGrid.style.display = 'none';
                            if (paginationWrapper) paginationWrapper.style.display = 'none';
                        }
                    } catch(err) {
                        if (spinner) spinner.style.display = 'none';
                    }
                }, 300);
            });
        }
    });
    </script>
</body>
</html>`;
}

/**
 * Render Complete Single Article Page HTML with full SEO, OpenGraph, Schema, TOC, and Code Blocks
 */
function renderArticleHtml({ post, relatedPosts = [], previousPost = null, nextPost = null, siteUrl, authorImage = '' }) {
    const postSlug = escapeHtml(post.slug || post.id);
    const postTitle = escapeHtml(post.title || 'Untitled Article');
    const metaTitle = escapeHtml(post.meta_title || `${post.title} | Sabbir Hasan`);
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
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
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
    <link rel="stylesheet" href="/blog-v7.css?v=4">

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
          "item": "${siteUrl}/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}"
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
                        <li><a href="/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}">${category}</a></li>
                    </ol>
                </nav>
            </div>

            <article class="single-article-container" itemscope itemtype="https://schema.org/Article">
                <!-- ARTICLE HERO HEADER -->
                <header class="article-header">
                    <div class="article-category-badge-wrap">
                        <a href="/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}" class="blog-category">
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

                ${tags.length ? `<div class="article-tags" aria-label="Article tags">${tags.map(tag => `<a href="/blog/category/${encodeURIComponent(tag.toLowerCase())}">#${escapeHtml(tag)}</a>`).join('')}</div>` : ''}

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
</body>
</html>`;
}

module.exports = {
    renderBlogListingHtml,
    renderArticleHtml,
    stripHtml,
    stripFirstH1,
    formatDate,
    processHeadingsAndToc,
    processCodeBlocks
};
