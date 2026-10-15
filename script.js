/* =========================================================
   PORTFOLIO JAVASCRIPT
   Hero -> About horizontal transition
   Desktop wheel + Mobile touch swipe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. TYPING EFFECT
       ===================================================== */

    const typingElement = document.getElementById("typing");

    const words = [
        "RTL Design Engineer",
        "FPGA Engineer",
        "VLSI Design Engineer",
        "Verilog HDL Developer"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        if (!typingElement) return;

        const currentWord = words[wordIndex];

        if (!deleting) {

            typingElement.textContent =
                currentWord.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentWord.length) {

                deleting = true;

                setTimeout(typeEffect, 1600);
                return;
            }

        } else {

            typingElement.textContent =
                currentWord.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {

                deleting = false;

                wordIndex++;

                if (wordIndex >= words.length) {
                    wordIndex = 0;
                }
            }
        }

        setTimeout(
            typeEffect,
            deleting ? 45 : 85
        );
    }

    typeEffect();


    /* =====================================================
       2. HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.getElementById("header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 150) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       3. BACK TO TOP BUTTON
       ===================================================== */

    const topBtn = document.getElementById("topBtn");

    function updateTopButton() {

        if (!topBtn) return;

        if (window.scrollY > 400) {
            topBtn.classList.add("show");
        } else {
            topBtn.classList.remove("show");
        }
    }

    window.addEventListener(
        "scroll",
        updateTopButton,
        { passive: true }
    );

    updateTopButton();

    if (topBtn) {

        topBtn.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       4. ACTIVE NAVIGATION LINK
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            'header a[href^="#"]'
        );

    const sections =
        document.querySelectorAll("section[id]");

    function updateActiveNav() {

        let currentSection = "";

        const scrollPosition =
            window.scrollY + 180;

        sections.forEach(section => {

            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (
                scrollPosition >= top &&
                scrollPosition < top + height
            ) {
                currentSection = section.id;
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }

        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();


    /* =====================================================
       5. NORMAL SCROLL REVEAL
       ===================================================== */

    const revealSections =
        document.querySelectorAll(
            ".about, .education, .skills, .projects, .internship, .certifications, .achievements, .contact"
        );

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });


    /* =====================================================
       6. SMOOTH INTERNAL NAVIGATION
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                /*
                 * If user clicks About while hero transition
                 * is active, cancel transition first.
                 */

                if (
                    document.body.classList.contains(
                        "hero-transitioning"
                    )
                ) {
                    finishTransitionImmediately();
                }

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =====================================================
       7. HERO IMAGE 3D MOUSE EFFECT
       ===================================================== */

    const heroImage =
        document.querySelector(".big-image");

    if (heroImage) {

        heroImage.addEventListener(
            "mousemove",
            event => {

                /*
                 * Disable effect on small screens.
                 */

                if (window.innerWidth <= 768) {
                    return;
                }

                const rect =
                    heroImage.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    ((x - centerX) / centerX) * 6;

                const rotateX =
                    ((centerY - y) / centerY) * 6;

                heroImage.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
            }
        );

        heroImage.addEventListener(
            "mouseleave",
            () => {

                heroImage.style.transform =
                    "perspective(700px) rotateX(0deg) rotateY(0deg)";

            }
        );

    }


    /* =====================================================
       8. CREATE SMALL CORNER PROFILE
       ===================================================== */

    const homeSection =
        document.getElementById("home");

    const aboutSection =
        document.getElementById("about");

    if (!homeSection || !aboutSection) {
        console.warn(
            "Hero/About section not found."
        );
        return;
    }

    /*
     * Create corner image automatically.
     * No HTML modification required.
     */

    let cornerProfile =
        document.querySelector(".corner-profile");

    if (!cornerProfile) {

        cornerProfile =
            document.createElement("div");

        cornerProfile.className =
            "corner-profile";

        cornerProfile.innerHTML = `
            <img
                src="images/profile.png"
                alt="Profile"
            >
        `;

        aboutSection.prepend(cornerProfile);
    }


    /* =====================================================
       9. HERO -> ABOUT TRANSITION VARIABLES
       ===================================================== */

    let transitionRunning = false;

    let transitionDirection = null;

    let touchStartY = 0;

    let touchStartX = 0;

    let aboutTop = 0;


    /*
     * Prevent repeated trackpad / wheel events.
     */

    const TRANSITION_DURATION = 780;


    /* =====================================================
       10. GET ABOUT POSITION
       ===================================================== */

    function getAboutTop() {

        return (
            aboutSection.getBoundingClientRect().top +
            window.scrollY
        );

    }


    /* =====================================================
       11. LOCK PAGE DURING TRANSITION
       ===================================================== */

    function lockPage() {

        document.body.classList.add(
            "hero-transitioning"
        );

        /*
         * Prevent browser native scrolling while
         * horizontal transition is running.
         */

        document.documentElement.style.overflow =
            "hidden";

        document.body.style.overflow =
            "hidden";
    }


    /* =====================================================
       12. UNLOCK PAGE
       ===================================================== */

    function unlockPage() {

        document.documentElement.style.overflow =
            "";

        document.body.style.overflow =
            "";

        document.body.classList.remove(
            "hero-transitioning"
        );

    }


    /* =====================================================
       13. DOWN TRANSITION
       
       Hero:
           center -> left

       About:
           left -> center

       Corner image:
           hidden -> visible
       ===================================================== */

    function transitionToAbout() {

        if (transitionRunning) return;

        /*
         * Only allow this transition when user is
         * at the top of the page.
         */

        if (window.scrollY > 10) return;

        transitionRunning = true;

        transitionDirection = "down";

        aboutTop = getAboutTop();

        lockPage();

        /*
         * Make sure About participates in the
         * horizontal transition.
         */

        aboutSection.classList.add("show");

        /*
         * Initial state.
         */

        homeSection.classList.remove(
            "hero-slide-left",
            "hero-slide-right"
        );

        aboutSection.classList.remove(
            "about-slide-center",
            "about-slide-right"
        );

        document.body.classList.add(
            "transition-down"
        );

        /*
         * Force browser to apply initial state
         * before starting animation.
         */

        void document.body.offsetWidth;

        /*
         * Start animation.
         */

        document.body.classList.add(
            "animate-down"
        );

        setTimeout(() => {

            /*
             * Move actual document to About.
             */

            unlockPage();

            window.scrollTo({
                top: aboutTop,
                behavior: "instant"
            });

            document.body.classList.remove(
                "transition-down",
                "animate-down"
            );

            /*
             * Corner image stays active while
             * About is the current section.
             */

            document.body.classList.add(
                "about-active"
            );

            transitionRunning = false;

            transitionDirection = null;

        }, TRANSITION_DURATION);

    }


    /* =====================================================
       14. ABOUT -> HERO REVERSE TRANSITION
       
       About:
           center -> right

       Hero:
           left -> center

       Corner image:
           visible -> hidden
       ===================================================== */

    function transitionToHero() {

        if (transitionRunning) return;

        aboutTop = getAboutTop();

        /*
         * Only reverse when user is at the very
         * top of About.
         */

        if (
            Math.abs(window.scrollY - aboutTop) > 15
        ) {
            return;
        }

        transitionRunning = true;

        transitionDirection = "up";

        lockPage();

        /*
         * Initial reverse state.
         */

        document.body.classList.add(
            "transition-up"
        );

        document.body.classList.remove(
            "about-active"
        );

        /*
         * Force initial styles.
         */

        void document.body.offsetWidth;

        /*
         * Start reverse animation.
         */

        document.body.classList.add(
            "animate-up"
        );

        setTimeout(() => {

            unlockPage();

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            document.body.classList.remove(
                "transition-up",
                "animate-up"
            );

            transitionRunning = false;

            transitionDirection = null;

        }, TRANSITION_DURATION);

    }


    /* =====================================================
       15. MOUSE WHEEL
       ===================================================== */

    window.addEventListener(
        "wheel",
        event => {

            /*
             * Ignore horizontal wheel.
             */

            if (
                Math.abs(event.deltaY) <=
                Math.abs(event.deltaX)
            ) {
                return;
            }

            /*
             * Don't interfere while animation runs.
             */

            if (transitionRunning) {

                event.preventDefault();

                return;
            }


            /* =============================================
               DOWN FROM HERO
               ============================================= */

            if (
                window.scrollY <= 10 &&
                event.deltaY > 0
            ) {

                event.preventDefault();

                transitionToAbout();

                return;
            }


            /* =============================================
               UP FROM ABOUT
               ============================================= */

            const currentAboutTop =
                getAboutTop();

            if (
                Math.abs(
                    window.scrollY -
                    currentAboutTop
                ) <= 15 &&
                event.deltaY < 0
            ) {

                event.preventDefault();

                transitionToHero();

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       16. MOBILE TOUCH START
       ===================================================== */

    window.addEventListener(
        "touchstart",
        event => {

            if (!event.touches.length) {
                return;
            }

            touchStartY =
                event.touches[0].clientY;

            touchStartX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       17. MOBILE TOUCH MOVE
       ===================================================== */

    window.addEventListener(
        "touchmove",
        event => {

            if (
                !event.touches.length ||
                transitionRunning
            ) {
                return;
            }

            const currentY =
                event.touches[0].clientY;

            const difference =
                touchStartY - currentY;


            /*
             * Swipe UP from Hero.
             */

            if (
                window.scrollY <= 10 &&
                difference > 15
            ) {

                event.preventDefault();

                return;
            }


            /*
             * Swipe DOWN from About top.
             */

            const currentAboutTop =
                getAboutTop();

            if (
                Math.abs(
                    window.scrollY -
                    currentAboutTop
                ) <= 15 &&
                difference < -15
            ) {

                event.preventDefault();

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       18. MOBILE TOUCH END
       ===================================================== */

    window.addEventListener(
        "touchend",
        event => {

            if (transitionRunning) {
                return;
            }

            const touchEndY =
                event.changedTouches[0].clientY;

            const touchEndX =
                event.changedTouches[0].clientX;

            const verticalDistance =
                touchStartY - touchEndY;

            const horizontalDistance =
                touchStartX - touchEndX;


            /*
             * Ignore mostly-horizontal gestures.
             */

            if (
                Math.abs(verticalDistance) <
                Math.abs(horizontalDistance)
            ) {
                return;
            }


            /*
             * Minimum swipe distance.
             */

            if (
                Math.abs(verticalDistance) < 50
            ) {
                return;
            }


            /* =============================================
               SWIPE UP
               Hero -> About
               ============================================= */

            if (
                verticalDistance > 50 &&
                window.scrollY <= 10
            ) {

                transitionToAbout();

                return;
            }


            /* =============================================
               SWIPE DOWN
               About -> Hero
               ============================================= */

            if (
                verticalDistance < -50
            ) {

                const currentAboutTop =
                    getAboutTop();

                if (
                    Math.abs(
                        window.scrollY -
                        currentAboutTop
                    ) <= 15
                ) {

                    transitionToHero();

                }

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       19. DETECT ABOUT SECTION FOR CORNER PHOTO
       ===================================================== */

    function updateAboutState() {

        if (transitionRunning) {
            return;
        }

        const currentAboutTop =
            getAboutTop();

        const aboutBottom =
            currentAboutTop +
            aboutSection.offsetHeight;

        const currentScroll =
            window.scrollY;

        /*
         * Corner photo is active only while the
         * About section is the active section.
         */

        if (
            currentScroll >=
                currentAboutTop - 20 &&
            currentScroll <
                aboutBottom
        ) {

            document.body.classList.add(
                "about-active"
            );

        } else {

            document.body.classList.remove(
                "about-active"
            );

        }

    }

    window.addEventListener(
        "scroll",
        updateAboutState,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateAboutState
    );

    updateAboutState();


    /* =====================================================
       20. IMMEDIATE TRANSITION CANCEL
       ===================================================== */

    function finishTransitionImmediately() {

        if (!transitionRunning) {
            return;
        }

        /*
         * Stop CSS animation classes.
         */

        document.body.classList.remove(
            "transition-down",
            "animate-down",
            "transition-up",
            "animate-up"
        );

        transitionRunning = false;

        unlockPage();

        /*
         * Go to About.
         */

        aboutTop = getAboutTop();

        window.scrollTo({
            top: aboutTop,
            behavior: "auto"
        });

        document.body.classList.add(
            "about-active"
        );

    }


    /* =====================================================
       21. PRELOADER
       ===================================================== */

    const preloader =
        document.querySelector(".preloader");

    if (preloader) {

        window.addEventListener(
            "load",
            () => {

                preloader.classList.add(
                    "loaded"
                );

                setTimeout(() => {

                    preloader.remove();

                }, 600);

            }
        );

    }


    /* =====================================================
       22. CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "%cWelcome to Hritik Kumar's Portfolio",
        "color:#00ffff;font-size:16px;font-weight:bold;"
    );

    console.log(
        "RTL • FPGA • VLSI Engineer"
    );

});