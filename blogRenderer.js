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
        let lang = 'CODE';
        const classMatch = codeAttrs.match(/class=(['"])(?:language-)?([a-zA-Z0-9_-]+)\1/i);
        if (classMatch && classMatch[2]) {
            lang = classMatch[2].toUpperCase();
        }
        return `
        <div class="code-block-wrapper">
            <div class="code-header">
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
    const canonicalUrl = currentCategory
        ? (currentPage > 1 ? `${siteUrl}/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}/page/${currentPage}` : `${siteUrl}/blog/category/${encodeURIComponent(currentCategory.toLowerCase())}`)
        : (currentPage > 1 ? `${siteUrl}/blog/page/${currentPage}` : `${siteUrl}/blog`);

    const pageTitle = currentCategory 
        ? `${escapeHtml(currentCategory)} Articles (Page ${currentPage}) | Sabbir Hasan`
        : (currentPage > 1 ? `Latest Articles — Page ${currentPage} | Sabbir Hasan Blog` : `Blog | Sabbir Hasan — Networking, Cybersecurity & Tech Articles`);

    const pageDesc = currentCategory
        ? `Read in-depth ${escapeHtml(currentCategory)} tutorials, articles and practical guides by Sabbir Hasan.`
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

        <main class="section blog-listing-section">
            <header class="section-header reveal active">
                <p class="section-label">Knowledge Base &amp; Tutorials</p>
                <h1 class="section-title">Technical <span>Articles</span></h1>
                <p class="section-desc">Practical guides, network engineering configurations, cybersecurity breakdowns, and full-stack development insights.</p>
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

        <footer class="footer">
            <div class="footer-inner">
                <p>&copy; <span id="year">${new Date().getFullYear()}</span> <a href="/about">Sabbir Hasan</a>. All rights reserved.</p>
                <div class="footer-links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/resume">Resume</a>
                    <a href="/blog">Blog</a>
                    <a href="/tools">Tools</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </footer>
    </div>

    <script src="/main.js" defer></script>
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
                                <article class="blog-card">
                                    <a href="/blog/\${post.slug}">
                                        <img src="\${post.image_path || '/og-image.png'}" alt="\${post.title}" class="blog-img" loading="lazy">
                                    </a>
                                    <div class="blog-body">
                                        <span class="blog-category">\${post.category || 'Tech'}</span>
                                        <h3 class="blog-title"><a href="/blog/\${post.slug}">\${post.title}</a></h3>
                                        <p class="blog-excerpt">\${post.excerpt || ''}</p>
                                        <a href="/blog/\${post.slug}" class="read-more">Read Article →</a>
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
function renderArticleHtml({ post, relatedPosts = [], siteUrl }) {
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
                    <span class="toc-title">📑 Table of Contents</span>
                    <span class="toc-toggle-icon">▾</span>
                </summary>
                <nav class="toc-nav">
                    <ul class="toc-list">
                        ${toc.map((item, idx) => `
                            <li class="toc-item toc-${item.level}">
                                <a href="#${item.id}" class="toc-link">${idx + 1}. ${escapeHtml(item.text)}</a>
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
                    <article class="blog-card">
                        <a href="/blog/${escapeHtml(rel.slug || rel.id)}" class="blog-card-img-link" tabindex="-1">
                            <img src="${rel.image_path ? escapeHtml(rel.image_path) : '/og-image.png'}" alt="${escapeHtml(rel.title)}" class="blog-img" loading="lazy" width="400" height="225">
                        </a>
                        <div class="blog-body">
                            <span class="blog-category">${escapeHtml(rel.category || 'Tech')}</span>
                            <h3 class="blog-title"><a href="/blog/${escapeHtml(rel.slug || rel.id)}">${escapeHtml(rel.title)}</a></h3>
                            <p class="blog-excerpt">${escapeHtml(rel.excerpt || stripHtml(rel.content).slice(0, 100) + '...')}</p>
                            <a href="/blog/${escapeHtml(rel.slug || rel.id)}" class="read-more">Read Article →</a>
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
        "name": "Sabbir Hasan",
        "url": "${siteUrl}/about",
        "jobTitle": "Network Engineer & Full-Stack Developer"
      },
      "publisher": {
        "@type": "Person",
        "name": "Sabbir Hasan",
        "url": "${siteUrl}/"
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

        <main class="article-wrapper">
            <!-- BREADCRUMBS -->
            <nav class="breadcrumb-bar" aria-label="Breadcrumbs">
                <ol class="breadcrumb-list">
                    <li><a href="/">Home</a></li>
                    <li><span class="sep">/</span></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><span class="sep">/</span></li>
                    <li><a href="/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}">${category}</a></li>
                    <li><span class="sep">/</span></li>
                    <li aria-current="page" class="active">${postTitle}</li>
                </ol>
            </nav>

            <article class="single-article-container" itemscope itemtype="https://schema.org/Article">
                <!-- ARTICLE HEADER -->
                <header class="article-header">
                    <div class="article-category-badge-wrap">
                        <a href="/blog/category/${encodeURIComponent(post.category ? post.category.toLowerCase() : 'tech')}" class="blog-category">${category}</a>
                        <span class="reading-time-pill">⏱️ ${readingTime}</span>
                    </div>

                    <h1 class="article-main-title" itemprop="headline">${postTitle}</h1>

                    <div class="article-author-meta">
                        <img src="/uploads/1780147875909-556133141.jpg" alt="Sabbir Hasan" class="author-avatar-small" width="44" height="44" onerror="this.src='/favicon.svg'">
                        <div class="author-meta-info">
                            <span class="author-name">Written by <a href="/about" rel="author">Sabbir Hasan</a></span>
                            <span class="article-pub-dates">
                                Published <time datetime="${publishedIso}" itemprop="datePublished">${formattedPublishedDate}</time>
                                ${post.updated_at ? ` · Updated <time datetime="${updatedIso}" itemprop="dateModified">${formattedUpdatedDate}</time>` : ''}
                            </span>
                        </div>
                    </div>
                </header>

                <!-- FEATURED IMAGE -->
                ${post.image_path ? `
                <figure class="article-featured-media">
                    <img src="${featuredImg}" alt="${postTitle}" class="article-hero-img" loading="eager" decoding="async" width="900" height="500" itemprop="image">
                </figure>
                ` : ''}

                <!-- TABLE OF CONTENTS (Auto-generated) -->
                ${tocHtml}

                <!-- ARTICLE BODY CONTENT -->
                <div class="article-content-body" itemprop="articleBody">
                    ${finalContent}
                </div>

                <!-- SHARE & TAGS ROW -->
                <div class="article-share-row">
                    <div class="share-label">Share this article:</div>
                    <div class="share-buttons-group">
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

                <!-- AUTHOR BIO BOX -->
                <section class="author-bio-card" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <img src="/uploads/1780147875909-556133141.jpg" alt="Sabbir Hasan" class="author-bio-avatar" width="90" height="90" onerror="this.src='/favicon.svg'">
                    <div class="author-bio-content">
                        <h3 class="author-bio-name" itemprop="name">Sabbir Hasan</h3>
                        <p class="author-bio-tagline">CCNA-Trained Network Engineer · Full-Stack Developer · Cybersecurity Enthusiast</p>
                        <p class="author-bio-text" itemprop="description">
                            Computer Science graduate and IT professional bridging the gap between secure network engineering and full-stack software development. Specialized in Cisco network configurations, packet analysis, cybersecurity practices, and scalable Node.js architectures.
                        </p>
                        <div class="author-bio-links">
                            <a href="/about" class="author-link-btn">More About Sabbir →</a>
                            <a href="https://github.com/Sabbir-Hasan-670" target="_blank" rel="noopener noreferrer" class="author-social-link">GitHub</a>
                            <a href="https://www.linkedin.com/in/sabbir670/" target="_blank" rel="noopener noreferrer" class="author-social-link">LinkedIn</a>
                        </div>
                    </div>
                </section>
            </article>

            <!-- RELATED ARTICLES -->
            ${relatedHtml}

            <!-- BACK TO BLOG BUTTON -->
            <div class="back-to-blog-wrapper">
                <a href="/blog" class="action-btn back-blog-btn">← Back to All Articles</a>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-inner">
                <p>&copy; <span id="year">${new Date().getFullYear()}</span> <a href="/about">Sabbir Hasan</a>. All rights reserved.</p>
                <div class="footer-links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/resume">Resume</a>
                    <a href="/blog">Blog</a>
                    <a href="/tools">Tools</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </footer>
    </div>

    <script src="/main.js" defer></script>
    <script src="/toast.js" defer></script>
    <script>
    // Copy Code Block Button Functionality
    function copyCode(btn) {
        const wrapper = btn.closest('.code-block-wrapper');
        const codeElement = wrapper.querySelector('pre code');
        if (!codeElement) return;

        const codeText = codeElement.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<span>✅</span> Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            alert('Failed to copy code to clipboard.');
        });
    }

    // Copy Article Link Functionality
    function copyArticleLink(url, btn) {
        navigator.clipboard.writeText(url).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Link Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            alert('Copied URL: ' + url);
        });
    }
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
