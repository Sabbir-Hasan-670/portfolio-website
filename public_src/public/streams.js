/**
 * Broadcast Studio & Media Streams Frontend Engine
 * Sabbir Hasan Portfolio System
 */

(function () {
    'use strict';

    let allChannels = [];
    let allVideos = [];
    let activePlatform = 'all';
    let searchQuery = '';
    let selectedChannelId = null;

    // DOM Elements
    const elements = {
        navHamburger: document.getElementById('streams-hamburger'),
        mobileMenu: document.getElementById('streams-mobile-menu'),
        hudChannels: document.getElementById('hud-channels-count'),
        hudLive: document.getElementById('hud-live-status'),
        hudVideos: document.getElementById('hud-videos-count'),
        stagePlayerWrap: document.getElementById('stage-player-container'),
        stageBadge: document.getElementById('stage-badge'),
        stageMetaTitle: document.getElementById('stage-meta-title'),
        stageMetaChannel: document.getElementById('stage-meta-channel'),
        stageAvatar: document.getElementById('stage-avatar'),
        stageSubscribeBtn: document.getElementById('stage-subscribe-btn'),
        channelsDeck: document.getElementById('channels-deck'),
        channelsCountLabel: document.getElementById('channels-count-label'),
        videosGrid: document.getElementById('videos-grid'),
        videosCountBadge: document.getElementById('videos-count-badge'),
        videoSearchInput: document.getElementById('video-search-input'),
        filterTabs: document.querySelectorAll('.filter-tab'),
        cinemaModal: document.getElementById('cinema-modal'),
        cinemaModalClose: document.getElementById('cinema-modal-close'),
        cinemaModalBackdrop: document.getElementById('cinema-modal-backdrop'),
        cinemaModalTitle: document.getElementById('cinema-modal-title'),
        cinemaFrameWrap: document.getElementById('cinema-frame-wrap')
    };

    // Mobile Menu Toggle
    if (elements.navHamburger && elements.mobileMenu) {
        elements.navHamburger.addEventListener('click', () => {
            elements.mobileMenu.classList.toggle('open');
        });
    }

    // Helper: Extract YouTube ID
    function extractYouTubeId(url) {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i);
        return match ? match[1] : null;
    }

    // Helper: Format Relative Date
    function formatRelativeDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        const diffSecs = Math.floor((now - d) / 1000);
        if (diffSecs < 60) return 'Just now';
        const diffMins = Math.floor(diffSecs / 60);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30) return `${diffDays}d ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths}mo ago`;
        return `${Math.floor(diffMonths / 12)}y ago`;
    }

    // Helper: Build Embed URL
    function buildEmbedUrl(url, platform) {
        const p = (platform || 'youtube').toLowerCase();
        if (p === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
            const ytId = extractYouTubeId(url);
            return ytId ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0` : null;
        } else if (p === 'twitch' || url.includes('twitch.tv')) {
            const channelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
            const channel = channelMatch ? channelMatch[1] : '';
            return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true`;
        } else if (p === 'kick' || url.includes('kick.com')) {
            const kickMatch = url.match(/kick\.com\/([a-zA-Z0-9_]+)/i);
            const channel = kickMatch ? kickMatch[1] : '';
            return `https://player.kick.com/${channel}?autoplay=true`;
        }
        return url;
    }

    // Initialize & Fetch API
    async function initStreams() {
        try {
            const res = await fetch('/api/media-channels');
            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();
            allChannels = data.channels || [];
            allVideos = data.videos || [];

            updateHudMetrics();
            setupFeaturedStage();
            renderChannels();
            renderVideos();
        } catch (err) {
            console.error('Streams load notice:', err);
            renderChannels();
            renderVideos();
        }
    }

    // Update HUD Metrics
    function updateHudMetrics() {
        if (elements.hudChannels) elements.hudChannels.textContent = allChannels.length;
        if (elements.hudVideos) elements.hudVideos.textContent = allVideos.length;

        const liveChannel = allChannels.find(c => c.is_live);
        if (elements.hudLive) {
            if (liveChannel) {
                elements.hudLive.textContent = 'ON AIR';
                elements.hudLive.style.color = '#ef4444';
            } else {
                elements.hudLive.textContent = 'STANDBY';
                elements.hudLive.style.color = '#38bdf8';
            }
        }
    }

    // Setup Featured Stage
    function setupFeaturedStage() {
        if (!elements.stagePlayerWrap) return;

        // Check for live channel first
        const liveChannel = allChannels.find(c => c.is_live);
        if (liveChannel) {
            loadStageMedia({
                title: `${liveChannel.channel_name} is LIVE NOW!`,
                channel_name: liveChannel.channel_name,
                platform: liveChannel.platform,
                video_url: liveChannel.channel_url,
                avatar_url: liveChannel.avatar_url,
                badge_text: 'LIVE TRANSMISSION',
                subscribers_count: liveChannel.subscribers_count,
                channel_url: liveChannel.channel_url
            });
            return;
        }

        // Otherwise feature the latest video
        if (allVideos.length > 0) {
            const firstVideo = allVideos[0];
            const linkedCh = allChannels.find(c => c.id === firstVideo.channel_id);
            loadStageMedia({
                title: firstVideo.title,
                channel_name: linkedCh ? linkedCh.channel_name : (firstVideo.platform.toUpperCase() + ' Video'),
                platform: firstVideo.platform,
                video_url: firstVideo.video_url,
                thumbnail_url: firstVideo.thumbnail_url,
                avatar_url: linkedCh ? linkedCh.avatar_url : '',
                badge_text: 'FEATURED TRANSMISSION',
                subscribers_count: linkedCh ? linkedCh.subscribers_count : firstVideo.views_count,
                channel_url: linkedCh ? linkedCh.channel_url : firstVideo.video_url
            });
        } else {
            // Empty Standby Stage
            elements.stagePlayerWrap.innerHTML = `
                <div class="stage-placeholder" style="cursor: default; background: #080d1a;">
                    <div class="stage-play-overlay">
                        <span style="font-size: 2.5rem;">📡</span>
                        <div class="stage-play-text">BROADCAST TRANSMITTER STANDBY</div>
                    </div>
                </div>
            `;
            if (elements.stageBadge) elements.stageBadge.textContent = 'STANDBY FREQUENCY';
            if (elements.stageMetaTitle) elements.stageMetaTitle.textContent = 'No Live Broadcast Currently Active';
            if (elements.stageMetaChannel) elements.stageMetaChannel.textContent = 'Configure channels in Admin Dashboard to stream';
        }
    }

    // Load Stage Media
    function loadStageMedia(item) {
        if (!elements.stagePlayerWrap) return;

        if (elements.stageBadge) elements.stageBadge.textContent = item.badge_text || 'BROADCAST';
        if (elements.stageMetaTitle) elements.stageMetaTitle.textContent = item.title;
        if (elements.stageMetaChannel) elements.stageMetaChannel.textContent = `${item.channel_name} · ${item.subscribers_count || item.platform}`;

        if (elements.stageAvatar) {
            if (item.avatar_url) {
                elements.stageAvatar.src = item.avatar_url;
                elements.stageAvatar.style.display = 'block';
            } else {
                elements.stageAvatar.style.display = 'none';
            }
        }

        if (elements.stageSubscribeBtn) {
            elements.stageSubscribeBtn.href = item.channel_url || item.video_url || '#';
            elements.stageSubscribeBtn.textContent = `Subscribe on ${item.platform.toUpperCase()} ↗`;
            if (item.platform === 'youtube') elements.stageSubscribeBtn.style.background = '#ef4444';
            else if (item.platform === 'twitch') elements.stageSubscribeBtn.style.background = '#a855f7';
            else if (item.platform === 'kick') elements.stageSubscribeBtn.style.background = '#22c55e';
        }

        const embed = buildEmbedUrl(item.video_url, item.platform);
        const thumb = item.thumbnail_url || (extractYouTubeId(item.video_url) ? `https://img.youtube.com/vi/${extractYouTubeId(item.video_url)}/maxresdefault.jpg` : '');

        if (thumb) {
            elements.stagePlayerWrap.innerHTML = `
                <div class="stage-placeholder" id="stage-trigger-play">
                    <img src="${thumb}" alt="${item.title}" onerror="this.src='https://img.youtube.com/vi/${extractYouTubeId(item.video_url)}/hqdefault.jpg'">
                    <div class="stage-play-overlay">
                        <div class="stage-play-btn">▶</div>
                        <div class="stage-play-text">START PLAYBACK IN THEATER</div>
                    </div>
                </div>
            `;
            const trigger = document.getElementById('stage-trigger-play');
            if (trigger && embed) {
                trigger.addEventListener('click', () => {
                    elements.stagePlayerWrap.innerHTML = `
                        <iframe src="${embed}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `;
                });
            }
        } else if (embed) {
            elements.stagePlayerWrap.innerHTML = `
                <iframe src="${embed}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }
    }

    // Render Channels Grid
    function renderChannels() {
        if (!elements.channelsDeck) return;

        let filtered = allChannels;
        if (activePlatform !== 'all') {
            filtered = filtered.filter(c => c.platform.toLowerCase() === activePlatform.toLowerCase());
        }

        if (elements.channelsCountLabel) {
            elements.channelsCountLabel.textContent = `${filtered.length} ACTIVE`;
        }

        if (filtered.length === 0) {
            elements.channelsDeck.innerHTML = `
                <div class="streams-empty-terminal">
                    <div class="radar-icon">📡</div>
                    <h4>BROADCAST CHANNELS STANDBY</h4>
                    <p>No ${activePlatform !== 'all' ? activePlatform.toUpperCase() : ''} channels connected yet. Add channels via the Admin Dashboard to start streaming automatically.</p>
                </div>
            `;
            return;
        }

        elements.channelsDeck.innerHTML = filtered.map(ch => {
            const p = ch.platform.toLowerCase();
            const subLabel = p === 'youtube' ? 'Subscribe ↗' : (p === 'twitch' ? 'Follow on Twitch ↗' : 'Follow on Kick ↗');
            const isLiveBadge = ch.is_live 
                ? `<span class="streams-live-pill" style="padding: 2px 8px; font-size: 0.65rem;"><span class="streams-pulse-dot" style="width:6px;height:6px;"></span>LIVE NOW</span>`
                : `<span class="channel-badge-tag">${ch.badge_text || 'OFFICIAL'}</span>`;

            const avatarHtml = ch.avatar_url 
                ? `<img src="${ch.avatar_url}" alt="${ch.channel_name}">`
                : `<div class="channel-avatar-fallback">${ch.channel_name.charAt(0).toUpperCase()}</div>`;

            return `
                <article class="channel-card-st" data-platform="${p}">
                    <div class="channel-card-top">
                        <span class="channel-badge-tag" style="color:var(--st-card-accent);">${p.toUpperCase()} NETWORK</span>
                        ${isLiveBadge}
                    </div>
                    <div class="channel-card-profile">
                        <div class="channel-avatar-wrapper">
                            ${avatarHtml}
                        </div>
                        <div class="channel-card-info">
                            <h4>${ch.channel_name}</h4>
                            <p class="handle">${ch.channel_handle || `@${ch.channel_name.toLowerCase().replace(/\s+/g, '')}`}</p>
                            <p class="stats">${ch.subscribers_count || 'Verified Channel'}</p>
                        </div>
                    </div>
                    ${ch.description ? `<p class="channel-card-desc">${ch.description}</p>` : ''}
                    <div class="channel-card-bottom">
                        <a href="${ch.channel_url}" target="_blank" rel="noopener" class="channel-sub-btn-st">
                            ${subLabel}
                        </a>
                        <button type="button" class="channel-filter-btn" data-channel-id="${ch.id}" title="Filter videos by this channel">
                            Videos
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        // Attach event listeners to "Videos" filter buttons
        elements.channelsDeck.querySelectorAll('.channel-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.getAttribute('data-channel-id'));
                selectedChannelId = (selectedChannelId === id) ? null : id;
                renderVideos();
                // Scroll down smoothly to video section
                const videoSec = document.getElementById('videos-section');
                if (videoSec) videoSec.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Render Videos Grid
    function renderVideos() {
        if (!elements.videosGrid) return;

        let filtered = allVideos;

        // Platform Filter
        if (activePlatform !== 'all') {
            filtered = filtered.filter(v => v.platform.toLowerCase() === activePlatform.toLowerCase());
        }

        // Specific Channel Filter
        if (selectedChannelId) {
            filtered = filtered.filter(v => v.channel_id === selectedChannelId);
        }

        // Search Query Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(v => v.title.toLowerCase().includes(q));
        }

        if (elements.videosCountBadge) {
            elements.videosCountBadge.textContent = `${filtered.length} TRANSMISSIONS ARCHIVED`;
        }

        if (filtered.length === 0) {
            elements.videosGrid.innerHTML = `
                <div class="streams-empty-terminal">
                    <div class="radar-icon">🎬</div>
                    <h4>NO TRANSMISSIONS FOUND</h4>
                    <p>${searchQuery ? `No videos matching "${searchQuery}". Try a different keyword.` : 'No video transmissions synced for this filter yet.'}</p>
                </div>
            `;
            return;
        }

        elements.videosGrid.innerHTML = filtered.map((v, idx) => {
            const p = (v.platform || 'youtube').toLowerCase();
            const relDate = v.published_at ? formatRelativeDate(v.published_at) : '';
            const ytId = extractYouTubeId(v.video_url);
            const thumb = v.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');

            return `
                <article class="video-card-st" data-video-index="${idx}" data-platform="${p}">
                    <div class="video-card-thumb-wrap">
                        ${thumb ? `<img src="${thumb}" alt="${v.title}" loading="lazy">` : `<div style="width:100%;height:100%;display:grid;place-items:center;color:#64748b;">No Thumbnail</div>`}
                        <span class="video-platform-badge ${p}">${p}</span>
                        ${v.duration ? `<span class="video-duration-pill">${v.duration}</span>` : ''}
                        <div class="video-card-play-icon">
                            <span>▶</span>
                        </div>
                    </div>
                    <div class="video-card-body">
                        <h3 class="video-card-title">${v.title}</h3>
                        <div class="video-card-footer">
                            <span class="video-card-views">${v.views_count || 'Transmission'}</span>
                            ${relDate ? `<span>${relDate}</span>` : '<span>Active</span>'}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Attach click handlers to open in Cinema Lightbox
        elements.videosGrid.querySelectorAll('.video-card-st').forEach(card => {
            card.addEventListener('click', () => {
                const idx = Number(card.getAttribute('data-video-index'));
                const vid = filtered[idx];
                if (vid) openCinemaModal(vid);
            });
        });
    }

    // Cinema Modal Functions
    function openCinemaModal(video) {
        if (!elements.cinemaModal || !elements.cinemaFrameWrap) return;

        const embedUrl = buildEmbedUrl(video.video_url, video.platform);
        if (!embedUrl) {
            window.open(video.video_url, '_blank');
            return;
        }

        if (elements.cinemaModalTitle) elements.cinemaModalTitle.textContent = video.title;

        elements.cinemaFrameWrap.innerHTML = `
            <iframe src="${embedUrl}" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;

        elements.cinemaModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCinemaModal() {
        if (!elements.cinemaModal) return;
        elements.cinemaModal.classList.remove('open');
        if (elements.cinemaFrameWrap) elements.cinemaFrameWrap.innerHTML = '';
        document.body.style.overflow = '';
    }

    if (elements.cinemaModalClose) elements.cinemaModalClose.addEventListener('click', closeCinemaModal);
    if (elements.cinemaModalBackdrop) elements.cinemaModalBackdrop.addEventListener('click', closeCinemaModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.cinemaModal && elements.cinemaModal.classList.contains('open')) {
            closeCinemaModal();
        }
    });

    // Filter Tabs Handler
    elements.filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            elements.filterTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activePlatform = e.currentTarget.getAttribute('data-platform') || 'all';
            selectedChannelId = null; // reset channel filter on platform tab switch
            renderChannels();
            renderVideos();
        });
    });

    // Search Input Handler (Debounced)
    if (elements.videoSearchInput) {
        let debounceTimer;
        elements.videoSearchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                renderVideos();
            }, 200);
        });
    }

    // Boot
    document.addEventListener('DOMContentLoaded', initStreams);

})();
