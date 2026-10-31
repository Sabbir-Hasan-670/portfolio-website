/**
 * public/site-config.js
 * Browser-accessible site configuration for dynamic hydration.
 */
(function(window) {
    window.siteConfig = {
        name: 'Sabbir Hasan',
        siteTitle: 'Sabbir Hasan | Freelance Digital Marketer & Graphic Designer',
        siteUrl: 'https://sabbirhasan.com',
        email: 'contact@sabbirhasan.com',
        role: 'Freelance Digital Marketer, Social Media Marketer, Graphic Designer & Networking Professional',
        jobTitle: 'Freelance Digital Marketer & Graphic Designer',
        learningStatus: 'Currently learning Cyber Security',
        socialLinks: [
            {
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/in/sabbir670/',
                icon: 'linkedin',
                rel: 'me noopener noreferrer',
                title: 'Sabbir Hasan on LinkedIn'
            }
        ],
        services: [
            { name: 'Social Media Marketing', path: '/social-media-marketing', icon: '📱' },
            { name: 'Graphic Design', path: '/graphic-design', icon: '🎨' },
            { name: 'Logo Design', path: '/logo-design', icon: '✨' },
            { name: 'Digital Marketing', path: '/digital-marketing', icon: '📈' },
            { name: 'Networking', path: '/networking', icon: '🌐' }
        ]
    };
})(typeof window !== 'undefined' ? window : this);
