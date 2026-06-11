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

// ⌨️ Typing Effect (🔴 FIXED: Null Safety Added)
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

// 📱 Navbar & Mobile Menu (🔴 FIXED: Hybrid Menu Logic for Home/Blog + Hamburger)
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));
}

const hamburger = document.getElementById('hamburger');
const navDropdown = document.getElementById('navDropdown');

if (hamburger && navDropdown) {
    // ৩-বার আইকনে ক্লিক করলে মেনু টগল হবে
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // গ্লোবাল ক্লিকের সাথে ওভারল্যাপ বন্ধ করতে
        hamburger.classList.toggle('active');
        navDropdown.classList.toggle('active');
    });

    // ড্রপডাউনের ভেতরের কোনো লিংকে ক্লিক করলে মেনু বন্ধ হয়ে যাবে
    navDropdown.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navDropdown.classList.remove('active');
        });
    });

    // মেনুর বাইরে কোথাও ক্লিক করলে ড্রপডাউন অটোমেটিক বন্ধ হবে
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
            hamburger.classList.remove('active');
            navDropdown.classList.remove('active');
        }
    });
}

// 📅 Footer Year (🔴 FIXED: Null Safety Added)
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════
// 🔗 BACKEND API INTEGRATION
// ═══════════════════════════════════════════

// Fetch profile – builds social links, profile picture, GitHub graph
async function fetchProfile() {
    try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
            console.log('Backend server error. Showing fallback buttons.');
            return;
        }

        const data = await res.json();
        if (!data) return;

        // Hero buttons (CV + Contact)
        const heroBtns = document.getElementById('hero-buttons');
        if (heroBtns) {
            heroBtns.innerHTML = '';
            if (data.cv_file_path) {
                heroBtns.innerHTML += `<a href="${data.cv_file_path}" target="_blank" class="btn btn-outline">📄 Download CV</a>`;
            }
            heroBtns.innerHTML += `<a href="#contact" class="btn btn-primary">✉️ Contact Me</a>`;
        }

        // বাটন এলিমেন্টগুলো সিলেক্ট করা
        const githubBtn = document.getElementById('link-github');
        const linkedinBtn = document.getElementById('link-linkedin');
        const facebookBtn = document.getElementById('link-facebook');
        const fiverrBtn = document.getElementById('link-fiverr');
        const pinterestBtn = document.getElementById('link-pinterest');

        // 🛠️ কন্ডিশন চেক: লিংক থাকলে href বসবে, না থাকলে বাটন ডিলিট হয়ে যাবে (নিরাপদ রিমুভ)
        if (data.github_link && data.github_link.trim() !== "") {
            if (githubBtn) githubBtn.href = data.github_link;
        } else if (githubBtn) {
            githubBtn.remove();
        }

        if (data.linkedin_link && data.linkedin_link.trim() !== "") {
            if (linkedinBtn) linkedinBtn.href = data.linkedin_link;
        } else if (linkedinBtn) {
            linkedinBtn.remove();
        }

        if (data.facebook_link && data.facebook_link.trim() !== "") {
            if (facebookBtn) facebookBtn.href = data.facebook_link;
        } else if (facebookBtn) {
            facebookBtn.remove();
        }

        if (data.fiverr_link && data.fiverr_link.trim() !== "") {
            if (fiverrBtn) fiverrBtn.href = data.fiverr_link;
        } else if (fiverrBtn) {
            fiverrBtn.remove();
        }

        if (data.pinterest_link && data.pinterest_link.trim() !== "") {
            if (pinterestBtn) pinterestBtn.href = data.pinterest_link;
        } else if (pinterestBtn) {
            pinterestBtn.remove();
        }

        // গিটহাব প্রোফাইল পিকচার ও গ্রাফ লোড করা
        if (data.github_link && data.github_link.trim() !== "") {
            const username = data.github_link.replace(/\/$/, '').split('/').pop();
            
            const aboutImgContainer = document.getElementById('about-image');
            if (aboutImgContainer) {
                aboutImgContainer.innerHTML = `<img src="https://github.com/${username}.png" style="width:100%; height:100%; object-fit:cover; object-position:top center; display:block; border-radius:50%;">`;
            }
            
            const graphImg = document.getElementById('github-graph-mini');
            const graphLoading = document.getElementById('github-loading');
            if (graphImg && graphLoading) {
                graphImg.src = `https://ghchart.rshah.org/38bdf8/${username}?v=${Date.now()}`;
                graphImg.onload = () => { graphImg.style.display = 'block'; graphLoading.style.display = 'none'; };
                graphImg.onerror = () => { graphLoading.textContent = 'Could not load graph.'; };
            }
        }
    } catch (e) {
        console.log('Profile fetch skipped or network error encountered:', e);
    }
}

// Fetch projects (includes GitHub auto-imported)
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
                <div class="project-image">
                    ${proj.image_path ? `<img src="${proj.image_path}" alt="${proj.title}">` : '🚀'}
                </div>
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
    } catch (e) {
        console.log('Projects fetch error');
    }
}

// Fetch experience
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
    } catch (e) { console.log('Experience fetch error'); }
}

// Fetch education
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
    } catch (e) { console.log('Education fetch error'); }
}

// Contact form submission (🔴 FIXED: Null Safety Added)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fb = document.getElementById('formFeedback');
        if (fb) {
            fb.className = 'form-feedback';
            fb.style.display = 'none';
        }

        const payload = {
            sender_name: document.getElementById('contact-name').value,
            sender_email: document.getElementById('contact-email').value,
            sender_phone: document.getElementById('contact-phone').value,
            message: document.getElementById('contact-message').value
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && fb) {
                fb.className = 'form-feedback success';
                fb.textContent = '✅ Message sent successfully!';
                contactForm.reset();
            } else if (fb) {
                fb.className = 'form-feedback error';
                fb.textContent = data.error || 'Something went wrong.';
            }
            if (fb) fb.style.display = 'block';
        } catch (err) {
            if (fb) {
                fb.className = 'form-feedback error';
                fb.textContent = 'Network error. Please try again.';
                fb.style.display = 'block';
            }
        }
    });
}

// Load everything on page start
fetchProfile();
fetchProjects();
fetchExperience();
fetchEducation();

// 🎯 Project Card Tilt Effect
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.project-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        card.style.transform = `perspective(800px) rotateX(${(y - cy) / cy * -6}deg) rotateY(${(x - cx) / cx * 6}deg)`;
    });
});
document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
});

// ==========================================================================
// 9. BLOG PAGE EXCLUSIVE LOGIC (আপনার নতুন ব্লগের সম্পূর্ণ জাভাস্ক্রিপ্ট)
// ==========================================================================
let allPosts = [];
let currentPage = 0;
const POSTS_PER_PAGE = 10;
let selectedCategory = 'all';

const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const categoryFilters = document.getElementById('categoryFilters');

// Fetch all posts from your backend
async function fetchAllPosts() {
    if (!blogGrid) return; 
    try {
        const res = await fetch('/api/blog');
        const posts = await res.json();
        allPosts = posts;
        buildCategoryButtons(posts);
        applyFilter();
    } catch (e) {
        blogGrid.innerHTML = '<p style="color:#e74c3c;">Failed to load blog posts.</p>';
    }
}

// Build category buttons from unique categories
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

// Filter posts by category and show page 0
function applyFilter() {
    const filtered = selectedCategory === 'all'
        ? allPosts
        : allPosts.filter(p => (p.category || 'Uncategorized') === selectedCategory);

    currentPage = 0;
    renderPage(filtered, currentPage);
    updateLoadMoreButton(filtered);
}

// Render posts for a specific page
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
        card.innerHTML = `
            ${post.image_path ? `<img src="${post.image_path}" class="blog-img" alt="${post.title}">` : ''}
            <div class="blog-body">
                <span class="blog-category">${post.category || 'General'}</span>
                <h3 class="blog-title">${post.title}</h3>
                <div class="blog-excerpt">${excerpt}</div>
                <a href="article.html?id=${post.id}" class="read-more">Read Article →</a>
            </div>`;
        blogGrid.appendChild(card);
    });
}

// Show/hide load more button
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

// Load more button click
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

// Start
fetchAllPosts();