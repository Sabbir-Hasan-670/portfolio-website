document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get values from both inputs
            const usernameInput = document.getElementById('admin-username').value;
            const passwordInput = document.getElementById('admin-password').value;
            
            const msgElement = document.getElementById('login-msg');
            const btn = document.querySelector('.login-btn');
            const card = document.querySelector('.login-card');
            
            // Loading Animation State
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = 'Authenticating...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            msgElement.classList.remove('show');

            try {
                // Send BOTH username and password to your Node.js server
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: usernameInput, 
                        password: passwordInput 
                    })
                });

                const result = await response.json();
                msgElement.classList.add('show');

                if (response.ok) {
                    // Success State
                    msgElement.textContent = "Access Granted. Initializing Dashboard...";
                    msgElement.style.color = "#4ade80"; // Neon Green
                    
                    // Button morphs into a success indicator
                    btn.innerHTML = 'Unlocked ✓';
                    btn.style.background = '#4ade80';
                    btn.style.borderColor = '#4ade80';
                    btn.style.color = '#0f172a';
                    
                    // Wait 1.5 seconds so the user sees the animation, then redirect
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard/dashboard';
                    }, 1500);

                } else {
                    // Error State
                    msgElement.textContent = result.error || "Authentication Failed.";
                    msgElement.style.color = "#f87171"; // Neon Red
                    
                    // Reset Button
                    btn.innerHTML = originalBtnText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    
                    // Trigger the CSS Shake Animation
                    card.style.animation = 'shake 0.4s';
                    
                    // Remove the animation class after it finishes so it can shake again next time
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 400);
                }
            } catch (error) {
                // Server Error State
                msgElement.textContent = "Server connection lost.";
                msgElement.style.color = "#f87171";
                msgElement.classList.add('show');
                
                btn.innerHTML = originalBtnText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        });
    }

    // ==========================================
// ADMIN EDUCATION MANAGEMENT
// ==========================================
const eduForm = document.getElementById('admin-education-form');
const eduList = document.getElementById('admin-education-list');

async function loadAdminEducation() {
    if (!eduList) return;
    const res = await fetch('/api/education');
    const data = await res.json();
    eduList.innerHTML = '';
    data.forEach(edu => {
        eduList.innerHTML += `
            <div class="modern-card" style="padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4>${edu.degree}</h4>
                    <p style="margin: 0; color: #7f8c8d;">${edu.institution} | ${edu.duration}</p>
                </div>
                <button onclick="deleteEducation(${edu.id})" class="card-btn btn-secondary" style="background:#e74c3c; color:white; max-width:80px;">Delete</button>
            </div>
        `;
    });
}

if (eduForm) {
    eduForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            duration: document.getElementById('edu-duration').value,
            description: document.getElementById('edu-description').value
        };

        const res = await fetch('/api/admin/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            eduForm.reset();
            loadAdminEducation();
        }
    });
}

window.deleteEducation = async (id) => {
    const confirmed = await window.customConfirm('Delete this entry?');
    if (confirmed) {
        await fetch(`/api/admin/education/${id}`, { method: 'DELETE' });
        loadAdminEducation();
    }
};

// ==========================================
// ADMIN CERTIFICATES MANAGEMENT
// ==========================================
const certForm = document.getElementById('admin-certificates-form');
const certList = document.getElementById('admin-certificates-list');

async function loadAdminCertificates() {
    if (!certList) return;
    const res = await fetch('/api/certificates');
    const data = await res.json();
    certList.innerHTML = '';
    data.forEach(cert => {
        certList.innerHTML += `
            <div class="modern-card" style="padding: 1rem; text-align: center;">
                <img src="${cert.image_path}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 0.5rem;">
                <h4>${cert.title}</h4>
                <p style="color: #7f8c8d; font-size: 0.9rem;">${cert.issuer}</p>
                <button onclick="deleteCertificate(${cert.id})" class="card-btn" style="background:#e74c3c; color:white; width:100%; margin-top:0.5rem;">Delete</button>
            </div>
        `;
    });
}

if (certForm) {
    certForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('cert-title').value);
        formData.append('issuer', document.getElementById('cert-issuer').value);
        formData.append('link', document.getElementById('cert-link').value);
        formData.append('cert_image', document.getElementById('cert-image').files[0]);

        const res = await fetch('/api/admin/certificates', {
            method: 'POST',
            body: formData // Correctly sends as multipart/form-data for file uploads
        });

        if (res.ok) {
            certForm.reset();
            loadAdminCertificates();
        }
    });
}

window.deleteCertificate = async (id) => {
    const confirmed = await window.customConfirm('Delete this certificate?');
    if (confirmed) {
        await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
        loadAdminCertificates();
    }
};

// Call these inside your existing dashboard initialization function
loadAdminEducation();
loadAdminCertificates();
});
,\n                        totp_token: document.getElementById('admin-totp') ? document.getElementById('admin-totp').value : ''