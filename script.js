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

const mobileMenuMedia = window.matchMedia('(max-width: 968px)');

document.querySelectorAll('.navbar').forEach(navbar => {
    const toggle = navbar.querySelector('.nav-toggle');
    const menu = navbar.querySelector('.nav-menu');
    menu.id = 'primary-navigation';
    toggle.setAttribute('aria-controls', menu.id);
    let currentSection = null;

    function leaveSection() {
        if (!currentSection) return;
        currentSection.setAttribute('aria-expanded', 'false');
        currentSection.removeAttribute('aria-label');
        currentSection = null;
        menu.scrollTop = 0;
    }

    function setOpen(open) {
        leaveSection();
        navbar.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
        menu.scrollTop = 0;
    }

    toggle.addEventListener('click', () => setOpen(!navbar.classList.contains('is-open')));

    menu.querySelectorAll('.nav-link--submenu').forEach((button, index) => {
        const submenu = button.nextElementSibling;
        submenu.id = `nav-submenu-${index + 1}`;
        button.setAttribute('aria-controls', submenu.id);
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', () => {
            if (!mobileMenuMedia.matches) return;
            if (currentSection) {
                leaveSection();
            } else {
                currentSection = button;
                button.setAttribute('aria-expanded', 'true');
                button.setAttribute('aria-label', 'Back to main menu');
                menu.scrollTop = 0;
            }
            button.focus();
        });
    });

    menu.addEventListener('click', event => {
        if (event.target.closest('a') && navbar.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('keydown', event => {
        if (!navbar.classList.contains('is-open')) return;
        if (event.key === 'Escape') {
            if (currentSection) {
                currentSection.focus();
                leaveSection();
            } else {
                setOpen(false);
                toggle.focus();
            }
        } else if (event.key === 'Tab') {
            const controls = Array.from(navbar.querySelectorAll('a, button'))
                .filter(control => control.getClientRects().length);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    mobileMenuMedia.addEventListener('change', () => {
        if (!mobileMenuMedia.matches && navbar.classList.contains('is-open')) setOpen(false);
    });
});

// Add scroll effect to navbar (only for non-hero navbars)
let lastScroll = 0;
const navbar = document.querySelector('.navbar:not(.hero .navbar)');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        navbar.classList.toggle('is-scrolled', currentScroll > 100);
        
        lastScroll = currentScroll;
    });
}

// Scroll reveal - self-controlled animated experience
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
