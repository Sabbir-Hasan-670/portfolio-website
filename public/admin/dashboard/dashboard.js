document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. ADMIN LIVE CLOCK
    // ==========================================
    function updateAdminClock() {
        const clockEl = document.getElementById('admin-clock');
        if (!clockEl) return;

        const now = new Date();
        const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

        clockEl.textContent = `${now.toLocaleDateString(undefined, dateOptions)} | ${now.toLocaleTimeString(undefined, timeOptions)}`;
    }
    
    updateAdminClock();
    setInterval(updateAdminClock, 1000);



    // ==========================================
    // . THEME TOGGLE LOGIC
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.getElementById('main-body');

    // Check if you saved the light theme previously
    if (localStorage.getItem('admin-theme') === 'light') {
        body.classList.add('light-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            
            // Save your preference to the browser
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('admin-theme', 'light');
            } else {
                localStorage.setItem('admin-theme', 'dark');
            }
        });
    }

    // --- Tab Navigation ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

    // --- Data Fetching & Deletion ---
    async function deleteItem(url, id, fetchFunction) {
        if (!confirm('Delete this item?')) return;
        try {
            const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
            if (res.status === 403) return window.location.href = '/admin/login.html';
            if (res.ok) fetchFunction();
        } catch (e) { alert('Network error.'); }
    }

    window.deleteItem = deleteItem;

    async function fetchExperience() {
        const list = document.getElementById('experience-list-admin');
        try {
            const res = await fetch('/api/experience');
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(exp => {
                list.innerHTML += `<li><div class="info"><h4>${exp.role}</h4><p>${exp.company_or_project}</p></div><button class="delete-btn" onclick="deleteItem('/api/admin/experience', ${exp.id}, window.fetchExperience)">Delete</button></li>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchExperience = fetchExperience;

    async function fetchProjects() {
        const list = document.getElementById('projects-list-admin');
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(proj => {
                list.innerHTML += `<li><div class="info"><h4>${proj.title}</h4></div><button class="delete-btn" onclick="deleteItem('/api/admin/projects', ${proj.id}, window.fetchProjects)">Delete</button></li>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchProjects = fetchProjects;

    async function fetchEducation() {
        const list = document.getElementById('admin-education-list');
        if (!list) return;
        try {
            const res = await fetch('/api/education');
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(edu => {
                list.innerHTML += `<div class="dash-card" style="padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2);">
                    <div><h4>${edu.degree}</h4><p style="margin: 0; opacity: 0.7;">${edu.institution}</p></div>
                    <button class="delete-btn" onclick="deleteItem('/api/admin/education', ${edu.id}, window.fetchEducation)">Delete</button>
                </div>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchEducation = fetchEducation;

    async function fetchCertificates() {
        const list = document.getElementById('admin-certificates-list');
        if (!list) return;
        try {
            const res = await fetch('/api/certificates');
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(cert => {
                list.innerHTML += `<div class="dash-card" style="padding: 1rem; text-align: center; background: rgba(0,0,0,0.2);">
                    <img src="${cert.image_path}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 0.5rem;">
                    <h4>${cert.title}</h4>
                    <p style="opacity: 0.7; font-size: 0.9rem;">${cert.issuer}</p>
                    <button class="delete-btn" style="width:100%; margin-top:0.5rem;" onclick="deleteItem('/api/admin/certificates', ${cert.id}, window.fetchCertificates)">Delete</button>
                </div>`;
            });
        } catch (e) { list.innerHTML = 'Error loading.'; }
    }
    window.fetchCertificates = fetchCertificates;

    async function fetchInbox() {
        const container = document.getElementById('messages-container');
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            container.innerHTML = '';
            if(data.length === 0) container.innerHTML = '<p>Inbox empty.</p>';
            data.forEach(msg => {
                container.innerHTML += `<div style="background:rgba(0,0,0,0.2); padding:15px; margin-bottom:10px; border-radius:8px;"><h4>From: ${msg.sender_name}</h4><p>${msg.message}</p><button class="delete-btn" style="margin-top:10px;" onclick="deleteItem('/api/admin/messages', ${msg.id}, window.fetchInbox)">Trash</button></div>`;
            });
        } catch (e) { container.innerHTML = 'Error loading.'; }
    }
    window.fetchInbox = fetchInbox;

    // 🌟 NEW FIX: Pre-fill the social links form to prevent accidental deletion 🌟
    async function fetchSocialLinks() {
        try {
            const res = await fetch('/api/profile');
            if (!res.ok) return;
            const data = await res.json();
            
            if (data) {
                // Safely fill inputs if they exist on the page
                const gh = document.getElementById('social-github'); if(gh) gh.value = data.github_link || '';
                const li = document.getElementById('social-linkedin'); if(li) li.value = data.linkedin_link || '';
                const fb = document.getElementById('social-facebook'); if(fb) fb.value = data.facebook_link || '';
                const fi = document.getElementById('social-fiverr'); if(fi) fi.value = data.fiverr_link || '';
                const pi = document.getElementById('social-pinterest'); if(pi) pi.value = data.pinterest_link || '';
                const ad = document.getElementById('social-adobe'); if(ad) ad.value = data.adobe_stock_link || '';
            }
        } catch (e) { 
            console.log("Failed to load social links."); 
        }
    }
    window.fetchSocialLinks = fetchSocialLinks;

    // Call all fetch functions on load
    fetchExperience(); 
    fetchProjects(); 
    fetchEducation(); 
    fetchCertificates(); 
    fetchInbox();
    fetchSocialLinks(); // 🌟 Added to the initial load sequence

    // --- UNIVERSAL CROPPER LOGIC (Fixed Sizes) ---
    let cropper;
    let croppedBlob = null;
    let currentUploadType = ''; 
    const modal = document.getElementById('cropper-modal');
    
    function handleImageSelect(e, type, ratio) {
        const files = e.target.files;
        if (files && files.length > 0) {
            currentUploadType = type;
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('cropper-image').src = event.target.result;
                modal.classList.remove('hidden');
                if (cropper) cropper.destroy();
                cropper = new Cropper(document.getElementById('cropper-image'), { aspectRatio: ratio, viewMode: 2 });
            };
            reader.readAsDataURL(files[0]);
        }
    }

    document.getElementById('proj-image')?.addEventListener('change', (e) => handleImageSelect(e, 'project', 16 / 9));
    document.getElementById('profile_image')?.addEventListener('change', (e) => handleImageSelect(e, 'profile', 1 / 1));

    document.getElementById('crop-confirm')?.addEventListener('click', () => {
        if (!cropper) return;
        const dims = currentUploadType === 'project' ? { width: 800, height: 450 } : { width: 400, height: 400 };
        cropper.getCroppedCanvas(dims).toBlob((blob) => {
            croppedBlob = blob;
            modal.classList.add('hidden');
            cropper.destroy(); cropper = null;
            alert("Image cropped perfectly! You can now submit the form.");
        }, 'image/jpeg');
    });

    document.getElementById('crop-cancel')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (cropper) { cropper.destroy(); cropper = null; }
        document.getElementById('proj-image').value = "";
        document.getElementById('profile_image').value = "";
        croppedBlob = null;
    });

    // --- Form Submissions (No Refreshing!) ---
    async function submitForm(url, options, formElement, callback) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.status === 403) return window.location.href = '/admin/login.html';
            if (response.ok) { alert(data.message); if(callback) callback(); } // Removed formElement.reset() here to protect socials
            else { alert('Error: ' + data.error); }
        } catch (e) { alert('Server error.'); }
    }

    // Submit Project
    document.getElementById('project-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!croppedBlob || currentUploadType !== 'project') return alert("Please crop an image first!");
        const formData = new FormData();
        formData.append('title', document.getElementById('proj-title').value);
        formData.append('description', document.getElementById('proj-desc').value);
        formData.append('github_url', document.getElementById('proj-github').value);
        formData.append('live_url', document.getElementById('proj-live').value);
        formData.append('project_image', croppedBlob, 'project.jpg');
        submitForm('/api/admin/projects', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset(); // Reset form manually after success
            croppedBlob = null; fetchProjects();
        });
    });

    // Submit Profile Picture
    document.getElementById('pic-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!croppedBlob || currentUploadType !== 'profile') return alert("Please crop an image first!");
        const formData = new FormData();
        formData.append('profile_image', croppedBlob, 'avatar.jpg');
        submitForm('/api/admin/upload-pic', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset();
            croppedBlob = null;
        });
    });

   // Submit Social Links
    document.getElementById('socials-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            github_link: document.getElementById('social-github').value,
            linkedin_link: document.getElementById('social-linkedin').value,
            facebook_link: document.getElementById('social-facebook').value,
            fiverr_link: document.getElementById('social-fiverr').value,
            pinterest_link: document.getElementById('social-pinterest').value,
            adobe_stock_link: document.getElementById('social-adobe').value
        };
        // Removed the automatic form reset so your links stay in the boxes after saving
        submitForm('/api/admin/socials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, e.target, fetchSocialLinks);
    });

    // Submit Experience
    document.getElementById('exp-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            role: document.getElementById('role').value,
            company_or_project: document.getElementById('company').value,
            duration: document.getElementById('duration').value,
            description: document.getElementById('desc').value
        };
        submitForm('/api/admin/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, e.target, () => {
            e.target.reset(); fetchExperience();
        });
    });

    // Submit Education (No Image)
    document.getElementById('admin-education-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const payload = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            duration: document.getElementById('edu-duration').value,
            description: document.getElementById('edu-description').value
        };
        
        submitForm('/api/admin/education', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        }, e.target, () => {
            e.target.reset(); fetchEducation();
        });
    });

    // Submit Certificates
    document.getElementById('admin-certificates-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('cert-image');
        if (fileInput.files.length === 0) return alert("Please select a certificate image/badge.");
        
        const formData = new FormData();
        formData.append('title', document.getElementById('cert-title').value);
        formData.append('issuer', document.getElementById('cert-issuer').value);
        formData.append('link', document.getElementById('cert-link').value);
        formData.append('cert_image', fileInput.files[0]); 
        
        submitForm('/api/admin/certificates', { method: 'POST', body: formData }, e.target, () => {
            e.target.reset(); fetchCertificates();
        });
    });

    // Submit CV Document
    const cvForm = document.getElementById('cv-form');
    if (cvForm) {
        cvForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const fileInput = document.getElementById('cv_document');
            if (fileInput.files.length === 0) return alert("Please select a PDF file first.");
            const formData = new FormData();
            formData.append('cv_document', fileInput.files[0]);
            submitForm('/api/admin/upload-cv', { method: 'POST', body: formData }, e.target, () => e.target.reset());
        });
    }


    // ==========================================
    // BLOG MANAGER LOGIC (FIXED)
    // ==========================================

    // 1. Fetch and Display Published Blogs
    async function fetchAdminBlogs() {
        try {
            const res = await fetch('/api/blog');
            const data = await res.json();
            const list = document.getElementById('blog-list');
            
            if (!list) return;
            list.innerHTML = data.length ? '' : '<p>No articles published yet.</p>';
            
            data.forEach(blog => {
                list.innerHTML += `
                    <li>
                        <span><strong>${blog.title}</strong> <span style="color:#6366f1;">(${blog.category})</span></span>
                        <button class="delete-btn" onclick="deleteItem('/api/admin/blog', ${blog.id}, window.fetchAdminBlogs)">Delete</button>
                    </li>`;
            });
        } catch (e) { console.log(e); }
    }
    
    window.fetchAdminBlogs = fetchAdminBlogs;
    fetchAdminBlogs(); 

    // 2. Submit a New Blog Post
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('title', document.getElementById('blog-title').value);
            formData.append('category', document.getElementById('blog-category').value);
            formData.append('content', document.getElementById('blog-content').value);
            
            const fileInput = document.getElementById('blog-image');
            if (fileInput.files.length > 0) {
                formData.append('blog_image', fileInput.files[0]);
            }
            
            try {
                const response = await fetch('/api/admin/blog', {
                    method: 'POST',
                    body: formData 
                });
                
                if (response.ok) {
                    blogForm.reset(); 
                    fetchAdminBlogs(); 
                    alert('Article published successfully! 🚀');
                } else {
                    const data = await response.json();
                    alert('Server Error: ' + (data.error || 'Failed to publish'));
                }
            } catch (err) {
                console.error("Frontend Fetch Error:", err);
                alert("Network error. Could not reach server.");
            }
        });
    }

    // ==========================================
    // REAL-TIME SYSTEM STATS (Anti-Spam Update)
    // ==========================================
    let statsTimer; 

    async function fetchSystemStats() {
        const overviewTab = document.getElementById('tab-overview');
        if (!overviewTab) return;

        try {
            const res = await fetch('/api/admin/system-status');
            
            if (res.status === 403) {
                clearInterval(statsTimer);
                window.location.href = '/admin/login.html';
                return;
            }
            
            if (!res.ok) return; 
            
            const data = await res.json();
            
            // 1. Update RAM
            document.getElementById('sys-ram-percent').textContent = `${data.ramPercentage}%`;
            document.getElementById('sys-ram-bar').style.width = `${data.ramPercentage}%`;
            document.getElementById('sys-ram-text').textContent = `${data.usedRam} GB / ${data.totalRam} GB Used`;
            
            // 2. Update Processor Info
            document.getElementById('sys-cpu-cores').textContent = `${data.cpuCores} Threads`;
            document.getElementById('sys-cpu-model').textContent = data.cpuModel;
            
            // 3. Update Uptime
            document.getElementById('sys-uptime').textContent = data.uptime;
            document.getElementById('sys-os').textContent = `OS: ${data.osPlatform}`;
            
            // 4. 🌟 NEW: Update CPU Load 
            const cpuEl = document.getElementById('sys-cpu-percent');
            if (cpuEl) {
                cpuEl.textContent = `${data.cpuPercentage}%`;
                // Turn red if CPU is struggling!
                cpuEl.style.color = data.cpuPercentage > 85 ? '#e74c3c' : '#2ecc71'; 
            }
            
            // 5. 🌟 NEW: Update Disk Storage 
            const diskEl = document.getElementById('sys-disk-percent');
            if (diskEl) {
                diskEl.textContent = `${data.diskPercentage}%`;
                document.getElementById('sys-disk-bar').style.width = `${data.diskPercentage}%`;
                document.getElementById('sys-disk-text').textContent = `${data.usedDisk} GB / ${data.totalDisk} GB Used`;
            }
            
            // 6. 🌟 NEW: Update Network 
            const netDownEl = document.getElementById('sys-net-down');
            if (netDownEl) {
                netDownEl.textContent = data.networkDownload || "0.00";
                document.getElementById('sys-net-up').textContent = data.networkUpload || "0.00";
            }
            
        } catch (e) {
            console.log("Stats update skipped.");
        }
    }

    fetchSystemStats();
    statsTimer = setInterval(fetchSystemStats, 5000);

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/admin/login.html';
    });
});