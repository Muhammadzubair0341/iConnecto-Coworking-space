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
                const headerOffset = nav ? nav.offsetHeight + 20 : 0; // Check if nav exists
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Navbar Toggle for Mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body; // Moved body here for wider scope

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('no-scroll');
        });

        // Close mobile nav on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('no-scroll');
            });
        });
    }


    // 4. Scroll Progress Bar & Navbar Glass Effect
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.querySelector('.nav');

    document.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        // Navbar glass effect on scroll
        if (nav) {
            if (scrollTop > 50) {
                nav.setAttribute('data-glass', true);
            } else {
                nav.removeAttribute('data-glass');
            }
        }
    });

    // Function to handle typing animation
    function typeText(element, speed = 50) {
        // Store original content including HTML (like <span class="grad">)
        const originalContent = element.innerHTML;
        const plainTextContent = element.textContent; // Use textContent for typing
        element.innerHTML = ''; // Clear content before typing
        element.classList.add('typing-container'); // Add container class for cursor

        let i = 0;
        const timer = setInterval(() => {
            if (i < plainTextContent.length) {
                // If it's a character from the grad span, ensure it's re-added as HTML
                // This is a simplified approach, a more robust solution would parse HTML
                // For this specific case with `span.grad` inside, we can try to re-inject.
                // A better approach for mixed HTML is to extract plain text, type it, then
                // re-inject the original HTML around the typed plain text.
                // For simplicity here, we'll type the plain text and assume the HTML is stable.

                const char = plainTextContent.charAt(i);
                element.textContent += char;
                i++;
            } else {
                clearInterval(timer);
                element.classList.add('typed'); // Remove cursor after typing

                // If originalContent had HTML, restore it after typing plain text.
                // This is a rough fix for the `grad` span.
                // A more advanced solution would type within the `span.grad` too.
                element.innerHTML = originalContent; // Restore full HTML
                // The issue here is the `typing-container` styling and `typed` class on the inner span.
                // We will modify the observer logic to target the wrapper elements directly for typing.
            }
        }, speed);
    }





    // 5. On-Scroll Animations (Intersection Observer API)
    const animateElements = document.querySelectorAll('[data-animate]');
    const heroH1Wrapper = document.querySelector('.hero__copy h1'); // Target the <h1> itself
    const heroLeadWrapper = document.querySelector('.hero__copy .lead'); // Target the <p> itself
    let h1Typed = false;
    let leadTyped = false;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                setTimeout(() => {
                    entry.target.classList.add('in-view');

                    // Trigger typing animation for H1
                    if (entry.target === heroH1Wrapper && !h1Typed) {
                        initTypingAnimation(heroH1Wrapper, 70); // Adjust typing speed here (ms per character)
                        h1Typed = true;
                    }
                    // Trigger typing animation for Lead P
                    if (entry.target === heroLeadWrapper && !leadTyped) {
                        initTypingAnimation(heroLeadWrapper, 30); // Adjust typing speed here
                        leadTyped = true;
                    }

                }, delay);

                // For typing animations, we don't want to unobserve immediately if it's the target.
                // We only unobserve elements that are purely for 'in-view' class addition.
                if (!entry.target.classList.contains('carousel') && !entry.target.classList.contains('marquee')) {
                    // Unobserve after animation, but only if it's not the typing target
                    if (entry.target !== heroH1Wrapper && entry.target !== heroLeadWrapper) {
                         observer.unobserve(entry.target);
                    }
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Ensure the hero H1 and Lead P are observed for the typing animation
    if (heroH1Wrapper) observer.observe(heroH1Wrapper);
    if (heroLeadWrapper) observer.observe(heroLeadWrapper);


    // 6. Testimonial Carousel
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
        setInterval(nextQuote, 4000); // 4 seconds for faster change
    }

    // 7. Fullscreen Gallery Image Viewer
    const galleryItems = document.querySelectorAll('.gallery__item img');
    // const body is already defined globally at the top of DOMContentLoaded

    // Create the overlay elements once
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.classList.add('fullscreen-overlay');
    fullscreenOverlay.innerHTML = `
        <div class="fullscreen-image-container">
            <img src="" alt="Full Screen Image" class="fullscreen-image">
            <button class="close-btn" aria-label="Close image viewer">✕</button>
        </div>
    `;
    body.appendChild(fullscreenOverlay); // Append to body

    const fullScreenImage = fullscreenOverlay.querySelector('.fullscreen-image');
    const closeBtn = fullscreenOverlay.querySelector('.close-btn');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            fullScreenImage.src = img.src;
            fullScreenImage.alt = img.alt;
            fullscreenOverlay.classList.add('active');
            body.classList.add('no-scroll'); // Prevent body scroll when overlay is active
        });
    });

    // Close button and overlay click to close
    closeBtn.addEventListener('click', () => {
        fullscreenOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    fullscreenOverlay.addEventListener('click', (e) => {
        // Close only if clicking directly on the overlay, not the image or container
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
            fullscreenOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});