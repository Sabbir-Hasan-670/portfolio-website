// ⭐ Starfield Background
(function() {
    const sc = document.getElementById('starCanvas');
    if (!sc) return;
    const sctx = sc.getContext('2d');
    let stars = [], shootingStars = [];
    const starCount = 180;

    function resize() { sc.width = window.innerWidth; sc.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', () => { resize(); initStars(); });

    class Star {
        constructor() {
            this.x = Math.random() * sc.width;
            this.y = Math.random() * sc.height;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.speed = Math.random() * 0.015 + 0.005;
        }
        update() {
            this.opacity += this.speed;
            if (this.opacity > 0.85 || this.opacity < 0.25) this.speed *= -1;
        }
        draw() {
            sctx.beginPath();
            sctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            sctx.fillStyle = `rgba(200,220,255,${this.opacity})`;
            sctx.fill();
        }
    }
    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * sc.width;
            this.y = Math.random() * sc.height * 0.4;
            this.length = Math.random() * 70 + 20;
            this.speed = Math.random() * 5 + 3;
            this.opacity = 1;
            this.angle = Math.PI / 4;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.012;
            if (this.opacity <= 0 || this.x > sc.width || this.y > sc.height) {
                this.reset();
                this.x = Math.random() * sc.width;
                this.y = Math.random() * sc.height * 0.25;
                this.opacity = 1;
            }
        }
        draw() {
            sctx.beginPath();
            sctx.moveTo(this.x, this.y);
            sctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            sctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
            sctx.lineWidth = 1.3;
            sctx.stroke();
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) stars.push(new Star());
        shootingStars = [];
        for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());
    }
    initStars();

    function animate() {
        sctx.clearRect(0, 0, sc.width, sc.height);
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ⌨️ Typing Effect
(function() {
    const el = document.getElementById('typingText');
    if (!el) return; 

    const titles = ['Multidisciplinary IT Specialist', 'Graphic Designer', 'Web Developer', 'Network Security Enthusiast'];
    let ti = 0, ci = 0, del = false;

    function type() {
        if (!el) return; 
        const cur = titles[ti];
        if (!del) {
            el.textContent = cur.substring(0, ci + 1);
            ci++;
            if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
        } else {
            el.textContent = cur.substring(0, ci - 1);
            ci--;
            if (ci === 0) { del = false; ti = (ti + 1) % titles.length; }
        }
        setTimeout(type, del ? 35 : 80);
    }
    type();
})();

// 👁️ Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 📱 Navbar & Mobile Menu Control Framework
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));
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

// 📅 Footer Year (Null Safety Added)
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════
// 🔗 BACKEND API INTEGRATION
// ═══════════════════════════════════════════

async function fetchProfile() {
    const heroBtns = document.getElementById('hero-buttons');
    const githubBtn = document.getElementById('link-github');
    if (!heroBtns && !githubBtn) return; 

    try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        if (heroBtns) {
            heroBtns.innerHTML = '';
            if (data.cv_file_path) {
                heroBtns.innerHTML += `<a href="${data.cv_file_path}" target="_blank" class="btn btn-outline">📄 Download CV</a>`;
            }
            heroBtns.innerHTML += `<a href="#contact" class="btn btn-primary">✉️ Contact Me</a>`;
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

        if (data.facebook_link && data.facebook_link.trim() !== "") {
            if (facebookBtn) facebookBtn.href = data.facebook_link;
        } else if (facebookBtn) { facebookBtn.remove(); }

        if (data.fiverr_link && data.fiverr_link.trim() !== "") {
            if (fiverrBtn) fiverrBtn.href = data.fiverr_link;
        } else if (fiverrBtn) { fiverrBtn.remove(); }

        if (data.pinterest_link && data.pinterest_link.trim() !== "") {
            if (pinterestBtn) pinterestBtn.href = data.pinterest_link;
        } else if (pinterestBtn) { pinterestBtn.remove(); }

        if (data.github_link && data.github_link.trim() !== "") {
            const username = data.github_link.replace(/\/$/, '').split('/').pop();
            const aboutImgContainer = document.getElementById('about-image');
            if (aboutImgContainer) {
                aboutImgContainer.innerHTML = `<img src="https://github.com/${username}.png" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
            }
            
            const graphImg = document.getElementById('github-graph-mini');
            const graphLoading = document.getElementById('github-loading');
            if (graphImg && graphLoading) {
                graphImg.src = `https://ghchart.rshah.org/38bdf8/${username}?v=${Date.now()}`;
                graphImg.onload = () => { graphImg.style.display = 'block'; graphLoading.style.display = 'none'; };
                graphImg.onerror = () => { graphLoading.textContent = 'Could not load graph.'; };
            }
        }
    } catch (e) { console.log(e); }
}

async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        grid.innerHTML = '';
        if (!projects.length) {
            grid.innerHTML = '<p style="color:#94a3b8;text-align:center;">No projects yet.</p>';
            return;
        }
        projects.forEach(proj => {
            const isGithub = proj.id && String(proj.id).startsWith('gh-');
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.innerHTML = `
                ${isGithub ? '<div style="color:#6366f1; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">⚡ Auto-Imported</div>' : ''}
                <div class="project-image">${proj.image_path ? `<img src="${proj.image_path}" alt="${proj.title}">` : '🚀'}</div>
                <div class="project-body">
                    <h3>${proj.title}</h3>
                    <p>${proj.description || ''}</p>
                    <div class="project-tags">${proj.languages || ''}</div>
                    <div style="margin-top:0.8rem;display:flex;gap:6px;">
                        ${proj.live_url ? `<a href="${proj.live_url}" target="_blank" class="btn btn-primary" style="padding:0.35rem 0.7rem;font-size:0.75rem;">Live Demo ↗</a>` : ''}
                        ${proj.github_url ? `<a href="${proj.github_url}" target="_blank" class="btn btn-outline" style="padding:0.35rem 0.7rem;font-size:0.75rem;">GitHub ↗</a>` : ''}
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    } catch (e) { console.log(e); }
}

async function fetchExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/experience');
        const data = await res.json();
        timeline.innerHTML = '';
        if (!data.length) {
            timeline.innerHTML = '<p style="color:#94a3b8;">No experience added yet.</p>';
            return;
        }
        data.forEach(exp => {
            timeline.innerHTML += `
                <div class="reveal" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:1.3rem;">
                    <div class="timeline-role">${exp.role}</div>
                    <div class="timeline-sub">${exp.company_or_project} | ${exp.duration}</div>
                    <div class="timeline-desc">${exp.description}</div>
                </div>`;
        });
    } catch (e) { console.log(e); }
}

async function fetchEducation() {
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/education');
        const data = await res.json();
        timeline.innerHTML = '';
        if (!data.length) {
            timeline.innerHTML = '<p style="color:#94a3b8;">No education added yet.</p>';
            return;
        }
        data.forEach(edu => {
            timeline.innerHTML += `
                <div class="reveal" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:1.3rem;">
                    <div class="timeline-role">${edu.degree}</div>
                    <div class="timeline-sub">${edu.institution} | ${edu.duration}</div>
                    <div class="timeline-desc">${edu.description || ''}</div>
                </div>`;
        });
    } catch (e) { console.log(e); }
}

// Loader Engine for Services Grid Component
async function fetchServices() {
    const grid = document.getElementById('public-services-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/services');
        const data = await res.json();
        
        if (!data || !Array.isArray(data)) {
            grid.innerHTML = '<p style="text-align:center; width:100%; color:#94a3b8;">No services available at the moment.</p>';
            return;
        }
        
        grid.innerHTML = data.length ? '' : '<p style="text-align:center; width:100%; color:#94a3b8;">No services added yet.</p>';
        
        data.forEach(srv => {
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
                <div class="service-card">
                    <div class="service-icon-box">${srv.icon || '💻'}</div>
                    <h3 class="service-title">${srv.title}</h3>
                    <p class="service-desc">${srv.description}</p>
                    <div class="service-tags">${tagsHtml}</div>
                </div>
            `;
        });
    } catch (e) { 
        console.log("Services Fetch Exception Block Handled:", e);
        if (grid) grid.innerHTML = '<p style="text-align:center; width:100%; color:#94a3b8;">Services module active.</p>';
    }
}

// ==========================================
// 9. BLOG PAGE EXCLUSIVE LOGIC
// ==========================================
let allPosts = [];
let currentPage = 0;
const POSTS_PER_PAGE = 10;
let selectedCategory = 'all';

const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categoryFilters = document.getElementById('categoryFilters');

async function fetchAllPosts() {
    if (!blogGrid) return; 
    try {
        const res = await fetch('/api/blog');
        allPosts = await res.json();
        buildCategoryButtons(allPosts);
        applyFilter();
    } catch (e) {
        blogGrid.innerHTML = '<p style="color:#e74c3c;">Failed to load blog posts.</p>';
    }
}

function buildCategoryButtons(posts) {
    if (!categoryFilters) return;
    const categories = [...new Set(posts.map(p => p.category || 'Uncategorized'))];
    let html = '<button class="cat-btn active" data-category="all">All</button>';
    categories.forEach(cat => {
        // 🌟 FIXED STRING LITERAL HACK RIGHT HERE:
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

function renderPage(filteredPosts, page) {
    if (!blogGrid) return;
    const start = page * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(start, end);

    if (page === 0) blogGrid.innerHTML = '';
    if (!pagePosts.length && page === 0) {
        blogGrid.innerHTML = '<p style="color:var(--text2);">No articles in this category.</p>';
        return;
    }

    pagePosts.forEach(post => {
        const excerpt = post.content ? post.content.substring(0, 120) + '...' : '';
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        const postSlug = post.slug || post.id;
        card.innerHTML = `
            ${post.image_path ? `<img src="${post.image_path}" class="blog-img" alt="${post.title}">` : ''}
            <div class="blog-body">
                <span class="blog-category">${post.category || 'General'}</span>
                <h3 class="blog-title">${post.title}</h3>
                <div class="blog-excerpt">${excerpt}</div>
                <a href="article.html?slug=${postSlug}" class="read-more">Read Article →</a>
            </div>`;
        blogGrid.appendChild(card);
    });
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
                ${image ? `<img src="${image}" class="blog-img" style="display: block; margin: 0 auto 2rem auto; max-width: 100%; height: auto; max-height: 450px; border-radius: var(--radius); object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" alt="${title}">` : ''}
                <div class="blog-excerpt" style="color: var(--text); font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap; text-align: left; width: 100%; max-width: 750px; letter-spacing: 0.3px; margin-top: 1rem;">${content}</div>
            </div>
        `;
    } catch (e) {
        console.error("Fetch Error:", e);
        articleContainer.innerHTML = '<p style="color:#e74c3c; text-align:center;">⚠️ Failed to load the article. Please check your database data or URL.</p>';
    }
}

// ═══════════════════════════════════════════
// ✉️ CONTACT FORM SUBMISSION LISTENER (RELOAD PROTECTION FIXED)
// ═══════════════════════════════════════════
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const submitBtn = contactForm.querySelector('.form-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending Message... ⏳";
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
                alert('✅ Success: Message logged and sent safely!');
                contactForm.reset(); 
            } else {
                alert('⚠️ Error: ' + (data.error || 'Something went wrong.'));
            }
        } catch (err) {
            console.error("Submission Failure Layer:", err);
            alert('❌ Network failed. Please check backend API server logs.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message 🚀";
            }
        }
    });
}

// ═══════════════════════════════════════════
// 🚀 MAIN RUNTIME EXECUTION GATEWAY
// ═══════════════════════════════════════════
fetchProfile();
fetchProjects();
fetchExperience();
fetchEducation();
fetchServices(); 
fetchAllPosts();
fetchSingleArticle();
initContactForm();