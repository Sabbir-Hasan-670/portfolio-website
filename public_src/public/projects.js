/**
 * projects.js - Interactive Controller for /projects Page
 * Features: Client-Side Instant Search, Multi-Domain Category Filtering, 
 * Double-Bezel Rendering, and Dynamic Profile Hydration.
 */

(function () {
    'use strict';

    let allProjects = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // DOM Elements
    const grid = document.getElementById('projectGrid');
    const searchInput = document.getElementById('projectSearch');
    const searchCount = document.getElementById('searchCount');
    const filterButtons = document.querySelectorAll('.filter-pill');
    const mobileMenu = document.getElementById('projectsMobileMenu');
    const hamburger = document.getElementById('projectsHamburger');

    // Categorization Classifier
    function classifyProject(proj) {
        const text = `${proj.title || ''} ${proj.description || ''} ${proj.languages || ''} ${proj.technologies || ''}`.toLowerCase();
        
        if (text.includes('cisco') || text.includes('ospf') || text.includes('vlan') || text.includes('network') || text.includes('packet tracer') || text.includes('wireshark') || text.includes('firewall')) {
            return 'network';
        }
        if (text.includes('electron') || text.includes('download manager') || text.includes('mcp') || text.includes('desktop') || (text.includes('python') && !text.includes('django'))) {
            return 'desktop';
        }
        if (text.includes('shop') || text.includes('ecommerce') || text.includes('iptv') || text.includes('jobfit') || text.includes('node') || text.includes('express') || text.includes('ejs') || text.includes('web') || text.includes('full-stack') || text.includes('full stack')) {
            return 'web';
        }
        if (text.includes('calculator') || text.includes('utility') || text.includes('toggle') || text.includes('animation') || text.includes('tool')) {
            return 'tools';
        }
        return 'web'; // Default fallback
    }

    // Technology Parser
    function parseTechnologies(proj) {
        if (!proj) return [];
        let raw = String(proj.technologies || proj.languages || '').trim();
        if (!raw) return [];

        if (raw.includes('<') && raw.includes('>')) {
            const temp = document.createElement('div');
            temp.innerHTML = raw;
            const items = Array.from(temp.querySelectorAll('span, b, a'));
            if (items.length) {
                return items.map(s => s.textContent.trim()).filter(Boolean);
            }
            raw = temp.textContent || '';
        }
        return raw.split(/[\n,|•]/).map(item => item.trim()).filter(Boolean);
    }

    // Escape HTML Helper
    function esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Generate Visual Fallback when image_path is missing
    function getFallbackIcon(category, title) {
        const t = (title || '').toLowerCase();
        if (t.includes('network') || t.includes('ospf') || t.includes('cisco')) return { icon: '🌐', code: 'CISCO // NETWORKING' };
        if (t.includes('electron') || t.includes('download')) return { icon: '⚡', code: 'ELECTRON // SYSTEM' };
        if (t.includes('mcp') || t.includes('python')) return { icon: '🧠', code: 'AI AGENTS // MCP' };
        if (t.includes('iptv') || t.includes('media')) return { icon: '📺', code: 'STREAMING // MEDIA' };
        if (t.includes('security') || t.includes('defense')) return { icon: '🛡️', code: 'SECURITY // DEFENSE' };
        if (t.includes('calculator') || t.includes('subnet')) return { icon: '🧮', code: 'UTILITY // CALC' };
        return { icon: '💻', code: 'FULL-STACK // APPLICATION' };
    }

    // Render Double-Bezel Project Card
    function renderProjectCard(proj, index) {
        const isGithub = proj.id && String(proj.id).startsWith('gh-');
        const techList = parseTechnologies(proj);
        const category = classifyProject(proj);
        const isPinned = Boolean(proj.is_pinned);
        const formattedIndex = `PROJ_${String(index + 1).padStart(2, '0')}`;
        const fallback = getFallbackIcon(category, proj.title);

        const projectSlug = String(proj.repo_slug || proj.title || '')
            .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        let mediaHtml = '';
        if (proj.image_path) {
            mediaHtml = `
                <div class="proj-media-frame">
                    <img src="${esc(proj.image_path)}" alt="${esc(proj.title)}" class="proj-media-img" loading="lazy" decoding="async" width="600" height="340" onerror="this.parentElement.innerHTML='<div class=\\'proj-media-fallback\\'><div class=\\'proj-fallback-pattern\\'></div><div class=\\'proj-fallback-icon\\'>${fallback.icon}</div><div class=\\'proj-fallback-code\\'>${fallback.code}</div></div>';">
                    <div class="proj-media-overlay"></div>
                    ${isPinned ? `<span class="proj-pin-badge">★ PINNED</span>` : ''}
                    <span class="proj-status-badge">● ${isGithub ? 'GitHub Live' : 'Verified'}</span>
                </div>
            `;
        } else {
            mediaHtml = `
                <div class="proj-media-frame">
                    <div class="proj-media-fallback">
                        <div class="proj-fallback-pattern"></div>
                        <div class="proj-fallback-icon">${fallback.icon}</div>
                        <div class="proj-fallback-code">${fallback.code}</div>
                    </div>
                    ${isPinned ? `<span class="proj-pin-badge">★ PINNED</span>` : ''}
                    <span class="proj-status-badge">● ${isGithub ? 'Source Code' : 'Production'}</span>
                </div>
            `;
        }

        // Tech chips
        const techHtml = techList.slice(0, 7).map(t => `<span class="tech-chip">${esc(t)}</span>`).join('');

        // Action Buttons
        let actionsHtml = '';
        if (proj.live_url) {
            actionsHtml += `
                <a href="${esc(proj.live_url)}" target="_blank" rel="noopener noreferrer" class="proj-btn-primary">
                    <span>Live Demo</span>
                    <span class="btn-icon-circle">↗</span>
                </a>
            `;
        }
        if (proj.github_url) {
            actionsHtml += `
                <a href="${esc(proj.github_url)}" target="_blank" rel="noopener noreferrer" class="proj-btn-secondary">
                    <span>GitHub</span>
                    <span class="btn-icon-circle">↗</span>
                </a>
            `;
        }
        if (projectSlug && isGithub && !proj.live_url) {
            actionsHtml += `
                <a href="/project/${encodeURIComponent(projectSlug)}" class="proj-btn-secondary">
                    <span>Case Study</span>
                    <span class="btn-icon-circle">→</span>
                </a>
            `;
        }

        return `
            <article class="proj-card-shell ${isPinned ? 'pinned' : ''}" data-category="${category}">
                <div class="proj-card-core">
                    ${mediaHtml}
                    <div class="proj-card-body">
                        <div class="proj-card-meta">
                            <span class="proj-index">${formattedIndex}</span>
                            <span class="proj-source-tag">${isGithub ? 'PUBLIC REPO' : 'ENGINEERING BUILD'}</span>
                        </div>
                        <h2 class="proj-card-title">${esc(proj.title)}</h2>
                        <p class="proj-card-desc">${esc(proj.description || 'Enterprise project repository and system architecture blueprint designed by Sabbir Hasan.')}</p>
                        ${techHtml ? `<div class="proj-tech-stack">${techHtml}</div>` : ''}
                        <div class="proj-card-actions">
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // Filter and Search Projects
    function applyFilterAndSearch() {
        if (!grid) return;

        const q = searchQuery.toLowerCase().trim();
        const filtered = allProjects.filter(p => {
            const matchesCategory = (currentFilter === 'all') || (classifyProject(p) === currentFilter);
            if (!matchesCategory) return false;

            if (!q) return true;
            const title = (p.title || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            const langs = (p.languages || '').toLowerCase();
            const techs = (p.technologies || '').toLowerCase();
            return title.includes(q) || desc.includes(q) || langs.includes(q) || techs.includes(q);
        });

        if (searchCount) {
            searchCount.textContent = `${filtered.length} Projects`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="projects-empty-state">
                    <h3>No matching engineering projects found</h3>
                    <p>Try clearing your search query or switching to another category filter tab.</p>
                    <button type="button" onclick="window.resetProjectFilters()">View All Projects</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map((proj, idx) => renderProjectCard(proj, idx)).join('');
    }

    // Expose reset function
    window.resetProjectFilters = function () {
        currentFilter = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
        });
        applyFilterAndSearch();
    };

    // Update Counts on Filter Pills
    function updateCategoryCounts() {
        const counts = {
            all: allProjects.length,
            network: 0,
            web: 0,
            desktop: 0,
            tools: 0
        };

        allProjects.forEach(p => {
            const cat = classifyProject(p);
            if (counts[cat] !== undefined) {
                counts[cat]++;
            }
        });

        filterButtons.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const countEl = btn.querySelector('.pill-count');
            if (countEl && counts[filter] !== undefined) {
                countEl.textContent = counts[filter];
            }
        });
    }

    // Initialize Event Handlers
    function initEvents() {
        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                searchQuery = e.target.value;
                applyFilterAndSearch();
            });
        }

        // Category Filter Pills
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter') || 'all';
                applyFilterAndSearch();
            });
        });

        // Mobile Hamburger Toggle
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });
        }
    }

    // Fetch Projects from API
    async function loadProjects() {
        try {
            const res = await fetch('/api/projects', { cache: 'no-cache' });
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                allProjects = data;
                updateCategoryCounts();
                applyFilterAndSearch();
            }
        } catch (err) {
            console.warn('Projects API fetch error:', err);
        }
    }

    // Hydrate Dynamic Profile Data
    async function hydrateProfile() {
        try {
            const res = await fetch('/api/profile', { cache: 'no-cache' });
            if (!res.ok) return;
            const profile = await res.json();
            if (!profile) return;

            // Name
            if (profile.name) {
                document.querySelectorAll('[data-name]').forEach(el => el.textContent = profile.name);
            }
            // CV Link
            if (profile.cv_file_path) {
                document.querySelectorAll('[data-cv]').forEach(el => el.href = profile.cv_file_path);
            }
            // Email Link
            if (profile.contact_email) {
                document.querySelectorAll('[data-email]').forEach(el => el.href = 'mailto:' + profile.contact_email);
            }
        } catch (e) {}
    }

    // DOM Ready execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initEvents();
            loadProjects();
            hydrateProfile();
        });
    } else {
        initEvents();
        loadProjects();
        hydrateProfile();
    }

})();
