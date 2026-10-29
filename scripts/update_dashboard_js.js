const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../public/admin/dashboard/dashboard.js');
let code = fs.readFileSync(jsPath, 'utf8');

// 1. Enable hash-based tab navigation & tab switching helper
if (!code.includes("window.navigateToTab")) {
    const navHelper = `
    // Tab Navigation by ID with URL hash update
    window.navigateToTab = function(targetId) {
        const btn = document.querySelector(\`.tab-btn[data-target="\${targetId}"]\`);
        const pane = document.getElementById(targetId);
        if (btn && pane) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            pane.classList.add('active');
            window.location.hash = targetId;

            // Trigger data load for dynamic tabs
            if (targetId === 'tab-tracking') window.loadTrackingSettings();
            if (targetId === 'tab-blog-analytics') window.loadBlogAnalytics();
            if (targetId === 'tab-blog') window.fetchAdminBlogs();
            if (targetId === 'tab-overview') window.loadOverviewAnalyticsWidget();
        }
    };

    // Check URL hash on page load
    setTimeout(() => {
        if (window.location.hash) {
            const hashTab = window.location.hash.replace('#', '');
            if (document.getElementById(hashTab)) {
                window.navigateToTab(hashTab);
            }
        }
    }, 150);
`;

    code = code.replace("const tabBtns = document.querySelectorAll('.tab-btn');", navHelper + "\n    const tabBtns = document.querySelectorAll('.tab-btn');");
    
    // Also enhance click on tab-btn to update hash and trigger data
    code = code.replace(
        "document.getElementById(btn.getAttribute('data-target')).classList.add('active');",
        `document.getElementById(btn.getAttribute('data-target')).classList.add('active');
            const tId = btn.getAttribute('data-target');
            window.location.hash = tId;
            if (tId === 'tab-tracking') window.loadTrackingSettings();
            if (tId === 'tab-blog-analytics') window.loadBlogAnalytics();
            if (tId === 'tab-blog') window.fetchAdminBlogs();
            if (tId === 'tab-overview') window.loadOverviewAnalyticsWidget();`
    );
    console.log("✅ Added hash tab navigation & listeners to dashboard.js");
}

// 2. Add complete Tracking, Blog Analytics, and Multi-Select Blog logic
const analyticsAndTrackingModule = `
    // =========================================================================
    // 🎯 TRACKING & ANALYTICS CLIENT CONTROLLER
    // =========================================================================
    const VALIDATION_REGEX = {
        ga4: /^G-[A-Z0-9]{6,12}$/,
        gtm: /^GTM-[A-Z0-9]{4,10}$/,
        pixel: /^\\d{8,20}$/,
        clarity: /^[a-zA-Z0-9]{6,16}$/
    };

    window.loadTrackingSettings = async function() {
        try {
            const res = await fetch('/api/admin/tracking-settings');
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('Failed to load tracking settings');
            const data = await res.json();
            
            // Populate form fields
            const ga4On = data.ga4_enabled === '1' || data.ga4_enabled === 1 || data.ga4_enabled === true;
            document.getElementById('track-ga4-enabled').checked = ga4On;
            document.getElementById('track-ga4-id').value = data.ga4_measurement_id || '';

            const gtmOn = data.gtm_enabled === '1' || data.gtm_enabled === 1 || data.gtm_enabled === true;
            document.getElementById('track-gtm-enabled').checked = gtmOn;
            document.getElementById('track-gtm-id').value = data.gtm_container_id || '';

            const pixelOn = data.pixel_enabled === '1' || data.pixel_enabled === 1 || data.pixel_enabled === true;
            document.getElementById('track-pixel-enabled').checked = pixelOn;
            document.getElementById('track-pixel-id').value = data.pixel_id || '';

            const clarityOn = data.clarity_enabled === '1' || data.clarity_enabled === 1 || data.clarity_enabled === true;
            document.getElementById('track-clarity-enabled').checked = clarityOn;
            document.getElementById('track-clarity-id').value = data.clarity_id || '';

            const consentOn = data.cookie_consent_required === '1' || data.cookie_consent_required === 1 || data.cookie_consent_required === true;
            document.getElementById('track-consent-required').checked = consentOn;

            document.getElementById('track-gsc-tag').value = data.gsc_verification_tag || '';
            document.getElementById('track-head-script').value = data.custom_head_script || '';
            document.getElementById('track-body-script').value = data.custom_body_script || '';
            document.getElementById('track-ga4-property-id').value = data.ga4_property_id || '';
            document.getElementById('track-ga4-sa-json').value = data.ga4_service_account_json || '';

            window.updateTrackingLivePreview();
        } catch (err) {
            console.error('loadTrackingSettings error:', err);
            window.showToast('Could not load tracking settings', 'error');
        }
    };

    window.updateTrackingLivePreview = function() {
        const ga4On = document.getElementById('track-ga4-enabled')?.checked;
        const ga4Id = document.getElementById('track-ga4-id')?.value.trim();

        const gtmOn = document.getElementById('track-gtm-enabled')?.checked;
        const gtmId = document.getElementById('track-gtm-id')?.value.trim();

        const pixelOn = document.getElementById('track-pixel-enabled')?.checked;
        const pixelId = document.getElementById('track-pixel-id')?.value.trim();

        const clarityOn = document.getElementById('track-clarity-enabled')?.checked;
        const clarityId = document.getElementById('track-clarity-id')?.value.trim();

        const consentOn = document.getElementById('track-consent-required')?.checked;
        const gscTag = document.getElementById('track-gsc-tag')?.value.trim();
        const headCustom = document.getElementById('track-head-script')?.value.trim();
        const bodyCustom = document.getElementById('track-body-script')?.value.trim();

        // Update Checklist badges
        updateChecklistItem('check-ga4', ga4On && ga4Id, ga4On ? (ga4Id ? \`GA4: Active (\${ga4Id})\` : 'GA4: Missing ID') : 'GA4: Disabled');
        updateChecklistItem('check-gtm', gtmOn && gtmId, gtmOn ? (gtmId ? \`GTM: Active (\${gtmId})\` : 'GTM: Missing ID') : 'GTM: Disabled');
        updateChecklistItem('check-pixel', pixelOn && pixelId, pixelOn ? (pixelId ? \`Pixel: Active (\${pixelId})\` : 'Pixel: Missing ID') : 'Pixel: Disabled');
        updateChecklistItem('check-clarity', clarityOn && clarityId, clarityOn ? (clarityId ? \`Clarity: Active (\${clarityId})\` : 'Clarity: Missing ID') : 'Clarity: Disabled');
        updateChecklistItem('check-consent', consentOn, consentOn ? 'Consent: Mode v2 (Denied until click)' : 'Consent Banner: Disabled');
        updateChecklistItem('check-gsc', !!gscTag, gscTag ? 'GSC Tag: Configured' : 'GSC Tag: Not set');

        // Build simulated generated <head>
        const headSnippets = [];
        if (gscTag) {
            const meta = gscTag.includes('<meta') ? gscTag : \`<meta name="google-site-verification" content="\${gscTag}">\`;
            headSnippets.push(\`<!-- Google Search Console -->\\n\${meta}\`);
        }
        if (consentOn) {
            headSnippets.push(\`<!-- Google Consent Mode v2 (Default: Denied) -->\\n<script>\\n  window.dataLayer = window.dataLayer || [];\\n  function gtag(){dataLayer.push(arguments);}\\n  gtag('consent', 'default', {\\n    'analytics_storage': 'denied',\\n    'ad_storage': 'denied'\\n  });\\n</script>\`);
        }
        if (gtmOn && gtmId) {
            headSnippets.push(\`<!-- Google Tag Manager -->\\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\\n})(window,document,'script','dataLayer','\${gtmId}');</script>\`);
        } else if (ga4On && ga4Id) {
            headSnippets.push(\`<!-- Google tag (gtag.js) GA4 -->\\n<script async src="https://www.googletagmanager.com/gtag/js?id=\${ga4Id}"></script>\\n<script>\\n  window.dataLayer = window.dataLayer || [];\\n  function gtag(){dataLayer.push(arguments);}\\n  gtag('js', new Date());\\n  gtag('config', '\${ga4Id}');\\n</script>\`);
        }
        if (pixelOn && pixelId) {
            headSnippets.push(\`<!-- Meta Pixel Code -->\\n<script>\\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');\\nfbq('init', '\${pixelId}');\\nfbq('track', 'PageView');\\n</script>\`);
        }
        if (clarityOn && clarityId) {
            headSnippets.push(\`<!-- Microsoft Clarity -->\\n<script type="text/javascript">\\n  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\\n  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;\\n  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\\n  })(window, document, "clarity", "script", "\${clarityId}");\\n</script>\`);
        }
        if (headCustom) {
            headSnippets.push(\`<!-- Custom Head Script -->\\n\${headCustom}\`);
        }

        const headEl = document.getElementById('tracking-preview-head');
        if (headEl) {
            headEl.textContent = headSnippets.length ? headSnippets.join('\\n\\n') : '<!-- No tracking scripts enabled in <head> -->';
        }

        // Build simulated generated <body>
        const bodySnippets = [];
        if (gtmOn && gtmId) {
            bodySnippets.push(\`<!-- Google Tag Manager (noscript) -->\\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=\${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\`);
        }
        if (pixelOn && pixelId) {
            bodySnippets.push(\`<!-- Meta Pixel (noscript) -->\\n<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=\${pixelId}&ev=PageView&noscript=1"/></noscript>\`);
        }
        if (bodyCustom) {
            bodySnippets.push(\`<!-- Custom Body Script -->\\n\${bodyCustom}\`);
        }

        const bodyEl = document.getElementById('tracking-preview-body');
        if (bodyEl) {
            bodyEl.textContent = bodySnippets.length ? bodySnippets.join('\\n\\n') : '<!-- No scripts injected in <body> -->';
        }
    };

    function updateChecklistItem(id, isActive, text) {
        const item = document.getElementById(id);
        if (!item) return;
        if (isActive) {
            item.classList.add('active');
            item.innerHTML = \`<span class="check-icon">🟢</span> <span>\${text}</span>\`;
        } else {
            item.classList.remove('active');
            item.innerHTML = \`<span class="check-icon">⚪</span> <span>\${text}</span>\`;
        }
    }

    window.saveTrackingSettings = async function() {
        const ga4On = document.getElementById('track-ga4-enabled').checked;
        const ga4Id = document.getElementById('track-ga4-id').value.trim();

        const gtmOn = document.getElementById('track-gtm-enabled').checked;
        const gtmId = document.getElementById('track-gtm-id').value.trim();

        const pixelOn = document.getElementById('track-pixel-enabled').checked;
        const pixelId = document.getElementById('track-pixel-id').value.trim();

        const clarityOn = document.getElementById('track-clarity-enabled').checked;
        const clarityId = document.getElementById('track-clarity-id').value.trim();

        const consentOn = document.getElementById('track-consent-required').checked;
        const gscTag = document.getElementById('track-gsc-tag').value.trim();
        const headCustom = document.getElementById('track-head-script').value;
        const bodyCustom = document.getElementById('track-body-script').value;
        const ga4PropId = document.getElementById('track-ga4-property-id').value.trim();
        const ga4SaJson = document.getElementById('track-ga4-sa-json').value.trim();

        // Client-side strict validation
        if (ga4Id && !VALIDATION_REGEX.ga4.test(ga4Id)) {
            return window.showToast('Invalid GA4 Measurement ID (must match G-XXXXXXXXXX)', 'error');
        }
        if (gtmId && !VALIDATION_REGEX.gtm.test(gtmId)) {
            return window.showToast('Invalid GTM Container ID (must match GTM-XXXXXXX)', 'error');
        }
        if (pixelId && !VALIDATION_REGEX.pixel.test(pixelId)) {
            return window.showToast('Invalid Meta Pixel ID (must be 8-20 numeric digits)', 'error');
        }
        if (clarityId && !VALIDATION_REGEX.clarity.test(clarityId)) {
            return window.showToast('Invalid Clarity ID (must be 6-16 alphanumeric chars)', 'error');
        }

        const payload = {
            ga4_enabled: ga4On ? '1' : '0',
            ga4_measurement_id: ga4Id,
            gtm_enabled: gtmOn ? '1' : '0',
            gtm_container_id: gtmId,
            pixel_enabled: pixelOn ? '1' : '0',
            pixel_id: pixelId,
            clarity_enabled: clarityOn ? '1' : '0',
            clarity_id: clarityId,
            cookie_consent_required: consentOn ? '1' : '0',
            gsc_verification_tag: gscTag,
            custom_head_script: headCustom,
            custom_body_script: bodyCustom,
            ga4_property_id: ga4PropId,
            ga4_service_account_json: ga4SaJson
        };

        try {
            const res = await fetch('/api/admin/tracking-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save tracking settings');

            window.showToast(data.message || 'Tracking settings saved successfully!', 'success');
            window.updateTrackingLivePreview();
        } catch (err) {
            window.showToast(err.message || 'Error saving settings', 'error');
        }
    };

    window.copyGeneratedSnippets = function() {
        const head = document.getElementById('tracking-preview-head')?.textContent || '';
        const body = document.getElementById('tracking-preview-body')?.textContent || '';
        const all = \`=== <head> SNIPPET ===\\n\${head}\\n\\n=== <body> SNIPPET ===\\n\${body}\`;
        navigator.clipboard.writeText(all).then(() => {
            window.showToast('Generated snippets copied to clipboard!', 'info');
        }).catch(() => {
            alert('Copied to clipboard');
        });
    };

    window.toggleGa4Guide = function() {
        const box = document.getElementById('ga4-setup-guide-box');
        if (box) {
            box.style.display = box.style.display === 'none' ? 'block' : 'none';
        }
    };

    // =========================================================================
    // 📈 BUILT-IN BLOG ANALYTICS CONTROLLER
    // =========================================================================
    let currentAnalyticsPeriod = '30d';
    let currentAnalyticsData = null;
    let analyticsTablePage = 1;
    const ANALYTICS_PER_PAGE = 10;
    let filteredAnalyticsBlogs = [];

    window.setAnalyticsPeriod = function(period) {
        currentAnalyticsPeriod = period;
        document.querySelectorAll('.analytics-period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-period') === period);
        });
        const customBar = document.getElementById('custom-date-bar');
        if (customBar) customBar.style.display = period === 'custom' ? 'flex' : 'none';

        if (period !== 'custom') {
            window.loadBlogAnalytics();
        }
    };

    window.toggleCustomDateRange = function() {
        window.setAnalyticsPeriod('custom');
    };

    window.applyCustomDateRange = function() {
        const start = document.getElementById('custom-start-date').value;
        const end = document.getElementById('custom-end-date').value;
        if (!start || !end) {
            return window.showToast('Please select both start and end dates', 'error');
        }
        window.loadBlogAnalytics(start, end);
    };

    window.loadBlogAnalytics = async function(customStart = null, customEnd = null) {
        try {
            let url = \`/api/admin/blog-analytics?period=\${currentAnalyticsPeriod}\`;
            if (currentAnalyticsPeriod === 'custom' && customStart && customEnd) {
                url += \`&startDate=\${encodeURIComponent(customStart)}&endDate=\${encodeURIComponent(customEnd)}\`;
            }

            const res = await fetch(url);
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('Analytics temporarily unavailable');

            const data = await res.json();
            currentAnalyticsData = data;

            // 1. Render Summary Cards
            renderAnalyticsSummary(data.summary);

            // 2. Render Trend Chart
            renderTrendChart(data.trend || []);

            // 3. Render Referrers & Devices
            renderBreakdowns(data.referrers || [], data.devices || []);

            // 4. Render Table
            filteredAnalyticsBlogs = Array.isArray(data.blogs) ? [...data.blogs] : [];
            analyticsTablePage = 1;
            renderAnalyticsTable();

            // 5. Render Zero Views Alert List
            renderZeroViewsList(data.zeroViewBlogs || []);
        } catch (err) {
            console.error('loadBlogAnalytics error:', err);
            window.showToast('Error loading blog analytics', 'error');
        }
    };

    function renderAnalyticsSummary(summary = {}) {
        const totalViews = summary.total_views || 0;
        const viewsChange = summary.views_change || 0;
        const uniques = summary.unique_visitors || 0;
        const uniquesChange = summary.uniques_change || 0;
        const duration = summary.avg_duration || 0;
        const durationChange = summary.duration_change || 0;
        const scroll = summary.avg_scroll || 0;
        const scrollChange = summary.scroll_change || 0;

        document.getElementById('metric-total-views').textContent = totalViews.toLocaleString();
        setMetricBadge('metric-views-badge', viewsChange);

        document.getElementById('metric-unique-visitors').textContent = uniques.toLocaleString();
        setMetricBadge('metric-uniques-badge', uniquesChange);

        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        document.getElementById('metric-avg-duration').textContent = \`\${mins}m \${secs}s\`;
        setMetricBadge('metric-duration-badge', durationChange);

        document.getElementById('metric-avg-scroll').textContent = \`\${scroll}%\`;
        setMetricBadge('metric-scroll-badge', scrollChange);
    }

    function setMetricBadge(elId, change) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.className = 'metric-badge';
        if (change > 0) {
            el.classList.add('positive');
            el.textContent = \`▲ +\${change}%\`;
        } else if (change < 0) {
            el.classList.add('negative');
            el.textContent = \`▼ \${change}%\`;
        } else {
            el.classList.add('neutral');
            el.textContent = '0%';
        }
    }

    // SVG Line Trend Chart
    function renderTrendChart(trendData = []) {
        const container = document.getElementById('trend-chart-container');
        if (!container) return;

        if (!trendData.length) {
            container.innerHTML = \`<div style="display:flex; height:100%; align-items:center; justify-content:center; color:#94a3b8; font-size:0.85rem;">No views recorded during this date window. Traffic will chart here live.</div>\`;
            return;
        }

        const width = container.clientWidth || 700;
        const height = 240;
        const padLeft = 45;
        const padRight = 20;
        const padTop = 20;
        const padBottom = 35;
        const chartW = width - padLeft - padRight;
        const chartH = height - padTop - padBottom;

        const maxViews = Math.max(...trendData.map(d => Math.max(d.views, d.uniques)), 5);
        const count = trendData.length;

        const xStep = count > 1 ? chartW / (count - 1) : chartW;

        let viewsPath = '';
        let uniquesPath = '';
        let dotsSvg = '';

        trendData.forEach((pt, i) => {
            const x = padLeft + (i * xStep);
            const yViews = padTop + chartH - ((pt.views / maxViews) * chartH);
            const yUniques = padTop + chartH - ((pt.uniques / maxViews) * chartH);

            if (i === 0) {
                viewsPath += \`M \${x} \${yViews}\`;
                uniquesPath += \`M \${x} \${yUniques}\`;
            } else {
                viewsPath += \` L \${x} \${yViews}\`;
                uniquesPath += \` L \${x} \${yUniques}\`;
            }

            // Dot on each point
            const dateLabel = pt.date ? pt.date.slice(5) : '';
            dotsSvg += \`
                <circle cx="\${x}" cy="\${yViews}" r="3.5" fill="#38bdf8">
                    <title>\${pt.date}: \${pt.views} Views, \${pt.uniques} Uniques</title>
                </circle>
                <circle cx="\${x}" cy="\${yUniques}" r="3" fill="#10b981">
                    <title>\${pt.date}: \${pt.uniques} Uniques</title>
                </circle>
            \`;
        });

        // Horizontal Grid Lines (3 levels)
        let gridLines = '';
        [0, 0.5, 1].forEach(ratio => {
            const y = padTop + chartH - (ratio * chartH);
            const val = Math.round(maxViews * ratio);
            gridLines += \`
                <line x1="\${padLeft}" y1="\${y}" x2="\${width - padRight}" y2="\${y}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
                <text x="\${padLeft - 8}" y="\${y + 4}" fill="#64748b" font-size="10" text-anchor="end">\${val}</text>
            \`;
        });

        // X-axis date labels (show every few dates to avoid clutter)
        let xLabels = '';
        const stepSkip = Math.max(1, Math.floor(count / 6));
        trendData.forEach((pt, i) => {
            if (i % stepSkip === 0 || i === count - 1) {
                const x = padLeft + (i * xStep);
                const label = pt.date ? pt.date.slice(5) : '';
                xLabels += \`<text x="\${x}" y="\${height - 10}" fill="#94a3b8" font-size="10" text-anchor="middle">\${label}</text>\`;
            }
        });

        const svg = \`
            <svg width="100%" height="100%" viewBox="0 0 \${width} \${height}" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                \${gridLines}
                <path d="\${viewsPath} L \${padLeft + ((count-1)*xStep)} \${padTop + chartH} L \${padLeft} \${padTop + chartH} Z" fill="url(#viewsGrad)" />
                <path d="\${viewsPath}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="\${uniquesPath}" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3 3"/>
                \${dotsSvg}
                \${xLabels}
            </svg>
        \`;

        container.innerHTML = svg;
    }

    function renderBreakdowns(referrers = [], devices = []) {
        const refList = document.getElementById('analytics-referrers-list');
        if (refList) {
            if (!referrers.length) {
                refList.innerHTML = '<p style="color:#64748b; font-size:0.82rem;">No external referrers logged yet.</p>';
            } else {
                const maxCount = Math.max(...referrers.map(r => r.count), 1);
                refList.innerHTML = referrers.map(r => {
                    const pct = Math.round((r.count / maxCount) * 100);
                    return \`
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.83rem;">
                                <span style="color:#cbd5e1; font-weight:600;">\${r.source || 'Direct'}</span>
                                <span style="color:#38bdf8; font-weight:700;">\${r.count}</span>
                            </div>
                            <div class="analytics-progress-bar">
                                <div class="analytics-progress-fill" style="width:\${pct}%; background:#38bdf8;"></div>
                            </div>
                        </div>
                    \`;
                }).join('');
            }
        }

        const devList = document.getElementById('analytics-devices-list');
        if (devList) {
            if (!devices.length) {
                devList.innerHTML = '<p style="color:#64748b; font-size:0.82rem;">No device sessions recorded yet.</p>';
            } else {
                const totalDev = devices.reduce((sum, d) => sum + d.count, 0) || 1;
                devList.innerHTML = devices.map(d => {
                    const pct = Math.round((d.count / totalDev) * 100);
                    const color = d.device_type === 'mobile' ? '#10b981' : d.device_type === 'tablet' ? '#f1c40f' : '#38bdf8';
                    const icon = d.device_type === 'mobile' ? '📱' : d.device_type === 'tablet' ? '📟' : '💻';
                    return \`
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.83rem;">
                                <span style="color:#cbd5e1; font-weight:600;">\${icon} \${d.device_type.toUpperCase()}</span>
                                <span style="color:\${color}; font-weight:700;">\${pct}% (\${d.count})</span>
                            </div>
                            <div class="analytics-progress-bar">
                                <div class="analytics-progress-fill" style="width:\${pct}%; background:\${color};"></div>
                            </div>
                        </div>
                    \`;
                }).join('');
            }
        }
    }

    window.filterAnalyticsTable = function() {
        const query = (document.getElementById('analytics-search-input')?.value || '').toLowerCase().trim();
        const all = currentAnalyticsData?.blogs || [];
        if (!query) {
            filteredAnalyticsBlogs = [...all];
        } else {
            filteredAnalyticsBlogs = all.filter(b => (b.title || '').toLowerCase().includes(query) || (b.slug || '').toLowerCase().includes(query));
        }
        analyticsTablePage = 1;
        renderAnalyticsTable();
    };

    window.sortAnalyticsTable = function() {
        const sortVal = document.getElementById('analytics-sort-select')?.value || 'views-desc';
        filteredAnalyticsBlogs.sort((a, b) => {
            if (sortVal === 'views-desc') return (b.views || 0) - (a.views || 0);
            if (sortVal === 'views-asc') return (a.views || 0) - (b.views || 0);
            if (sortVal === 'date-desc') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            if (sortVal === 'time-desc') return (b.avg_duration || 0) - (a.avg_duration || 0);
            return 0;
        });
        analyticsTablePage = 1;
        renderAnalyticsTable();
    };

    window.changeAnalyticsPage = function(delta) {
        analyticsTablePage += delta;
        renderAnalyticsTable();
    };

    function renderAnalyticsTable() {
        const tbody = document.getElementById('analytics-table-body');
        const pageInfo = document.getElementById('analytics-page-info');
        const prevBtn = document.getElementById('analytics-prev-page');
        const nextBtn = document.getElementById('analytics-next-page');

        if (!tbody) return;

        const totalItems = filteredAnalyticsBlogs.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / ANALYTICS_PER_PAGE));
        if (analyticsTablePage < 1) analyticsTablePage = 1;
        if (analyticsTablePage > totalPages) analyticsTablePage = totalPages;

        const start = (analyticsTablePage - 1) * ANALYTICS_PER_PAGE;
        const pageItems = filteredAnalyticsBlogs.slice(start, start + ANALYTICS_PER_PAGE);

        if (!pageItems.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="padding: 25px; text-align: center; color: #94a3b8;">No articles matched your criteria.</td></tr>';
            if (pageInfo) pageInfo.textContent = 'Showing 0 articles';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        tbody.innerHTML = pageItems.map(b => {
            const dateStr = b.created_at ? new Date(b.created_at).toISOString().slice(0, 10) : '';
            const mins = Math.floor((b.avg_duration || 0) / 60);
            const secs = (b.avg_duration || 0) % 60;
            const timeStr = \`\${mins}m \${secs}s\`;
            const badgeClass = b.performance_badge === 'top' ? 'top' : b.performance_badge === 'low' ? 'low' : 'normal';
            const badgeLabel = b.performance_badge === 'top' ? '🔥 TOP 10%' : b.performance_badge === 'low' ? '📉 LOW 10%' : 'NORMAL';

            return \`
                <tr onclick="window.openBlogDetailDrawer(\${b.id})">
                    <td style="font-weight:600; color:#f8fafc; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        \${b.title}
                        <div style="font-size:0.75rem; color:#64748b; font-weight:normal;">/\${b.slug || b.id}</div>
                    </td>
                    <td style="color:#94a3b8;">\${dateStr}</td>
                    <td style="text-align:right; font-weight:700; color:#38bdf8;">\${(b.views || 0).toLocaleString()}</td>
                    <td style="text-align:right; font-weight:600; color:#10b981;">\${(b.unique_visitors || 0).toLocaleString()}</td>
                    <td style="text-align:right; color:#f1c40f;">\${timeStr}</td>
                    <td style="text-align:right; color:#a855f7;">\${b.avg_scroll || 0}%</td>
                    <td style="text-align:center;">
                        <span class="perf-badge \${badgeClass}">\${badgeLabel}</span>
                    </td>
                </tr>
            \`;
        }).join('');

        if (pageInfo) {
            pageInfo.textContent = \`Showing \${start + 1}–\${Math.min(start + ANALYTICS_PER_PAGE, totalItems)} of \${totalItems} articles (Page \${analyticsTablePage} of \${totalPages})\`;
        }
        if (prevBtn) prevBtn.disabled = analyticsTablePage <= 1;
        if (nextBtn) nextBtn.disabled = analyticsTablePage >= totalPages;
    }

    function renderZeroViewsList(zeroPosts = []) {
        const container = document.getElementById('zero-views-list');
        if (!container) return;
        if (!zeroPosts.length) {
            container.innerHTML = '<span style="color:#10b981; font-size:0.85rem; font-weight:600;">🎉 Excellent! All published articles received active traffic in the last 30 days.</span>';
            return;
        }

        container.innerHTML = zeroPosts.map(p => {
            return \`
                <a href="/blog/\${p.slug || p.id}" target="_blank" style="display:inline-flex; align-items:center; gap:6px; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; padding:4px 10px; border-radius:6px; font-size:0.8rem; text-decoration:none;">
                    <span>📌</span> \${p.title} ↗
                </a>
            \`;
        }).join('');
    }

    window.openBlogDetailDrawer = async function(blogId) {
        try {
            const res = await fetch(\`/api/admin/blog-analytics/detail/\${blogId}?period=30d\`);
            if (!res.ok) throw new Error('Detail unavailable');
            const data = await res.json();
            
            document.getElementById('drawer-blog-title').textContent = data.blog.title;
            document.getElementById('drawer-blog-category').textContent = \`📁 \${data.blog.category || 'General'}\`;
            document.getElementById('drawer-live-link').href = \`/blog/\${data.blog.slug || data.blog.id}\`;

            document.getElementById('drawer-views').textContent = (data.summary.total_views || 0).toLocaleString();
            document.getElementById('drawer-uniques').textContent = (data.summary.unique_visitors || 0).toLocaleString();

            const mins = Math.floor((data.summary.avg_duration || 0) / 60);
            const secs = (data.summary.avg_duration || 0) % 60;
            document.getElementById('drawer-duration').textContent = \`\${mins}m \${secs}s\`;
            document.getElementById('drawer-scroll').textContent = \`\${data.summary.avg_scroll || 0}%\`;

            // Mini Trend Chart in Drawer
            const chartBox = document.getElementById('drawer-chart-container');
            if (chartBox && data.trend) {
                renderMiniDrawerChart(chartBox, data.trend);
            }

            // Referrers in drawer
            const refList = document.getElementById('drawer-referrers-list');
            if (refList) {
                if (!data.referrers || !data.referrers.length) {
                    refList.innerHTML = '<span style="color:#64748b;">Direct visitors only</span>';
                } else {
                    refList.innerHTML = data.referrers.map(r => \`<div><strong style="color:#e2e8f0;">\${r.source}:</strong> \${r.count}</div>\`).join('');
                }
            }

            // Devices in drawer
            const devList = document.getElementById('drawer-devices-list');
            if (devList) {
                if (!data.devices || !data.devices.length) {
                    devList.innerHTML = '<span style="color:#64748b;">No device data</span>';
                } else {
                    devList.innerHTML = data.devices.map(d => \`<div><strong style="color:#e2e8f0;">\${d.device_type}:</strong> \${d.count}</div>\`).join('');
                }
            }

            document.getElementById('analytics-detail-drawer').classList.remove('hidden');
        } catch (err) {
            window.showToast('Failed to load article detail', 'error');
        }
    };

    function renderMiniDrawerChart(container, trendData = []) {
        if (!trendData.length) {
            container.innerHTML = '<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:0.8rem;">No views in 30 days</div>';
            return;
        }
        const w = container.clientWidth || 500;
        const h = 160;
        const maxV = Math.max(...trendData.map(d => d.views), 3);
        const count = trendData.length;
        const step = count > 1 ? (w - 30) / (count - 1) : w;

        let path = '';
        trendData.forEach((pt, i) => {
            const x = 15 + (i * step);
            const y = 140 - ((pt.views / maxV) * 110);
            path += i === 0 ? \`M \${x} \${y}\` : \` L \${x} \${y}\`;
        });

        container.innerHTML = \`
            <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}" preserveAspectRatio="none">
                <path d="\${path}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
            </svg>
        \`;
    }

    window.exportAnalyticsCsv = function() {
        const url = \`/api/admin/blog-analytics/export?period=\${currentAnalyticsPeriod}\`;
        window.location.href = url;
        window.showToast('Downloading Blog Analytics CSV report...', 'info');
    };

    // Overview Widget Loader
    window.loadOverviewAnalyticsWidget = async function() {
        try {
            const res = await fetch('/api/admin/blog-analytics/overview-widget');
            if (!res.ok) return;
            const data = await res.json();

            const viewsEl = document.getElementById('overview-total-views');
            if (viewsEl) viewsEl.textContent = (data.totalViews || 0).toLocaleString();

            const topPost = data.topPosts?.[0];
            const topTitleEl = document.getElementById('overview-top-post-title');
            const topViewsEl = document.getElementById('overview-top-post-views');
            if (topTitleEl && topPost) {
                topTitleEl.textContent = topPost.title;
                if (topViewsEl) topViewsEl.textContent = \`\${(topPost.views || 0).toLocaleString()} views\`;
            } else if (topTitleEl) {
                topTitleEl.textContent = 'No published posts';
                if (topViewsEl) topViewsEl.textContent = '0 views';
            }

            const listEl = document.getElementById('overview-top-posts-list');
            if (listEl && data.topPosts) {
                if (!data.topPosts.length) {
                    listEl.innerHTML = '<span style="color:#64748b; font-size:0.82rem;">No reader traffic recorded yet.</span>';
                } else {
                    listEl.innerHTML = data.topPosts.map((p, idx) => \`
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(0,0,0,0.2); border-radius:6px; font-size:0.85rem;">
                            <span style="color:#cbd5e1; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:70%;">
                                #\${idx + 1} \${p.title}
                            </span>
                            <span style="color:#38bdf8; font-weight:700;">\${(p.views || 0).toLocaleString()} views</span>
                        </div>
                    \`).join('');
                }
            }
        } catch (e) {}
    };

    // =========================================================================
    // 📝 ENHANCED BLOG MANAGER (MULTI-SELECT, BULK ACTIONS & TRASH)
    // =========================================================================
    window.selectedBlogIds = new Set();
    window.currentBlogFilter = 'all';

    // Override fetchAdminBlogs to support Trash tab and attach trash counts
    const originalFetchAdminBlogs = window.fetchAdminBlogs;
    window.fetchAdminBlogs = async function() {
        try {
            const isTrash = window.currentBlogFilter === 'trash';
            const url = isTrash ? '/api/admin/blog?trash=1' : '/api/admin/blog';
            const res = await fetch(url);
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            if (!res.ok) throw new Error('blog unavailable');

            const trashHeader = res.headers.get('x-trash-count');
            const data = await res.json();
            window.cachedBlogs = Array.isArray(data) ? data : [];
            window.currentBlogLimit = 15;

            // Update badge counts
            const elTrash = document.getElementById('count-blog-trash');
            if (elTrash) {
                const count = trashHeader || (window.cachedBlogs[0]?.trash_count) || (isTrash ? window.cachedBlogs.length : 0);
                elTrash.textContent = count;
            }

            updateBlogFilterBadges();
            window.renderAdminBlogs();
            window.updateBlogBulkBar();
        } catch (e) {
            console.error('fetchAdminBlogs error:', e);
        }
    };

    // Filter button handlers
    window.filterAdminBlogs = (filter) => {
        window.currentBlogFilter = filter;
        window.currentBlogLimit = 15;
        window.selectedBlogIds.clear();

        ['all', 'review', 'published', 'draft', 'trash'].forEach(f => {
            const btn = document.getElementById(\`filter-btn-\${f}\`);
            if (btn) {
                if (f === filter) {
                    btn.style.background = f === 'trash' ? '#ef4444' : '#3b82f6';
                    btn.style.color = '#ffffff';
                } else {
                    btn.style.background = '#1e293b';
                    btn.style.color = f === 'trash' ? '#ef4444' : '#94a3b8';
                }
            }
        });

        // Toggle bulk action buttons between normal and trash
        const normalActions = document.getElementById('bulk-normal-actions');
        const trashActions = document.getElementById('bulk-trash-actions');
        if (normalActions && trashActions) {
            normalActions.style.display = filter === 'trash' ? 'none' : 'flex';
            trashActions.style.display = filter === 'trash' ? 'flex' : 'none';
        }

        window.fetchAdminBlogs();
    };

    // Render Admin Blogs with Checkboxes & Views
    window.renderAdminBlogs = () => {
        const list = document.getElementById('blog-list');
        if (!list || !window.cachedBlogs) return;
        updateBlogFilterBadges();
        list.innerHTML = '';

        const filter = window.currentBlogFilter || 'all';
        const isTrash = filter === 'trash';
        const filtered = (filter === 'all' || isTrash)
            ? window.cachedBlogs 
            : window.cachedBlogs.filter(b => b.status === filter);

        if (!filtered.length) {
            list.innerHTML = \`<p style="color:#94a3b8; padding:20px; text-align:center;">No articles found \${filter !== 'all' ? \`in "\${filter}"\` : ''}.</p>\`;
            return;
        }

        const toShow = filtered.slice(0, window.currentBlogLimit);

        toShow.forEach(blog => {
            const isReview = blog.status === 'review';
            const isChecked = window.selectedBlogIds.has(Number(blog.id));
            const statusBadgeStyle = 
                blog.status === 'draft' ? 'background:rgba(148,163,184,0.15); color:#94a3b8; border:1px solid #94a3b8;' :
                isReview ? 'background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid #f59e0b;' :
                isTrash ? 'background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid #ef4444;' :
                'background:rgba(16,185,129,0.15); color:#10b981; border:1px solid #10b981;';

            list.innerHTML += \`
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; margin-bottom: 8px; background: \${isTrash ? 'rgba(239,68,68,0.04)' : isReview ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)'}; border: 1px solid \${isTrash ? 'rgba(239,68,68,0.25)' : isReview ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}; border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; padding-right: 15px;">
                        <input type="checkbox" class="blog-select-checkbox" data-id="\${blog.id}" \${isChecked ? 'checked' : ''} onchange="window.handleBlogCheckboxChange(\${blog.id}, this.checked)" style="width: 17px; height: 17px; accent-color: #38bdf8; cursor: pointer;">
                        <div style="flex: 1; min-width: 0;">
                            <strong style="display: block; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f8fafc;">\${blog.title}</strong> 
                            <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px; flex-wrap: wrap;">
                                <span style="color:#818cf8; font-size: 0.78rem;">📁 \${blog.category || 'General'}</span>
                                <span style="display:inline-block; padding:1px 7px; border-radius:4px; font-size:0.7rem; font-weight:700; \${statusBadgeStyle}">
                                    \${(isTrash ? 'TRASH' : (blog.status || 'published')).toUpperCase()}
                                </span>
                                <span style="color:#38bdf8; font-size:0.78rem; font-weight:600; background:rgba(56,189,248,0.1); padding:1px 6px; border-radius:4px;">👁️ \${(blog.views || 0).toLocaleString()} views</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-shrink: 0;">
                        \${isTrash ? \`
                            <button class="action-btn" style="padding: 5px 12px; font-size: 0.8rem; background: #10b981;" onclick="window.restoreSingleBlog(\${blog.id})">♻️ Restore</button>
                            <button class="delete-btn" style="padding: 5px 12px; font-size: 0.8rem;" onclick="window.permanentDeleteSingleBlog(\${blog.id})">❌ Permanent Delete</button>
                        \` : \`
                            \${isReview ? \`<button class="action-btn" style="padding: 5px 14px; font-size: 0.8rem; background: #10b981; font-weight: 600;" onclick="approveAndPublishBlog(\${blog.id})">Approve</button>\` : ''}
                            <button class="action-btn" style="padding: 5px 12px; font-size: 0.8rem; background: #38bdf8;" onclick="openEditBlogModal(\${blog.id})">Edit</button>
                            <button class="delete-btn" style="padding: 5px 12px; font-size: 0.8rem;" onclick="window.trashSingleBlog(\${blog.id})">Trash 🗑️</button>
                        \`}
                    </div>
                </li>\`;
        });

        if (filtered.length > window.currentBlogLimit) {
            list.innerHTML += \`
                <li style="display: flex; justify-content: center; margin-top: 15px;">
                    <button class="action-btn" style="padding: 8px 20px; font-size: 0.85rem;" onclick="window.currentBlogLimit += 15; window.renderAdminBlogs();">Show More (\${filtered.length - window.currentBlogLimit} remaining)</button>
                </li>
            \`;
        }

        // Sync master checkbox
        const masterBox = document.getElementById('blog-select-all');
        if (masterBox) {
            const allShownChecked = toShow.length > 0 && toShow.every(b => window.selectedBlogIds.has(Number(b.id)));
            masterBox.checked = allShownChecked;
        }
    };

    // Checkbox State Management
    window.handleBlogCheckboxChange = function(id, isChecked) {
        const numId = Number(id);
        if (isChecked) {
            window.selectedBlogIds.add(numId);
        } else {
            window.selectedBlogIds.delete(numId);
        }
        window.updateBlogBulkBar();
    };

    window.handleBlogSelectAll = function(masterBox) {
        const isChecked = masterBox.checked;
        const filter = window.currentBlogFilter || 'all';
        const filtered = (filter === 'all' || filter === 'trash')
            ? window.cachedBlogs 
            : window.cachedBlogs.filter(b => b.status === filter);

        filtered.forEach(b => {
            const numId = Number(b.id);
            if (isChecked) window.selectedBlogIds.add(numId);
            else window.selectedBlogIds.delete(numId);
        });

        document.querySelectorAll('.blog-select-checkbox').forEach(cb => {
            cb.checked = isChecked;
        });

        window.updateBlogBulkBar();
    };

    window.updateBlogBulkBar = function() {
        const count = window.selectedBlogIds.size;
        const bar = document.getElementById('blog-bulk-bar');
        const countSpan = document.getElementById('bulk-selected-count');
        const inlineCounter = document.getElementById('blog-selected-counter-inline');

        if (countSpan) countSpan.textContent = count;
        if (inlineCounter) inlineCounter.textContent = \`\${count} selected\`;

        if (bar) {
            bar.style.display = count > 0 ? 'flex' : 'none';
        }
    };

    window.clearBlogSelection = function() {
        window.selectedBlogIds.clear();
        document.querySelectorAll('.blog-select-checkbox').forEach(cb => cb.checked = false);
        const masterBox = document.getElementById('blog-select-all');
        if (masterBox) masterBox.checked = false;
        window.updateBlogBulkBar();
    };

    // Single item quick actions
    window.trashSingleBlog = async function(id) {
        const confirmed = await window.customConfirm('Move this article to Trash?');
        if (!confirmed) return;
        try {
            const res = await fetch(\`/api/admin/blog/\${id}\`, { method: 'DELETE' });
            if (res.ok) {
                window.showToast('Article moved to Trash', 'info');
                window.fetchAdminBlogs();
            } else {
                window.showToast('Failed to trash article', 'error');
            }
        } catch(e) { window.showToast('Error occurred', 'error'); }
    };

    window.restoreSingleBlog = async function(id) {
        try {
            const res = await fetch(\`/api/admin/blog/\${id}/restore\`, { method: 'POST' });
            if (res.ok) {
                window.showToast('Article restored to published status!', 'success');
                window.fetchAdminBlogs();
            } else {
                window.showToast('Failed to restore article', 'error');
            }
        } catch(e) { window.showToast('Error occurred', 'error'); }
    };

    window.permanentDeleteSingleBlog = async function(id) {
        const confirmed = await window.customConfirm('⚠️ PERMANENT DELETE: This will delete the article from the database and remove its cover image. This action CANNOT be undone. Proceed?');
        if (!confirmed) return;
        try {
            const res = await fetch(\`/api/admin/blog/\${id}?permanent=true\`, { method: 'DELETE' });
            if (res.ok) {
                window.showToast('Article permanently deleted', 'success');
                window.fetchAdminBlogs();
            } else {
                window.showToast('Failed to delete permanently', 'error');
            }
        } catch(e) { window.showToast('Error occurred', 'error'); }
    };

    // Bulk Confirmation Modal & Execution
    let pendingBulkAction = null;

    window.confirmBulkAction = function(action) {
        const count = window.selectedBlogIds.size;
        if (count === 0) return window.showToast('No articles selected', 'info');

        pendingBulkAction = action;
        const modal = document.getElementById('blog-bulk-modal');
        const titleEl = document.getElementById('bulk-modal-title');
        const descEl = document.getElementById('bulk-modal-desc');
        const listEl = document.getElementById('bulk-modal-list');
        const confirmBtn = document.getElementById('bulk-modal-confirm-btn');

        const actionLabels = {
            trash: { title: 'Move to Trash', desc: \`Move \${count} selected articles to Trash? They will be removed from public view.\`, btn: 'Move to Trash 🗑️', color: '#f59e0b' },
            restore: { title: 'Restore Selected', desc: \`Restore \${count} articles back to public status?\`, btn: 'Restore Selected ♻️', color: '#10b981' },
            delete: { title: 'Permanent Delete Warning', desc: \`⚠️ PERMANENTLY DELETE \${count} articles and unlink their images? This CANNOT be undone.\`, btn: 'Delete Permanently ❌', color: '#dc2626' },
            publish: { title: 'Bulk Publish', desc: \`Publish \${count} articles to live site immediately?\`, btn: 'Publish Articles 🚀', color: '#10b981' },
            draft: { title: 'Convert to Draft', desc: \`Set \${count} articles to Draft status?\`, btn: 'Convert to Draft 📝', color: '#64748b' }
        };

        const config = actionLabels[action] || { title: 'Confirm', desc: 'Proceed?', btn: 'Confirm', color: '#38bdf8' };
        if (titleEl) titleEl.textContent = config.title;
        if (descEl) descEl.textContent = config.desc;
        if (confirmBtn) {
            confirmBtn.textContent = config.btn;
            confirmBtn.style.background = config.color;
        }

        // Populate selected article titles
        if (listEl && window.cachedBlogs) {
            const selectedArticles = window.cachedBlogs.filter(b => window.selectedBlogIds.has(Number(b.id)));
            listEl.innerHTML = selectedArticles.map(b => \`
                <div>• <strong>\${b.title}</strong> <span style="color:#64748b;">(ID: \${b.id})</span></div>
            \`).join('');
        }

        modal.classList.remove('hidden');
    };

    // Execute bulk action
    document.getElementById('bulk-modal-confirm-btn')?.addEventListener('click', async () => {
        if (!pendingBulkAction || window.selectedBlogIds.size === 0) return;
        const modal = document.getElementById('blog-bulk-modal');
        modal.classList.add('hidden');

        const ids = Array.from(window.selectedBlogIds);
        try {
            const res = await fetch('/api/admin/blogs/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: pendingBulkAction,
                    ids: ids
                })
            });
            if (res.status === 401 || res.status === 403) return window.location.href = '/admin/login';
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Bulk action failed');

            window.showToast(data.message || \`Executed bulk \${pendingBulkAction} successfully!\`, 'success');
            window.clearBlogSelection();
            window.fetchAdminBlogs();
            if (window.loadOverviewAnalyticsWidget) window.loadOverviewAnalyticsWidget();
        } catch (err) {
            window.showToast(err.message || 'Error executing bulk action', 'error');
        }
    });
`;

// Insert the module before the closing DOMContentLoaded or right after fetchMediaChannelsAdmin();
if (!code.includes("TRACKING & ANALYTICS CLIENT CONTROLLER")) {
    code = code.replace("fetchMediaChannelsAdmin();", "fetchMediaChannelsAdmin();\n" + analyticsAndTrackingModule);
    console.log("✅ Appended tracking & analytics client controller to dashboard.js");
}

fs.writeFileSync(jsPath, code, 'utf8');
console.log("🎉 Successfully updated dashboard.js!");

