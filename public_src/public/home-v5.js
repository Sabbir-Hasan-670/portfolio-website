// ============================================================================
// Awwwards-Tier Interactive Cyber Neural Constellation Canvas (Zero-Lag 120fps)
// ============================================================================
(() => {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    let width = 0;
    let height = 0;
    let animId = null;
    let inView = true;

    const mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const PARTICLE_COUNT = window.innerWidth < 768 ? 20 : 40;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * (width || 800),
            y: Math.random() * (height || 600),
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.8,
            color: Math.random() > 0.35 ? 'rgba(56, 189, 248, ' : 'rgba(245, 158, 11, ',
            baseAlpha: Math.random() * 0.35 + 0.25
        });
    }

    const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    };

    const onMouseLeave = () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });

    const maxDist = 115;
    const maxDistSq = maxDist * maxDist;
    const mouseDist = 130;
    const mouseDistSq = mouseDist * mouseDist;

    const render = () => {
        if (!inView) {
            animId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            else if (p.x > width) { p.x = width; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            else if (p.y > height) { p.y = height; p.vy *= -1; }

            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < mouseDistSq && dSq > 0) {
                    const d = Math.sqrt(dSq);
                    const force = (mouseDist - d) / mouseDist * 0.6;
                    p.x += (dx / d) * force;
                    p.y += (dy / d) * force;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.baseAlpha + ')';
            ctx.fill();

            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dSq = dx * dx + dy * dy;

                if (dSq < maxDistSq) {
                    const distRatio = 1 - Math.sqrt(dSq) / maxDist;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${(distRatio * 0.16).toFixed(3)})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(render);
    };

    const obs = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !animId) {
            animId = requestAnimationFrame(render);
        }
    }, { threshold: 0.05 });

    obs.observe(hero);
})();

// Zero-Lag 120fps Hardware-Accelerated Spatial Motion for Hero Chassis
(() => {
    const scene = document.getElementById('heroScene');
    const shell = document.getElementById('heroVisualStage') || document.getElementById('portraitShell');
    const hero = document.getElementById('home');

    if (!scene || !shell || !hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    let sceneInView = true;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animId = null;
    let isMoving = false;

    const updateTilt = () => {
        if (!sceneInView || reducedMotion.matches) {
            animId = null;
            return;
        }

        // Smooth spring lerp for physical weighted glass feel
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        shell.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translate3d(0, -2px, 0)`;

        const diffX = Math.abs(targetRotX - currentRotX);
        const diffY = Math.abs(targetRotY - currentRotY);

        if (diffX > 0.01 || diffY > 0.01 || isMoving) {
            animId = window.requestAnimationFrame(updateTilt);
        } else {
            animId = null;
            if (!isMoving) {
                shell.style.transform = '';
            }
        }
    };

    const requestTiltLoop = () => {
        if (!animId && sceneInView && !reducedMotion.matches) {
            animId = window.requestAnimationFrame(updateTilt);
        }
    };

    const onPointerMove = (event) => {
        if (reducedMotion.matches || !precisePointer.matches || !sceneInView) return;

        const rect = shell.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        // Subtle, elegant rotation limits (max 4.5 degrees)
        targetRotX = Math.max(-4.5, Math.min(4.5, y * -9));
        targetRotY = Math.max(-4.5, Math.min(4.5, x * 9));
        isMoving = true;

        requestTiltLoop();
    };

    const onPointerLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        isMoving = false;
        requestTiltLoop();
    };

    const observer = new IntersectionObserver(([entry]) => {
        sceneInView = entry.isIntersecting;
        if (!sceneInView) {
            targetRotX = 0;
            targetRotY = 0;
            isMoving = false;
            shell.style.transform = '';
        }
    }, { threshold: 0.1 });

    observer.observe(hero);

    scene.addEventListener('pointermove', onPointerMove, { passive: true });
    scene.addEventListener('pointerleave', onPointerLeave, { passive: true });

    hero.classList.add('hero-ready');
})();

// Network and Cybersecurity showcase labels remain tied to existing services.
(() => {
    const targets = {
        network: document.getElementById('network-showcase-data'),
        security: document.getElementById('cyber-showcase-data')
    };
    if (!targets.network && !targets.security) return;

    const terms = {
        network: ['network', 'ccna', 'vlan', 'router', 'switch', 'routing', 'subnet', 'server'],
        security: ['security', 'cyber', 'ethical', 'firewall', 'ssl', 'vulnerability', 'defense', 'penetration', 'secure']
    };

    const categoryKeys = { network: ['network', 'server'], security: ['cybersecurity'] };

    const render = (services) => {
        Object.entries(targets).forEach(([domain, target]) => {
            if (!target) return;
            const matches = services.filter(service => {
                const category = String(service.category_key || '').trim().toLowerCase();
                if (categoryKeys[domain].includes(category)) return true;
                const source = `${service.title || ''} ${service.description || ''} ${service.tags || ''}`.toLowerCase();
                return terms[domain].some(term => source.includes(term));
            });
            target.replaceChildren();
            if (!matches.length) {
                const note = document.createElement('p');
                note.textContent = 'Relevant service details will appear when available from the admin system.';
                target.append(note);
                return;
            }
            matches.slice(0, 4).forEach(service => {
                const item = document.createElement('span');
                item.className = 'showcase-service';
                item.textContent = service.title || 'Untitled service';
                target.append(item);
            });
        });
    };

    window.addEventListener('expertise-services-ready', event => {
        if (Array.isArray(event.detail)) render(event.detail);
    });
    if (Array.isArray(window.__expertiseServices)) render(window.__expertiseServices);
})();

// Expertise is a single interactive technical system. Service copy/tags are
// supplied by the existing services API through the event below.
(() => {
    const system = document.getElementById('public-services-grid');
    if (!system || !system.classList.contains('expertise-system')) return;

    const tabs = [...system.querySelectorAll('.expertise-tab')];
    const stage = document.getElementById('expertise-stage');
    const list = document.getElementById('expertise-managed-list');
    const streamCounter = document.getElementById('hud-stream-counter');
    const latencyCounter = document.getElementById('hud-latency-counter');

    const modeMeta = {
        network: ['01 / SYSTEM MAP', 'LIVE TOPOLOGY'],
        security: ['02 / SECURITY MAP', 'VERIFIED PATH'],
        development: ['03 / REQUEST MAP', 'SERVICE CHAIN'],
        design: ['04 / VISUAL MAP', 'DESIGN SYSTEM'],
        marketing: ['05 / GROWTH MAP', 'CAMPAIGN FLOW'],
        database: ['06 / DATA MAP', 'RELATIONAL CORE']
    };

    const domainCapabilities = {
        network: [
            'Cisco CCNA 200-301',
            'BGP / OSPF Dynamic Routing',
            '802.1Q VLAN & Trunking',
            'WireGuard & IPSec VPN Mesh',
            'pfSense Firewall Segmentation',
            'High-Availability Routing'
        ],
        security: [
            'Zero Trust Network Access (ZTNA)',
            'OWASP Top 10 Hardening',
            'WAF & DDoS Edge Mitigation',
            'Penetration Testing & Auditing',
            'TLS 1.3 & Encrypted SNI',
            'Role-Based Access Control (RBAC)'
        ],
        development: [
            'Vanilla ES6+ & TypeScript',
            'Node.js & Express Architecture',
            'RESTful & WebSocket APIs',
            'Full-Stack Architecture',
            'High-Concurrency Caching Layers',
            'Automated CI/CD Workflows'
        ],
        design: [
            'Brand Identity & Logo Systems',
            'Dark-Tech Luxury UI/UX',
            'Figma & Adobe Illustrator',
            'Fluid Typography & 12-Col Grid',
            'Micro-Interactions & Physics',
            'Component Design Tokens'
        ],
        marketing: [
            'Technical SEO & Schema JSON-LD',
            'Core Web Vitals Optimization',
            'Search Console & Indexation',
            'Conversion Rate Optimization',
            'Performance Telemetry',
            'Content Growth Funnels'
        ],
        database: [
            'MySQL 8.0 Relational Architecture',
            'Query Profiling & Index Tuning',
            'ACID Transaction Integrity',
            'Automated Replication & Backups',
            'Redis In-Memory Caching',
            'Normalized Schema Design'
        ]
    };

    let services = [];

    const classify = (service, domain) => {
        const category = String(service.category_key || '').trim().toLowerCase();
        const categoryDomains = {
            network: ['network', 'server'],
            security: ['cybersecurity'],
            development: ['fullstack'],
            marketing: ['seo']
        };
        if (categoryDomains[domain]?.includes(category)) return true;
        const source = `${service.title || ''} ${service.description || ''} ${service.tags || ''}`.toLowerCase();
        const terms = {
            network: ['network', 'ccna', 'vlan', 'router', 'switch', 'routing', 'subnet'],
            security: ['security', 'cyber', 'ethical', 'firewall', 'ssl', 'vulnerability', 'defense', 'penetration'],
            development: ['full-stack', 'full stack', 'web', 'node', 'express', 'javascript', 'application', 'development'],
            design: ['graphic', 'design', 'branding', 'photoshop', 'illustrator', 'ui', 'ux', 'canva'],
            marketing: ['marketing', 'seo', 'digital', 'content', 'analytics', 'campaign', 'social media'],
            database: ['database', 'mysql', 'sql', 'postgres', 'mongo', 'schema', 'query']
        };
        return terms[domain].some(term => source.includes(term));
    };

    const renderServices = () => {
        const domain = system.dataset.activeDomain || 'network';
        const related = services.filter(service => classify(service, domain));
        const caps = domainCapabilities[domain] || domainCapabilities.network;

        list.replaceChildren();

        // 1. Render CMS custom services if present in database
        related.slice(0, 3).forEach(service => {
            const item = document.createElement('span');
            item.className = 'expertise-service';
            item.textContent = service.title || 'Untitled service';
            list.append(item);
        });

        // 2. Render Core Enterprise Capabilities for selected discipline
        caps.forEach(cap => {
            const item = document.createElement('span');
            item.className = 'expertise-service';
            item.textContent = cap;
            list.append(item);
        });
    };

    const activate = (domain) => {
        const meta = modeMeta[domain];
        if (!meta) return;

        system.dataset.activeDomain = domain;
        tabs.forEach(tab => {
            const active = tab.dataset.domain === domain;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
            if (active && stage) stage.setAttribute('aria-labelledby', tab.id);
        });
        const indexEl = system.querySelector('.expertise-stage-index');
        const statusEl = system.querySelector('.expertise-stage-status');
        if (indexEl) indexEl.textContent = meta[0];
        if (statusEl) statusEl.textContent = meta[1];
        renderServices();
    };

    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.domain)));
    window.addEventListener('expertise-services-ready', event => {
        services = Array.isArray(event.detail) ? event.detail : [];
        renderServices();
    });

    if (Array.isArray(window.__expertiseServices)) {
        services = window.__expertiseServices;
        renderServices();
    } else {
        renderServices();
    }

    // Interactive Node Inspection on SVG (Clean Telemetry without SVG coordinate corruption)
    const topoStatus = system.querySelector('.hud-val-green');
    const NODE_DESCRIPTIONS = {
        'edge': 'EDGE GATEWAY (FW / NAT)',
        'router': 'CORE ROUTER (CISCO C8300)',
        'switch': 'VLAN TRUNK (10/20/30)',
        'client-a': 'CLIENT A (PROD 10.10.10.25)',
        'client-b': 'CLIENT B (MGMT 10.20.20.14)'
    };

    system.querySelectorAll('.node-interactive').forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.classList.add('node-active');
            const nodeKey = node.getAttribute('data-node');
            if (topoStatus && NODE_DESCRIPTIONS[nodeKey]) {
                topoStatus.textContent = NODE_DESCRIPTIONS[nodeKey];
                topoStatus.style.fill = '#d8a745';
                topoStatus.style.color = '#d8a745';
            }
        });
        node.addEventListener('mouseleave', () => {
            node.classList.remove('node-active');
            if (topoStatus) {
                topoStatus.textContent = 'OPTIMAL';
                topoStatus.style.fill = '';
                topoStatus.style.color = '';
            }
        });
    });

    const observer = new IntersectionObserver(([entry]) => {
        system.classList.toggle('expertise-paused', !entry.isIntersecting || document.hidden);
    }, { threshold: 0.08 });
    observer.observe(system);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) system.classList.add('expertise-paused');
    }, { passive: true });
})();

// Section settings move/hide existing DOM nodes. Recalculate scroll-based layout
// without recreating visual systems or attaching another set of listeners.
window.addEventListener('portfolio-sections-applied', () => {
    window.requestAnimationFrame(() => {
        if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
        }
    });
});
