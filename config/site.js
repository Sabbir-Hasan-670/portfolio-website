/**
 * config/site.js
 * Central configuration file for Sabbir Hasan's Portfolio Website.
 * 
 * Edit this file to add new social media profiles (Facebook, Behance, GitHub, etc.),
 * update service details, change contact emails, or modify site navigation.
 * All changes here automatically reflect in schemas (Person sameAs), footers, and headers.
 */

const siteConfig = {
    // Site Identity & Metadata
    name: 'Sabbir Hasan',
    siteTitle: 'Sabbir Hasan | Freelance Digital Marketer & Graphic Designer',
    siteUrl: 'https://sabbirhasan.com',
    email: 'contact@sabbirhasan.com',
    targetAudience: 'Worldwide clients (Remote availability)',
    
    // Professional Role & Specialty
    role: 'Freelance Digital Marketer, Social Media Marketer, Graphic Designer & Networking Professional',
    jobTitle: 'Freelance Digital Marketer & Graphic Designer',
    learningStatus: 'Currently learning Cyber Security',
    
    // Core Skills for Schema.org knowsAbout
    knowsAbout: [
        'Digital Marketing',
        'Social Media Marketing',
        'Graphic Design',
        'Logo Design',
        'Brand Identity',
        'Content Strategy',
        'Search Engine Optimization (SEO)',
        'Networking',
        'Network Configuration'
    ],

    // Default SEO & Open Graph
    defaultDescription: 'Sabbir Hasan is a freelance digital marketer and graphic designer offering social media marketing, logo design and networking services to clients worldwide.',
    defaultOgImage: 'https://sabbirhasan.com/og-image.png',
    
    // Analytics & Webmaster Verification Placeholders
    googleAnalyticsId: 'G-5DYSG5JWBH', // Replace or manage via /admin/tracking
    googleSiteVerification: '', // e.g. 'YOUR_GOOGLE_SEARCH_CONSOLE_CODE'

    /**
     * Social Links Configuration
     * Add any new profile here (Facebook, Behance, GitHub, Twitter/X, Dribbble, etc.)
     * and it will automatically appear in the footer and in the Person schema sameAs.
     */
    socialLinks: [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/sabbir670/',
            icon: 'linkedin',
            rel: 'me noopener noreferrer',
            title: 'Sabbir Hasan on LinkedIn'
        }
        // ===== ADD MORE PROFILES EASILY BELOW =====
        // {
        //     name: 'Behance',
        //     url: 'https://www.behance.net/sabbirhasan',
        //     icon: 'behance',
        //     rel: 'me noopener noreferrer',
        //     title: 'Sabbir Hasan on Behance'
        // },
        // {
        //     name: 'GitHub',
        //     url: 'https://github.com/Sabbir-Hasan-670',
        //     icon: 'github',
        //     rel: 'me noopener noreferrer',
        //     title: 'Sabbir Hasan on GitHub'
        // },
        // {
        //     name: 'Facebook',
        //     url: 'https://www.facebook.com/sabbirhasan800',
        //     icon: 'facebook',
        //     rel: 'me noopener noreferrer',
        //     title: 'Sabbir Hasan on Facebook'
        // }
    ],

    // Primary Navigation
    navLinks: [
        { name: 'Home', href: '/' },
        { 
            name: 'Services', 
            href: '/#services',
            dropdown: [
                { name: 'Social Media Marketing', href: '/social-media-marketing' },
                { name: 'Graphic Design', href: '/graphic-design' },
                { name: 'Logo Design', href: '/logo-design' },
                { name: 'Digital Marketing', href: '/digital-marketing' },
                { name: 'Networking', href: '/networking' }
            ]
        },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ],

    // Service Hub Pages Definition
    services: [
        {
            id: 'social-media-marketing',
            name: 'Social Media Marketing',
            slug: 'social-media-marketing',
            path: '/social-media-marketing',
            title: 'Social Media Marketing Services | Sabbir Hasan',
            meta: 'Affordable social media marketing services and packages for small businesses, including content creation and management. Hire freelancer Sabbir Hasan.',
            h1: 'Social Media Marketing Services for Small Businesses',
            shortDesc: 'Drive real engagement, brand awareness, and conversions with strategic content creation, calendar scheduling, and targeted audience growth.',
            icon: '📱'
        },
        {
            id: 'graphic-design',
            name: 'Graphic Design',
            slug: 'graphic-design',
            path: '/graphic-design',
            title: 'Freelance Graphic Design & Social Media Design | Sabbir Hasan',
            meta: 'Professional graphic design services including social media design, branding and graphics for businesses worldwide. Hire freelance designer Sabbir Hasan.',
            h1: 'Freelance Graphic Design Services',
            shortDesc: 'Visually striking social media graphics, ad banners, marketing collateral, and digital illustrations tailored to your brand identity.',
            icon: '🎨'
        },
        {
            id: 'logo-design',
            name: 'Logo Design',
            slug: 'logo-design',
            path: '/logo-design',
            title: 'Custom Business Logo Design Services | Sabbir Hasan',
            meta: 'Get a unique, professional logo for your company. Custom logo design and branding by freelance graphic designer Sabbir Hasan.',
            h1: 'Custom Logo Design for Your Business',
            shortDesc: 'Memorable, versatile, and modern vector logos crafted from custom concept sketches to complete brand identity guideline kits.',
            icon: '✨'
        },
        {
            id: 'digital-marketing',
            name: 'Digital Marketing',
            slug: 'digital-marketing',
            path: '/digital-marketing',
            title: 'Freelance Digital Marketer for Hire | Sabbir Hasan',
            meta: 'Hire freelance digital marketer Sabbir Hasan for social media marketing, SEO and online growth strategy for your business.',
            h1: 'Freelance Digital Marketer',
            shortDesc: 'Holistic online growth campaigns combining on-page SEO, social media presence, conversion optimization, and analytics tracking.',
            icon: '📈'
        },
        {
            id: 'networking',
            name: 'Networking',
            slug: 'networking',
            path: '/networking',
            title: 'Networking Services & Support | Sabbir Hasan',
            meta: 'Network setup, configuration and troubleshooting services by Sabbir Hasan. Available for remote work worldwide.',
            h1: 'Networking Services',
            shortDesc: 'Reliable network configuration, router/switch setup, secure VPN tunnels, and performance troubleshooting for modern home and office infrastructures.',
            icon: '🌐'
        }
    ]
};

// Helper: Generates Schema.org Person JSON-LD
function getPersonSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${siteConfig.siteUrl}/#person`,
        'name': siteConfig.name,
        'url': `${siteConfig.siteUrl}/`,
        'email': `mailto:${siteConfig.email}`,
        'jobTitle': siteConfig.jobTitle,
        'description': siteConfig.defaultDescription,
        'knowsAbout': siteConfig.knowsAbout,
        'sameAs': siteConfig.socialLinks.map(s => s.url)
    };
}

// Helper: Generates Schema.org WebSite JSON-LD
function getWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}/#website`,
        'url': `${siteConfig.siteUrl}/`,
        'name': siteConfig.name,
        'description': siteConfig.defaultDescription,
        'publisher': {
            '@id': `${siteConfig.siteUrl}/#person`
        }
    };
}

// Helper: Generates BreadcrumbList Schema
function getBreadcrumbsSchema(items = []) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url ? (item.url.startsWith('http') ? item.url : `${siteConfig.siteUrl}${item.url}`) : undefined
        }))
    };
}

module.exports = {
    siteConfig,
    getPersonSchema,
    getWebSiteSchema,
    getBreadcrumbsSchema
};
