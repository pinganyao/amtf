// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hamburger menu toggle
document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const navbar = btn.closest('.navbar');
        const isOpen = navbar.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
        if (!isOpen) closeMobileSubmenus(navbar);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
});

document.querySelectorAll('.nav-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const navbar = overlay.closest('.navbar');
        const btn = navbar.querySelector('.nav-toggle');
        navbar.classList.remove('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        closeMobileSubmenus(navbar);
        document.body.style.overflow = '';
    });
});

// Close menu when clicking a nav link (for same-page navigation)
document.querySelectorAll('.nav-menu a.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = link.closest('.navbar');
        const btn = navbar?.querySelector('.nav-toggle');
        if (navbar?.classList.contains('is-open')) {
            navbar.classList.remove('is-open');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            closeMobileSubmenus(navbar);
            document.body.style.overflow = '';
        }
    });
});

// Close menu on Escape and when resizing to desktop
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.navbar.is-open').forEach(navbar => {
            navbar.classList.remove('is-open');
            const btn = navbar.querySelector('.nav-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            closeMobileSubmenus(navbar);
            document.body.style.overflow = '';
        });
    }
});

const mobileMenuMedia = window.matchMedia('(max-width: 968px)');

// Mobile navigation submenus behave as an accordion. Desktop keeps its
// hover/focus dropdown behavior from CSS.
document.querySelectorAll('.nav-link--submenu').forEach((button, index) => {
    const submenu = button.nextElementSibling;
    if (!submenu?.classList.contains('nav-submenu')) return;

    if (!submenu.id) submenu.id = `nav-submenu-${index + 1}`;
    button.setAttribute('aria-controls', submenu.id);
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', () => {
        if (!mobileMenuMedia.matches) return;

        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        const navMenu = button.closest('.nav-menu');
        navMenu.querySelectorAll('.nav-link--submenu[aria-expanded="true"]').forEach(openButton => {
            openButton.setAttribute('aria-expanded', 'false');
        });
        button.setAttribute('aria-expanded', String(shouldOpen));
    });
});

const closeMobileSubmenus = navbar => {
    navbar?.querySelectorAll('.nav-link--submenu').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
    });
};

window.addEventListener('resize', () => {
    if (!mobileMenuMedia.matches) {
        document.querySelectorAll('.navbar.is-open').forEach(navbar => {
            navbar.classList.remove('is-open');
            const btn = navbar.querySelector('.nav-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            closeMobileSubmenus(navbar);
            document.body.style.overflow = '';
        });
    }
});

// Add scroll effect to navbar (only for non-hero navbars)
let lastScroll = 0;
const navbar = document.querySelector('.navbar:not(.hero .navbar)');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
        
        lastScroll = currentScroll;
    });
}

// Scroll reveal - self-controlled animated experience
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A small depth shift keeps the homepage sound columns connected to the scroll.
const homepageHero = document.querySelector('.hero');
if (homepageHero && !prefersReducedMotion) {
    let heroScrollFrame;
    const updateHeroColumns = () => {
        const shift = Math.min(window.scrollY * 0.08, 38);
        homepageHero.style.setProperty('--hero-column-shift', `${shift}px`);
        heroScrollFrame = undefined;
    };

    window.addEventListener('scroll', () => {
        if (!heroScrollFrame && window.scrollY <= homepageHero.offsetHeight) {
            heroScrollFrame = window.requestAnimationFrame(updateHeroColumns);
        }
    }, { passive: true });
}

const scrollRevealOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
};

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, scrollRevealOptions);

document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion) {
        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal, .scroll-reveal--fade, .scroll-reveal--scale, .scroll-reveal-stagger').forEach(el => {
            scrollRevealObserver.observe(el);
        });
    } else {
        // Show all immediately if user prefers reduced motion
        document.querySelectorAll('.scroll-reveal, .scroll-reveal--fade, .scroll-reveal--scale, .scroll-reveal-stagger').forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // Legacy: founder-card, info-card, contact-item, event-card (if not already using scroll-reveal)
    document.querySelectorAll('.founder-card, .info-card, .contact-item, .event-card').forEach(el => {
        if (!el.classList.contains('scroll-reveal') && !el.classList.contains('is-visible')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            const legacyObserver = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            legacyObserver.observe(el);
        }
    });
});
