// ==================== Main Script ====================
// Wait for the entire HTML (DOM) to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. CURRENT YEAR IN FOOTER ==========
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        // Automatically sets the current year in footer
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========== 2. SMOOTH SCROLLING FOR ANCHOR LINKS ==========
    // Adds smooth scrolling behavior when user clicks a link that starts with '#'
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevents instant jump
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const nav = document.querySelector('.nav');
                const headerOffset = nav ? nav.offsetHeight + 20 : 0; // Adjust scroll position for navbar height
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // Smooth scroll animation
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== 3. NAVBAR TOGGLE (MOBILE MENU) ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    if (navToggle && navMenu) {
        // Open/Close mobile navigation menu
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
        });

        // Automatically close menu when a navigation link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
            });
        });
    }

    // ========== 4. SCROLL PROGRESS BAR & NAVBAR GLASS EFFECT ==========
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.querySelector('.nav');

    document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

        // Update progress bar width as user scrolls
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        // Add glass effect to navbar when scrolling down
        if (nav) {
            if (scrollTop > 50) {
                nav.setAttribute('data-glass', true);
            } else {
                nav.removeAttribute('data-glass');
            }
        }
    });

    // ========== 5. TYPING ANIMATION FUNCTION ==========
    function typeText(element, speed = 50) {
        const originalContent = element.innerHTML;
        const plainTextContent = element.textContent;
        element.innerHTML = ''; // Clear content before animation
        element.classList.add('typing-container');

        let i = 0;
        const timer = setInterval(() => {
            if (i < plainTextContent.length) {
                element.textContent += plainTextContent.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.classList.add('typed');
                // Restore full HTML after typing completes (handles spans like <span class="grad">)
                element.innerHTML = originalContent;
            }
        }, speed);
    }

    // ========== 6. ON-SCROLL ANIMATIONS USING INTERSECTION OBSERVER ==========
    const animateElements = document.querySelectorAll('[data-animate]');
    const heroH1Wrapper = document.querySelector('.hero__copy h1');
    const heroLeadWrapper = document.querySelector('.hero__copy .lead');
    let h1Typed = false;
    let leadTyped = false;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;

                setTimeout(() => {
                    entry.target.classList.add('in-view');

                    // Type animation for Hero H1
                    if (entry.target === heroH1Wrapper && !h1Typed) {
                        initTypingAnimation(heroH1Wrapper, 70);
                        h1Typed = true;
                    }

                    // Type animation for Hero paragraph
                    if (entry.target === heroLeadWrapper && !leadTyped) {
                        initTypingAnimation(heroLeadWrapper, 30);
                        leadTyped = true;
                    }

                }, delay);

                // Stop observing once animation triggered (except hero typing targets)
                if (!entry.target.classList.contains('carousel') &&
                    !entry.target.classList.contains('marquee') &&
                    entry.target !== heroH1Wrapper &&
                    entry.target !== heroLeadWrapper) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    animateElements.forEach(el => observer.observe(el));
    if (heroH1Wrapper) observer.observe(heroH1Wrapper);
    if (heroLeadWrapper) observer.observe(heroLeadWrapper);

    // ========== 7. TESTIMONIAL CAROUSEL ==========
    const quotes = document.querySelectorAll('.quote');
    let currentQuote = 0;

    if (quotes.length > 0) {
        // Function to display one quote at a time
        function showQuote(index) {
            quotes.forEach((quote, i) => {
                if (i === index) {
                    quote.classList.add('active');
                    quote.setAttribute('aria-hidden', 'false');
                } else {
                    quote.classList.remove('active');
                    quote.setAttribute('aria-hidden', 'true');
                }
            });
        }

        // Automatically switch to next quote every 4 seconds
        function nextQuote() {
            currentQuote = (currentQuote + 1) % quotes.length;
            showQuote(currentQuote);
        }

        showQuote(currentQuote);
        setInterval(nextQuote, 4000); // 4 seconds
    }

    // ========== 8. FULLSCREEN IMAGE VIEWER (GALLERY) ==========
    const galleryItems = document.querySelectorAll('.gallery__item img');

    // Create overlay only once
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.classList.add('fullscreen-overlay');
    fullscreenOverlay.innerHTML = `
        <div class="fullscreen-image-container">
            <img src="" alt="Full Screen Image" class="fullscreen-image">
            <button class="close-btn" aria-label="Close image viewer">✕</button>
        </div>
    `;
    body.appendChild(fullscreenOverlay);

    const fullScreenImage = fullscreenOverlay.querySelector('.fullscreen-image');
    const closeBtn = fullscreenOverlay.querySelector('.close-btn');

    // Open image in fullscreen mode on click
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            fullScreenImage.src = img.src;
            fullScreenImage.alt = img.alt;
            fullscreenOverlay.classList.add('active');
            body.classList.add('no-scroll');
        });
    });

    // Close viewer on button click
    closeBtn.addEventListener('click', () => {
        fullscreenOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    // Close if clicking on overlay background
    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Close viewer using ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});
