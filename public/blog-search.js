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
                if (resultsBox) { resultsBox.style.display = 'none'; resultsBox.innerHTML = ''; }
                if (blogGrid) blogGrid.style.display = 'grid';
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
                        resultsBox.innerHTML = '<h3>Search Results for "' + q + '" (' + data.length + ')</h3><div class="blog-grid">' + data.map(post => `
                            <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                                <a href="/blog/${post.slug}" class="blog-card-img-link" tabindex="-1" aria-hidden="true">
                                    <img src="${post.image_path || '/og-image.png'}" alt="${post.title}" class="blog-img" loading="lazy">
                                </a>
                                <div class="blog-body">
                                    <div class="blog-meta-bar">
                                        <span class="blog-category">${post.category || 'Tech'}</span>
                                        <span class="blog-reading-time">⏱️ ${post.reading_time || '4 min read'}</span>
                                    </div>
                                    <h3 class="blog-title"><a href="/blog/${post.slug}">${post.title}</a></h3>
                                    <p class="blog-excerpt">${post.excerpt || ''}</p>
                                    <div class="blog-footer-row">
                                        <span class="blog-date">📅 ${post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                                        <a href="/blog/${post.slug}" class="read-more">Read Article <span>→</span></a>
                                    </div>
                                </div>
                            </article>
                        `).join('') + '</div>';
                        resultsBox.style.display = 'block';
                        if (blogGrid) blogGrid.style.display = 'none';
                        if (paginationWrapper) paginationWrapper.style.display = 'none';
                    } else {
                        resultsBox.innerHTML = '<div class="empty-state"><p>No articles matching "<strong>' + q + '</strong>".</p></div>';
                        resultsBox.style.display = 'block';
                        if (blogGrid) blogGrid.style.display = 'none';
                        if (paginationWrapper) paginationWrapper.style.display = 'none';
                    }
                } catch(err) {
                    if (spinner) spinner.style.display = 'none';
                }
            }, 300);
        });
    }
});
