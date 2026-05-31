document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. LIVE CLOCK (Local Visitor Time)
    // ==========================================
    function updateClock() {
        const clockEl = document.getElementById('live-clock');
        if (!clockEl) return;

        const now = new Date();
        const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
        const timeString = now.toLocaleTimeString(undefined, timeOptions);
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateString = now.toLocaleDateString(undefined, dateOptions);

        clockEl.textContent = `${dateString} | ${timeString}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);

    // 1. Auto-update Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ==========================================
    // DATA FETCHING & UI INJECTION
    // ==========================================

    // Fetch Base Profile & Reorganize Buttons
    async function fetchProfile() {
        const socialContainer = document.getElementById('social-icons-header');
        if (!socialContainer) return; 

        try {
            const res = await fetch('/api/profile'); 
            const profileData = await res.json();
            
            if (profileData) {
                socialContainer.innerHTML = '';
                socialContainer.style.display = 'flex';
                socialContainer.style.flexDirection = 'column';
                socialContainer.style.alignItems = 'center'; 
                socialContainer.style.gap = '20px';

                // --- GROUP 1: PRIMARY ACTIONS (CV & CONTACT) ---
                let primaryHTML = `<div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 12px;">`;
                
                if(profileData.cv_file_path) {
                    primaryHTML += `
                    <a href="${profileData.cv_file_path}" target="_blank" download class="btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; text-decoration: none; padding: 0.7rem 1.2rem; border-radius: 8px; font-weight: 600; text-align: center; display: flex; justify-content: center; align-items: center; gap: 8px; transition: all 0.3s ease;">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> 
                        Download CV
                    </a>`;
                }
                
                primaryHTML += `
                <a href="#public-contact-form" class="btn" style="background: var(--primary, #38bdf8); color: #fff; text-decoration: none; padding: 0.7rem 1.2rem; border-radius: 8px; font-weight: 600; text-align: center; display: flex; justify-content: center; align-items: center; gap: 8px; transition: all 0.3s ease;">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Contact Me
                </a>`;
                primaryHTML += `</div>`;


                // --- GROUP 2: SOCIAL MEDIA TAGS ---
                let socialHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">`;
                const sStyle = "display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; text-decoration: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; transition: all 0.3s ease;";

                // 🌟 THE ULTIMATE ADBLOCK-PROOF ICON GENERATOR 🌟
                const getIcon = (brand) => {
                    const svgs = {
                        'github': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
                        'linkedin': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                        'facebook': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                        'fiverr': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12 6.201 1.5 12 1.5 22.5 6.201 22.5 12zm-9.378-2.603c-.279-.226-.64-.344-.997-.344H9.551v-1.63c0-.441.359-.8.801-.8h1.773V4.254H9.866c-1.745 0-3.165 1.42-3.165 3.164v1.63H5.21v2.368h1.491v7.33H9.55v-7.33h2.385l.551-2.368H9.55v-1.258c0-.129.055-.251.151-.334.095-.081.218-.124.348-.124h1.074v-1.018zM15.42 6.643c-1.03 0-1.866.836-1.866 1.866s.836 1.866 1.866 1.866c1.031 0 1.867-.836 1.867-1.866s-.836-1.866-1.867-1.866zm-1.421 12.103h2.842V9.975h-2.842v8.771z"/></svg>',
                        'pinterest': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z"/></svg>',
                        'adobe': '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.1 2H24v20L15.1 2zM8.9 2H0v20L8.9 2zM12 9.4L17.6 22h-3.8l-1.6-4H8.1L12 9.4z"/></svg>'
                    };
                    return svgs[brand] || '';
                };

                // Injecting buttons safely using the SVG generator
                if(profileData.github_link) {
                    socialHTML += `<a href="${profileData.github_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('github')} GitHub</a>`;
                    
                    const githubUsername = profileData.github_link.replace(/\/$/, '').split('/').pop(); 
                    if (githubUsername) {
                        
                        // 🌟 THE CHEAT CODE: Bypass the API and load the photo directly!
                        const profilePic = document.getElementById('public-profile-pic');
                        if (profilePic) {
                            profilePic.src = `https://github.com/${githubUsername}.png`;
                        }

                        // Load the graph
                        const graphImg = document.getElementById('github-graph-img');
                        const loadingText = document.getElementById('github-loading-text');
                        if (graphImg && loadingText) {
                            graphImg.src = `https://ghchart.rshah.org/38bdf8/${githubUsername}?v=${Date.now()}`;
                            graphImg.onload = () => {
                                graphImg.style.display = 'block';
                                loadingText.style.display = 'none';
                            };
                        }
                        
                        // Fetch the bio (This might still be temporarily blocked for an hour, but your photo won't be!)
                        fetch(`https://api.github.com/users/${githubUsername}`)
                            .then(r => r.json())
                            .then(ghData => {
                                const heroBio = document.getElementById('hero-bio');
                                if (ghData.bio && heroBio) heroBio.textContent = ghData.bio;
                            }).catch(e => console.log("GitHub API Limit reached. Bio will load later."));
                    }
                }
                
                if(profileData.linkedin_link) {
                    socialHTML += `<a href="${profileData.linkedin_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('linkedin')} LinkedIn</a>`;
                }

                if(profileData.facebook_link) {
                    socialHTML += `<a href="${profileData.facebook_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('facebook')} Facebook</a>`;
                }

                if(profileData.fiverr_link) {
                    socialHTML += `<a href="${profileData.fiverr_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('fiverr')} Fiverr</a>`;
                }

                if(profileData.pinterest_link) {
                    socialHTML += `<a href="${profileData.pinterest_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('pinterest')} Pinterest</a>`;
                }

                if(profileData.adobe_stock_link) {
                    socialHTML += `<a href="${profileData.adobe_stock_link}" target="_blank" class="btn" style="${sStyle}">${getIcon('adobe')} Adobe Stock</a>`;
                }

                socialHTML += `</div>`;
                socialContainer.innerHTML = primaryHTML + socialHTML;
            }
        } catch (e) { console.log("Profile load skipped or failed."); }
    }

    // ==========================================
    // 🌟 FIXED: FETCH EXPERIENCE WITH NEW GRID 
    // ==========================================
    // Fetch Experience (Now respects Enter / Line Breaks!)
    async function fetchExperience() {
        const grid = document.getElementById('public-experience-grid');
        if (!grid) return;

        try {
            const res = await fetch('/api/experience');
            const data = await res.json();
            
            grid.innerHTML = data.length ? '' : '<p>No experience added yet.</p>';
            data.forEach(exp => {
                grid.innerHTML += `
                    <div class="glass-card">
                        <h3 class="card-title">${exp.role}</h3>
                        <div class="card-subtitle">${exp.company_or_project} | ${exp.duration}</div>
                        
                        <!-- 🌟 MAGIC HERE: white-space: pre-wrap forces HTML to respect your 'Enters' -->
                        <div style="white-space: pre-wrap; color: #94a3b8; font-size: 0.95rem; line-height: 1.8;">${exp.description}</div>
                        
                    </div>`;
            });
        } catch (e) { console.log(e); }
    }

    // Fetch Projects
    async function fetchProjects() {
        const grid = document.getElementById('public-projects-grid'); 
        if (!grid) return;

        try {
            const res = await fetch('/api/projects');
            const projects = await res.json();
            
            if (projects.length === 0) {
                grid.innerHTML = '<p style="color: #94a3b8; text-align: center; width: 100%;">No projects available.</p>';
                return;
            }

            grid.innerHTML = ''; 
            
            projects.forEach(proj => {
                const isGithub = proj.id && String(proj.id).startsWith('gh-');

                grid.innerHTML += `
                    <div class="glass-card ${isGithub ? 'github-card' : ''}" style="display: flex; flex-direction: column; height: 100%; padding: 1.5rem;">
                        
                        ${isGithub ? '<div style="color: #6366f1; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">⚡ Auto-Imported</div>' : ''}
                        
                        ${proj.image_path ? `<div class="card-img-container" style="margin:-1.5rem -1.5rem 1rem -1.5rem; border-radius: 12px 12px 0 0; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${proj.image_path}" style="width: 100%; height: 180px; object-fit: cover;"></div>` : ''}
                        
                        <h3 class="card-title" style="text-transform: capitalize; font-size: 1.1rem; margin-bottom: 8px;">${proj.title}</h3>
                        
                        <p style="color: #94a3b8; margin-bottom: 1rem; flex-grow: 1; font-size: 0.85rem; line-height: 1.5;">${proj.description}</p>
                        
                        ${proj.languages ? proj.languages : ''}
                        
                        <div style="display: flex; gap: 8px; margin-top: auto;">
                            ${proj.live_url ? `<a href="${proj.live_url}" target="_blank" class="btn" style="background: var(--primary); color: #fff; text-decoration: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Live Demo ↗</a>` : ''}
                            ${proj.github_url ? `<a href="${proj.github_url}" target="_blank" class="btn" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; text-decoration: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">${isGithub ? 'View Code ↗' : 'GitHub'}</a>` : ''}
                        </div>
                    </div>
                `;
            });
        } catch (e) { 
            console.error("Failed to load projects:", e);
        }
    }

    // Fetch Education (Now respects Enter / Line Breaks!)
    async function fetchEducation() {
        const grid = document.getElementById('public-education-grid');
        if (!grid) return;

        try {
            const res = await fetch('/api/education');
            const data = await res.json();
            
            grid.innerHTML = data.length ? '' : '<p>No education added yet.</p>';
            data.forEach(edu => {
                grid.innerHTML += `
                    <div class="glass-card">
                        <h3 class="card-title">${edu.degree}</h3>
                        <div class="card-subtitle">${edu.institution} | ${edu.duration}</div>
                        
                        <!-- 🌟 MAGIC HERE: white-space: pre-wrap added for Education description -->
                        <div style="white-space: pre-wrap; color: #94a3b8; font-size: 0.95rem; line-height: 1.8;">${edu.description}</div>
                        
                    </div>`;
            });
        } catch (e) { console.log(e); }
    }

    // Fetch Certificates
    async function fetchCertificates() {
        const grid = document.getElementById('public-certificates-grid');
        if (!grid) return;

        try {
            const res = await fetch('/api/certificates');
            const data = await res.json();
            
            grid.innerHTML = data.length ? '' : '<p>No certificates added yet.</p>';
            data.forEach(cert => {
                grid.innerHTML += `
                    <div class="glass-card text-center" style="padding: 1.5rem;">
                        <img src="${cert.image_path}" class="cert-img" alt="${cert.title}">
                        <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">${cert.title}</h4>
                        <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem;">${cert.issuer}</p>
                        ${cert.link ? `<a href="${cert.link}" target="_blank" style="color: #38bdf8; font-size: 0.85rem; text-decoration: none;">Verify Badge ↗</a>` : ''}
                    </div>`;
            });
        } catch (e) { console.log(e); }
    }

   // Fetch Blog Posts (Now respects Enter / Line Breaks in previews!)
    async function fetchBlogPosts() {
        const grid = document.getElementById('public-blog-grid');
        if (!grid) return; 

        try {
            const res = await fetch('/api/blog');
            const posts = await res.json();
            
            grid.innerHTML = posts.length ? '' : '<p style="color: #94a3b8; text-align: center; width: 100%;">No articles published yet.</p>';
            
            posts.forEach(post => {
                const excerpt = post.content ? post.content.substring(0, 100) + '...' : '';

                grid.innerHTML += `
                    <div class="glass-card">
                        ${post.image_path ? `<div class="card-img-container"><img src="${post.image_path}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;"></div>` : ''}
                        <div class="card-subtitle" style="color: #6366f1;">${post.category}</div>
                        <h3 class="card-title">${post.title}</h3>
                        
                        <!-- 🌟 MAGIC HERE: white-space: pre-wrap added for the Blog excerpt text -->
                        <div style="white-space: pre-wrap; color: #94a3b8; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6;">${excerpt}</div>
                        
                        <a href="article.html?id=${post.id}" style="color: var(--primary); text-decoration: none; font-weight: 600;">Read Article ↗</a>
                    </div>
                `;
            });
        } catch (e) { console.log("Failed to load blog posts", e); }
    }

    // Initialize all fetches
    fetchProfile(); 
    fetchExperience(); 
    fetchProjects(); 
    fetchEducation(); 
    fetchCertificates();
    fetchBlogPosts();

    // Contact Form
    const contactForm = document.getElementById('public-contact-form');
    const contactStatus = document.getElementById('contact-status');
    const rocket = document.getElementById('rocket-animation');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            contactStatus.style.color = '#38bdf8';
            contactStatus.textContent = 'Preparing launch...';
            
            const payload = {
                sender_name: document.getElementById('contact-name').value,
                sender_email: document.getElementById('contact-email').value,
                sender_phone: document.getElementById('contact-phone')?.value || '',
                message: document.getElementById('contact-message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    contactStatus.style.color = '#2ecc71';
                    contactStatus.textContent = 'Message sent successfully!';
                    contactForm.reset();
                    
                    if (rocket) {
                        rocket.classList.add('launch');
                        setTimeout(() => rocket.classList.remove('launch'), 3000);
                    }
                    
                    setTimeout(() => contactStatus.textContent = '', 5000);
                } else {
                    contactStatus.style.color = '#e74c3c';
                    contactStatus.textContent = data.error || 'Failed to send message.';
                }
            } catch (err) {
                contactStatus.style.color = '#e74c3c';
                contactStatus.textContent = 'Server error. Please try again later.';
            }
        });
    }

    // Fetch Single Article
    async function fetchSingleArticle() {
        const container = document.getElementById('single-article-content');
        if (!container) return; 

        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            container.innerHTML = '<h2 style="text-align:center; color: #e74c3c;">Article not found.</h2>';
            return;
        }

        try {
            const res = await fetch(`/api/blog/${articleId}`);
            const data = await res.json();

            if (data.error) {
                container.innerHTML = '<h2 style="text-align:center; color: #e74c3c;">Article not found.</h2>';
                return;
            }

            const post = data.post;
            
            container.innerHTML = `
                <div style="color: #6366f1; font-weight: bold; margin-bottom: 10px;">${post.category}</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 2rem; line-height: 1.2; color: #fff;">${post.title}</h1>
                ${post.image_path ? `<img src="${post.image_path}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">` : ''}
                
                <div style="white-space: pre-wrap; color: var(--text-main); font-size: 1.1rem; line-height: 1.8;">${post.content}</div>
            `;

            const nextLinkContainer = document.getElementById('next-blog-link');
            if (data.nextPost && nextLinkContainer) {
                nextLinkContainer.innerHTML = `<a href="article.html?id=${data.nextPost.id}" class="btn action-btn" style="text-decoration: none;">Next: ${data.nextPost.title} →</a>`;
            }
        } catch (e) {
            console.error("Error loading article:", e);
            container.innerHTML = '<h2 style="text-align:center; color: #e74c3c;">Error loading article. Check console.</h2>';
        }
    }


    // ==========================================
    // MOBILE HAMBURGER MENU TOGGLE
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        // Toggle menu when clicking the 3 bars
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Auto-close the menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    fetchSingleArticle();
});