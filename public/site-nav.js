/**
 * public/site-nav.js
 * Interactive scripts for header navigation, mobile menu, FAQ accordions, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.innerHTML = isOpen ? '✕' : '☰';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.innerHTML = '☰';
            });
        });
    }

    // 2. FAQ Accordion Handling
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close others in same list
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 3. Contact Form Submission
    const contactForm = document.getElementById('freelance-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusEl = document.getElementById('form-status-message');
            
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Send Message';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending... ⏳';
            }
            if (statusEl) {
                statusEl.style.display = 'none';
                statusEl.className = '';
            }

            const formData = new FormData(contactForm);

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();

                if (res.ok && result.success) {
                    contactForm.reset();
                    if (statusEl) {
                        statusEl.style.display = 'block';
                        statusEl.style.color = '#10b981';
                        statusEl.style.background = 'rgba(16, 185, 129, 0.1)';
                        statusEl.style.border = '1px solid #10b981';
                        statusEl.style.padding = '12px 16px';
                        statusEl.style.borderRadius = '6px';
                        statusEl.style.marginTop = '15px';
                        statusEl.innerText = '🎉 Thank you! Your message has been sent successfully. Sabbir Hasan will reply within 24 hours.';
                    }
                } else {
                    throw new Error(result.error || 'Failed to send message. Please email contact@sabbirhasan.com directly.');
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.style.display = 'block';
                    statusEl.style.color = '#ef4444';
                    statusEl.style.background = 'rgba(239, 68, 68, 0.1)';
                    statusEl.style.border = '1px solid #ef4444';
                    statusEl.style.padding = '12px 16px';
                    statusEl.style.borderRadius = '6px';
                    statusEl.style.marginTop = '15px';
                    statusEl.innerText = '⚠️ ' + (err.message || 'An error occurred. Please email contact@sabbirhasan.com directly.');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    }

    // 4. Highlight Active Navigation Link
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';
        if (linkPath === currentPath) {
            link.classList.add('active');
            // If inside dropdown, also highlight parent Services
            const parentItem = link.closest('.nav-item');
            if (parentItem) {
                const parentLink = parentItem.querySelector('.nav-link');
                if (parentLink) parentLink.classList.add('active');
            }
        }
    });
});
