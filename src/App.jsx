import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react"

import {useProgress, Environment, OrbitControls, Sparkles, PerspectiveCamera} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, DepthOfField } from '@react-three/postprocessing';

// React Router removed for Webflow compatibility - navigation handled via page detection

import Model from "./NeuralFractal.jsx"

import gsap from "gsap";
//import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

/* Camera layers for bloom to be only on spheres */
function CameraLayerSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Enable default layer 0 and bloom layer 1
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);

  return null;
}

// Webflow-compatible navigation system
if (typeof window !== 'undefined') {
  window.goToPath = (path) => {
    // For Webflow embedding, we need to handle navigation differently
    if (path === "/contact-us") {
      // Handle contact navigation within the same page via DOM manipulation
      const contactContainer = document.querySelector(".container.contact");
      const homeContainer = document.querySelector(".container.home");
      
      if (contactContainer && homeContainer) {
        // Don't dispatch conflicting events - let React handle state management
        console.log("🌐 goToPath - navigating to contact (React handles state)");
        window.currentPageState = 'contact';
      }
    } else if (path === "/") {
      // Handle home navigation
      const contactContainer = document.querySelector(".container.contact");
      const homeContainer = document.querySelector(".container.home");
      
      if (contactContainer && homeContainer) {
        // Don't dispatch conflicting events - let React handle state management
        console.log("🌐 goToPath - navigating to home (React handles state)");
        window.currentPageState = 'home';
      }
    } else if (path === "/portfolio") {
      // Handle portfolio navigation - this will trigger animation
      // Note: The actual navigation to portfolio.html is handled by the button click handler
      window.dispatchEvent(new CustomEvent('pageStateChange', { 
        detail: { from: window.currentPageState || 'home', to: 'portfolio' }
      }));
      window.currentPageState = 'portfolio';
    }
  };

  // Initialize page state based on current URL or Webflow page indicators
  window.getCurrentPageState = () => {
    // Try to detect current page state from URL
    const path = window.location.pathname;
    const url = window.location.href;
    
    // Only return portfolio/casestudy if we're actually on those HTML files
    if (path.endsWith('portfolio.html') || url.endsWith('portfolio.html')) return 'portfolio';
    if (path.endsWith('casestudy.html') || url.endsWith('casestudy.html')) return 'casestudy';
    if (path.includes('dopo-casestudy.html') || url.includes('dopo-casestudy.html')) return 'casestudy';
    if (path.includes('oakley-casestudy.html') || url.includes('oakley-casestudy.html')) return 'casestudy';
    
    // Check for contact state via hash or path
    if (path.includes('contact') || window.location.hash === '#contact') return 'contact';
    
    // For the main index page or any path that doesn't end with specific HTML files, assume home
    return 'home';
  };

  // Set initial page state
  window.currentPageState = window.getCurrentPageState();
}

function Scene({ shouldPlayContactIntro, shouldPlayBackContact, shouldPlayHomeToPortfolio, shouldPlayContactToPortfolio, shouldPlayPortfolioToHome }) {
  // In Webflow embedding context, detect page type from URL and DOM
  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  };

  const currentPath = getCurrentPath();
  const is404 = currentPath !== "/" && 
                currentPath !== "/index.html" && 
                !currentPath.includes('/contact') &&
                !currentPath.includes('/portfolio') &&
                !currentPath.includes('/casestudy');

  /* Depth of field and blur */
  const focusRef = useRef();
  const [targetReady, setTargetReady] = useState(false);

  useEffect(() => {
    const checkFocusRef = setInterval(() => {
      if (focusRef.current) {
        setTargetReady(true);
        clearInterval(checkFocusRef);
      }
    }, 100);
    return () => clearInterval(checkFocusRef);
  }, []);

    /* Depth of field and blur ENDS*/

   useEffect(() => {
    // Targeted portfolio click interceptor - only log and intercept portfolio-related clicks
    const portfolioClickHandler = (e) => {
      // Only process clicks that might be portfolio-related
      const target = e.target;
      const href = target.href || target.getAttribute('href');
      const text = target.textContent?.trim().toLowerCase();
      
      // Quick check - only log if it might be portfolio-related
      const mightBePortfolio = (
        (href && (href.includes('portfolio') || href.includes('/portfolio'))) ||
        (text && (text.includes('portfolio') || text.includes('work') || text.includes('works'))) ||
        target.className.includes('works') ||
        target.className.includes('portfolio')
      );
      
      if (mightBePortfolio) {

        
        // Check the clicked element and its parents for portfolio links
        let currentElement = target;
        let depth = 0;
        
        while (currentElement && depth < 3) { // Check up to 3 levels up
          const elemHref = currentElement.href || currentElement.getAttribute('href');
          const elemText = currentElement.textContent?.trim().toLowerCase();
          
          // Check if this is definitely a portfolio link
          const isPortfolioLink = (
            (elemHref && (elemHref.includes('portfolio') || elemHref.includes('/portfolio'))) ||
            (elemText && elemText.includes('portfolio'))
          );
          
          if (isPortfolioLink) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Use the href or construct portfolio URL
            const originalHref = elemHref || '/portfolio';
            
            // Check if click is from mobile menu
            const mobileMenuContainer1 = document.querySelector('.menu-open-wrap-dopo');
            const mobileMenuContainer2 = document.querySelector('.menu-open-wrap');
            const isFromMobileMenu1 = mobileMenuContainer1 && mobileMenuContainer1.classList.contains('menu-open');
            const isFromMobileMenu2 = mobileMenuContainer2 && mobileMenuContainer2.classList.contains('menu-open');
            const isFromMobileMenu = isFromMobileMenu1 || isFromMobileMenu2;
            const activeMobileMenu = isFromMobileMenu1 ? mobileMenuContainer1 : mobileMenuContainer2;
            

            
            const startAnimation = () => {

                
                // Step 1: Trigger 3D model animation
                const animEvent = new CustomEvent('directPortfolioAnimation');
                window.dispatchEvent(animEvent);
                
                // Step 2: Start oval animation slightly later
                setTimeout(() => {
                    if (window.playOvalExpandAnimation) {
                        window.playOvalExpandAnimation(() => {
                            // Navigate after oval animation completes
                            const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                            window.location.href = fullUrl;
                        });
                    } else {
                        setTimeout(() => {
                            const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                            window.location.href = fullUrl;
                        }, 800);
                    }
                }, 1300); // Start ovals even later
            };
            
            if (isFromMobileMenu) {
                if (activeMobileMenu) {
                    activeMobileMenu.classList.remove('menu-open');
                }
                setTimeout(startAnimation, 300);
            } else {
                startAnimation();
            }
            
            return false;
          }
          
          currentElement = currentElement.parentElement;
          depth++;
        }
      }
    };
    
    // Add targeted portfolio click listener
    document.addEventListener('click', portfolioClickHandler, true);


    // Simple oval initialization for home to portfolio animation
    const initializeOvals = () => {
      // Target the correct container by class instead of ID (due to duplicate IDs in Webflow)
      const introAnimContainer = document.querySelector(".intro-anim-home");
      
      if (introAnimContainer) {
        // Ensure container is ready but hidden initially
        introAnimContainer.classList.add("finished");
        
        // Initialize ovals with scale 0 - use the correct Webflow class
        gsap.set(".oval-white-home", { 
          scale: 0,
          transformOrigin: "center center"
        });
      }
    };
    
    // Call initialization with delay to ensure Webflow is ready
    setTimeout(initializeOvals, 100);

    /**
     * Simple oval transition animation for Home to Portfolio navigation
     * 
     * This function animates the ovals in the .intro-anim-home container
     * from scale 0 to scale 1 with opacity 1, creating a smooth transition
     * effect when navigating from the home page to the portfolio page.
     * 
     * The sequence is:
     * 1. homeToPortfolioAction (3D model animation) plays first
     * 2. After 1200ms, this oval animation starts (when 3D animation is almost done)
     * 3. Ovals animate very quickly (0.5s) with tight stagger (0.03s)
     * 4. Navigation to portfolio.html happens after animation completes
     */
    window.playOvalExpandAnimation = (onComplete) => {
      // Target the correct container by class instead of ID (due to duplicate IDs in Webflow)
      const introAnimContainer = document.querySelector(".intro-anim-home");
      if (!introAnimContainer) {
        onComplete && onComplete();
        return;
      }
      
      // Make container visible
      introAnimContainer.classList.remove("finished");
      introAnimContainer.style.opacity = "1";
      introAnimContainer.style.visibility = "visible";
      introAnimContainer.style.pointerEvents = "all";
      
      // Animate ovals with opacity faster than scale - center-out stagger
      const timeline = gsap.timeline();
      
      // Opacity animates first and faster
      timeline.to(".oval-white-home", {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
        stagger: {
          amount: 0.1,
          from: "center"
        }
      }, 0);
      
      // Scale animates slightly after and slower
      timeline.to(".oval-white-home", {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: {
          amount: 0.15,
          from: "center"
        }
      }, 0.1);
      
      // Call completion callback when animation finishes
      timeline.eventCallback("onComplete", () => {
        // Set white background just before navigation to prevent flicker
        document.body.style.backgroundColor = '#ffffff';
        onComplete && onComplete();
      });
    };





    // Delay setup to ensure DOM is ready and Webflow has initialized
    const setupEventListeners = () => {
      /* ===== BUTTON HOVER EFFECTS START ===== */

      /* ----- Contact Button ----- */
      const contactText = new SplitType(".contactus-text", {
          types: "words, chars",
          tagName: "span",
      });

    const contactAnim = gsap.to(contactText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleContactEnter = () => contactAnim.play();
    const handleContactLeave = () => contactAnim.reverse();

    /* ----- Works Button ----- */
    const worksText = new SplitType(".works-text", {
        types: "words, chars",
        tagName: "span",
    });

    const worksAnim = gsap.to(worksText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleWorksEnter = () => worksAnim.play();
    const handleWorksLeave = () => worksAnim.reverse();

    /* ----- Submit Button ----- */
    const submitText = new SplitType(".submit-text", {
        types: "words, chars",
        tagName: "span",
    });
  
    const submitAnim = gsap.to(submitText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });
  
    const handleSubmitEnter = () => submitAnim.play();
    const handleSubmitLeave = () => submitAnim.reverse();

    /* ----- Home Button ----- */
    const homeText = new SplitType(".home-text", {
        types: "words, chars",
        tagName: "span",
    });

    const homeAnim = gsap.to(homeText.chars, {
        paused: true,
        yPercent: -100,
        stagger: 0.03,
    });

    const handleHomeEnter = () => homeAnim.play();
    const handleHomeLeave = () => homeAnim.reverse();

    /* ===== ROUTING FUNCTIONS ===== */
    const handleContactClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        // Check if we're currently on home and trigger proper state change
        const homeContainer = document.querySelector('.container.home');
        const isOnHome = homeContainer && homeContainer.style.display !== 'none' && 
                        (homeContainer.style.display === 'flex' || homeContainer.style.visibility === 'visible');
        
        console.log("📞 Contact clicked - checking home state via DOM");
        console.log("📞 Home container display:", homeContainer?.style.display);
        console.log("📞 Home container visibility:", homeContainer?.style.visibility);
        console.log("📞 Is on home:", isOnHome);
        
        if (isOnHome) {
            console.log("📞 Contact clicked from home - triggering state change event");
            // Dispatch custom event to ensure proper state tracking
            const event = new CustomEvent('pageStateChange', {
                detail: { from: 'home', to: 'contact' }
            });
            console.log("📞 Dispatching event with detail:", event.detail);
            window.dispatchEvent(event);
        } else {
            console.log("📞 Not on home page");
        }
        
        window.goToPath("/contact-us");
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        // Check if we're currently on contact by checking DOM state directly
        const contactContainer = document.querySelector('.container.contact');
        const isOnContact = contactContainer && contactContainer.style.display !== 'none' && 
                           (contactContainer.style.display === 'flex' || contactContainer.style.visibility === 'visible');
        
        console.log("🏠 Home clicked - checking contact state via DOM");
        console.log("🏠 Contact container display:", contactContainer?.style.display);
        console.log("🏠 Contact container visibility:", contactContainer?.style.visibility);
        console.log("🏠 Is on contact:", isOnContact);
        
        if (isOnContact) {
            console.log("🏠 Home clicked from contact - triggering state change event");
            // Dispatch custom event to ensure proper state tracking
            const event = new CustomEvent('pageStateChange', {
                detail: { from: 'contact', to: 'home' }
            });
            console.log("🏠 Dispatching event with detail:", event.detail);
            window.dispatchEvent(event);
        } else {
            console.log("🏠 Not on contact page");
        }
        
        // Always navigate to root path, not index.html
        window.goToPath("/");
    };

    const handleContactPortfolioClick = (e) => {
        // Store the original href before preventing default
        const originalHref = e.currentTarget.href;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Check if clicking from mobile menu
        const isFromMobileMenu = e.currentTarget.closest('.menu-open-wrap-dopo') !== null;
        const activeMobileMenu = document.querySelector('.menu-open-wrap-dopo.menu-open');
        
        const startAnimation = () => {
            // Trigger contact to portfolio animation
            const animEvent = new CustomEvent('directContactPortfolioAnimation');
            window.dispatchEvent(animEvent);
            
            // Start oval animation with same timing as home to portfolio
            setTimeout(() => {
                if (window.playOvalExpandAnimation) {
                    window.playOvalExpandAnimation(() => {
                        // Navigate after oval animation completes
                        const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                        window.location.href = fullUrl;
                    });
                } else {
                    // Fallback navigation without oval animation
                    document.body.style.backgroundColor = '#ffffff';
                    const fullUrl = originalHref.startsWith('http') ? originalHref : `${window.location.origin}${originalHref}`;
                    window.location.href = fullUrl;
                }
            }, 1300); // Same timing as home to portfolio
        };
        
        if (isFromMobileMenu) {
            if (activeMobileMenu) {
                activeMobileMenu.classList.remove('menu-open');
            }
            
            // Wait for menu close animation to complete before starting portfolio animation
            setTimeout(startAnimation, 300); // Give menu time to close
        } else {
            // Not from mobile menu, start animation immediately
            startAnimation();
        }
    };

    const handleWorksClick = (e) => {
        // Store the original href before preventing default
        const originalHref = e.currentTarget.href;
        
        // Prevent default navigation temporarily
        e.preventDefault();
        e.stopPropagation();
        
        // Check if we're on contact page by checking DOM state directly (more reliable)
        const contactContainer = document.querySelector('.container.contact');
        const isOnContactPage = contactContainer && contactContainer.style.display !== 'none' && 
                               (contactContainer.style.display === 'flex' || contactContainer.style.visibility === 'visible');
        

        
        // Use appropriate handler based on current page
        if (isOnContactPage) {
            handleContactPortfolioClick(e);
        } else {
            // Original home to portfolio logic
            // Check if we're clicking from mobile menu (check both possible menu containers)
            const mobileMenuContainer1 = document.querySelector('.menu-open-wrap-dopo');
            const mobileMenuContainer2 = document.querySelector('.menu-open-wrap');
            const isFromMobileMenu1 = mobileMenuContainer1 && mobileMenuContainer1.classList.contains('menu-open');
            const isFromMobileMenu2 = mobileMenuContainer2 && mobileMenuContainer2.classList.contains('menu-open');
            const isFromMobileMenu = isFromMobileMenu1 || isFromMobileMenu2;
            const activeMobileMenu = isFromMobileMenu1 ? mobileMenuContainer1 : mobileMenuContainer2;
            

            
                    const startAnimation = () => {
            // Trigger animation
            const animEvent = new CustomEvent('directPortfolioAnimation');
            window.dispatchEvent(animEvent);
            
            // Start oval animation slightly later
            setTimeout(() => {
                if (window.playOvalExpandAnimation) {
                    window.playOvalExpandAnimation(() => {
                        // Navigate after oval animation completes
                        window.location.href = originalHref;
                    });
                } else {
                    // Fallback navigation without oval animation
                    document.body.style.backgroundColor = '#ffffff';
                    window.location.href = originalHref;
                }
            }, 1300);
        };
            
            if (isFromMobileMenu) {
                if (activeMobileMenu) {
                    activeMobileMenu.classList.remove('menu-open');
                }
                
                // Wait for menu close animation to complete before starting portfolio animation
                setTimeout(startAnimation, 300); // Give menu time to close
            } else {
                // Not from mobile menu, start animation immediately
                startAnimation();
            }
        }
    };



    /* ===== EVENT LISTENERS ===== */
    const contactBtn = document.querySelector(".contactus-btn");
    const worksBtn = document.querySelector(".works-btn");
    const submitBtn = document.querySelector(".submit-button");
    const homeBtn = document.querySelector(".home-btn");
    const logoBtn = document.querySelector(".logo-btn");  // Add logo button selector
    
    // Mobile menu buttons (inside .menu-open-wrap-dopo)
    const mobileContactBtn = document.querySelector(".menu-open-wrap-dopo .one-menu-item[data-path='/contact-us']");
    const mobileHomeBtn = document.querySelector(".menu-open-wrap-dopo .one-menu-item[data-path='/']");
    
    // Try alternative selectors for mobile home button
    const mobileHomeBtnAlt1 = document.querySelector(".menu-open-wrap-dopo a[href='index.html']");
    const mobileHomeBtnAlt2 = document.querySelector(".menu-open-wrap-dopo a[href='/']");
    const mobileHomeBtnAlt3 = document.querySelector(".menu-open-wrap-dopo .one-menu-item");
    
    // Use the first found mobile home button
    const finalMobileHomeBtn = mobileHomeBtn || mobileHomeBtnAlt1 || mobileHomeBtnAlt2;

    // Footer buttons (for case study pages)
    const footerContactBtn = document.querySelector(".footer-contain .contactus-btn[data-path='/contact-us']");
    const footerHomeBtn = document.querySelector(".footer-contain .home-btn[data-path='/']");
    const footerLogoBtn = document.querySelector(".footer-contain .logo-btn[data-path='/']");
    
    // Try alternative selectors for footer home button
    const footerHomeBtnAlt1 = document.querySelector(".footer-contain .home-btn");
    const footerHomeBtnAlt2 = document.querySelector(".footer-contain a[href='index.html']");
    const footerHomeBtnAlt3 = document.querySelector(".footer-contain .logo-btn");
    
    // Use the first found footer home button
    const finalFooterHomeBtn = footerHomeBtn || footerHomeBtnAlt1 || footerHomeBtnAlt2 || footerLogoBtn;



    // Contact button listeners
    if (contactBtn) {
        contactBtn.addEventListener("mouseenter", handleContactEnter);
        contactBtn.addEventListener("mouseleave", handleContactLeave);
        contactBtn.addEventListener("click", handleContactClick, true);
    }

    // Works button listeners
    if (worksBtn) {
        worksBtn.addEventListener("mouseenter", handleWorksEnter);
        worksBtn.addEventListener("mouseleave", handleWorksLeave);
        worksBtn.addEventListener("click", handleWorksClick, true);
    }

    // Submit button listeners
    if (submitBtn) {
        submitBtn.addEventListener("mouseenter", handleSubmitEnter);
        submitBtn.addEventListener("mouseleave", handleSubmitLeave);
    }

    // Home button listener
    if (homeBtn) {
        homeBtn.addEventListener("mouseenter", handleHomeEnter);
        homeBtn.addEventListener("mouseleave", handleHomeLeave);
        homeBtn.addEventListener("click", handleHomeClick, true);
    }

    // Logo button listener - same functionality as home button
    if (logoBtn) {
        logoBtn.addEventListener("click", handleHomeClick);
    }

    // Mobile menu button listeners
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener("click", handleContactClick, true);
    }

    if (finalMobileHomeBtn) {
        finalMobileHomeBtn.addEventListener("click", handleHomeClick, true);
    }

    // Footer button listeners
    if (footerContactBtn) {
        footerContactBtn.addEventListener("click", handleContactClick, true);
    }

    if (finalFooterHomeBtn) {
        finalFooterHomeBtn.addEventListener("click", handleHomeClick, true);
    }

    // 🧼 CLEANUP:
    return () => {
        if (contactBtn) {
            contactBtn.removeEventListener("mouseenter", handleContactEnter);
            contactBtn.removeEventListener("mouseleave", handleContactLeave);
            contactBtn.removeEventListener("click", handleContactClick);
        }
        if (worksBtn) {
            worksBtn.removeEventListener("mouseenter", handleWorksEnter);
            worksBtn.removeEventListener("mouseleave", handleWorksLeave);
            worksBtn.removeEventListener("click", handleWorksClick);
        }
        if (submitBtn) {
            submitBtn.removeEventListener("mouseenter", handleSubmitEnter);
            submitBtn.removeEventListener("mouseleave", handleSubmitLeave);
        }
        if (homeBtn) {
            homeBtn.removeEventListener("mouseenter", handleHomeEnter);
            homeBtn.removeEventListener("mouseleave", handleHomeLeave);
            homeBtn.removeEventListener("click", handleHomeClick);
        }
        if (logoBtn) {
            logoBtn.removeEventListener("click", handleHomeClick);
        }
        if (mobileContactBtn) {
            mobileContactBtn.removeEventListener("click", handleContactClick);
        }
        if (finalMobileHomeBtn) {
            finalMobileHomeBtn.removeEventListener("click", handleHomeClick);
        }
        if (footerContactBtn) {
            footerContactBtn.removeEventListener("click", handleContactClick);
        }
        if (finalFooterHomeBtn) {
            finalFooterHomeBtn.removeEventListener("click", handleHomeClick);
        }
    };
    /* ===== BUTTON HOVER EFFECTS END ===== */
    };

    // Setup with delay to ensure Webflow has initialized
    setTimeout(setupEventListeners, 500); // Increased delay for Webflow loading
    
    return () => {
        document.removeEventListener('click', portfolioClickHandler, true);
    };
}, []);

  return (
    <>
     <Canvas shadows >
  
        <Environment files='https://imaginethiscode.netlify.app/hospital_room_2_1k.hdr' environmentIntensity={0.005}/>

        <CameraLayerSetup />
        <Suspense fallback={null}>

        <group>
          {!is404 ? (
            <Model 
              focusRef={focusRef} 
              shouldPlayContactIntro={shouldPlayContactIntro}
              shouldPlayBackContact={shouldPlayBackContact}
              shouldPlayHomeToPortfolio={shouldPlayHomeToPortfolio}
              shouldPlayContactToPortfolio={shouldPlayContactToPortfolio}
              shouldPlayPortfolioToHome={shouldPlayPortfolioToHome}
            />
          ) : (
            <group name="Empty_-_Camera" position={[-0.008, 0.823, -0.033]} scale={0.14}>
              <PerspectiveCamera
                name="Camera"
                makeDefault={true}
                far={100}
                near={0.1}
                fov={22.895}
                position={[-0.217, 5.606, 12.792]}
                rotation={[-0.442, 0.068, 0.032]}
                scale={7.146}
              />
            </group>
          )}
          <Sparkles
            count={30}
            color="#34ebe8"
            scale={[1.15, 1.15, 1.15]}
            position={[0, 1, 0]}
            speed={0.1}
            baseNoise={40}
          />
          <Sparkles
            count={30}
            color="#365f9c"
            scale={[1.15, 1.15, 1.15]}
            position={[0, 1, 0]}
            speed={0.1}
            baseNoise={40}
          />
          <Sparkles
            count={30}
            color="#f7f389"
            scale={[1.15, 1.15, 1.15]}
            position={[0, 1, 0]}
            speed={0.1}
            baseNoise={40}
          />
          <Sparkles
            count={30}
            color="#ffffff"
            scale={[1.15, 1.15, 1.15]}
            position={[0, 1, 0]}
            speed={0.1}
            baseNoise={40}
          /> 

        </group>
       </Suspense>

       <EffectComposer multisampling={4}>
          <Bloom
            mipmapBlur
            intensity={0.8}              // Adjust to your taste
            luminanceThreshold={1.0}     // Only bloom > 1.0 colors
            luminanceSmoothing={0.0}
            radius={0.1}
          />
          <HueSaturation saturation={0.45} />
          {!is404 && (
            <DepthOfField
              focalLength={1.6}    // Try larger, e.g. 0.5, 1.0
              bokehScale={50}      // Increase for bigger blur shapes
              focusDistance={0.5}  // You can experiment with this (distance from camera)
              target={focusRef.current}
              layers={[0, 1]}  
            />
          )}
        </EffectComposer>

        
      </Canvas>
    </>

  );
}

function PageContent() {
  // SINGLE SOURCE OF TRUTH for page state
  const [currentPageState, setCurrentPageState] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    
    // Detect page state from URL
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    console.log("🔍 Initial page detection - path:", path, "hash:", hash);
    
    // Portfolio/casestudy pages
    if (path.includes('portfolio') || path.includes('casestudy')) {
      return path.includes('portfolio') ? 'portfolio' : 'casestudy';
    }
    
    // Contact via hash OR if contact container is visible
    if (hash === '#contact') {
      return 'contact';
    }
    
    // Only check container visibility if we have a hash indicating contact
    // Don't rely on container visibility for initial detection
    
    // Default to home
    return 'home';
  });
  
  const prevPageState = useRef('home'); // Track previous state - start with home
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const [shouldPlayHomeToPortfolio, setShouldPlayHomeToPortfolio] = useState(false);
  const [shouldPlayContactToPortfolio, setShouldPlayContactToPortfolio] = useState(false);
  const [shouldPlayPortfolioToHome, setShouldPlayPortfolioToHome] = useState(false);
  const isAnimating = useRef(false);
  const hasInitialized = useRef(false);
  // Removed complex navigation tracking for simplicity
  


  // Background flicker prevention
  // Background flicker prevention is now handled only in oval animation
  // (when going TO portfolio) - removed global page load background change

  // Set up simple global animation trigger
  useEffect(() => {
    window.triggerHomeToPortfolioAnimation = () => {
      setShouldPlayHomeToPortfolio(true);
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayPortfolioToHome(false);
    };

    // Listen for direct animation trigger
    const handleDirectPortfolioAnimation = () => {
      setShouldPlayHomeToPortfolio(true);
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayPortfolioToHome(false);
    };

    window.addEventListener('directPortfolioAnimation', handleDirectPortfolioAnimation);

    // Handle contact to portfolio animation trigger
    const handleDirectContactPortfolioAnimation = () => {
      setShouldPlayContactToPortfolio(true);
      setTimeout(() => setShouldPlayContactToPortfolio(false), 2000);
    };

    window.addEventListener('directContactPortfolioAnimation', handleDirectContactPortfolioAnimation);

    // Check if we came from portfolio/casestudy pages on page load
    const checkPortfolioReturn = () => {
      const referrer = document.referrer;
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      
      // Only trigger portfolio return animation if we're on the main index page AND came from portfolio
      const currentPath = window.location.pathname;
      const isOnMainPage = currentPath === '/' || currentPath === '/index.html' || currentPath.includes('index');
      
      // Much more strict referrer check - disable for now to prevent false positives
      const isActualPortfolioReturn = false; // Temporarily disable to fix click issues
      
      if (isOnMainPage && isActualPortfolioReturn) {
        setShouldPlayPortfolioToHome(true);
        setShouldPlayContactIntro(false);
        setShouldPlayBackContact(false);
        setShouldPlayHomeToPortfolio(false);
      }
      
      // Handle contact navigation from external pages
      if (intendedRoute === '/contact-us') {
        // Set page state to contact FIRST
        setCurrentPageState('contact');
        
        setShouldPlayContactIntro(true);
        setShouldPlayBackContact(false);
        setShouldPlayHomeToPortfolio(false);
        setShouldPlayContactToPortfolio(false);
        setShouldPlayPortfolioToHome(false);
        sessionStorage.removeItem('intendedRoute');
      }
      
      // Check if we came from portfolio/casestudy pages to contact (only if URL indicates contact)
      const isFromPortfolioToContact = referrer && (
        referrer.includes('portfolio') || 
        referrer.includes('casestudy') ||
        referrer.includes('oakley') ||
        referrer.includes('dopo')
      ) && isOnMainPage && (
        window.location.hash === '#contact' || 
        window.location.href.includes('#contact')
      );
      
      if (isFromPortfolioToContact && !intendedRoute) {
        // Set page state to contact when coming from portfolio TO CONTACT specifically
        // Add small delay to allow smooth transition
        setTimeout(() => {
          setCurrentPageState('contact');
        }, 100);
        
        setShouldPlayContactIntro(true);
        setShouldPlayBackContact(false);
        setShouldPlayHomeToPortfolio(false);
        setShouldPlayContactToPortfolio(false);
        setShouldPlayPortfolioToHome(false);
      }
    };

    checkPortfolioReturn();
    
    // SINGLE hash change handler
    const handleHashChange = () => {
      const newHash = window.location.hash;
      const path = window.location.pathname;
      console.log("🔧 Hash changed to:", newHash, "path:", path, "current state:", currentPageState);
      
      if (newHash === '#contact') {
        console.log("🔧 Setting state to contact");
        setCurrentPageState('contact');
      } else if (newHash === '' && (path === '/' || path === '/index.html')) {
        // Going back to home (either from contact or direct navigation)
        console.log("🏠 Detected navigation to home from state:", currentPageState);
        // Manually update prevPageState to ensure proper transition detection
        if (currentPageState === 'contact') {
          console.log("🏠 Manually setting prevPageState to contact for proper transition");
          prevPageState.current = 'contact';
        }
        setCurrentPageState('home');
      }
    };
    
    // Also listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      console.log("🔧 Popstate event - checking current state");
      handleHashChange();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.triggerHomeToPortfolioAnimation = null;
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('directPortfolioAnimation', handleDirectPortfolioAnimation);
      window.removeEventListener('directContactPortfolioAnimation', handleDirectContactPortfolioAnimation);
    };
  }, []);

  // Listen for page state changes from navigation system (for contact/home only)
  useEffect(() => {
    const handlePageStateChange = (event) => {
      const { from, to } = event.detail;
      console.log("🔄 Page state change event received:", from, "→", to);
      console.log("🔄 Event detail:", event.detail);
      console.log("🔄 Current prevPageState before update:", prevPageState.current);
      
      prevPageState.current = from;
      setCurrentPageState(to);
      
      console.log("🔄 Set prevPageState to:", from, "and currentPageState to:", to);
    };

    window.addEventListener('pageStateChange', handlePageStateChange);
    
    return () => {
      window.removeEventListener('pageStateChange', handlePageStateChange);
    };
  }, []);

  // Simplified container management - let GSAP handle everything
  // Removed emergency check that was causing flicker



  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = currentPageState === "home";
    const showContact = currentPageState === "contact";
    
    // Debug container visibility
    console.log("🎨 Container visibility - showHome:", showHome, "showContact:", showContact, "pageState:", currentPageState);
    
    // Container management with smooth animation for contact
    if (homeContainer && contactContainer) {
      if (showHome) {
        homeContainer.style.display = 'flex';
        homeContainer.style.visibility = 'visible';
        homeContainer.style.opacity = '1';
        contactContainer.style.display = 'none';
      } else if (showContact) {
        // Smooth animation for contact container
        contactContainer.style.display = 'flex';
        contactContainer.style.visibility = 'visible';
        
        // Animate contact container in smoothly
        gsap.fromTo(contactContainer, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        
        homeContainer.style.display = 'none';
      }
    }
    


    // Removed complex GSAP animations - using simple show/hide for reliability
  }, [currentPageState]);

  // Handle animation triggers based on page state changes
  useEffect(() => {
    const from = prevPageState.current;
    const to = currentPageState;
    
    console.log("🎯 ANIMATION TRIGGER - from:", from, "to:", to);
    console.log("🎯 URL:", window.location.pathname + window.location.hash);
    console.log("🎯 prevPageState.current:", prevPageState.current);
    
    // Helper function to check if a state is portfolio/casestudy page
    const isPortfolioOrCasestudy = (state) => {
      return state === 'portfolio' || state === 'casestudy';
    };

    // On first initialization, set the previous state properly
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // IMPORTANT: Reset prevPageState to match current state on first load
      // This prevents false animation triggers from cached/stale state
      prevPageState.current = to;
      
      // EXIT EARLY - Don't trigger any animations on first load
      return;
      

    }

    if (isAnimating.current) {
      return;
    }

    // Reset all animations first
    const resetAnimations = () => {
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
      setShouldPlayHomeToPortfolio(false);
      setShouldPlayContactToPortfolio(false);
      setShouldPlayPortfolioToHome(false);
    };



    // Simplified navigation logic - each transition is independent
    if (to === "contact" && from !== "contact") {
      console.log("🎯 Going TO contact - triggering contact intro");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactIntro(true);
      

      
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (from === "contact" && to === "home") {
      console.log("🎯 Going FROM contact TO home - triggering backwards contact");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayBackContact(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (to === "home" && isPortfolioOrCasestudy(from)) {
      // Coming back to home from portfolio/casestudy pages
      console.log("🎯 Going FROM portfolio TO home - triggering portfolio to home");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayPortfolioToHome(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (isPortfolioOrCasestudy(to) && from === "home") {
      // Going from home to portfolio/casestudy pages  
      console.log("🎯 Triggering HOME to portfolio animation");

      isAnimating.current = true;
      resetAnimations();
      setShouldPlayHomeToPortfolio(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (isPortfolioOrCasestudy(to) && from === "contact") {
      // Going from contact to portfolio/casestudy pages  
      console.log("🎯 Triggering CONTACT to portfolio animation");

      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactToPortfolio(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else {
      console.log("🎯 No animation needed for transition:", from, "→", to);
      resetAnimations();
    }

    // ALWAYS update prevPageState at the end
    prevPageState.current = to;
    console.log("🎯 Updated prevPageState to:", to);
  }, [currentPageState]);

  return <Scene 
    shouldPlayContactIntro={shouldPlayContactIntro}
    shouldPlayBackContact={shouldPlayBackContact}
    shouldPlayHomeToPortfolio={shouldPlayHomeToPortfolio}
    shouldPlayContactToPortfolio={shouldPlayContactToPortfolio}
    shouldPlayPortfolioToHome={shouldPlayPortfolioToHome}
  />;
}

// Simplified app content for Webflow embedding - no routing needed
function AppContent() {
  useEffect(() => {
    // Check for intended route from sessionStorage (for navigation from standalone pages)
    const intendedRoute = sessionStorage.getItem('intendedRoute');
    if (intendedRoute) {
      sessionStorage.removeItem('intendedRoute');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (intendedRoute === '/contact-us') {
          window.goToPath('/contact-us');
        }
      }, 200);
    }
  }, []);

  return <PageContent />;
}

export function App() {
  // No BrowserRouter needed for Webflow embedding
  return <AppContent />;
}

export default App;