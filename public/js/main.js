// Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
});

// Smooth Scroll for Navigation Links
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

// Navbar Background Change on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuButton = document.querySelector('.navbar-toggler');
const mobileMenu = document.querySelector('.navbar-collapse');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        if (!event.target.closest('.navbar-collapse') && !event.target.closest('.navbar-toggler')) {
            mobileMenu.classList.remove('show');
        }
    }
}); 