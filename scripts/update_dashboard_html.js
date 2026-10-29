const fs = require('fs');
const path = require('path');

const dashHtmlPath = path.join(__dirname, '../public/admin/dashboard/dashboard.html');
let html = fs.readFileSync(dashHtmlPath, 'utf8');

// 1. Add sidebar tab buttons
if (!html.includes('data-target="tab-tracking"')) {
    const blogTabBtn = '<li class="tab-btn" data-target="tab-blog">📝 Blog</li>';
    const newTabBtns = `${blogTabBtn}
                <li class="tab-btn" data-target="tab-blog-analytics">📈 Blog Analytics</li>
                <li class="tab-btn" data-target="tab-tracking">🎯 Tracking &amp; Analytics</li>`;
    html = html.replace(blogTabBtn, newTabBtns);
    console.log("✅ Added sidebar buttons for Tracking & Blog Analytics");
}

// 2. Add Overview Widget to tab-overview
if (!html.includes('id="overview-total-views"')) {
    const overviewEnd = `                        </div>
                    </div>
                </div>
            </section>`;
    const overviewWidget = `                        </div>
                    </div>
                </div>

                <!-- Blog Analytics Quick Overview Widget -->
                <div class="dash-card" style="margin-top: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size: 1.3rem;">📈</span>
                            <div>
                                <h3 style="margin: 0; padding:0; border:none; font-size:1.15rem; color:#f8fafc;">Blog Performance Snapshot</h3>
                                <p style="color: #94a3b8; font-size: 0.82rem; margin-top: 2px;">Verified first-party reader engagement metrics</p>
                            </div>
                        </div>
                        <button type="button" class="action-btn" style="padding: 6px 14px; font-size: 0.82rem;" onclick="window.navigateToTab('tab-blog-analytics')">Open Full Analytics Dashboard →</button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
                        <div style="background: rgba(0,0,0,0.25); padding: 18px; border-radius: 10px; border: 1px solid rgba(56,189,248,0.2);">
                            <div style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 6px; font-weight:600;">TOTAL BLOG READS</div>
                            <div id="overview-total-views" style="color: #38bdf8; font-size: 2rem; font-weight: 700; line-height:1.2;">--</div>
                            <div style="color: #64748b; font-size: 0.76rem; margin-top: 5px;">Bot-filtered &amp; deduplicated views</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.25); padding: 18px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.2);">
                            <div style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 6px; font-weight:600;">TOP PERFORMING GUIDE</div>
                            <div id="overview-top-post-title" style="color: #10b981; font-size: 1.05rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height:1.3;">Loading top post...</div>
                            <div id="overview-top-post-views" style="color: #64748b; font-size: 0.76rem; margin-top: 5px;">-- views</div>
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 10px;">MOST READ ARTICLES</div>
                        <div id="overview-top-posts-list" style="display: flex; flex-direction: column; gap: 8px;">
                            <p style="color: #64748b; font-size: 0.85rem;">Gathering reader statistics...</p>
                        </div>
                    </div>
                </div>
            </section>`;
    html = html.replace(overviewEnd, overviewWidget);
    console.log("✅ Added Blog Analytics Quick Overview Widget to tab-overview");
}

// 3. Update tab-blog with Trash filter button and Master Select
if (!html.includes('id="filter-btn-trash"')) {
    const filterGroup = '<button type="button" class="action-btn" id="filter-btn-published" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid #10b981;" onclick="window.filterAdminBlogs(\'published\')">Published (<span id="count-blog-published">0</span>)</button>';
    const newFilters = `${filterGroup}
                                <button type="button" class="action-btn" id="filter-btn-draft" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(148,163,184,0.15); color: #94a3b8; border: 1px solid #94a3b8;" onclick="window.filterAdminBlogs('draft')">Draft (<span id="count-blog-draft">0</span>)</button>
                                <button type="button" class="action-btn" id="filter-btn-trash" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid #ef4444;" onclick="window.filterAdminBlogs('trash')">🗑️ Trash (<span id="count-blog-trash">0</span>)</button>`;
    html = html.replace(filterGroup, newFilters);

    // Add select all control above list
    const listCardStart = '<ul id="blog-list" class="admin-list">';
    const selectAllHeader = `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,0,0,0.2); border-radius: 6px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06);">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #cbd5e1; cursor: pointer; user-select: none;">
                            <input type="checkbox" id="blog-select-all" onchange="window.handleBlogSelectAll(this)" style="width: 16px; height: 16px; accent-color: #38bdf8; cursor: pointer;">
                            <span>Select All Articles</span>
                        </label>
                        <span id="blog-selected-counter-inline" style="font-size: 0.8rem; color: #94a3b8;">0 selected</span>
                    </div>
                    <ul id="blog-list" class="admin-list">`;
    html = html.replace(listCardStart, selectAllHeader);
    console.log("✅ Added Trash tab button and master select to tab-blog");
}

// 4. Add Tab Sections for tab-tracking and tab-blog-analytics before closing main
if (!html.includes('id="tab-tracking"')) {
    const trackingAndAnalyticsTabs = `
            <!-- ========================================== -->
            <!-- 🎯 TAB: TRACKING & ANALYTICS SETTINGS     -->
            <!-- ========================================== -->
            <section id="tab-tracking" class="tab-pane">
                <div class="dash-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
                        <div>
                            <h2 style="margin:0; font-size:1.4rem;">🎯 Tracking &amp; Analytics Settings</h2>
                            <p style="color:#94a3b8; font-size:0.85rem; margin-top:4px;">Manage GA4, Google Tag Manager, Meta Pixel, Clarity, Google Search Console &amp; Cookie Consent</p>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button type="button" class="action-btn" style="background:#1e293b; border:1px solid #475569;" onclick="window.loadTrackingSettings()">Reload 🔄</button>
                            <button type="button" class="action-btn" style="background:#38bdf8; font-weight:700;" onclick="window.saveTrackingSettings()">Save Settings 💾</button>
                        </div>
                    </div>

                    <form id="tracking-settings-form" onsubmit="event.preventDefault(); window.saveTrackingSettings();">
                        <!-- Tracking IDs Grid -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px;">
                            
                            <!-- Google Analytics 4 Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.2rem;">📊</span>
                                        <strong style="color: #f8fafc; font-size: 0.95rem;">Google Analytics 4</strong>
                                    </div>
                                    <label class="tracking-switch">
                                        <input type="checkbox" id="track-ga4-enabled" onchange="window.updateTrackingLivePreview()">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="admin-field" style="margin-bottom: 8px;">
                                    <label>Measurement ID (format: G-XXXXXXXXXX)</label>
                                    <input type="text" id="track-ga4-id" placeholder="G-XXXXXXXXXX" autocomplete="off" oninput="window.updateTrackingLivePreview()">
                                </div>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    💡 <em>Where to find:</em> Google Analytics &gt; Admin &gt; Data Streams &gt; Web stream.
                                </p>
                                <p style="font-size: 0.76rem; color: #f59e0b; margin-top: 6px; line-height: 1.35; background: rgba(245,158,11,0.1); padding: 6px 8px; border-radius: 4px; border-left: 3px solid #f59e0b;">
                                    ⚠️ <strong>Notice:</strong> If you load GA4 inside Google Tag Manager, leave this direct GA4 toggle disabled to prevent double-counting traffic.
                                </p>
                            </div>

                            <!-- Google Tag Manager Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.2rem;">🏷️</span>
                                        <strong style="color: #f8fafc; font-size: 0.95rem;">Google Tag Manager</strong>
                                    </div>
                                    <label class="tracking-switch">
                                        <input type="checkbox" id="track-gtm-enabled" onchange="window.updateTrackingLivePreview()">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="admin-field" style="margin-bottom: 8px;">
                                    <label>Container ID (format: GTM-XXXXXXX)</label>
                                    <input type="text" id="track-gtm-id" placeholder="GTM-XXXXXXX" autocomplete="off" oninput="window.updateTrackingLivePreview()">
                                </div>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    💡 Injects the official GTM script in &lt;head&gt; and noscript iframe in &lt;body&gt;.
                                </p>
                            </div>

                            <!-- Meta (Facebook) Pixel Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.2rem;">🎯</span>
                                        <strong style="color: #f8fafc; font-size: 0.95rem;">Meta (Facebook) Pixel</strong>
                                    </div>
                                    <label class="tracking-switch">
                                        <input type="checkbox" id="track-pixel-enabled" onchange="window.updateTrackingLivePreview()">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="admin-field" style="margin-bottom: 8px;">
                                    <label>Pixel ID (8-20 numeric digits)</label>
                                    <input type="text" id="track-pixel-id" placeholder="123456789012345" autocomplete="off" oninput="window.updateTrackingLivePreview()">
                                </div>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    💡 <em>Where to find:</em> Meta Events Manager &gt; Data Sources &gt; Pixel ID. Automatically fires PageView.
                                </p>
                            </div>

                            <!-- Microsoft Clarity Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.2rem;">🔥</span>
                                        <strong style="color: #f8fafc; font-size: 0.95rem;">Microsoft Clarity (Heatmaps)</strong>
                                    </div>
                                    <label class="tracking-switch">
                                        <input type="checkbox" id="track-clarity-enabled" onchange="window.updateTrackingLivePreview()">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="admin-field" style="margin-bottom: 8px;">
                                    <label>Project ID (alphanumeric, 6-16 chars)</label>
                                    <input type="text" id="track-clarity-id" placeholder="e.g. k7x9p2m4" autocomplete="off" oninput="window.updateTrackingLivePreview()">
                                </div>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    💡 <em>Where to find:</em> Clarity Settings &gt; Overview &gt; Project ID. Captures session recordings and click heatmaps.
                                </p>
                            </div>
                        </div>

                        <!-- SEO Verification & Cookie Consent Row -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px;">
                            
                            <!-- Google Search Console Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                    <span style="font-size: 1.2rem;">🔍</span>
                                    <strong style="color: #f8fafc; font-size: 0.95rem;">Google Search Console Verification</strong>
                                </div>
                                <div class="admin-field" style="margin-bottom: 8px;">
                                    <label>HTML Meta Tag or Verification Code</label>
                                    <input type="text" id="track-gsc-tag" placeholder="&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot;&gt;" autocomplete="off" oninput="window.updateTrackingLivePreview()">
                                </div>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    💡 Paste either the entire meta tag from Google Search Console or just the content code string.
                                </p>
                            </div>

                            <!-- Google Consent Mode v2 / Cookie Banner Card -->
                            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.2rem;">🍪</span>
                                        <strong style="color: #f8fafc; font-size: 0.95rem;">Cookie Consent &amp; Consent Mode v2</strong>
                                    </div>
                                    <label class="tracking-switch">
                                        <input type="checkbox" id="track-consent-required" onchange="window.updateTrackingLivePreview()">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <p style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 8px; line-height: 1.4;">
                                    When enabled, analytics storage and ad storage are <strong>denied by default</strong>. Trackers are only activated after the visitor gives consent via a discreet dark-glass cookie banner.
                                </p>
                                <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
                                    Fully compatible with European GDPR &amp; Google Consent Mode v2 standards.
                                </p>
                            </div>
                        </div>

                        <!-- Custom Scripts (Advanced) -->
                        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px; margin-bottom: 25px;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                                <span style="font-size:1.2rem;">⚡</span>
                                <strong style="color: #f8fafc; font-size: 0.95rem;">Custom Injections (Advanced / Admin Only)</strong>
                            </div>
                            <div style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 4px; margin-bottom: 15px; font-size: 0.8rem; color: #fca5a5;">
                                ⚠️ <strong>Caution:</strong> Code added here will be executed on all public pages. Never paste unverified code. Admin sessions and /admin/* routes are strictly protected from injection.
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
                                <div class="admin-field">
                                    <label>Custom &lt;head&gt; Scripts (runs before page renders)</label>
                                    <textarea id="track-head-script" rows="4" placeholder="&lt;!-- custom head scripts e.g. custom font tags or web verification --&gt;" oninput="window.updateTrackingLivePreview()"></textarea>
                                </div>
                                <div class="admin-field">
                                    <label>Custom &lt;body&gt; Scripts (runs right before &lt;/body&gt;)</label>
                                    <textarea id="track-body-script" rows="4" placeholder="&lt;!-- custom body scripts e.g. chat widget or embed scripts --&gt;" oninput="window.updateTrackingLivePreview()"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Phase 3: GA4 Data API Key (Optional) -->
                        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px; margin-bottom: 25px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="font-size:1.2rem;">🔑</span>
                                    <strong style="color: #f8fafc; font-size: 0.95rem;">Google Analytics 4 Data API (Optional / Remote Reporting)</strong>
                                </div>
                                <button type="button" class="action-btn" style="padding:4px 10px; font-size:0.75rem; background:#1e293b; border:1px solid #475569;" onclick="window.toggleGa4Guide()">How to Setup Guide 📖</button>
                            </div>
                            <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;">
                                Connect your GA4 property directly to pull Google-side statistics alongside your first-party analytics.
                            </p>
                            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px;">
                                <div class="admin-field">
                                    <label>GA4 Property ID (numeric digits only)</label>
                                    <input type="text" id="track-ga4-property-id" placeholder="e.g. 439281729" autocomplete="off">
                                </div>
                                <div class="admin-field">
                                    <label>Google Cloud Service Account JSON Key</label>
                                    <textarea id="track-ga4-sa-json" rows="2" placeholder='{"type": "service_account", "project_id": "...", ...}'></textarea>
                                </div>
                            </div>
                            <div id="ga4-setup-guide-box" style="display:none; margin-top:15px; background:rgba(0,0,0,0.4); padding:14px; border-radius:8px; border:1px solid rgba(56,189,248,0.2); font-size:0.83rem; color:#cbd5e1; line-height:1.5;">
                                <h4 style="color:#38bdf8; margin-bottom:8px;">Quick 4-Step GA4 Data API Setup:</h4>
                                <ol style="padding-left:20px; display:flex; flex-direction:column; gap:6px;">
                                    <li>Open <a href="https://console.cloud.google.com" target="_blank" style="color:#38bdf8;">Google Cloud Console</a> and create or select a project.</li>
                                    <li>Enable the <strong>Google Analytics Data API</strong> from the API Library.</li>
                                    <li>Create a <strong>Service Account</strong>, create a JSON key, and download it. Paste its entire JSON content above.</li>
                                    <li>In <a href="https://analytics.google.com" target="_blank" style="color:#38bdf8;">Google Analytics</a> &gt; Admin &gt; Property Access Management, add the service account email with the <strong>Viewer</strong> role.</li>
                                </ol>
                            </div>
                        </div>

                        <!-- Live Test & Preview Panel -->
                        <div class="dash-card" style="background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.25);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap:wrap; gap:10px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="font-size:1.2rem;">🔬</span>
                                    <h3 style="margin:0; padding:0; border:none; font-size:1.1rem; color:#38bdf8;">Live Inspection &amp; Test Preview</h3>
                                </div>
                                <button type="button" class="action-btn" style="padding: 5px 12px; font-size: 0.8rem; background: #1e293b; border: 1px solid #38bdf8; color:#38bdf8;" onclick="window.copyGeneratedSnippets()">Copy Generated Snippets 📋</button>
                            </div>

                            <!-- Status Checklist Grid -->
                            <div id="tracking-checklist" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 18px;">
                                <div class="checklist-item" id="check-ga4">
                                    <span class="check-icon">⚪</span> <span>GA4: Disabled</span>
                                </div>
                                <div class="checklist-item" id="check-gtm">
                                    <span class="check-icon">⚪</span> <span>GTM: Disabled</span>
                                </div>
                                <div class="checklist-item" id="check-pixel">
                                    <span class="check-icon">⚪</span> <span>Pixel: Disabled</span>
                                </div>
                                <div class="checklist-item" id="check-clarity">
                                    <span class="check-icon">⚪</span> <span>Clarity: Disabled</span>
                                </div>
                                <div class="checklist-item" id="check-consent">
                                    <span class="check-icon">⚪</span> <span>Consent Banner: Off</span>
                                </div>
                                <div class="checklist-item" id="check-gsc">
                                    <span class="check-icon">⚪</span> <span>GSC Tag: Not set</span>
                                </div>
                            </div>

                            <!-- Live Code Preview Pre -->
                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <span style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Generated &lt;head&gt; Payload (Injected on Public Requests):</span>
                                </div>
                                <pre style="background: #020617; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; max-height: 220px; overflow-y: auto; font-family: monospace; font-size: 0.8rem; color: #38bdf8; white-space: pre-wrap;"><code id="tracking-preview-head">&lt;!-- No tracking scripts enabled --&gt;</code></pre>
                            </div>

                            <div style="margin-top: 14px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <span style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Generated &lt;body&gt; Payload (Noscript &amp; Custom Body):</span>
                                </div>
                                <pre style="background: #020617; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; max-height: 160px; overflow-y: auto; font-family: monospace; font-size: 0.8rem; color: #2ecc71; white-space: pre-wrap;"><code id="tracking-preview-body">&lt;!-- No body scripts --&gt;</code></pre>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px;">
                            <button type="button" class="logout-btn" onclick="window.loadTrackingSettings()">Reset Changes</button>
                            <button type="submit" class="action-btn" style="padding: 10px 24px; font-size: 0.95rem; font-weight: 700; background: #38bdf8;">Save All Tracking Settings 🚀</button>
                        </div>
                    </form>
                </div>
            </section>

            <!-- ========================================== -->
            <!-- 📈 TAB: BUILT-IN BLOG ANALYTICS DASHBOARD  -->
            <!-- ========================================== -->
            <section id="tab-blog-analytics" class="tab-pane">
                <div class="dash-card">
                    <!-- Dashboard Header & Period Controls -->
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 25px;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <h2 style="margin: 0; font-size: 1.4rem;">📈 Built-in Blog Analytics</h2>
                                <span style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">FIRST-PARTY VERIFIED</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 4px;">Privacy-focused, bot-filtered audience metrics without third-party cookies</p>
                        </div>

                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <!-- Period Pills -->
                            <div id="analytics-period-filters" style="display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                                <button type="button" class="analytics-period-btn" data-period="today" onclick="window.setAnalyticsPeriod('today')">Today</button>
                                <button type="button" class="analytics-period-btn" data-period="7d" onclick="window.setAnalyticsPeriod('7d')">7 Days</button>
                                <button type="button" class="analytics-period-btn active" data-period="30d" onclick="window.setAnalyticsPeriod('30d')">30 Days</button>
                                <button type="button" class="analytics-period-btn" data-period="90d" onclick="window.setAnalyticsPeriod('90d')">90 Days</button>
                                <button type="button" class="analytics-period-btn" data-period="custom" onclick="window.toggleCustomDateRange()">Custom</button>
                            </div>

                            <button type="button" class="action-btn" style="padding: 7px 14px; font-size: 0.82rem; background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8;" onclick="window.exportAnalyticsCsv()">Export CSV 📥</button>
                            <button type="button" class="action-btn" style="padding: 7px 12px; font-size: 0.82rem;" onclick="window.loadBlogAnalytics()">Refresh 🔄</button>
                        </div>
                    </div>

                    <!-- Custom Date Range Bar (Collapsible) -->
                    <div id="custom-date-bar" style="display: none; background: rgba(0,0,0,0.25); padding: 12px 18px; border-radius: 8px; border: 1px solid rgba(56,189,248,0.2); margin-bottom: 20px; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <span style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">Custom Range:</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <label style="font-size: 0.78rem; color: #94a3b8;">Start:</label>
                            <input type="date" id="custom-start-date" style="padding: 4px 8px; font-size: 0.8rem;">
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <label style="font-size: 0.78rem; color: #94a3b8;">End:</label>
                            <input type="date" id="custom-end-date" style="padding: 4px 8px; font-size: 0.8rem;">
                        </div>
                        <button type="button" class="action-btn" style="padding: 4px 12px; font-size: 0.8rem;" onclick="window.applyCustomDateRange()">Apply Filter ⚡</button>
                    </div>

                    <!-- 4 Summary Metric Cards Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 25px;">
                        <!-- Card 1: Total Views -->
                        <div class="analytics-metric-card" style="border-left: 3px solid #38bdf8;">
                            <div class="metric-header">
                                <span class="metric-label">TOTAL VIEWS</span>
                                <span id="metric-views-badge" class="metric-badge neutral">0%</span>
                            </div>
                            <div id="metric-total-views" class="metric-value" style="color: #38bdf8;">0</div>
                            <div class="metric-subtext">Page loads &gt; 30s deduped</div>
                        </div>

                        <!-- Card 2: Unique Visitors -->
                        <div class="analytics-metric-card" style="border-left: 3px solid #10b981;">
                            <div class="metric-header">
                                <span class="metric-label">UNIQUE VISITORS</span>
                                <span id="metric-uniques-badge" class="metric-badge neutral">0%</span>
                            </div>
                            <div id="metric-unique-visitors" class="metric-value" style="color: #10b981;">0</div>
                            <div class="metric-subtext">Daily rotating hash, 0 raw IPs</div>
                        </div>

                        <!-- Card 3: Avg Time on Page -->
                        <div class="analytics-metric-card" style="border-left: 3px solid #f1c40f;">
                            <div class="metric-header">
                                <span class="metric-label">AVG. READ TIME</span>
                                <span id="metric-duration-badge" class="metric-badge neutral">0%</span>
                            </div>
                            <div id="metric-avg-duration" class="metric-value" style="color: #f1c40f;">0m 0s</div>
                            <div class="metric-subtext">Active reading engagement</div>
                        </div>

                        <!-- Card 4: Avg Scroll Depth -->
                        <div class="analytics-metric-card" style="border-left: 3px solid #a855f7;">
                            <div class="metric-header">
                                <span class="metric-label">AVG. SCROLL DEPTH</span>
                                <span id="metric-scroll-badge" class="metric-badge neutral">0%</span>
                            </div>
                            <div id="metric-avg-scroll" class="metric-value" style="color: #a855f7;">0%</div>
                            <div class="metric-subtext">Article content consumption</div>
                        </div>
                    </div>

                    <!-- Trend Chart Card -->
                    <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                            <div>
                                <h3 style="margin: 0; padding:0; border:none; font-size: 1.05rem; color: #f8fafc;">Views &amp; Unique Visitors Trend</h3>
                                <p style="color: #94a3b8; font-size: 0.78rem; margin-top: 2px;">Daily distribution over selected timeframe</p>
                            </div>
                            <div style="display: flex; gap: 15px; font-size: 0.8rem;">
                                <span style="display:flex; align-items:center; gap:6px;"><span style="display:inline-block; width:12px; height:12px; background:#38bdf8; border-radius:3px;"></span> Total Views</span>
                                <span style="display:flex; align-items:center; gap:6px;"><span style="display:inline-block; width:12px; height:12px; background:#10b981; border-radius:3px;"></span> Unique Visitors</span>
                            </div>
                        </div>
                        <div id="trend-chart-container" style="width: 100%; height: 260px; position: relative;">
                            <!-- Responsive SVG Chart injected by JS -->
                        </div>
                    </div>

                    <!-- 2 Column Breakdown Row (Referrers & Devices) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px;">
                        <!-- Top Referrers Card -->
                        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
                                <span style="font-size: 1.2rem;">🌐</span>
                                <h3 style="margin: 0; padding: 0; border: none; font-size: 1.05rem; color: #f8fafc;">Top Traffic Referrers</h3>
                            </div>
                            <div id="analytics-referrers-list" style="display: flex; flex-direction: column; gap: 10px;">
                                <p style="color: #94a3b8; font-size: 0.85rem;">Loading referrer data...</p>
                            </div>
                        </div>

                        <!-- Device Breakdown Card -->
                        <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
                                <span style="font-size: 1.2rem;">📱</span>
                                <h3 style="margin: 0; padding: 0; border: none; font-size: 1.05rem; color: #f8fafc;">Device Breakdown</h3>
                            </div>
                            <div id="analytics-devices-list" style="display: flex; flex-direction: column; gap: 10px;">
                                <p style="color: #94a3b8; font-size: 0.85rem;">Loading device data...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Per-Article Performance Table -->
                    <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
                            <div>
                                <h3 style="margin: 0; padding:0; border:none; font-size: 1.1rem; color: #f8fafc;">Article Performance Breakdown</h3>
                                <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 2px;">Click any article to view its drill-down engagement breakdown</p>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                                <input type="text" id="analytics-search-input" placeholder="Search by title..." style="padding: 6px 12px; font-size: 0.82rem; width: 200px;" oninput="window.filterAnalyticsTable()">
                                <select id="analytics-sort-select" style="padding: 6px 12px; font-size: 0.82rem;" onchange="window.sortAnalyticsTable()">
                                    <option value="views-desc">Views (High to Low)</option>
                                    <option value="views-asc">Views (Low to High)</option>
                                    <option value="date-desc">Newest First</option>
                                    <option value="time-desc">Longest Read Time</option>
                                </select>
                            </div>
                        </div>

                        <div style="overflow-x: auto;">
                            <table class="analytics-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">
                                        <th style="padding: 10px 12px;">Article Title</th>
                                        <th style="padding: 10px 12px;">Published</th>
                                        <th style="padding: 10px 12px; text-align: right;">Views</th>
                                        <th style="padding: 10px 12px; text-align: right;">Uniques</th>
                                        <th style="padding: 10px 12px; text-align: right;">Avg Time</th>
                                        <th style="padding: 10px 12px; text-align: right;">Scroll %</th>
                                        <th style="padding: 10px 12px; text-align: center;">Performance</th>
                                    </tr>
                                </thead>
                                <tbody id="analytics-table-body">
                                    <tr><td colspan="7" style="padding: 20px; text-align: center; color: #94a3b8;">Loading article metrics...</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Table Pagination -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; font-size: 0.82rem; color: #94a3b8;">
                            <span id="analytics-page-info">Showing 0 of 0 articles</span>
                            <div style="display: flex; gap: 6px;">
                                <button type="button" class="action-btn" id="analytics-prev-page" style="padding: 4px 10px; font-size: 0.78rem;" onclick="window.changeAnalyticsPage(-1)">← Previous</button>
                                <button type="button" class="action-btn" id="analytics-next-page" style="padding: 4px 10px; font-size: 0.78rem;" onclick="window.changeAnalyticsPage(1)">Next →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Zero Views Alert Card -->
                    <div style="background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 18px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 1.2rem;">📢</span>
                            <h4 style="margin: 0; color: #f87171; font-size: 0.95rem;">Content Opportunity: Zero Views in Last 30 Days</h4>
                        </div>
                        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 12px;">
                            These published articles haven't received traffic in the past month. Consider promoting them on LinkedIn/X, refreshing content, or adding internal links.
                        </p>
                        <div id="zero-views-list" style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <span style="color: #94a3b8; font-size: 0.82rem;">Checking content health...</span>
                        </div>
                    </div>
                </div>
            </section>
`;
    html = html.replace('</main>', trackingAndAnalyticsTabs + '\n        </main>');
    console.log("✅ Added #tab-tracking and #tab-blog-analytics to dashboard.html");
}

// 5. Add Modals: Bulk Confirmation Modal & Analytics Detail Drawer before </body>
if (!html.includes('id="blog-bulk-modal"')) {
    const extraModals = `
    <!-- Sticky Bulk Action Bar for Blogs -->
    <div id="blog-bulk-bar" class="blog-bulk-bar" style="display: none;">
        <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.1rem;">⚡</span>
            <span style="font-weight:600; font-size:0.92rem;"><span id="bulk-selected-count">0</span> articles selected</span>
        </div>
        <div id="bulk-normal-actions" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="bulk-action-btn bulk-trash-btn" onclick="window.confirmBulkAction('trash')">🗑️ Move to Trash</button>
            <button type="button" class="bulk-action-btn bulk-pub-btn" onclick="window.confirmBulkAction('publish')">🚀 Publish</button>
            <button type="button" class="bulk-action-btn bulk-draft-btn" onclick="window.confirmBulkAction('draft')">📝 Draft</button>
            <button type="button" class="bulk-action-btn bulk-cancel-btn" onclick="window.clearBlogSelection()">Clear</button>
        </div>
        <div id="bulk-trash-actions" style="display: none; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="bulk-action-btn bulk-restore-btn" onclick="window.confirmBulkAction('restore')">♻️ Restore Selected</button>
            <button type="button" class="bulk-action-btn bulk-delete-btn" onclick="window.confirmBulkAction('delete')">❌ Delete Permanently</button>
            <button type="button" class="bulk-action-btn bulk-cancel-btn" onclick="window.clearBlogSelection()">Clear</button>
        </div>
    </div>

    <!-- Bulk Action Confirmation Modal -->
    <div id="blog-bulk-modal" class="modal hidden">
        <div class="modal-content dash-card" style="max-width: 500px; width: 92%;">
            <h3 id="bulk-modal-title" style="margin-bottom: 10px; color: #38bdf8;">Confirm Bulk Action</h3>
            <p id="bulk-modal-desc" style="color: #cbd5e1; font-size: 0.88rem; margin-bottom: 15px; line-height: 1.4;">Are you sure you want to proceed?</p>
            
            <div style="margin-bottom: 15px;">
                <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Selected Articles:</span>
                <div id="bulk-modal-list" style="max-height: 160px; overflow-y: auto; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px; margin-top: 6px; font-size: 0.82rem; color: #e2e8f0; display:flex; flex-direction:column; gap:4px;">
                </div>
            </div>

            <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 10px;">
                <button type="button" class="logout-btn" onclick="document.getElementById('blog-bulk-modal').classList.add('hidden')">Cancel</button>
                <button type="button" id="bulk-modal-confirm-btn" class="action-btn" style="background: #e74c3c; font-weight: 700;">Proceed</button>
            </div>
        </div>
    </div>

    <!-- Analytics Article Detail Drawer Modal -->
    <div id="analytics-detail-drawer" class="modal hidden">
        <div class="modal-content dash-card" style="max-width: 720px; width: 92%; max-height: 90vh; overflow-y: auto; position: relative;">
            <button type="button" onclick="document.getElementById('analytics-detail-drawer').classList.add('hidden')" style="position: absolute; right: 18px; top: 18px; background: none; border: none; color: #94a3b8; font-size: 1.6rem; cursor: pointer;">&times;</button>
            
            <h3 id="drawer-blog-title" style="margin-bottom: 6px; color: #38bdf8; padding-right: 30px; font-size: 1.25rem;">Article Analytics</h3>
            <div style="margin-bottom: 18px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span id="drawer-blog-category" style="color: #818cf8; font-size: 0.82rem; font-weight: 600;"></span>
                <a id="drawer-live-link" href="#" target="_blank" style="color: #38bdf8; font-size: 0.8rem; text-decoration: underline;">Open Live Article ↗</a>
            </div>

            <!-- 4 Quick Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 22px;">
                <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; text-align: center; border: 1px solid rgba(56,189,248,0.2);">
                    <div style="color: #94a3b8; font-size: 0.74rem; font-weight: 600;">VIEWS</div>
                    <div id="drawer-views" style="color: #38bdf8; font-size: 1.5rem; font-weight: 700;">0</div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; text-align: center; border: 1px solid rgba(16,185,129,0.2);">
                    <div style="color: #94a3b8; font-size: 0.74rem; font-weight: 600;">UNIQUES</div>
                    <div id="drawer-uniques" style="color: #10b981; font-size: 1.5rem; font-weight: 700;">0</div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; text-align: center; border: 1px solid rgba(241,196,15,0.2);">
                    <div style="color: #94a3b8; font-size: 0.74rem; font-weight: 600;">AVG. READ TIME</div>
                    <div id="drawer-duration" style="color: #f1c40f; font-size: 1.5rem; font-weight: 700;">0s</div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; text-align: center; border: 1px solid rgba(168,85,247,0.2);">
                    <div style="color: #94a3b8; font-size: 0.74rem; font-weight: 600;">AVG. SCROLL</div>
                    <div id="drawer-scroll" style="color: #a855f7; font-size: 1.5rem; font-weight: 700;">0%</div>
                </div>
            </div>

            <!-- Single Post Daily Trend -->
            <div style="margin-bottom: 22px;">
                <h4 style="color: #cbd5e1; margin-bottom: 10px; font-size: 0.95rem;">Daily Trend (Last 30 Days)</h4>
                <div id="drawer-chart-container" style="width: 100%; height: 180px; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 10px; border: 1px solid rgba(255,255,255,0.06);"></div>
            </div>

            <!-- Referrers & Devices for this post -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                <div style="background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <h4 style="color: #cbd5e1; margin-bottom: 10px; font-size: 0.9rem;">Referrer Sources</h4>
                    <div id="drawer-referrers-list" style="font-size: 0.82rem; color: #94a3b8; display:flex; flex-direction:column; gap:6px;">Loading...</div>
                </div>
                <div style="background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <h4 style="color: #cbd5e1; margin-bottom: 10px; font-size: 0.9rem;">Devices</h4>
                    <div id="drawer-devices-list" style="font-size: 0.82rem; color: #94a3b8; display:flex; flex-direction:column; gap:6px;">Loading...</div>
                </div>
            </div>
        </div>
    </div>
`;
    html = html.replace('</body>', extraModals + '\n</body>');
    console.log("✅ Added bulk bar, bulk confirmation modal & detail drawer to dashboard.html");
}

fs.writeFileSync(dashHtmlPath, html, 'utf8');
console.log("🎉 Successfully updated dashboard.html!");

