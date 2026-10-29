/**
 * Tracking & Analytics Service
 * Manages GA4, GTM, Meta Pixel, Clarity, GSC, Custom Scripts, Consent Mode v2, and Dynamic Injection
 */
const crypto = require('crypto');

let settingsCache = null;

const VALIDATION_REGEX = {
    ga4: /^G-[A-Z0-9]{6,12}$/,
    gtm: /^GTM-[A-Z0-9]{4,10}$/,
    pixel: /^\d{8,20}$/,
    clarity: /^[a-zA-Z0-9]{6,16}$/
};

const DEFAULT_SETTINGS = {
    ga4_enabled: '0',
    ga4_measurement_id: '',
    gtm_enabled: '0',
    gtm_container_id: '',
    pixel_enabled: '0',
    pixel_id: '',
    clarity_enabled: '0',
    clarity_id: '',
    gsc_verification_tag: '',
    custom_head_script: '',
    custom_body_script: '',
    cookie_consent_required: '0',
    ga4_property_id: '',
    ga4_service_account_json: ''
};

// Initialize settings from DB into memory
async function initTrackingSettings(db) {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS site_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value LONGTEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        for (const [key, val] of Object.entries(DEFAULT_SETTINGS)) {
            await db.query(`INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)`, [key, val]);
        }

        const [rows] = await db.query(`SELECT setting_key, setting_value FROM site_settings`);
        settingsCache = { ...DEFAULT_SETTINGS };
        rows.forEach(r => {
            if (r.setting_key) {
                settingsCache[r.setting_key] = r.setting_value || '';
            }
        });
        console.log('✅ Tracking & Analytics settings loaded and cached in memory.');
    } catch (e) {
        console.error('Tracking Settings Init Error:', e.message);
        settingsCache = { ...DEFAULT_SETTINGS };
    }
}

function getTrackingSettings() {
    return settingsCache ? { ...settingsCache } : { ...DEFAULT_SETTINGS };
}

// Update settings with strict validation
async function updateTrackingSettings(db, newSettings) {
    const sanitized = {};
    const errors = [];

    // GA4 Validation
    const ga4Id = String(newSettings.ga4_measurement_id || '').trim();
    const ga4On = newSettings.ga4_enabled === '1' || newSettings.ga4_enabled === true || newSettings.ga4_enabled === 1;
    if (ga4Id && !VALIDATION_REGEX.ga4.test(ga4Id)) {
        errors.push('Invalid Google Analytics 4 Measurement ID format (expected G-XXXXXXXXXX).');
    }
    sanitized.ga4_enabled = ga4On ? '1' : '0';
    sanitized.ga4_measurement_id = ga4Id;

    // GTM Validation
    const gtmId = String(newSettings.gtm_container_id || '').trim();
    const gtmOn = newSettings.gtm_enabled === '1' || newSettings.gtm_enabled === true || newSettings.gtm_enabled === 1;
    if (gtmId && !VALIDATION_REGEX.gtm.test(gtmId)) {
        errors.push('Invalid Google Tag Manager Container ID format (expected GTM-XXXXXXX).');
    }
    sanitized.gtm_enabled = gtmOn ? '1' : '0';
    sanitized.gtm_container_id = gtmId;

    // Meta Pixel Validation
    const pixelId = String(newSettings.pixel_id || '').trim();
    const pixelOn = newSettings.pixel_enabled === '1' || newSettings.pixel_enabled === true || newSettings.pixel_enabled === 1;
    if (pixelId && !VALIDATION_REGEX.pixel.test(pixelId)) {
        errors.push('Invalid Meta Pixel ID format (must be 8-20 numeric digits).');
    }
    sanitized.pixel_enabled = pixelOn ? '1' : '0';
    sanitized.pixel_id = pixelId;

    // Clarity Validation
    const clarityId = String(newSettings.clarity_id || '').trim();
    const clarityOn = newSettings.clarity_enabled === '1' || newSettings.clarity_enabled === true || newSettings.clarity_enabled === 1;
    if (clarityId && !VALIDATION_REGEX.clarity.test(clarityId)) {
        errors.push('Invalid Microsoft Clarity ID format (alphanumeric string).');
    }
    sanitized.clarity_enabled = clarityOn ? '1' : '0';
    sanitized.clarity_id = clarityId;

    // Google Search Console Meta Tag
    let gsc = String(newSettings.gsc_verification_tag || '').trim();
    // Allow extracting content="XYZ" if full meta tag was pasted
    const matchGsc = gsc.match(/content=["']([^"']+)["']/i);
    if (matchGsc) gsc = matchGsc[1];
    sanitized.gsc_verification_tag = gsc.replace(/[^a-zA-Z0-9_\-+=]/g, '');

    // Cookie consent toggle
    const consentOn = newSettings.cookie_consent_required === '1' || newSettings.cookie_consent_required === true || newSettings.cookie_consent_required === 1;
    sanitized.cookie_consent_required = consentOn ? '1' : '0';

    // Custom scripts (Admin only)
    sanitized.custom_head_script = String(newSettings.custom_head_script || '').trim();
    sanitized.custom_body_script = String(newSettings.custom_body_script || '').trim();

    // GA4 Property ID and Service Account JSON for Phase 3
    sanitized.ga4_property_id = String(newSettings.ga4_property_id || '').trim();
    if (newSettings.ga4_service_account_json !== undefined) {
        sanitized.ga4_service_account_json = String(newSettings.ga4_service_account_json || '').trim();
    } else if (settingsCache && settingsCache.ga4_service_account_json) {
        sanitized.ga4_service_account_json = settingsCache.ga4_service_account_json;
    }

    if (errors.length > 0) {
        const err = new Error(errors.join(' '));
        err.validationErrors = errors;
        throw err;
    }

    // Save to DB
    for (const [key, val] of Object.entries(sanitized)) {
        await db.query(
            `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
            [key, val]
        );
    }

    // Refresh memory cache
    settingsCache = { ...(settingsCache || DEFAULT_SETTINGS), ...sanitized };
    return getTrackingSettings();
}

// Generate the <head> scripts according to settings
function generateTrackingHeadHtml(req) {
    if (!settingsCache) return '';
    // Never track admin sessions or admin routes
    if (req && (req.path.startsWith('/admin') || (req.session && req.session.isAuthenticated))) {
        return '';
    }

    const chunks = [];

    // 1. Google Search Console Verification
    if (settingsCache.gsc_verification_tag) {
        chunks.push(`<!-- Google Search Console -->\n<meta name="google-site-verification" content="${escapeHtmlAttr(settingsCache.gsc_verification_tag)}" />`);
    }

    // 2. Google Consent Mode v2 Default (if enabled)
    if (settingsCache.cookie_consent_required === '1') {
        chunks.push(`<!-- Google Consent Mode v2 Default -->
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function() {
    var stored = null;
    try { stored = localStorage.getItem('sh_cookie_consent'); } catch(e){}
    if (stored === 'granted') {
        gtag('consent', 'default', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted'
        });
    } else {
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });
    }
})();
</script>`);
    }

    // 3. Google Tag Manager
    if (settingsCache.gtm_enabled === '1' && settingsCache.gtm_container_id && VALIDATION_REGEX.gtm.test(settingsCache.gtm_container_id)) {
        chunks.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${settingsCache.gtm_container_id}');</script>
<!-- End Google Tag Manager -->`);
    }

    // 4. Google Analytics 4 (only if GTM is not active, or explicitly enabled)
    const gtmActive = settingsCache.gtm_enabled === '1' && settingsCache.gtm_container_id;
    if (settingsCache.ga4_enabled === '1' && settingsCache.ga4_measurement_id && VALIDATION_REGEX.ga4.test(settingsCache.ga4_measurement_id) && !gtmActive) {
        chunks.push(`<!-- Google tag (gtag.js) GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${settingsCache.ga4_measurement_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${settingsCache.ga4_measurement_id}');
</script>`);
    }

    // 5. Meta Pixel
    if (settingsCache.pixel_enabled === '1' && settingsCache.pixel_id && VALIDATION_REGEX.pixel.test(settingsCache.pixel_id)) {
        chunks.push(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${settingsCache.pixel_id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${settingsCache.pixel_id}&ev=PageView&noscript=1"
alt="Meta Pixel" /></noscript>
<!-- End Meta Pixel Code -->`);
    }

    // 6. Microsoft Clarity
    if (settingsCache.clarity_enabled === '1' && settingsCache.clarity_id && VALIDATION_REGEX.clarity.test(settingsCache.clarity_id)) {
        chunks.push(`<!-- Microsoft Clarity -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${settingsCache.clarity_id}");
</script>`);
    }

    // 7. Custom Head Script (Admin-defined)
    if (settingsCache.custom_head_script) {
        chunks.push(`<!-- Custom Head Script (Admin) -->\n${settingsCache.custom_head_script}`);
    }

    return chunks.join('\n\n');
}

// Generate the <body> scripts (noscript, consent banner, tracking-events helper)
function generateTrackingBodyHtml(req) {
    if (!settingsCache) return '';
    if (req && (req.path.startsWith('/admin') || (req.session && req.session.isAuthenticated))) {
        return '';
    }

    const chunks = [];

    // GTM noscript
    if (settingsCache.gtm_enabled === '1' && settingsCache.gtm_container_id && VALIDATION_REGEX.gtm.test(settingsCache.gtm_container_id)) {
        chunks.push(`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settingsCache.gtm_container_id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`);
    }

    // Cookie Consent Banner (if enabled)
    if (settingsCache.cookie_consent_required === '1') {
        chunks.push(`<!-- Cookie Consent Banner (Google Consent Mode v2) -->
<div id="sh-cookie-banner" class="sh-cookie-banner" role="dialog" aria-label="Privacy & Cookie Preferences" style="display:none;">
    <div class="sh-cookie-inner">
        <div class="sh-cookie-text">
            <span class="sh-cookie-icon" aria-hidden="true">🛡️</span>
            <div>
                <strong>Privacy &amp; Telemetry</strong>
                <p>This portfolio uses privacy-friendly cookies and analytics to understand project reach and improve systems performance.</p>
            </div>
        </div>
        <div class="sh-cookie-buttons">
            <button type="button" id="sh-cookie-decline" class="sh-cookie-btn sh-cookie-btn-decline">Essential Only</button>
            <button type="button" id="sh-cookie-accept" class="sh-cookie-btn sh-cookie-btn-accept">Accept All</button>
        </div>
    </div>
</div>
<style>
.sh-cookie-banner {
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: 440px;
    width: calc(100% - 48px);
    background: rgba(12, 18, 30, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 14px;
    padding: 16px 20px;
    box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.15);
    z-index: 999999;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: shBannerSlideUp 0.3s ease forwards;
}
@keyframes shBannerSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.sh-cookie-inner { display: flex; flex-direction: column; gap: 14px; }
.sh-cookie-text { display: flex; gap: 12px; align-items: flex-start; color: #f1f5f9; }
.sh-cookie-icon { font-size: 1.4rem; line-height: 1; }
.sh-cookie-text strong { display: block; font-size: 0.95rem; font-weight: 700; color: #38bdf8; margin-bottom: 3px; }
.sh-cookie-text p { font-size: 0.82rem; color: #94a3b8; margin: 0; line-height: 1.45; }
.sh-cookie-buttons { display: flex; gap: 10px; justify-content: flex-end; }
.sh-cookie-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
}
.sh-cookie-btn-decline {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94a3b8;
}
.sh-cookie-btn-decline:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.sh-cookie-btn-accept {
    background: #38bdf8;
    border: 1px solid #38bdf8;
    color: #060913;
}
.sh-cookie-btn-accept:hover { background: #7dd3fc; box-shadow: 0 4px 12px rgba(56, 189, 248, 0.35); }
@media (max-width: 480px) {
    .sh-cookie-banner { bottom: 12px; right: 12px; width: calc(100% - 24px); }
    .sh-cookie-buttons { flex-direction: column; }
    .sh-cookie-btn { width: 100%; text-align: center; }
}
</style>
<script>
(function() {
    var banner = document.getElementById('sh-cookie-banner');
    if (!banner) return;
    var choice = null;
    try { choice = localStorage.getItem('sh_cookie_consent'); } catch(e){}
    if (!choice) {
        banner.style.display = 'block';
    }
    var acceptBtn = document.getElementById('sh-cookie-accept');
    var declineBtn = document.getElementById('sh-cookie-decline');
    if (acceptBtn) {
        acceptBtn.onclick = function() {
            try { localStorage.setItem('sh_cookie_consent', 'granted'); } catch(e){}
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
            }
            banner.style.display = 'none';
        };
    }
    if (declineBtn) {
        declineBtn.onclick = function() {
            try { localStorage.setItem('sh_cookie_consent', 'denied'); } catch(e){}
            banner.style.display = 'none';
        };
    }
})();
</script>`);
    }

    // Custom Event Helper (pushed to dataLayer, gtag, fbq)
    chunks.push(`<!-- Unified Telemetry Events Helper -->
<script>
(function() {
    window.shTrackEvent = function(eventName, params) {
        params = params || {};
        // 1. Google Tag Manager / GA4 DataLayer
        if (window.dataLayer && Array.isArray(window.dataLayer)) {
            window.dataLayer.push(Object.assign({ event: eventName }, params));
        }
        // 2. Direct gtag
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
        // 3. Meta Pixel Mapping
        if (typeof fbq === 'function') {
            if (eventName === 'generate_lead') fbq('track', 'Lead');
            else if (eventName === 'resume_view') fbq('track', 'ViewContent', { content_name: 'Resume' });
            else fbq('trackCustom', eventName, params);
        }
    };

    // Auto-listen to key site interactions
    document.addEventListener('DOMContentLoaded', function() {
        // Contact Form Lead
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                window.shTrackEvent('generate_lead', { method: 'Contact Form' });
            });
        }
        // Resume View / Download
        document.querySelectorAll('a[href*="resume"], a[data-cv], a[href$=".pdf"]').forEach(function(el) {
            el.addEventListener('click', function() {
                window.shTrackEvent('resume_view', { target: el.getAttribute('href') });
            });
        });
        // Outbound links
        document.querySelectorAll('a[target="_blank"]').forEach(function(el) {
            el.addEventListener('click', function() {
                var href = el.getAttribute('href');
                if (href && !href.startsWith('/') && !href.includes(window.location.hostname)) {
                    window.shTrackEvent('outbound_click', { url: href });
                }
            });
        });
        // 75% Scroll Depth Tracking
        var reached75 = false;
        window.addEventListener('scroll', function() {
            if (reached75) return;
            var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (docH > 0) {
                var pct = (window.scrollY / docH) * 100;
                if (pct >= 75) {
                    reached75 = true;
                    window.shTrackEvent('blog_read_75', { page: window.location.pathname });
                }
            }
        }, { passive: true });
    });
})();
</script>`);

    // Custom Body Script
    if (settingsCache.custom_body_script) {
        chunks.push(`<!-- Custom Body Script (Admin) -->\n${settingsCache.custom_body_script}`);
    }

    return chunks.join('\n\n');
}

// Injects tracking snippets into an HTML string dynamically
function injectTrackingIntoHtml(html, req) {
    if (!html || typeof html !== 'string') return html;
    // Don't inject on admin pages or logged-in admin sessions
    if (req && (req.path.startsWith('/admin') || (req.session && req.session.isAuthenticated))) {
        return html;
    }

    const headScripts = generateTrackingHeadHtml(req);
    const bodyScripts = generateTrackingBodyHtml(req);

    let result = html;

    if (headScripts) {
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${headScripts}\n</head>`);
        } else {
            result = headScripts + '\n' + result;
        }
    }

    if (bodyScripts) {
        if (result.includes('</body>')) {
            result = result.replace('</body>', `${bodyScripts}\n</body>`);
        } else {
            result = result + '\n' + bodyScripts;
        }
    }

    return result;
}

function escapeHtmlAttr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

module.exports = {
    initTrackingSettings,
    getTrackingSettings,
    updateTrackingSettings,
    generateTrackingHeadHtml,
    generateTrackingBodyHtml,
    injectTrackingIntoHtml,
    VALIDATION_REGEX
};

