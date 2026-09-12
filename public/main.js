// ⭐ Enhanced Starfield with Nebula & Mouse Parallax
(function() {
    const sc = document.getElementById('starCanvas');
    if (!sc) return;
    const sctx = sc.getContext('2d');
    let stars = [], shootingStars = [];
    const starCount = 180; // Reduced from 250 for better performance
    let mouseX = 0, mouseY = 0;
    let animFrameId = null;
    let isVisible = !document.hidden;

    function resize() { sc.width = window.innerWidth; sc.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', () => { resize(); initStars(); }, { passive: true });

    // Throttled mouse parallax (max 60fps update)
    let lastMouseUpdate = 0;
    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastMouseUpdate < 16) return; // ~60fps throttle
        lastMouseUpdate = now;
        mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
    }, { passive: true });

    // ⚡ Page Visibility API — pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !animFrameId) {
            animate();
        } else if (!isVisible && animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    });

    class Star {
        constructor() {
            this.x = Math.random() * sc.width;
            this.y = Math.random() * sc.height;
            this.size = Math.random() * 2.2 + 0.3;
            this.opacity = Math.random() * 0.7 + 0.2;
            this.speed = Math.random() * 0.015 + 0.005;
            this.parallaxFactor = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.85 ? (Math.random() > 0.5 ? 200 : 270) : 0;
        }
        update() {
            this.opacity += this.speed;
            if (this.opacity > 0.9 || this.opacity < 0.15) this.speed *= -1;
        }
        draw() {
            const px = this.x + mouseX * this.parallaxFactor;
            const py = this.y + mouseY * this.parallaxFactor;
            sctx.beginPath();
            sctx.arc(px, py, this.size, 0, Math.PI * 2);
            if (this.hue) {
                sctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.opacity})`;
            } else {
                sctx.fillStyle = `rgba(200,220,255,${this.opacity})`;
            }
            sctx.fill();
        }
    }

    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * sc.width;
            this.y = Math.random() * sc.height * 0.3;
            this.length = Math.random() * 80 + 30;
            this.speed = Math.random() * 6 + 3;
            this.opacity = 1;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.01;
            if (this.opacity <= 0 || this.x > sc.width || this.y > sc.height) {
                this.reset();
                this.opacity = 0;
                setTimeout(() => { this.opacity = 1; }, Math.random() * 8000 + 3000);
            }
        }
        draw() {
            if (this.opacity <= 0) return;
            const gradient = sctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(this.angle) * this.length,
                this.y - Math.sin(this.angle) * this.length
            );
            gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
            gradient.addColorStop(1, `rgba(255,255,255,0)`);
            sctx.beginPath();
            sctx.moveTo(this.x, this.y);
            sctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            sctx.strokeStyle = gradient;
            sctx.lineWidth = 1.5;
            sctx.stroke();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) stars.push(new Star());
        shootingStars = [];
        for (let i = 0; i < 4; i++) shootingStars.push(new ShootingStar());
    }
    initStars();

    function animate() {
        if (!isVisible) { animFrameId = null; return; }
        sctx.clearRect(0, 0, sc.width, sc.height);
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(s => { s.update(); s.draw(); });
        animFrameId = requestAnimationFrame(animate);
    }
    animate();
})();

// ⌨️ Typing Effect
window.typingTitles = ['Network Engineer', 'Full-Stack Developer', 'Cybersecurity Specialist', 'Linux Server Administrator', 'Technical SEO Specialist'];
window.setTypingRoles = (rolesStr) => {
    if (rolesStr) {
        const arr = rolesStr.split(',').map(r => r.trim()).filter(r => r);
        if (arr.length > 0) window.typingTitles = arr;
    }
};

(function() {
    const el = document.getElementById('typingText');
    if (!el) return;

    let ti = 0, ci = 0, del = false;

    function type() {
        if (!el) return;
        const cur = window.typingTitles[ti % window.typingTitles.length] || '';
        if (!del) {
            el.textContent = cur.substring(0, ci + 1);
            ci++;
            if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
        } else {
            el.textContent = cur.substring(0, ci - 1);
            ci--;
            if (ci === 0) { del = false; ti = (ti + 1) % window.typingTitles.length; }
        }
        setTimeout(type, del ? 35 : 80);
    }
    type();
})();

// 📊 Scroll Progress Bar
(function() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true }); // passive: true prevents scroll blocking
})();

// 👁️ Scroll Reveal with Stagger
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Add reveal to dynamically created elements
function observeNewReveals() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

// 📱 Navbar & Mobile Menu
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

const hamburger = document.getElementById('hamburger');
const navDropdown = document.getElementById('navDropdown');

if (hamburger && navDropdown) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navDropdown.classList.toggle('active');
    });

    navDropdown.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navDropdown.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
            hamburger.classList.remove('active');
            navDropdown.classList.remove('active');
        }
    });
}

// 📅 Footer Year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════
// 🔗 BACKEND API INTEGRATION
// ═══════════════════════════════════════════

// Homepage settings are progressive enhancement: the server returns safe defaults
// until the additive site_sections migration has been executed.
const homepageSectionSettings = new Map();

function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function replaceText(target, value) {
    if (target && hasText(value)) target.textContent = value.trim();
}

function getSectionCopyTarget(section, field) {
    const selectors = {
        hero: { eyebrow: '.hero-kicker', title: '.hero-name-intro', description: '#hero-bio' },
        expertise: { description: '.expertise-summary' },
        projects: { description: '.projects-summary' },
        technology: { description: '.technology-summary' },
        network: { description: '.showcase-summary' },
        cybersecurity: { description: '.showcase-summary' },
        about: { description: '#about-desc-display' },
        experience: { description: '.section-sidecopy' },
        blog: { description: '.section-intro' },
        tools: { description: '.tools-preview-copy p' },
        development: { description: '.development-copy p' },
        streams: { description: '.streams-header-left p' },
        contact: { description: '.contact-info > p' }
    };
    const selector = selectors[section.dataset.sectionKey]?.[field];
    return selector ? section.querySelector(selector) : null;
}

function applySectionCopy(section, settings) {
    if (!section || !settings) return;
    const eyebrow = getSectionCopyTarget(section, 'eyebrow') || section.querySelector('.section-label');
    const title = getSectionCopyTarget(section, 'title') || section.querySelector('.section-title');
    const description = getSectionCopyTarget(section, 'description');
    replaceText(eyebrow, settings.eyebrow);
    replaceText(title, settings.title);

    if (description && hasText(settings.description)) {
        if (section.dataset.sectionKey === 'about') {
            description.replaceChildren();
            String(settings.description).split('\n').map(line => line.trim()).filter(Boolean).forEach(line => {
                const paragraph = document.createElement('p');
                paragraph.textContent = line;
                description.append(paragraph);
            });
        } else {
            replaceText(description, settings.description);
        }
    }
}

function refreshHomepageLayout() {
    window.requestAnimationFrame(() => {
        if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
        }
        window.dispatchEvent(new Event('resize'));
    });
}

function applyHomepageSections(rows) {
    if (!Array.isArray(rows)) return;
    const sections = [...document.querySelectorAll('[data-section-key]')];
    if (!sections.length) return;

    rows.forEach(row => {
        if (row && hasText(row.section_key)) homepageSectionSettings.set(row.section_key, row);
    });

    const managed = sections.map((section, originalIndex) => {
        const settings = homepageSectionSettings.get(section.dataset.sectionKey);
        const hidden = settings && (settings.is_visible === false || Number(settings.is_visible) === 0);
        section.hidden = Boolean(hidden);
        section.setAttribute('aria-hidden', String(Boolean(hidden)));
        section.classList.toggle('is-backend-hidden', Boolean(hidden));
        applySectionCopy(section, settings);
        if (section.id) {
            document.querySelectorAll(`a[href="#${section.id}"]`).forEach(link => {
                link.hidden = Boolean(hidden);
                if (hidden) link.setAttribute('tabindex', '-1');
                else link.removeAttribute('tabindex');
            });
        }
        return {
            section,
            originalIndex,
            sortOrder: Number.isFinite(Number(settings?.sort_order)) ? Number(settings.sort_order) : originalIndex
        };
    });

    // Reorder existing nodes rather than rebuilding markup; attached listeners,
    // anchors and accessibility semantics remain intact. Only modify DOM if order changed
    const parent = managed[0]?.section.parentElement;
    if (parent && managed.every(item => item.section.parentElement === parent)) {
        const bridge = document.querySelector('.hero-expertise-bridge');
        const ordered = [...managed].sort((a, b) => a.sortOrder - b.sortOrder || a.originalIndex - b.originalIndex);
        const orderChanged = ordered.some((item, index) => item.section !== managed[index].section);
        if (orderChanged) {
            const fragment = document.createDocumentFragment();
            ordered.forEach(item => {
                fragment.append(item.section);
                if (item.section.dataset.sectionKey === 'hero' && bridge) fragment.append(bridge);
            });
            const footer = parent.querySelector('footer.site-footer');
            parent.insertBefore(fragment, footer || null);
        }
    }

    window.dispatchEvent(new CustomEvent('portfolio-sections-applied', { detail: rows }));
    refreshHomepageLayout();
}

async function fetchHomepageSections() {
    if (!document.querySelector('[data-section-key]')) return;
    try {
        const res = await fetch('/api/site-sections');
        if (!res.ok) return;
        const rows = await res.json();
        applyHomepageSections(rows);
    } catch (e) {
        // Static HTML remains the old-database/offline fallback.
        console.log('Homepage section settings unavailable:', e);
    }
}

function applyHomepageDefaultSeo(data) {
    if (!document.getElementById('home')) return;
    if (hasText(data.default_seo_title)) document.title = data.default_seo_title.trim();
    if (hasText(data.default_seo_description)) {
        document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach(meta => {
            meta.setAttribute('content', data.default_seo_description.trim());
        });
    }
    if (hasText(data.default_og_image)) {
        document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(meta => {
            meta.setAttribute('content', data.default_og_image.trim());
        });
    }
}

async function fetchProfile() {
    const heroBtns = document.getElementById('hero-buttons');
    const githubBtn = document.getElementById('link-github');
    if (!heroBtns && !githubBtn && !document.getElementById('contact-email-display') && !document.getElementById('hero-portrait') && !document.getElementById('about-image')) return;

    try {
        const res = await fetch('/api/profile', { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        applyHomepageDefaultSeo(data);

        const has = (key) => Object.prototype.hasOwnProperty.call(data, key);
        if (has('hero_roles') && window.setTypingRoles) {
            window.setTypingRoles(data.hero_roles || '');
        }
        if (has('hero_description')) {
            const heroBio = document.getElementById('hero-bio');
            if (heroBio && hasText(data.hero_description)) heroBio.textContent = data.hero_description.trim();
        }

        if (has('name')) {
            const heroName = document.getElementById('hero-name');
            if (heroName && hasText(data.name)) heroName.textContent = data.name.trim();
        }

        if (has('profile_pic_path')) {
            const fallbackPic = window.GlobalProfile ? window.GlobalProfile.fallbackImage : '/uploads/1789156728823-569590328.jpg';
            const globalProfileImage = window.GlobalProfile
                ? window.GlobalProfile.getImage(data)
                : (hasText(data.profile_pic_path) ? data.profile_pic_path.trim() : fallbackPic);
            const heroPortrait = document.getElementById('hero-portrait');
            if (heroPortrait) {
                if (window.GlobalProfile) window.GlobalProfile.applyImage(heroPortrait, data);
                else if (!heroPortrait.src.endsWith(globalProfileImage)) heroPortrait.src = globalProfileImage;
                heroPortrait.hidden = false;
                if (!window.GlobalProfile) heroPortrait.onerror = () => { heroPortrait.onerror = null; heroPortrait.src = fallbackPic; };
            }
            const aboutImgContainer = document.getElementById('about-image');
            if (aboutImgContainer) {
                let aboutImage = aboutImgContainer.querySelector('img');
                if (!aboutImage) {
                    aboutImage = document.createElement('img');
                    aboutImage.alt = data.name || 'Sabbir Hasan';
                    aboutImage.width = 400; aboutImage.height = 400; aboutImage.loading = 'lazy'; aboutImage.decoding = 'async';
                    aboutImage.style.cssText = 'width:100%; height:100%; object-fit:cover; border-radius:0;';
                    aboutImgContainer.append(aboutImage);
                }
                if (window.GlobalProfile) window.GlobalProfile.applyImage(aboutImage, data);
                else if (!aboutImage.src.endsWith(globalProfileImage)) aboutImage.src = globalProfileImage;
                if (!window.GlobalProfile) aboutImage.onerror = () => { aboutImage.onerror = null; aboutImage.src = fallbackPic; };
            }
        }

        if (heroBtns) {
            const primaryBtn = document.getElementById('hero-primary-cta');
            const resumeBtn = document.getElementById('hero-resume');
            if (primaryBtn) {
                if (hasText(data.hero_primary_cta_label)) {
                    primaryBtn.replaceChildren(document.createTextNode(`${data.hero_primary_cta_label.trim()} `));
                    const icon = document.createElement('span');
                    icon.setAttribute('aria-hidden', 'true');
                    icon.textContent = '↗';
                    primaryBtn.append(icon);
                }
                if (hasText(data.hero_primary_cta_url)) primaryBtn.href = data.hero_primary_cta_url.trim();
            }
            if (resumeBtn && data.cv_file_path) {
                resumeBtn.href = data.cv_file_path;
                resumeBtn.target = '_blank';
                resumeBtn.rel = 'noopener';
            }
            if (resumeBtn) {
                if (hasText(data.hero_secondary_cta_label)) resumeBtn.textContent = data.hero_secondary_cta_label.trim();
                if (hasText(data.hero_secondary_cta_url)) resumeBtn.href = data.hero_secondary_cta_url.trim();
            }
        }

        if (hasText(data.hero_availability_text)) {
            const availability = document.querySelector('.hero-greeting span');
            if (availability) availability.textContent = data.hero_availability_text.trim();
        }

        const linkedinBtn = document.getElementById('link-linkedin');
        const facebookBtn = document.getElementById('link-facebook');
        const fiverrBtn = document.getElementById('link-fiverr');
        const pinterestBtn = document.getElementById('link-pinterest');

        if (data.github_link && data.github_link.trim() !== "") {
            if (githubBtn) githubBtn.href = data.github_link;
        } else if (githubBtn) { githubBtn.remove(); }

        if (data.linkedin_link && data.linkedin_link.trim() !== "") {
            if (linkedinBtn) linkedinBtn.href = data.linkedin_link;
        } else if (linkedinBtn) { linkedinBtn.remove(); }

        if (data.adobe_stock_link && data.adobe_stock_link.trim() !== "") {
            const abBtn = document.createElement('a');
            abBtn.href = data.adobe_stock_link;
            abBtn.className = "btn";
            abBtn.target = "_blank";
            abBtn.innerHTML = `Adobe Stock`;
            document.querySelector('.social-links').appendChild(abBtn);
        }

        if (data.facebook_link && data.facebook_link.trim() !== "") {
            if (facebookBtn) facebookBtn.href = data.facebook_link;
        } else if (facebookBtn) { facebookBtn.remove(); }

        if (data.fiverr_link && data.fiverr_link.trim() !== "") {
            if (fiverrBtn) fiverrBtn.href = data.fiverr_link;
        } else if (fiverrBtn) { fiverrBtn.remove(); }

        if (data.pinterest_link && data.pinterest_link.trim() !== "") {
            if (pinterestBtn) pinterestBtn.href = data.pinterest_link;
        } else if (pinterestBtn) { pinterestBtn.remove(); }

        // --- INJECT BENTO STATS ---
        if (data.stat_ccna) {
            const ccnaEl = document.getElementById('stat-ccna-label');
            if (ccnaEl) ccnaEl.innerText = data.stat_ccna;
        }
        if (data.stat_ccna_title) {
            const ccnaTitleEl = document.getElementById('stat-ccna');
            if (ccnaTitleEl) ccnaTitleEl.innerText = data.stat_ccna_title;
        }
        if (data.stat_ceh) {
            const cehEl = document.getElementById('stat-ceh-label');
            if (cehEl) cehEl.innerText = data.stat_ceh;
        }
        if (data.stat_ceh_title) {
            const cehTitleEl = document.getElementById('stat-ceh');
            if (cehTitleEl) cehTitleEl.innerText = data.stat_ceh_title;
        }
        if (data.stat_years) {
            const yearsEl = document.getElementById('stat-years');
            if (yearsEl) yearsEl.innerText = data.stat_years;
        }
        if (data.stat_projects) {
            const projEl = document.getElementById('stat-projects');
            if (projEl) projEl.innerText = data.stat_projects;
        }

        // --- INJECT ABOUT SECTION ---
        if (has('about_title')) {
            const aboutTitleEl = document.getElementById('about-title-display');
            if (aboutTitleEl) aboutTitleEl.innerText = data.about_title || '';
        }
        if (has('about_desc')) {
            const aboutDescEl = document.getElementById('about-desc-display');
            if (aboutDescEl) {
                aboutDescEl.replaceChildren();
                String(data.about_desc || '').split('\n').filter(p => p.trim() !== '').forEach(text => {
                    const paragraph = document.createElement('p'); paragraph.textContent = text; aboutDescEl.append(paragraph);
                });
            }
        }

        const aboutSettings = homepageSectionSettings.get('about');
        const aboutSection = document.querySelector('[data-section-key="about"]');
        if (aboutSettings && aboutSection) applySectionCopy(aboutSection, aboutSettings);

        // --- INJECT CONTACT SECTION ---
        if (has('contact_email')) {
            const emailEl = document.getElementById('contact-email-display');
            if (emailEl) emailEl.innerText = data.contact_email || '';
        }
        if (has('contact_location')) {
            const locEl = document.getElementById('contact-location-display');
            if (locEl) locEl.innerText = data.contact_location || '';
        }
        if (has('contact_phone') && hasText(data.contact_phone)) {
            const phoneEl = document.getElementById('contact-phone-display');
            if (phoneEl) phoneEl.textContent = data.contact_phone.trim();
            const phoneItem = document.getElementById('contact-phone-item');
            if (phoneItem) phoneItem.hidden = false;
        }
        if (data.contact_map_url) {
            const mapContainer = document.getElementById('contact-map-container');
            const mapIframe = document.getElementById('contact-map-iframe');
            if (mapContainer && mapIframe) {
                mapIframe.src = data.contact_map_url;
                mapContainer.style.display = 'block';
            }
        }

        const fallbackGithubText = 'GitHub activity available via Projects';
        const loadGraphWithTimeout = (imgEl, loadingEl, url) => {
            if (!imgEl || !loadingEl) return;
            let finished = false;
            const timer = setTimeout(() => {
                if (!finished) {
                    finished = true;
                    imgEl.onload = null;
                    imgEl.onerror = null;
                    loadingEl.textContent = fallbackGithubText;
                    loadingEl.style.display = 'block';
                }
            }, 4000);

            imgEl.onload = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    imgEl.style.display = 'block';
                    loadingEl.style.display = 'none';
                }
            };
            imgEl.onerror = () => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timer);
                    loadingEl.textContent = fallbackGithubText;
                    loadingEl.style.display = 'block';
                }
            };
            imgEl.src = url;
            if (imgEl.complete && imgEl.naturalWidth > 0) {
                finished = true;
                clearTimeout(timer);
                imgEl.style.display = 'block';
                loadingEl.style.display = 'none';
            }
        };

        if (data.github_link && data.github_link.trim() !== "") {
            const username = data.github_link.replace(/\/$/, '').split('/').pop();
            const developmentLink = document.getElementById('development-github-link');
            if (developmentLink) developmentLink.href = data.github_link;
            const graphImg = document.getElementById('github-graph-mini');
            const graphLoading = document.getElementById('github-loading');
            if (graphImg && graphLoading) {
                loadGraphWithTimeout(graphImg, graphLoading, `https://ghchart.rshah.org/38bdf8/${username}`);
            }

            const developmentGraph = document.getElementById('development-github-graph');
            const developmentLoading = document.getElementById('development-github-loading');
            if (developmentGraph && developmentLoading) {
                loadGraphWithTimeout(developmentGraph, developmentLoading, `https://ghchart.rshah.org/d5a34a/${username}`);
            }
        } else {
            const graphLoading = document.getElementById('github-loading');
            if (graphLoading) graphLoading.textContent = fallbackGithubText;
            const developmentLoading = document.getElementById('development-github-loading');
            if (developmentLoading) developmentLoading.textContent = fallbackGithubText;
        }

        if (hasText(data.footer_text)) {
            const footerText = document.getElementById('footer-text');
            if (footerText) footerText.textContent = data.footer_text.trim().replaceAll('{year}', String(new Date().getFullYear()));
        }

        // --- FOOTER DYNAMIC NETWORK HYDRATION ---
        const footerGithub = document.getElementById('footer-link-github');
        const footerLinkedin = document.getElementById('footer-link-linkedin');
        const footerFacebook = document.getElementById('footer-link-facebook');
        const footerFacebookItem = document.getElementById('footer-item-facebook');
        const footerEmail = document.getElementById('footer-link-email');

        if (footerGithub) {
            if (hasText(data.github_link)) {
                footerGithub.href = data.github_link.trim();
                const li = footerGithub.closest('li');
                if (li) li.style.display = '';
            } else {
                const li = footerGithub.closest('li');
                if (li) li.style.display = 'none';
            }
        }

        if (footerLinkedin) {
            if (hasText(data.linkedin_link)) {
                footerLinkedin.href = data.linkedin_link.trim();
                const li = footerLinkedin.closest('li');
                if (li) li.style.display = '';
            } else {
                const li = footerLinkedin.closest('li');
                if (li) li.style.display = 'none';
            }
        }

        if (footerFacebook) {
            if (hasText(data.facebook_link)) {
                footerFacebook.href = data.facebook_link.trim();
                if (footerFacebookItem) footerFacebookItem.style.display = '';
            } else {
                // If not set in admin backend, hide so it doesn't lead to a dead page
                if (footerFacebookItem) footerFacebookItem.style.display = 'none';
            }
        }

        if (footerEmail) {
            const email = hasText(data.contact_email) ? data.contact_email.trim() : 'contact@sabbirhasan.com';
            footerEmail.href = `mailto:${email}`;
        }

        // --- FOOTER STATION LOCATION & TIMEZONE HYDRATION ---
        const stationLocEl = document.getElementById('footer-station-loc');
        if (stationLocEl) {
            const loc = hasText(data.station_location) ? data.station_location.trim() : (hasText(data.contact_location) ? data.contact_location.trim() : 'Faridpur, BD');
            stationLocEl.textContent = loc;
        }

        const stationStatusEl = document.getElementById('footer-station-status');
        if (stationStatusEl && hasText(data.station_status)) {
            stationStatusEl.textContent = data.station_status.trim();
        }

        if (hasText(data.station_timezone) && window.setFooterTimezone) {
            window.setFooterTimezone(data.station_timezone.trim());
        }
    } catch (e) {
        console.log(e);
        const fallback = 'GitHub activity available via Projects';
        const graphLoading = document.getElementById('github-loading');
        if (graphLoading && graphLoading.style.display !== 'none') graphLoading.textContent = fallback;
        const devLoading = document.getElementById('development-github-loading');
        if (devLoading && devLoading.style.display !== 'none') devLoading.textContent = fallback;
    }
}

async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    function cleanTechName(str) {
        if (!str) return '';
        let clean = String(str).replace(/\s*\d+(\.\d+)?%/g, '').trim();
        clean = clean.replace(/^[•\-\*\s]+/, '').trim();
        return clean;
    }

    function parseProjectTechnologies(proj) {
        if (!proj) return [];
        let list = [];
        if (Array.isArray(proj.technology_names) && proj.technology_names.length) {
            list = proj.technology_names.map(t => cleanTechName(t)).filter(Boolean);
        } else {
            let raw = String(proj.technologies || proj.languages || '').trim();
            if (raw) {
                if (raw.includes('<') && raw.includes('>')) {
                    const temp = document.createElement('div');
                    temp.innerHTML = raw;
                    const items = Array.from(temp.querySelectorAll('span, b, a'));
                    if (items.length) {
                        list = items.map(s => cleanTechName(s.textContent)).filter(Boolean);
                    } else {
                        raw = temp.textContent || '';
                        list = raw.split(/[\n,|•]/).map(item => cleanTechName(item)).filter(Boolean);
                    }
                } else {
                    list = raw.split(/[\n,|•]/).map(item => cleanTechName(item)).filter(Boolean);
                }
            }
        }
        return list.filter(item => {
            const low = item.toLowerCase();
            return low !== 'batchfile' && !/^\d+$/.test(low) && low.length > 1;
        });
    }

    try {
        const res = await fetch('/api/projects?featured=1');
        const projects = await res.json();
        if (!Array.isArray(projects)) return;

        grid.replaceChildren();
        if (!projects.length) {
            const message = document.createElement('p');
            message.className = 'project-archive-state';
            message.textContent = 'No projects are currently published from the admin system.';
            grid.append(message);
            return;
        }

        function getProjectFallbackSvg(title, index) {
            const safeTitle = String(title || 'SYSTEM CORE').toUpperCase().slice(0, 24);
            const icons = ['⚡', '🛡️', '🌐', '💻', '⚙️', '📊'];
            const icon = icons[index % icons.length];
            return `
                <div class="home-proj-fallback">
                    <div class="fallback-center">
                        <span class="fallback-icon">${icon}</span>
                        <span class="fallback-code">${safeTitle}</span>
                        <span class="fallback-sub">PRODUCTION SYSTEM // REPOSITORY ACTIVE</span>
                    </div>
                </div>
            `;
        }

        const latestProjects = projects.slice(0, 6);
        latestProjects.forEach((proj, index) => {
            const isGithub = proj.id && String(proj.id).startsWith('gh-');
            const isPinned = proj.is_pinned === 1 || proj.is_pinned === true;
            const projectSlug = String(proj.repo_slug || proj.title || '')
                .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            const project = document.createElement('article');
            project.className = 'home-proj-card reveal';
            project.style.transitionDelay = `${index * 0.08}s`;

            // 1. Hardware Header Bar
            const headBar = document.createElement('div');
            headBar.className = 'home-proj-head';
            headBar.innerHTML = `
                <div class="home-proj-dots">
                    <span class="dot-red"></span>
                    <span class="dot-yellow"></span>
                    <span class="dot-green"></span>
                </div>
                <span class="home-proj-index">PROJ_${String(index + 1).padStart(2, '0')}</span>
                <span class="home-proj-status-badge ${isPinned ? 'is-pinned' : 'is-live'}">
                    <span class="badge-beacon"></span> ${isPinned ? '★ PINNED' : '● GITHUB LIVE'}
                </span>
            `;

            // 2. Media Viewport
            const media = document.createElement('div');
            media.className = 'home-proj-media';
            if (proj.image_path) {
                const img = document.createElement('img');
                img.src = proj.image_path;
                img.alt = proj.title || 'Project preview';
                img.loading = 'lazy';
                img.decoding = 'async';
                img.onerror = () => {
                    img.remove();
                    media.innerHTML = getProjectFallbackSvg(proj.title, index);
                };
                media.append(img);
            } else {
                media.innerHTML = getProjectFallbackSvg(proj.title, index);
            }

            // 3. Project Body
            const body = document.createElement('div');
            body.className = 'home-proj-body';

            const title = document.createElement('h3');
            title.className = 'home-proj-title';
            title.textContent = proj.title || 'Untitled Project';

            const desc = document.createElement('p');
            desc.className = 'home-proj-desc';
            desc.textContent = proj.description || 'Enterprise production system engineered with modern architecture, automated workflows, and robust security.';

            // Technologies
            const stack = document.createElement('div');
            stack.className = 'home-proj-stack';
            const techList = parseProjectTechnologies(proj);
            techList.slice(0, 6).forEach(tech => {
                const chip = document.createElement('span');
                chip.className = 'home-proj-chip';
                chip.textContent = tech;
                stack.append(chip);
            });

            // Action Buttons
            const actions = document.createElement('div');
            actions.className = 'home-proj-actions';

            if (isGithub && projectSlug) {
                const caseBtn = document.createElement('a');
                caseBtn.href = `/project/${encodeURIComponent(projectSlug)}`;
                caseBtn.className = 'home-proj-btn btn-case';
                caseBtn.innerHTML = `<span>Case Study</span> <i class="btn-arrow">→</i>`;
                actions.append(caseBtn);
            }

            if (proj.live_url) {
                const liveBtn = document.createElement('a');
                liveBtn.href = proj.live_url;
                liveBtn.target = '_blank';
                liveBtn.rel = 'noopener noreferrer';
                liveBtn.className = 'home-proj-btn btn-demo';
                liveBtn.innerHTML = `<span>Live Demo</span> <i class="btn-arrow">↗</i>`;
                actions.append(liveBtn);
            }

            if (proj.github_url) {
                const gitBtn = document.createElement('a');
                gitBtn.href = proj.github_url;
                gitBtn.target = '_blank';
                gitBtn.rel = 'noopener noreferrer';
                gitBtn.className = 'home-proj-btn btn-git';
                gitBtn.innerHTML = `<span>Source Code</span> <i class="btn-arrow">↗</i>`;
                actions.append(gitBtn);
            }

            body.append(title, desc, stack, actions);
            project.append(headBar, media, body);
            grid.append(project);
        });
        observeNewReveals();
    } catch (e) { console.log(e); }
}

async function fetchExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/experience');
        if (!res.ok) return;
        const data = await res.json();
        timeline.replaceChildren();
        if (!Array.isArray(data) || !data.length) {
            const empty = document.createElement('p');
            empty.className = 'section-empty';
            empty.textContent = 'No experience records have been added yet.';
            timeline.append(empty);
            return;
        }

        data.forEach((exp, index) => {
            const entry = document.createElement('article');
            entry.className = 'career-entry reveal';
            entry.style.transitionDelay = `${index * 0.1}s`;

            // Chrono Timeline Node Marker
            const marker = document.createElement('div');
            marker.className = 'career-marker';
            marker.textContent = String(index + 1).padStart(2, '0');

            // Open Editorial Layout (Zero card wrappers)
            const content = document.createElement('div');
            content.className = 'career-content';

            // Left Side: Role, Period Pill, Company & Location
            const roleCol = document.createElement('div');
            roleCol.className = 'career-role-col';

            if (exp.duration) {
                const durationBadge = document.createElement('div');
                durationBadge.className = 'career-duration-badge';
                durationBadge.innerHTML = `
                    <span class="career-pulse-dot"></span>
                    <span>${exp.duration}</span>
                `;
                roleCol.append(durationBadge);
            }

            const role = document.createElement('h3');
            role.className = 'career-role-title';
            role.textContent = exp.role || 'Engineering Role';
            roleCol.append(role);

            if (exp.company_or_project) {
                const company = document.createElement('p');
                company.className = 'career-company';
                company.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>${exp.company_or_project}</span>
                `;
                roleCol.append(company);
            }

            // Right Side: Clean Bulleted Impact Points (NO card box, pure open typography)
            const impactCol = document.createElement('div');
            impactCol.className = 'career-impact-col';

            const rawDesc = String(exp.description || '').trim();
            if (rawDesc) {
                const ul = document.createElement('ul');
                ul.className = 'career-bullet-list';

                const bulletLines = rawDesc
                    .split(/\r?\n/)
                    .map(l => l.replace(/^[•\-\*\s]+/, '').trim())
                    .filter(Boolean);

                bulletLines.forEach(line => {
                    const li = document.createElement('li');
                    li.className = 'career-bullet-item';
                    li.innerHTML = `
                        <span class="career-bullet-icon" aria-hidden="true">›</span>
                        <span class="career-bullet-text">${line}</span>
                    `;
                    ul.append(li);
                });

                impactCol.append(ul);
            }

            content.append(roleCol, impactCol);
            entry.append(marker, content);
            timeline.append(entry);
        });
        observeNewReveals();
    } catch (e) { console.log(e); }
}

async function fetchEducation() {
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/education');
        if (!res.ok) return;
        const data = await res.json();
        timeline.replaceChildren();
        if (!Array.isArray(data) || !data.length) {
            const empty = document.createElement('p');
            empty.className = 'section-empty';
            empty.textContent = 'No education records have been added yet.';
            timeline.append(empty);
            return;
        }

        // Sort descending by completion year so highest/University degree appears first
        const sorted = [...data].sort((a, b) => {
            const getYear = d => {
                const match = (d.duration || '').match(/\d{4}/g);
                return match ? Math.max(...match.map(Number)) : 0;
            };
            return getYear(b) - getYear(a);
        });

        sorted.forEach((edu, index) => {
            const card = document.createElement('article');
            const isFeatured = (edu.degree || '').toLowerCase().includes('b.tech') || 
                               (edu.degree || '').toLowerCase().includes('bachelor') || 
                               (edu.degree || '').toLowerCase().includes('computer science') ||
                               index === 0;
            card.className = isFeatured ? 'education-card edu-card-featured reveal' : 'education-card reveal';
            card.style.transitionDelay = `${index * 0.1}s`;

            // Top Header: Serial Index, Prime Tag, and Duration Pill
            const top = document.createElement('div');
            top.className = 'edu-card-top';

            const badgeGroup = document.createElement('div');
            badgeGroup.className = 'edu-badge-group';

            const serial = document.createElement('span');
            serial.className = 'edu-serial';
            serial.textContent = `ACAD // 0${index + 1}`;
            badgeGroup.append(serial);

            if (isFeatured) {
                const primeBadge = document.createElement('span');
                primeBadge.className = 'edu-prime-badge';
                primeBadge.textContent = 'PRIMARY DEGREE';
                badgeGroup.append(primeBadge);
            }

            const duration = document.createElement('div');
            duration.className = 'edu-duration-badge';
            duration.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${edu.duration || 'Academic'}</span>
            `;

            top.append(badgeGroup, duration);

            // Body: Degree Title & Institution
            const body = document.createElement('div');
            body.className = 'edu-card-body';

            const title = document.createElement('h3');
            title.className = 'edu-degree-title';
            title.textContent = edu.degree || 'Education Record';

            const institution = document.createElement('p');
            institution.className = 'edu-institution';
            institution.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${edu.institution || ''}</span>
            `;

            body.append(title, institution);

            // Footer: Parsed Metric Chips
            const footer = document.createElement('div');
            footer.className = 'edu-card-footer';
            const chipsRow = document.createElement('div');
            chipsRow.className = 'edu-chips-row';

            const rawDesc = String(edu.description || '').trim();
            if (rawDesc) {
                const lines = rawDesc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                lines.forEach(line => {
                    const chip = document.createElement('div');
                    if (/^cgpa|^gpa/i.test(line)) {
                        chip.className = 'edu-chip edu-chip-grade';
                        chip.innerHTML = `
                            <span class="edu-chip-dot"></span>
                            <span class="edu-chip-text">${line}</span>
                        `;
                    } else if (/^major/i.test(line)) {
                        chip.className = 'edu-chip edu-chip-major';
                        chip.innerHTML = `<span class="edu-chip-text">${line}</span>`;
                    } else if (/^minor/i.test(line)) {
                        chip.className = 'edu-chip edu-chip-minor';
                        chip.innerHTML = `<span class="edu-chip-text">${line}</span>`;
                    } else {
                        chip.className = 'edu-chip edu-chip-default';
                        chip.textContent = line;
                    }
                    chipsRow.append(chip);
                });
            }

            footer.append(chipsRow);
            card.append(top, body, footer);
            timeline.append(card);
        });
        observeNewReveals();
    } catch (e) { console.log(e); }
}

// Services Grid
async function fetchServices() {
    const grid = document.getElementById('public-services-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/services');
        if (!res.ok) return;
        const data = await res.json();

        if (grid.classList.contains('expertise-system')) {
            if (Array.isArray(data)) {
                window.__expertiseServices = data;
                window.dispatchEvent(new CustomEvent('expertise-services-ready', { detail: data }));
            }
            return;
        }

        if (!data || !Array.isArray(data)) {
            grid.innerHTML = '<p style="text-align:center; width:100%; color:var(--text2);">No services available at the moment.</p>';
            return;
        }

        grid.innerHTML = data.length ? '' : '<p style="text-align:center; width:100%; color:var(--text2);">No services added yet.</p>';

        data.forEach((srv, index) => {
            let tagsHtml = '';
            if (srv.tags) {
                const tagArray = srv.tags.split(',');
                tagArray.forEach(tag => {
                    if(tag.trim() !== '') {
                        tagsHtml += `<span class="service-tag">${tag.trim()}</span>`;
                    }
                });
            }

            grid.innerHTML += `
                <div class="service-card reveal" style="transition-delay:${index * 0.1}s">
                    <div class="service-icon-box">${srv.icon || '💻'}</div>
                    <h3 class="service-title">${srv.title}</h3>
                    <p class="service-desc">${srv.description}</p>
                    <div class="service-tags">${tagsHtml}</div>
                </div>
            `;
        });
        observeNewReveals();
    } catch (e) {
        console.log("Services Fetch Exception Block Handled:", e);
        if (grid.classList.contains('expertise-system')) return;
        if (grid) grid.innerHTML = '<p style="text-align:center; width:100%; color:var(--text2);">Services module active.</p>';
    }
}

// Certificates Registry Ledger (No cards, pure verified ledger rows)
async function fetchCertificates() {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/certificates');
        if (!res.ok) {
            const empty = document.createElement('p');
            empty.className = 'section-empty';
            empty.textContent = 'No credentials have been added yet.';
            grid.replaceChildren(empty);
            return;
        }
        const data = await res.json();
        grid.replaceChildren();

        if (!Array.isArray(data) || !data.length) {
            const empty = document.createElement('p');
            empty.className = 'section-empty';
            empty.textContent = 'No credentials have been added yet.';
            grid.append(empty);
            return;
        }

        data.forEach((cert, index) => {
            const row = document.createElement('article');
            row.className = 'credential-row reveal';
            row.style.transitionDelay = `${index * 0.1}s`;

            // Col 1: Registry Index & Verified Beacon
            const statusCol = document.createElement('div');
            statusCol.className = 'cert-col-status';

            const indexTag = document.createElement('span');
            indexTag.className = 'cert-reg-index';
            indexTag.textContent = `REG // 0${index + 1}`;

            const beacon = document.createElement('div');
            beacon.className = 'cert-beacon';
            beacon.innerHTML = `
                <span class="cert-beacon-dot"></span>
                <span>ACCREDITED</span>
            `;
            statusCol.append(indexTag, beacon);

            // Col 2: Title & Issuing Authority
            const mainCol = document.createElement('div');
            mainCol.className = 'cert-col-main';

            const title = document.createElement('h3');
            title.className = 'cert-title';
            title.textContent = cert.title || 'Accredited Credential';

            const issuer = document.createElement('p');
            issuer.className = 'cert-issuer-line';
            issuer.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
                <span>${cert.issuer || 'Official Accreditation'}</span>
            `;
            mainCol.append(title, issuer);

            // Col 3: Compact Credential Emblem (NOT a giant card image)
            const badgeCol = document.createElement('div');
            badgeCol.className = 'cert-col-badge';
            if (cert.image_path) {
                const thumb = document.createElement('div');
                thumb.className = 'cert-emblem-thumb';
                const img = document.createElement('img');
                img.src = cert.image_path;
                img.alt = cert.title || 'Badge emblem';
                img.loading = 'lazy';
                img.decoding = 'async';
                img.width = 72;
                img.height = 48;
                thumb.append(img);
                badgeCol.append(thumb);
            } else {
                const seal = document.createElement('div');
                seal.className = 'cert-seal-icon';
                seal.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                `;
                badgeCol.append(seal);
            }

            // Col 4: Action / Verification Link
            const actionCol = document.createElement('div');
            actionCol.className = 'cert-col-action';
            if (cert.link) {
                const link = document.createElement('a');
                link.href = cert.link;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'cert-verify-button';
                link.innerHTML = `
                    <span>Verify Record</span>
                    <span class="cert-arrow-icon" aria-hidden="true">↗</span>
                `;
                actionCol.append(link);
            } else {
                const verifiedTag = document.createElement('span');
                verifiedTag.className = 'cert-verified-pill';
                verifiedTag.textContent = 'Active ID';
                actionCol.append(verifiedTag);
            }

            row.append(statusCol, mainCol, badgeCol, actionCol);
            grid.append(row);
        });
        observeNewReveals();
    } catch (e) {
        console.log(e);
        const empty = document.createElement('p');
        empty.className = 'section-empty';
        empty.textContent = 'No credentials have been added yet.';
        grid.replaceChildren(empty);
    }
}

// ==========================================
// 9. BLOG PAGE EXCLUSIVE LOGIC
// ==========================================
let allPosts = [];
let currentPage = 0;
const POSTS_PER_PAGE = 12;
let selectedCategory = 'all';

const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categoryFilters = document.getElementById('categoryFilters');

async function fetchAllPosts() {
    if (!blogGrid) return;
    // 🛑 CRITICAL: Do NOT overwrite server-rendered crawlable blog listing or article pages!
    if (document.body.classList.contains('blog-page-body') || document.querySelector('.blog-listing-section') || document.body.classList.contains('article-page-body')) {
        return;
    }
    try {
        const isHomepagePreview = Boolean(document.getElementById('insights')) && !categoryFilters;
        const res = await fetch(isHomepagePreview ? '/api/blog?featured=1' : '/api/blog');
        if (!res.ok) throw new Error('Blog request failed');
        allPosts = await res.json();
        if (!Array.isArray(allPosts) || !allPosts.length) {
            blogGrid.innerHTML = '<p class="section-empty">No field notes or articles published yet.</p>';
            return;
        }
        buildCategoryButtons(allPosts);
        applyFilter();
    } catch (e) {
        blogGrid.innerHTML = '<p class="section-empty">No field notes or articles published yet.</p>';
    }
}

function buildCategoryButtons(posts) {
    if (!categoryFilters) return;
    const categories = [...new Set(posts.map(p => p.category || 'Uncategorized'))];
    let html = '<button class="cat-btn active" data-category="all">All</button>';
    categories.forEach(cat => {
        html += `<button class="cat-btn" data-category="${cat}">${cat}</button>`;
    });
    categoryFilters.innerHTML = html;

    categoryFilters.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            categoryFilters.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.category;
            currentPage = 0;
            applyFilter();
        });
    });
}

function applyFilter() {
    const filtered = selectedCategory === 'all'
        ? allPosts
        : allPosts.filter(p => (p.category || 'Uncategorized') === selectedCategory);

    currentPage = 0;
    renderPage(filtered, currentPage);
    updateLoadMoreButton(filtered);
}

function buildBlogPreviewExcerpt(post) {
    const source = String(post.excerpt || post.content || '');
    if (!source) return '';

    const decoded = document.createElement('textarea');
    decoded.innerHTML = source
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<\/?(h[1-6]|p|div|section|article|li|ul|ol|br|blockquote|pre)[^>]*>/gi, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/<[^>]*>/g, ' ');

    const plainText = decoded.value
        .replace(/[\u00a0\t\r\n]+/g, ' ')
        .replace(/([.!?])(?=[A-Za-z])/g, '$1 ')
        .replace(/\b(Introduction|Overview|Summary|Conclusion)(?=[A-Z])/g, '$1 ')
        .replace(/^[#>*_`~\s]+/, '')
        .replace(/^(?:introduction|overview|summary)\s*[:.\-–—]?\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (plainText.length <= 155) return plainText;
    const clipped = plainText.slice(0, 155).replace(/\s+\S*$/, '').trim();
    return `${clipped}…`;
}

function renderPage(filteredPosts, page) {
    if (!blogGrid) return;
    const start = page * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const isHomepagePreview = Boolean(document.getElementById('insights')) && !categoryFilters;
    const pagePosts = filteredPosts.slice(start, isHomepagePreview ? 3 : end);

    if (page === 0) blogGrid.innerHTML = '';
    if (!pagePosts.length && page === 0) {
        blogGrid.innerHTML = '<p style="color:var(--text2);">No articles in this category.</p>';
        return;
    }

    pagePosts.forEach((post, index) => {
        const excerpt = buildBlogPreviewExcerpt(post);
        const card = document.createElement('article');
        card.className = isHomepagePreview ? 'blog-card editorial-note reveal' : 'blog-card';
        if (isHomepagePreview) card.style.transitionDelay = `${index * 0.1}s`;

        const postSlug = post.slug || post.id;
        const addFallbackCover = () => {
            if (card.querySelector('.blog-fallback-cover')) return;
            const cover = document.createElement('div');
            cover.className = 'blog-fallback-cover';
            const label = document.createElement('span'); label.textContent = post.category || 'Field note';
            const mark = document.createElement('b'); mark.textContent = (post.title || 'SH').slice(0, 2).toUpperCase();
            cover.append(label, mark); card.prepend(cover);
        };
        if (post.image_path) {
            const imageWrap = document.createElement('div');
            imageWrap.className = 'blog-image-wrap';
            const image = document.createElement('img');
            image.src = post.image_path;
            image.className = 'blog-img';
            image.alt = post.title || 'Blog article image';
            image.loading = 'lazy'; image.decoding = 'async'; image.width = 600; image.height = 340;
            image.onerror = () => { imageWrap.remove(); card.classList.add('blog-card-no-image'); addFallbackCover(); };
            imageWrap.append(image); card.append(imageWrap);
        } else addFallbackCover();
        const body = document.createElement('div'); body.className = 'blog-body';
        const category = document.createElement('span'); category.className = 'blog-category'; category.textContent = post.category || 'General';
        const title = document.createElement('h3'); title.className = 'blog-title'; title.textContent = post.title || 'Untitled article';
        const summary = document.createElement('p'); summary.className = 'blog-excerpt'; summary.textContent = excerpt;
        const read = document.createElement('a'); read.href = `/blog/${encodeURIComponent(postSlug)}`; read.className = 'read-more'; read.textContent = 'Read article →';
        body.append(category, title, summary, read); card.append(body);
        blogGrid.appendChild(card);
    });
    observeNewReveals();
}

function updateLoadMoreButton(filteredPosts) {
    if (!loadMoreBtn) return;
    const remaining = filteredPosts.length - (currentPage + 1) * POSTS_PER_PAGE;
    if (remaining > 0) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = `Load More Posts (${remaining} remaining)`;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const filtered = selectedCategory === 'all'
            ? allPosts
            : allPosts.filter(p => (p.category || 'Uncategorized') === selectedCategory);

        currentPage++;
        renderPage(filtered, currentPage);
        updateLoadMoreButton(filtered);
    });
}

async function fetchSingleArticle() {
    const articleContainer = document.getElementById('article-content');
    if (!articleContainer) return;
    if (document.body.classList.contains('article-page-body')) return;

    const params = new URLSearchParams(window.location.search);
    const articleIdentifier = params.get('slug') || params.get('id');

    if (!articleIdentifier) {
        articleContainer.innerHTML = '<p style="color:var(--text2); text-align:center;">Article identifier is missing in URL!</p>';
        return;
    }

    try {
        const res = await fetch(`/api/blog/${articleIdentifier}`);
        if (!res.ok) throw new Error('Not found');

        const data = await res.json();
        const article = data.post ? data.post : data;

        const title = article.title || article.blog_title || 'Untitled Post';
        const category = article.category || article.blog_category || 'General';
        const content = article.content || article.description || article.body || article.text || 'No content available.';
        const image = article.image_path || article.img_path || '';

        document.title = `${title} | Blog`;

        articleContainer.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <span class="blog-category" style="margin-bottom: 1.5rem; display: inline-block;">${category}</span>
                <h1 class="blog-title" style="margin-bottom: 2rem; text-align: center; background: linear-gradient(135deg, #fff, var(--text2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; line-height: 1.3; width: 100%;">${title}</h1>
                ${image ? `<img src="${image}" class="blog-detail-img" alt="${title}" loading="lazy" decoding="async" width="800" height="450">` : ''}
                <div class="blog-excerpt" style="color: var(--text); font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap; text-align: left; width: 100%; max-width: 750px; letter-spacing: 0.3px; margin-top: 1rem;">${content}</div>
            </div>
        `;
    } catch (e) {
        console.error("Fetch Error:", e);
        articleContainer.innerHTML = '<p style="color:#e74c3c; text-align:center;">⚠️ Failed to load the article. Please check your database data or URL.</p>';
    }
}

// ═══════════════════════════════════════════
// ✉️ CONTACT FORM SUBMISSION
// ═══════════════════════════════════════════
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.form-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="form-submit-content"><span>Transmitting payload... ⏳</span></span>';
        }

        const formData = new FormData(contactForm);

        try {
            console.log("⏳ Dispatched payload fields to endpoint...");
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok && data.success) {
                window.showToast('Message transmitted securely!', 'success');
                contactForm.reset();
            } else {
                alert('⚠️ Error: ' + (data.error || 'Something went wrong.'));
            }
        } catch (err) {
            console.error("Submission Failure Layer:", err);
            window.showToast('Something went wrong. Please try again.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="form-submit-content"><span class="submit-icon">⚡</span> <span class="submit-label">Transmit Message</span> <span class="submit-arrow">↗</span></span>';
            }
        }
    });

    const copyBtn = document.getElementById('btn-copy-contact-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = document.getElementById('contact-email-display')?.innerText.trim() || 'sabbirhasan800@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                if (window.showToast) window.showToast('Email address copied to clipboard! 📋', 'success');
            }).catch(() => {
                if (window.showToast) window.showToast(email, 'info');
            });
        });
    }
}

// ═══════════════════════════════════════════
// 🎥 SECTION 14: BROADCAST STUDIO & MEDIA CHANNELS
// ═══════════════════════════════════════════
let allMediaChannels = [];
let allMediaVideos = [];
let activeMediaFilter = 'all';

function extractYouTubeEmbedId(url) {
    if (!url) return null;
    const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    return match ? match[1] : null;
}

function renderMediaChannels() {
    const deck = document.getElementById('streams-channels-deck');
    const videoGrid = document.getElementById('streams-video-grid');
    const videoCounter = document.getElementById('streams-video-counter');
    if (!deck) return;

    const filteredChannels = activeMediaFilter === 'all' 
        ? allMediaChannels 
        : allMediaChannels.filter(ch => (ch.platform || '').toLowerCase() === activeMediaFilter);

    const filteredVideos = activeMediaFilter === 'all'
        ? allMediaVideos
        : allMediaVideos.filter(v => (v.platform || '').toLowerCase() === activeMediaFilter);

    if (videoCounter) {
        videoCounter.textContent = `${filteredVideos.length} HIGHLIGHT${filteredVideos.length === 1 ? '' : 'S'}`;
    }

    // Render Channels
    if (filteredChannels.length === 0) {
        deck.innerHTML = `
        <div class="streams-empty-terminal" style="grid-column: 1 / -1; padding: 2.5rem 1.5rem; text-align: center; border: 1px dashed rgba(243, 240, 233, 0.12); border-radius: 10px; background: rgba(0,0,0,0.25);">
            <span style="font-size: 1.8rem; display: block; margin-bottom: 0.5rem;" aria-hidden="true">📡</span>
            <h4 style="margin: 0 0 0.4rem; color: var(--v5-ink); font-family: var(--font-mono); font-size: 0.92rem; letter-spacing: 0.06em; text-transform: uppercase;">BROADCAST STATIONS STANDBY</h4>
            <p style="margin: 0; color: var(--text3); font-size: 0.84rem;">No channels linked yet. Add your YouTube, Kick, or Twitch channels from the Admin Dashboard.</p>
        </div>`;
    } else {
        deck.innerHTML = filteredChannels.map(ch => {
            const platform = (ch.platform || 'youtube').toLowerCase();
            const platformName = platform === 'youtube' ? 'YouTube' : (platform === 'twitch' ? 'Twitch' : 'Kick');
            const subBtnText = platform === 'youtube' ? 'Subscribe' : 'Follow';
            const isLive = Boolean(ch.is_live);
            const liveStatusHtml = isLive 
                ? `<span class="channel-live-status is-live"><span class="pulse-beacon-dot"></span> LIVE NOW</span>`
                : `<span class="channel-live-status is-offline">OFFLINE</span>`;

            const avatarHtml = ch.avatar_url 
                ? `<img class="channel-avatar-img" src="${ch.avatar_url}" alt="${ch.channel_name}" loading="lazy">`
                : `<div class="channel-avatar-fallback">${(ch.channel_name || 'C').charAt(0).toUpperCase()}</div>`;

            return `
            <div class="channel-card" data-platform="${platform}">
                <div class="channel-top-bar">
                    <span class="channel-platform-pill">${platformName}</span>
                    ${liveStatusHtml}
                </div>
                <div class="channel-profile-row">
                    <div class="channel-avatar-wrap">
                        ${avatarHtml}
                        ${isLive ? '<div class="channel-live-pulse-ring" aria-hidden="true"></div>' : ''}
                    </div>
                    <div class="channel-meta">
                        <h3 class="channel-name">${ch.channel_name}</h3>
                        ${ch.channel_handle ? `<span class="channel-handle">${ch.channel_handle}</span>` : ''}
                        <span class="channel-badge">${ch.badge_text || 'BROADCASTER'}</span>
                    </div>
                </div>
                ${ch.description ? `<p class="channel-desc">${ch.description}</p>` : ''}
                <div class="channel-action-row">
                    <span class="channel-stat-badge">${ch.subscribers_count || 'Official Channel'}</span>
                    <a href="${ch.channel_url}" target="_blank" rel="noopener" class="channel-sub-btn">
                        <span>${subBtnText}</span>
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>`;
        }).join('');
    }

    // Render Videos
    if (!videoGrid) return;
    if (filteredVideos.length === 0) {
        videoGrid.innerHTML = `
        <div class="streams-empty-terminal" style="grid-column: 1 / -1; padding: 2.5rem 1.5rem; text-align: center; border: 1px dashed rgba(243, 240, 233, 0.12); border-radius: 10px; background: rgba(0,0,0,0.25);">
            <span style="font-size: 1.8rem; display: block; margin-bottom: 0.5rem;" aria-hidden="true">🎬</span>
            <h4 style="margin: 0 0 0.4rem; color: var(--v5-ink); font-family: var(--font-mono); font-size: 0.92rem; letter-spacing: 0.06em; text-transform: uppercase;">NO VIDEO HIGHLIGHTS YET</h4>
            <p style="margin: 0; color: var(--text3); font-size: 0.84rem;">Featured video highlights added in the Admin Dashboard will stream here directly.</p>
        </div>`;
    } else {
        videoGrid.innerHTML = filteredVideos.map(v => {
            const platform = (v.platform || 'youtube').toLowerCase();
            const badgeClass = platform === 'youtube' ? 'yt' : (platform === 'twitch' ? 'twitch' : 'kick');
            const ytId = extractYouTubeEmbedId(v.video_url);
            const thumbUrl = v.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');

            return `
            <div class="video-card" data-video-url="${v.video_url}" data-video-title="${encodeURIComponent(v.title)}" data-platform="${platform}">
                <div class="video-thumb-container">
                    <img class="video-thumb-img" src="${thumbUrl}" alt="${v.title}" loading="lazy">
                    <span class="video-platform-badge ${badgeClass}">${platform.toUpperCase()}</span>
                    ${v.duration ? `<span class="video-duration-badge">${v.duration}</span>` : ''}
                    <div class="video-play-overlay" aria-label="Play video">
                        <div class="video-play-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="6 3 20 12 6 21 6 3"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="video-details">
                    <h3 class="video-card-title">${v.title}</h3>
                    <div class="video-card-meta">
                        <span>${v.views_count || 'Featured Broadcast'}</span>
                        <span style="color: var(--cyan);">Watch Now ↗</span>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Attach click handlers to open Cinema Video Modal
        videoGrid.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const url = card.dataset.videoUrl;
                const title = decodeURIComponent(card.dataset.videoTitle || 'Video Highlight');
                const platform = card.dataset.platform || 'youtube';
                openCinemaModal(url, title, platform);
            });
        });
    }

    if (typeof observeNewReveals === 'function') {
        observeNewReveals();
    }
}

function openCinemaModal(url, title, platform) {
    const modal = document.getElementById('video-cinema-modal');
    const playerInner = document.getElementById('cinema-player-inner');
    const titleEl = document.getElementById('cinema-title');
    const badgeEl = document.getElementById('cinema-badge');
    if (!modal || !playerInner) return;

    if (titleEl) titleEl.textContent = title;
    if (badgeEl) {
        badgeEl.textContent = platform.toUpperCase();
        badgeEl.style.background = platform === 'youtube' ? '#ef4444' : (platform === 'twitch' ? '#a855f7' : '#22c55e');
    }

    const ytId = extractYouTubeEmbedId(url);
    if (ytId) {
        playerInner.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${title}"></iframe>`;
    } else if (platform === 'twitch') {
        const channelName = url.split('/').filter(Boolean).pop();
        const hostname = window.location.hostname || 'localhost';
        playerInner.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channelName}&parent=${hostname}&autoplay=true" allowfullscreen title="${title}"></iframe>`;
    } else {
        playerInner.innerHTML = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #fff; background: #06090d; padding: 2rem; text-align: center;">
            <p style="margin: 0; font-size: 1.1rem;">Opening stream on ${platform.toUpperCase()}...</p>
            <a href="${url}" target="_blank" rel="noopener" class="channel-sub-btn" style="background: #22c55e;">Launch Direct Stream ↗</a>
        </div>`;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCinemaModal() {
    const modal = document.getElementById('video-cinema-modal');
    const playerInner = document.getElementById('cinema-player-inner');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (playerInner) playerInner.innerHTML = '';
    document.body.style.overflow = '';
}

function initMediaSectionEvents() {
    const filterTabs = document.querySelectorAll('.streams-filter-tabs .stream-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            activeMediaFilter = tab.dataset.platform || 'all';
            renderMediaChannels();
        });
    });

    const closeBtn = document.getElementById('cinema-close-btn');
    const backdrop = document.getElementById('cinema-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeCinemaModal);
    if (backdrop) backdrop.addEventListener('click', closeCinemaModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCinemaModal();
    });
}

async function fetchMediaChannels() {
    try {
        const res = await fetch('/api/media-channels');
        if (!res.ok) throw new Error('Failed to fetch channels');
        const data = await res.json();
        allMediaChannels = data.channels || [];
        allMediaVideos = data.videos || [];
        renderMediaChannels();
    } catch (e) {
        console.error('Media channels error:', e);
        const deck = document.getElementById('streams-channels-deck');
        if (deck) deck.innerHTML = `<div class="streams-loading-state" style="color: var(--text3);">Streaming channels will be back online shortly.</div>`;
    }
}

// ═══════════════════════════════════════════
// 🚀 MAIN RUNTIME EXECUTION GATEWAY
// Parallel API calls for maximum speed
// ═══════════════════════════════════════════
Promise.allSettled([
    fetchHomepageSections(),
    fetchProfile(),
    fetchProjects(),
    fetchExperience(),
    fetchEducation(),
    fetchServices(),
    fetchCertificates(),
    fetchMediaChannels(),
    fetchAllPosts(),
    fetchSingleArticle()
]); // Each public API preserves its own static fallback when unavailable.

// 🔄 Seamless Marquee Runner (Smooth infinite horizontal scroll without duplicate source HTML)
function initTechMarquee() {
    const track = document.getElementById('techMarqueeTrack');
    if (!track) return;
    const group = track.querySelector('.marquee-group');
    if (group && !track.querySelector('.marquee-group-clone')) {
        const clone = group.cloneNode(true);
        clone.classList.add('marquee-group-clone');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    }
}
initTechMarquee();

initContactForm();
initMediaSectionEvents();

// 🌐 Footer Station Telemetry Clock (Dynamic Timezone Support - 12 Hour Format)
let currentStationTimezone = 'Asia/Dhaka';

function setFooterTimezone(tz) {
    if (tz && typeof tz === 'string' && tz.trim()) {
        currentStationTimezone = tz.trim();
        if (window._footerUpdateClock) window._footerUpdateClock();
    }
}
window.setFooterTimezone = setFooterTimezone;

function initFooterClock() {
    const clockEl = document.getElementById('footer-live-clock');
    if (!clockEl) return;
    function updateClock() {
        try {
            const now = new Date();
            const tz = currentStationTimezone || 'Asia/Dhaka';
            const timeStr = now.toLocaleTimeString('en-US', {
                timeZone: tz,
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            // Normalize GMT+6 to BST if Dhaka for clean aesthetic
            const formatted = (tz === 'Asia/Dhaka') ? timeStr.replace(/GMT\+6/i, 'BST') : timeStr;
            clockEl.textContent = formatted;
        } catch (e) {
            // Fallback for custom or invalid timezone input
            const now = new Date();
            let hours = now.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const hoursStr = String(hours).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
        }
    }
    window._footerUpdateClock = updateClock;
    updateClock();
    setInterval(updateClock, 1000);
}
initFooterClock();

// 🔝 Footer Back-to-Top Handler
function initFooterBackToTop() {
    const btn = document.getElementById('footer-back-to-top');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
initFooterBackToTop();

// 🌌 Hero 3D Interactive Mouse Parallax Engine
function initHeroParallax() {
    const hero = document.getElementById('home');
    const visual = document.getElementById('heroScene');
    if (!hero || !visual || window.innerWidth <= 900) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isTracking = false;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

        targetX = normX * 18; // Max 18px drift
        targetY = normY * 14; // Max 14px drift

        if (!isTracking) {
            isTracking = true;
            requestAnimationFrame(updateParallax);
        }
    });

    hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    function updateParallax() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        hero.style.setProperty('--hero-pointer-x', `${currentX.toFixed(2)}px`);
        hero.style.setProperty('--hero-pointer-y', `${currentY.toFixed(2)}px`);

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            requestAnimationFrame(updateParallax);
        } else {
            isTracking = false;
        }
    }
}
initHeroParallax();
