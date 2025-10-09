document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year for Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const nav = document.querySelector('.nav');
                // Adjust headerOffset to account for sticky nav bar
                const headerOffset = nav ? nav.offsetHeight + 20 : 0; 
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile nav after smooth scroll if it was open
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });

    // 3. Navbar Toggle for Mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('no-scroll');
        });
    }

    // 4. Scroll Progress Bar & Navbar Glass Effect
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.querySelector('.nav');

    document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // Calculate progress only if the page is scrollable
        const progress = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0; 

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        // Navbar glass effect on scroll
        if (nav) {
            // Apply glass effect only after scrolling 50px past the top
            if (scrollTop > 50) {
                nav.classList.add('scrolled'); // Use class list instead of data attribute for better CSS control
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    // 5. Typing Animation Function (Corrected and Completed) 🎬
    function initTypingAnimation(element, speed = 50) {
        // Use a temporary wrapper to hold the complex HTML structure while typing.
        const originalHTML = element.innerHTML;
        const plainTextContent = element.textContent.trim(); 
        
        // Temporarily clear the content
        element.textContent = ''; 
        element.classList.add('typing-container'); 

        let i = 0;
        const timer = setInterval(() => {
            if (i < plainTextContent.length) {
                element.textContent += plainTextContent.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                
                // After typing plain text, restore the original HTML structure
                // to correctly apply styles like the .grad span.
                element.innerHTML = originalHTML; 
                
                // Add 'typed' class to remove the cursor/animation (via CSS)
                element.classList.add('typed'); 
            }
        }, speed);
    }
    
    // 6. On-Scroll Animations (Intersection Observer API)
    const animateElements = document.querySelectorAll('[data-animate]');
    // Targeting the elements that will receive the typing animation
    const heroH1Wrapper = document.querySelector('.hero__copy h1'); 
    const heroLeadP = document.querySelector('.hero__copy p'); // Target the <p> tag 
    let h1Typed = false;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                
                setTimeout(() => {
                    entry.target.classList.add('in-view');

                    // Trigger typing animation for H1 on hero section entry
                    if (entry.target === heroH1Wrapper && !h1Typed) {
                        initTypingAnimation(heroH1Wrapper.querySelector('span'), 70); // Target the inner span for typing
                        // Wait for H1 to finish, then start P tag typing
                        setTimeout(() => {
                            initTypingAnimation(heroLeadP, 30);
                        }, heroH1Wrapper.textContent.length * 70 + 500); // Wait for H1 length * speed + extra delay
                        
                        h1Typed = true;
                    }
                }, delay);

                // Unobserve after animation is applied, except for elements that need repeated viewing or special handling
                if (entry.target !== heroH1Wrapper) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    // Observe all animatable elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Ensure the hero H1 is observed to trigger typing animation
    if (heroH1Wrapper) observer.observe(heroH1Wrapper);


    // 7. Testimonial Carousel
    const quotes = document.querySelectorAll('.quote');
    let currentQuote = 0;

    if (quotes.length > 0) {
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

        function nextQuote() {
            currentQuote = (currentQuote + 1) % quotes.length;
            showQuote(currentQuote);
        }

        showQuote(currentQuote);
        setInterval(nextQuote, 4000); // 4 seconds interval
    }

    // 8. Fullscreen Gallery Image Viewer (Logic remains sound)
    const galleryItems = document.querySelectorAll('.gallery__item img');
    
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

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            fullScreenImage.src = img.src;
            fullScreenImage.alt = img.alt;
            fullscreenOverlay.classList.add('active');
            body.classList.add('no-scroll');
        });
    });

    closeBtn.addEventListener('click', () => {
        fullscreenOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});