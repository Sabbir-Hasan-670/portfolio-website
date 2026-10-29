const fs = require('fs');

let code = fs.readFileSync('public/main.js', 'utf8');

// 1. Replace outdated 404 fallback image with hero-portrait-400.webp
code = code.replace(/\/uploads\/1789156728823-569590328\.jpg/g, '/uploads/hero-portrait-400.webp');

// 2. Throttle scrollProgress with requestAnimationFrame
const oldScrollProgress = `// 📊 Scroll Progress Bar
(function() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true }); // passive: true prevents scroll blocking
})();`;

const newScrollProgress = `// 📊 Scroll Progress Bar (Throttled with rAF)
(function() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const winScroll = window.scrollY || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - window.innerHeight;
                if (height > 0) progressBar.style.width = ((winScroll / height) * 100) + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();`;
code = code.replace(oldScrollProgress, newScrollProgress);

// 3. Throttle navbar scroll with requestAnimationFrame
const oldNavbar = `// 📱 Navbar & Mobile Menu
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}`;

const newNavbar = `// 📱 Navbar & Mobile Menu (Throttled with rAF)
const navbar = document.getElementById('navbar');
if (navbar) {
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });
}`;
code = code.replace(oldNavbar, newNavbar);

// 4. Update development graph URL to /api/github-graph
code = code.replace(
    'loadGraphWithTimeout(developmentGraph, developmentLoading, `https://ghchart.rshah.org/d5a34a/${username}`);',
    "loadGraphWithTimeout(developmentGraph, developmentLoading, '/api/github-graph');"
);

// 5. In fetchHomepageSections: check window.__INITIAL_DATA__
const oldFetchSections = `async function fetchHomepageSections() {
    if (!document.querySelector('[data-section-key]')) return;
    try {
        const res = await fetch('/api/site-sections');`;

const newFetchSections = `async function fetchHomepageSections() {
    if (!document.querySelector('[data-section-key]')) return;
    if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__.site_sections) && window.__INITIAL_DATA__.site_sections.length > 0) {
        applyHomepageSections(window.__INITIAL_DATA__.site_sections);
        return;
    }
    try {
        const res = await fetch('/api/site-sections');`;
code = code.replace(oldFetchSections, newFetchSections);

// 6. In fetchProfile: check window.__INITIAL_DATA__
const oldFetchProfileStart = `async function fetchProfile() {
    const heroBtns = document.getElementById('hero-buttons');
    const githubBtn = document.getElementById('link-github');
    if (!heroBtns && !githubBtn && !document.getElementById('contact-email-display') && !document.getElementById('hero-portrait') && !document.getElementById('about-image')) return;

    try {
        const res = await fetch('/api/profile', { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        applyHomepageDefaultSeo(data);`;

const newFetchProfileStart = `async function fetchProfile() {
    const heroBtns = document.getElementById('hero-buttons');
    const githubBtn = document.getElementById('link-github');
    if (!heroBtns && !githubBtn && !document.getElementById('contact-email-display') && !document.getElementById('hero-portrait') && !document.getElementById('about-image')) return;

    if (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.profile && Object.keys(window.__INITIAL_DATA__.profile).length > 0) {
        applyProfileData(window.__INITIAL_DATA__.profile);
        return;
    }

    try {
        const res = await fetch('/api/profile', { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;
        applyProfileData(data);
    } catch (e) {
        console.warn('Profile fetch skipped:', e.message);
    }
}

function applyProfileData(data) {
    applyHomepageDefaultSeo(data);`;

code = code.replace(oldFetchProfileStart, newFetchProfileStart);

// 7. In fetchProjects: check window.__INITIAL_DATA__
const oldFetchProjectsStart = `async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Show initial skeleton if empty
    if (!grid.children.length) {`;

const newFetchProjectsStart = `async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__.projects) && window.__INITIAL_DATA__.projects.length > 0) {
        renderProjectsList(window.__INITIAL_DATA__.projects, grid);
        return;
    }

    // Show initial skeleton if empty
    if (!grid.children.length) {`;

code = code.replace(oldFetchProjectsStart, newFetchProjectsStart);

// Wrap projects rendering loop into renderProjectsList
const oldProjRenderPart = `        const latestProjects = projects.slice(0, 6);
        latestProjects.forEach((proj, index) => {`;
const newProjRenderPart = `        renderProjectsList(projects, grid);
    } catch (e) {
        grid.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Projects temporarily unavailable</p></div>';
    }
}

function renderProjectsList(projects, grid) {
    if (!grid) grid = document.getElementById('projects-grid');
    if (!grid || !Array.isArray(projects)) return;
    grid.replaceChildren();
    if (!projects.length) {
        grid.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p><a href="/projects" class="section-fallback-btn">Explore Projects Archive ↗</a></div>';
        return;
    }
    const latestProjects = projects.slice(0, 6);
    latestProjects.forEach((proj, index) => {`;

code = code.replace(oldProjRenderPart, newProjRenderPart);

// 8. In fetchExperience: check window.__INITIAL_DATA__
const oldExpStart = `async function fetchExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/experience');
        if (!res.ok) throw new Error('Experience fetch failed');
        const data = await res.json();
        timeline.replaceChildren();`;

const newExpStart = `async function fetchExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;

    if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__.experience) && window.__INITIAL_DATA__.experience.length > 0) {
        renderExperienceList(window.__INITIAL_DATA__.experience, timeline);
        return;
    }

    try {
        const res = await fetch('/api/experience');
        if (!res.ok) throw new Error('Experience fetch failed');
        const data = await res.json();
        renderExperienceList(data, timeline);
    } catch (e) {
        timeline.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p><a href="/resume" class="section-fallback-btn">View Executive Resume ↗</a></div>';
    }
}

function renderExperienceList(data, timeline) {
    if (!timeline) timeline = document.getElementById('experience-timeline');
    if (!timeline || !Array.isArray(data)) return;
    timeline.replaceChildren();`;

code = code.replace(oldExpStart, newExpStart);

// 9. In fetchEducation: check window.__INITIAL_DATA__
const oldEduStart = `async function fetchEducation() {
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;
    try {
        const res = await fetch('/api/education');
        if (!res.ok) throw new Error('Education fetch failed');
        const data = await res.json();
        timeline.replaceChildren();`;

const newEduStart = `async function fetchEducation() {
    const timeline = document.getElementById('education-timeline');
    if (!timeline) return;

    if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__.education) && window.__INITIAL_DATA__.education.length > 0) {
        renderEducationList(window.__INITIAL_DATA__.education, timeline);
        return;
    }

    try {
        const res = await fetch('/api/education');
        if (!res.ok) throw new Error('Education fetch failed');
        const data = await res.json();
        renderEducationList(data, timeline);
    } catch (e) {
        timeline.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p></div>';
    }
}

function renderEducationList(data, timeline) {
    if (!timeline) timeline = document.getElementById('education-timeline');
    if (!timeline || !Array.isArray(data)) return;
    timeline.replaceChildren();`;

code = code.replace(oldEduStart, newEduStart);

// 10. In fetchCertificates: check window.__INITIAL_DATA__
const oldCertStart = `async function fetchCertificates() {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/certificates');
        if (!res.ok) {
            const empty = document.createElement('p');
            grid.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p></div>';
            return;
        }
        const data = await res.json();
        grid.replaceChildren();`;

const newCertStart = `async function fetchCertificates() {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__.certificates) && window.__INITIAL_DATA__.certificates.length > 0) {
        renderCertificatesList(window.__INITIAL_DATA__.certificates, grid);
        return;
    }

    try {
        const res = await fetch('/api/certificates');
        if (!res.ok) {
            grid.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p></div>';
            return;
        }
        const data = await res.json();
        renderCertificatesList(data, grid);
    } catch (e) {
        grid.innerHTML = '<div class="section-fallback-box"><p class="section-fallback-msg">Content is temporarily unavailable</p></div>';
    }
}

function renderCertificatesList(data, grid) {
    if (!grid) grid = document.getElementById('certificates-grid');
    if (!grid || !Array.isArray(data)) return;
    grid.replaceChildren();`;

code = code.replace(oldCertStart, newCertStart);

fs.writeFileSync('public/main.js', code, 'utf8');
console.log('✅ public/main.js patched with performance & initial-data hydration');

