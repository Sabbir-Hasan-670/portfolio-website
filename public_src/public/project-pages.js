(function () {
    const $ = selector => document.querySelector(selector);
    const split = value => {
        let raw = String(value || '').trim();
        if (raw.includes('<') && raw.includes('>')) {
            const temp = document.createElement('div');
            temp.innerHTML = raw;
            const items = Array.from(temp.querySelectorAll('span, b, a'));
            if (items.length) return items.map(s => s.textContent.trim()).filter(Boolean);
            raw = temp.textContent || '';
        }
        return raw.split(/[\n,|•]/).map(item => item.trim()).filter(Boolean);
    };
    const esc = value => value || '';
    const api = async path => {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw Error(path);
        return response.json();
    };
    const link = (href, label, className = 'page-button secondary') => href
        ? `<a class="${className}" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`
        : '';
    const projectSlug = project => String(project.repo_slug || project.title || '')
        .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const projectUrl = project => `/project/${encodeURIComponent(projectSlug(project))}`;

    async function profile() {
        try {
            const data = await api('/api/profile');
            document.querySelectorAll('[data-name]').forEach(element => { element.textContent = data.name || ''; });
            document.querySelectorAll('[data-email]').forEach(element => {
                element.textContent = data.contact_email || '';
                element.href = data.contact_email ? `mailto:${data.contact_email}` : '#';
            });
            document.querySelectorAll('[data-location]').forEach(element => { element.textContent = data.contact_location || ''; });
            document.querySelectorAll('[data-cv]').forEach(element => {
                if (data.cv_file_path) element.href = data.cv_file_path;
                else element.hidden = true;
            });
            const fallbackPic = window.GlobalProfile ? window.GlobalProfile.fallbackImage : '/uploads/1789156728823-569590328.jpg';
            const globalProfileImage = window.GlobalProfile
                ? window.GlobalProfile.getImage(data)
                : (data.profile_pic_path || fallbackPic);
            document.querySelectorAll('[data-profile-image]').forEach(element => {
                if (window.GlobalProfile) window.GlobalProfile.applyImage(element, data);
                else {
                    if (!element.src.endsWith(globalProfileImage)) element.src = globalProfileImage;
                    element.onerror = () => {
                        element.onerror = null;
                        element.src = fallbackPic;
                    };
                }
            });
            document.querySelectorAll('[data-github]').forEach(element => {
                if (data.github_link) element.href = data.github_link;
                else element.hidden = true;
            });
            document.querySelectorAll('[data-linkedin]').forEach(element => {
                if (data.linkedin_link) element.href = data.linkedin_link;
                else element.hidden = true;
            });
            if ($('#about-title')) $('#about-title').textContent = data.about_title || 'About';
            if ($('#about-description')) {
                $('#about-description').replaceChildren(...String(data.about_desc || '').split('\n').filter(Boolean).map(text => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = text;
                    return paragraph;
                }));
            }
        } catch (error) {}
    }

    async function resume() {
        const [experience, education, services, certificates] = await Promise.all(['/api/experience', '/api/education', '/api/services', '/api/certificates'].map(api));
        const entries = items => items.map(item => `<article class="resume-entry"><h3>${esc(item.role || item.degree || item.title)}</h3><p class="resume-meta">${esc(item.company_or_project || item.institution || item.issuer || '')} ${item.duration ? ` / ${item.duration}` : ''}</p><p>${esc(item.description || '')}</p></article>`).join('');
        if ($('#resume-experience')) $('#resume-experience').innerHTML = entries(experience);
        if ($('#resume-education')) $('#resume-education').innerHTML = entries(education);
        if ($('#resume-certificates')) $('#resume-certificates').innerHTML = entries(certificates);
        if ($('#resume-skills')) $('#resume-skills').innerHTML = services.flatMap(item => split(item.tags).length ? split(item.tags) : [item.title]).map(item => `<span>${esc(item)}</span>`).join('');
    }

    async function projects() {
        const list = await api('/api/projects');
        const root = $('#project-list');
        if (!root) return;
        root.innerHTML = list.map((project, index) => `<article class="project-row"><a class="project-media" href="${projectUrl(project)}">${project.image_path ? `<img src="${project.image_path}" alt="${esc(project.title)}">` : ''}</a><div class="project-copy"><span class="project-index">PROJECT ${String(index + 1).padStart(2, '0')}</span><h2>${esc(project.title)}</h2><p>${esc(project.description)}</p><div class="project-tags">${split(project.languages || project.technologies).slice(0, 8).map(item => `<span>${esc(item)}</span>`).join('')}</div><a class="page-button" href="${projectUrl(project)}">View case study →</a></div></article>`).join('') || '<p class="page-empty">No projects published yet.</p>';
    }

    async function detail() {
        const slug = location.pathname.match(/^\/project\/([^/]+)$/)?.[1];
        const id = new URLSearchParams(location.search).get('id');
        if (!slug && !id) return;
        const project = await api(slug
            ? `/api/projects/slug/${encodeURIComponent(slug)}`
            : `/api/projects/${encodeURIComponent(id)}`);
        $('#detail-title').textContent = project.title || 'Project';
        $('#detail-description').textContent = project.description || '';
        const image = $('#detail-image');
        if (project.image_path) {
            image.src = project.image_path;
            image.alt = project.title || 'Project';
        } else image.remove();
        $('#detail-links').innerHTML = link(project.live_url, 'Visit live', 'page-button') + link(project.github_url, 'View GitHub');
        $('#detail-stack').innerHTML = split(project.languages || project.technologies).map(item => `<span>${esc(item)}</span>`).join('');
        const blocks = [['Features', project.features], ['Challenge', project.challenge], ['Solution', project.solution], ['Architecture', project.architecture], ['Security', project.security_details], ['Database and backend', project.database_details]];
        $('#detail-body').innerHTML = blocks.filter(([, value]) => value).map(([heading, value]) => `<section><h2>${heading}</h2><p>${esc(value)}</p></section>`).join('') || '<p>Detailed case-study content will appear when it is added from the project editor.</p>';
        const screenshots = split(project.screenshots);
        if (screenshots.length) $('#detail-shots').innerHTML = screenshots.map(source => `<img src="${source}" alt="${esc(project.title)} screenshot">`).join('');
    }

    profile();
    if ($('#resume-page')) resume().catch(() => {});
    if ($('#project-list')) projects().catch(() => { $('#project-list').innerHTML = '<p class="page-empty">Projects are unavailable right now.</p>'; });
    if ($('#project-detail')) detail().catch(() => { document.body.innerHTML = '<main class="page-wrap"><p class="page-empty">Project is unavailable.</p></main>'; });
})();
