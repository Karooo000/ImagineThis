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
        console.log("🎯 Setting white background before portfolio navigation");
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
                    console.log("🎯 Setting white background - fallback portfolio navigation");
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
                    console.log("🎯 Setting white background - fallback works navigation");
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
  // Track if this is the very first load of the application
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    // BULLETPROOF: Use performance API to detect actual reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isActualReload = navigationType === 'reload';
    
    // Check referrer for navigation detection
    const referrer = document.referrer;
    const isNavigationFromPortfolio = referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
    // Simple logic: If it's an actual reload, always treat as first load
    // If it's navigation from portfolio, don't treat as first load
    const hasLoaded = sessionStorage.getItem('appHasLoaded');
    const isFirst = isActualReload || (!isNavigationFromPortfolio && !hasLoaded);
    
    console.log("🔍 Initializing first load state:", {
      navigationType,
      isActualReload,
      hasLoaded,
      isFirst,
      isNavigationFromPortfolio,
      referrer,
      sessionStorage: sessionStorage.getItem('appHasLoaded')
    });
    return isFirst;
  });
  
  // Track 3D model loading progress
  const { progress } = useProgress();
  const [modelLoaded, setModelLoaded] = useState(false);
  // Track if preloader has been shown during this session
  const [preloaderFinished, setPreloaderFinished] = useState(() => {
    // BULLETPROOF: Use performance API to detect actual reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isActualReload = navigationType === 'reload';
    
    // Check referrer for navigation detection
    const referrer = document.referrer;
    const isNavigationFromPortfolio = referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
    // Simple logic: If it's an actual reload, always show preloader
    // Only skip preloader if it's navigation from portfolio AND was already shown
    const wasShown = sessionStorage.getItem('preloaderShown') === 'true';
    const shouldSkipPreloader = !isActualReload && wasShown && isNavigationFromPortfolio;
    
    console.log("🔍 Preloader session check:", { 
      navigationType,
      isActualReload,
      wasShown, 
      isNavigationFromPortfolio, 
      shouldSkipPreloader,
      referrer 
    });
    
    return shouldSkipPreloader;
  });

  // SIMPLE AND BULLETPROOF: New preloader logic with dark ovals as background
  useEffect(() => {
    console.log("🚀 SIMPLE PRELOADER SETUP STARTING");
    
    // Detect if this is a hard reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isHardReload = navigationType === 'reload';
    const isFromPortfolio = document.referrer.includes('portfolio');
    const hasPreloaderShown = sessionStorage.getItem('preloaderShown') === 'true';
    
    console.log("🔍 NAVIGATION DETECTION:", {
      navigationType,
      isHardReload,
      isFromPortfolio,
      hasPreloaderShown,
      referrer: document.referrer
    });
    
    // SIMPLE RULE: Show preloader ONLY on hard reload AND not from portfolio
    const shouldShowPreloader = isHardReload && !isFromPortfolio && !hasPreloaderShown;
    
    if (shouldShowPreloader) {
      console.log("🎯 SHOWING PRELOADER - Hard reload detected");
      // Preloader is already visible by default, dark ovals are its background
      // Just ensure it's visible (shouldn't need to do anything)
      const preloader = document.querySelector('.pre-loader');
      if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.visibility = 'visible';
        console.log("🎯 Preloader confirmed visible");
      }
    } else {
      console.log("🎯 HIDING PRELOADER - Navigation or already shown");
      // Hide preloader immediately for navigation
      const preloader = document.querySelector('.pre-loader');
      if (preloader) {
        preloader.classList.add('finished');
        preloader.style.display = 'none';
        console.log("🎯 Preloader hidden for navigation");
      }
    }
    
    // Always ensure white ovals are available for navigation
    const whiteContainer = document.querySelector('.outro-anim-home');
    if (whiteContainer && !shouldShowPreloader) {
      whiteContainer.style.display = 'block';
      whiteContainer.style.visibility = 'visible';
      console.log("🎯 White ovals enabled for navigation");
    }
    
    console.log("🚀 SIMPLE SETUP COMPLETE");
  }, []);


  
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
    
    // Note: Referrer-based navigation detection moved to useEffect below
    
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
  
  // Monitor 3D model loading progress
  useEffect(() => {
    console.log("🔍 3D Model loading progress:", progress, "%");
    
    if (progress === 100 && !modelLoaded) {
      console.log("🎯 3D Model fully loaded via progress!");
      setModelLoaded(true);
    }
  }, [progress, modelLoaded]);

  // Fallback mechanism to ensure preloader finishes even if 3D progress doesn't work
  useEffect(() => {
    if (isFirstLoad && !modelLoaded) {
      // Set a fallback timer to mark model as loaded after a reasonable time
      const fallbackTimer = setTimeout(() => {
        console.log("🎯 Fallback: Marking model as loaded after timeout");
        setModelLoaded(true);
      }, 3000); // 3 seconds fallback

      return () => clearTimeout(fallbackTimer);
    }
  }, [isFirstLoad, modelLoaded]);

  // Track preloader timing for minimum 4-second display
  const [preloaderStartTime, setPreloaderStartTime] = useState(null);

  // Start timing when page loads
  useEffect(() => {
    if (!preloaderStartTime) {
      setPreloaderStartTime(Date.now());
      console.log("🕐 Preloader timing started");
    }
  }, [preloaderStartTime]);

  // NEW SIMPLE PRELOADER LOGIC: Handle model loading and timing
  useEffect(() => {
    const isHardReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    const shouldProcessPreloader = isHardReload && !document.referrer.includes('portfolio') && !preloaderFinished && modelLoaded;
    
    if (shouldProcessPreloader) {
      console.log("🎯 PROCESSING PRELOADER - Model loaded");
      
      const elapsed = Date.now() - (preloaderStartTime || Date.now());
      const modelLoadedFast = elapsed < 1000;
      const minDisplayTime = 4000;
      
      console.log("🕐 Preloader timing:", {
        elapsed: elapsed + "ms",
        modelLoadedFast,
        decision: modelLoadedFast ? "Show minimum 4s" : "Finish immediately"
      });
      
      const delay = modelLoadedFast ? Math.max(0, minDisplayTime - elapsed) : 0;
      
      setTimeout(() => {
        console.log("🎯 Finishing preloader sequence");
        finishPreloader();
      }, delay);
    }
  }, [modelLoaded, preloaderFinished, preloaderStartTime]);

  // SIMPLE preloader finish function
  const finishPreloader = () => {
    console.log("🎯 STARTING PRELOADER FINISH SEQUENCE");
    
    // 1. Animate preloader content up and fade out
    const preloaderContent = document.querySelector('.preloader-content');
    if (preloaderContent) {
      gsap.to(preloaderContent, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          console.log("🎯 Preloader content animated out");
          
          // 2. Now animate dark ovals from scale 1 to 0
          const darkOvals = document.querySelectorAll('.outro-anim-home-dark .oval-white-home-outro');
          if (darkOvals.length > 0) {
            console.log("🟣 Starting dark ovals outro animation");
            
            gsap.to(darkOvals, {
              scale: 0,
              opacity: 0,
              duration: 1.5,
              ease: "power2.in",
              stagger: {
                amount: 0.3,
                from: "outside"
              },
              onComplete: () => {
                console.log("🟣 Dark ovals animation completed");
                
                // 3. Hide preloader completely
                const preloader = document.querySelector('.pre-loader');
                if (preloader) {
                  preloader.classList.add('finished');
                  preloader.style.display = 'none';
                  console.log("🎯 Preloader hidden");
                }
                
                // 4. Mark as finished and trigger 3D animation
                setPreloaderFinished(true);
                sessionStorage.setItem('preloaderShown', 'true');
                
                // Trigger 3D animation
                const isContactPage = window.location.hash === '#contact';
                if (isContactPage) {
                  setShouldPlayContactIntro(true);
                  console.log("🎯 Triggered contact intro");
                } else {
                  setShouldPlayPortfolioToHome(true);
                  console.log("🎯 Triggered home intro");
                }
              }
            });
          }
        }
      });
    }
  };

  // Add manual debugging function to window for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugPreloader = () => {
        console.log("🔍 Manual preloader debug:", {
          isFirstLoad,
          modelLoaded,
          preloaderFinished,
          progress,
          preloaderElement: document.querySelector(".pre-loader")
        });
      };
      
      window.forceFinishPreloader = () => {
        console.log("🎯 Manually finishing preloader");
        const preloader = document.querySelector(".pre-loader");
        if (preloader) {
          preloader.classList.add("finished");
          console.log("🎯 Manually added 'finished' combo class");
        }
        setPreloaderFinished(true);
        sessionStorage.setItem('preloaderShown', 'true');
        console.log("🎯 Preloader marked as shown in session (manual)");
        setIsFirstLoad(false);
        setModelLoaded(true);
      };

      window.resetFirstLoad = () => {
        console.log("🔄 Resetting to first load state");
        sessionStorage.removeItem('appHasLoaded');
        sessionStorage.removeItem('preloaderShown');
        setIsFirstLoad(true);
        setModelLoaded(false);
        setPreloaderFinished(false);
        console.log("🔄 State reset - reload page to see first load behavior");
      };

      window.simulateFirstLoad = () => {
        console.log("🎯 Simulating first load sequence");
        sessionStorage.removeItem('appHasLoaded');
        sessionStorage.removeItem('preloaderShown');
        
        // Force first load state
        setIsFirstLoad(true);
        setModelLoaded(false);
        setPreloaderFinished(false);
        
        // After a short delay, simulate model loading
        setTimeout(() => {
          setModelLoaded(true);
        }, 1000);
      };

      // Test oval animations manually
      window.testOvalAnimationDark = () => {
        console.log("🧪 Testing oval outro animation with DARK container");
        playOvalOutroAnimation(() => {
          console.log("🧪 Test DARK oval animation completed");
        }, true);
      };

      window.testOvalAnimationWhite = () => {
        console.log("🧪 Testing oval outro animation with WHITE container");
        playOvalOutroAnimation(() => {
          console.log("🧪 Test WHITE oval animation completed");
        }, false);
      };

      window.testContactOvalAnimationDark = () => {
        console.log("🧪 Testing contact oval outro animation with DARK container");
        playContactOvalOutroAnimation(() => {
          console.log("🧪 Test DARK contact oval animation completed");
        }, true);
      };

      window.testContactOvalAnimationWhite = () => {
        console.log("🧪 Testing contact oval outro animation with WHITE container");
        playContactOvalOutroAnimation(() => {
          console.log("🧪 Test WHITE contact oval animation completed");
        }, false);
      };
    }
  }, [isFirstLoad, modelLoaded, preloaderFinished, progress]);

  // Outro oval animation - for coming FROM portfolio to home/contact OR first load
  // SIMPLIFIED: Only white oval animation for navigation
  const playOvalOutroAnimation = (onComplete) => {
    console.log("🟣 Starting WHITE oval outro animation for navigation");
    
    const outroContainer = document.querySelector(".outro-anim-home");
    const ovals = document.querySelectorAll(".outro-anim-home .oval-white-home-outro");
    
    console.log("🔍 Oval debugging:", {
      containerClass,
      outroContainer,
      ovalsFound: ovals.length,
      containerClasses: outroContainer?.className,
      useDarkVersion
    });
    
    if (!outroContainer) {
      console.warn(`⚠️ ${containerClass} container not found`);
      console.log("🔍 Available outro containers:", 
        Array.from(document.querySelectorAll('*')).filter(el => 
          el.className && el.className.includes && el.className.includes('outro-anim-home')
        ).map(el => ({ tag: el.tagName, class: el.className }))
      );
      onComplete && onComplete();
      return;
    }
    
    if (ovals.length === 0) {
      console.warn(`⚠️ No ovals found in ${containerClass} container`);
      console.log("🔍 Container innerHTML:", outroContainer.innerHTML.substring(0, 200));
      onComplete && onComplete();
      return;
    }

    console.log("🟣 Found", ovals.length, "ovals in", useDarkVersion ? "DARK" : "WHITE", "outro container");

    // AGGRESSIVE: Ensure we're using the right container
    if (useDarkVersion) {
      console.log("🎯 DARK VERSION - Ensuring white container is hidden");
      const whiteContainer = document.querySelector('.outro-anim-home');
      if (whiteContainer) {
        whiteContainer.style.display = 'none !important';
        whiteContainer.style.visibility = 'hidden !important';
        whiteContainer.style.zIndex = '-1';
      }
    } else {
      console.log("🎯 WHITE VERSION - Ensuring dark container is hidden");
      const darkContainer = document.querySelector('.outro-anim-home-dark');
      if (darkContainer) {
        darkContainer.style.display = 'none !important';
        darkContainer.style.visibility = 'hidden !important';
        darkContainer.style.zIndex = '-1';
      }
    }

    // Set up container for animation with inline styles
    outroContainer.style.display = 'block';
    outroContainer.style.visibility = 'visible';
    outroContainer.style.position = 'fixed';
    outroContainer.style.top = '0';
    outroContainer.style.left = '0';
    outroContainer.style.width = '100vw';
    outroContainer.style.height = '100vh';
    outroContainer.style.zIndex = '9999';
    outroContainer.style.pointerEvents = 'none';
    
    console.log("🎯 Container setup complete:", {
      container: useDarkVersion ? "DARK" : "WHITE",
      display: outroContainer.style.display,
      visibility: outroContainer.style.visibility,
      zIndex: outroContainer.style.zIndex
    });

    // Ensure ovals are ready for animation
    gsap.set(ovals, {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center"
    });

    // Start animation
    setTimeout(() => {
      console.log("🟣 Starting oval animation with", useDarkVersion ? "DARK" : "WHITE", "ovals");

    // Create timeline for outro animation (from outside to center)
    const timeline = gsap.timeline();
    
      // Animate opacity down first (MUCH SLOWER for debugging)
    timeline.to(ovals, {
      opacity: 0,
        duration: 3.0, // Increased from 0.4 to 3.0 seconds
      ease: "power2.out",
      stagger: {
          amount: 1.0, // Increased from 0.15 to 1.0 seconds
        from: "outside" // Animate from outside to center
      }
    });
    
      // Then animate scale down (starts 0.5s after opacity animation begins)
    timeline.to(ovals, {
      scale: 0,
        duration: 3.5, // Increased from 0.5 to 3.5 seconds
      ease: "power2.in",
      stagger: {
          amount: 1.5, // Increased from 0.2 to 1.5 seconds
        from: "outside" // Animate from outside to center
      }
      }, 0.5); // Increased from 0.1 to 0.5 seconds
    
    // Hide container and call completion callback when animation finishes
    timeline.eventCallback("onComplete", () => {
        console.log("🟣", useDarkVersion ? "DARK" : "WHITE", "oval outro animation completed");
      
      // Hide the outro container
      gsap.set(outroContainer, {
        display: "none",
        visibility: "hidden"
      });
      
      console.log("🎯", useDarkVersion ? "DARK" : "WHITE", "outro container hidden after animation");
      
      // For white container navigation, ensure body background is reset
      if (!useDarkVersion) {
        document.body.style.backgroundColor = '';
        console.log("🎯 Body background reset after WHITE oval animation");
      }
      
      onComplete && onComplete();
    });
    }, 10);
  };

  // Contact oval outro animation - specifically for contact page intros
  const playContactOvalOutroAnimation = (onComplete, useDarkVersion = false) => {
    console.log("🟣 Starting contact oval outro animation", useDarkVersion ? "(using DARK container)" : "(using WHITE container)");
    
    // Choose container based on whether we want dark or white version
    const containerClass = useDarkVersion ? ".outro-anim-home-dark" : ".outro-anim-home";
    const outroContainer = document.querySelector(containerClass);
    const ovals = document.querySelectorAll(`${containerClass} .oval-white-home-outro`);
    
    console.log("🔍 Contact oval debugging:", {
      containerClass,
      outroContainer,
      ovalsFound: ovals.length,
      containerClasses: outroContainer?.className,
      useDarkVersion
    });
    
    if (!outroContainer) {
      console.warn(`⚠️ ${containerClass} container not found for contact`);
      console.log("🔍 Available outro containers for contact:", 
        Array.from(document.querySelectorAll('*')).filter(el => 
          el.className && el.className.includes && el.className.includes('outro-anim-home')
        ).map(el => ({ tag: el.tagName, class: el.className }))
      );
      onComplete && onComplete();
      return;
    }
    
    if (ovals.length === 0) {
      console.warn(`⚠️ No ovals found in ${containerClass} container for contact`);
      console.log("🔍 Contact container innerHTML:", outroContainer.innerHTML.substring(0, 200));
      onComplete && onComplete();
      return;
    }

    console.log("🟣 Found", ovals.length, "contact ovals in", useDarkVersion ? "DARK" : "WHITE", "outro container");

    // Set up container for animation
    gsap.set(outroContainer, {
      display: "block",
      visibility: "visible",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      pointerEvents: "none"
    });

    // Ensure ovals are ready for animation
    gsap.set(ovals, {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center"
    });

    // Start animation
    setTimeout(() => {
      console.log("🟣 Starting contact oval animation with", useDarkVersion ? "DARK" : "WHITE", "ovals");
      
      // Create timeline for contact outro animation (from outside to center)
      const timeline = gsap.timeline();
      
      // First play the oval outro animation (MUCH SLOWER for debugging)
      timeline.to(ovals, {
        opacity: 0,
        duration: 3.0, // Increased from 0.4 to 3.0 seconds
        ease: "power2.out",
        stagger: {
          amount: 1.0, // Increased from 0.15 to 1.0 seconds
          from: "outside"
        }
      });
      
      timeline.to(ovals, {
        scale: 0,
        duration: 3.5, // Increased from 0.5 to 3.5 seconds
        ease: "power2.in",
        stagger: {
          amount: 1.5, // Increased from 0.2 to 1.5 seconds
          from: "outside"
        }
      }, 0.5); // Increased from 0.1 to 0.5 seconds
      
      // When outro completes
      timeline.eventCallback("onComplete", () => {
        console.log("🟣 Contact", useDarkVersion ? "DARK" : "WHITE", "oval outro animation completed");
      
      // Hide the outro container
      gsap.set(outroContainer, {
        display: "none"
      });
      
      onComplete && onComplete();
    });
    }, 10);
  };

  // Page load intro functionality - different for first load vs navigations
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const referrer = document.referrer;
    
    console.log("🔍 Starting page load intro logic");
    console.log("🔍 Current path:", path, "hash:", hash);
    console.log("🔍 Referrer:", referrer);
    console.log("🔍 Is first load:", isFirstLoad);
    console.log("🔍 Model loaded:", modelLoaded);
    
    // BULLETPROOF: Use performance API to detect actual reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isActualReload = navigationType === 'reload';
    
    // Check if this is navigation from portfolio
    const isNavigationFromPortfolio = referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
    console.log("🔍 Page intro logic check:", {
      navigationType,
      isActualReload,
      isFirstLoad,
      preloaderFinished,
      isNavigationFromPortfolio,
      referrer
    });

    // Skip intro logic if it's a reload (preloader handles this) OR if preloader was already used
    if (isActualReload || (preloaderFinished && !isNavigationFromPortfolio)) {
      console.log("🔍 Reload or preloader finished - skipping intro logic (preloader handles this)");
      console.log("🔍 State:", { isActualReload, isFirstLoad, preloaderFinished, isNavigationFromPortfolio });
      return;
    }
    
    // For navigation from portfolio, we WANT the intro logic to run (white ovals)
    if (isNavigationFromPortfolio) {
      console.log("🔍 Navigation from portfolio detected - running WHITE oval intro logic");
    }
    
    // IMMEDIATELY set up outro overlay before any content shows (for subsequent navigations)
    // Use WHITE outro container for navigation from portfolio
    const outroContainer = document.querySelector(".outro-anim-home");
    if (outroContainer) {
      console.log("🔍 Setting up immediate outro overlay for navigation");
      
      // Show outro container with ovals visible (covers everything)
      gsap.set(outroContainer, {
        display: "block",
        visibility: "visible",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        backgroundColor: "transparent" // Let ovals handle the coverage
      });
      
      // Set ovals to full visibility immediately
      const ovals = document.querySelectorAll(".outro-anim-home .oval-white-home-outro");
      if (ovals.length > 0) {
        gsap.set(ovals, {
          scale: 1,
          opacity: 1,
          transformOrigin: "center center"
        });
        
        console.log("🔍 Starting outro animation for navigation");
        
        // Determine which 3D animation to play based on destination (not just referrer)
        const cameFromPortfolio = referrer && (referrer.includes('portfolio') || referrer.includes('casestudy'));
        const isHomePage = (path === '/' || path === '/index.html') && hash !== '#contact';
        const isContactPage = hash === '#contact';
        
        // Use different outro animations based on destination
        if (isContactPage) {
          // For contact page, use contact-specific outro animation which triggers portfoliotocontact
        setTimeout(() => {
            playContactOvalOutroAnimation(() => {
              console.log("🎯 Contact navigation outro animation completed");
            }, false); // false = no dark combo for navigations
        }, 50);
        } else {
          // For home page, use regular outro animation and trigger portfoliotohome
        setTimeout(() => {
            playOvalOutroAnimation(() => {
              console.log("🎯 Home navigation outro animation completed");
              
              // Trigger portfoliotohome action after outro completes for home
          if (isHomePage) {
            if (cameFromPortfolio) {
              console.log("🎯 Came from portfolio to home - triggering PortfolioToHomeAction");
              setShouldPlayPortfolioToHome(true);
            } else {
              console.log("🎯 Loading home page - triggering PortfolioToHomeAction for intro");
              setShouldPlayPortfolioToHome(true);
            }
              }
            }, false); // false = no dark combo for navigations
          }, 50);
        }
      } else {
        console.warn("⚠️ No outro ovals found, hiding container");
        gsap.set(outroContainer, { display: "none" });
      }
    }
  }, [isFirstLoad, modelLoaded, preloaderFinished]); // Depend on first load, model loaded, and preloader finished states

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
    
    // Helper function to check if a state is portfolio/casestudy page
    const isPortfolioOrCasestudy = (state) => {
      return state === 'portfolio' || state === 'casestudy';
    };
    
    console.log("🎯 ANIMATION TRIGGER - from:", from, "to:", to);
    console.log("🎯 URL:", window.location.pathname + window.location.hash);
    console.log("🎯 prevPageState.current:", prevPageState.current);
    console.log("🎯 DEBUG - isPortfolioOrCasestudy(from):", isPortfolioOrCasestudy(from));
    console.log("🎯 DEBUG - to === 'home':", to === 'home');
    console.log("🎯 DEBUG - Should trigger portfolio→home:", to === "home" && isPortfolioOrCasestudy(from));

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
      
      // Note: Outro animation for portfolio → contact is handled by referrer detection
      
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
      console.log("🎯 Going FROM portfolio TO home - triggering portfolio to home + outro animation");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayPortfolioToHome(true);
      
      // Note: Outro animation for portfolio → home is handled by referrer detection
      
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (isPortfolioOrCasestudy(to) && from === "home") {
      // Going from home to portfolio/casestudy pages  
      console.log("🎯 Triggering HOME to portfolio animation");

      // SIMPLE: Trigger white oval outro animation for portfolio transition
      console.log("🟣 Triggering white ovals for HOME→PORTFOLIO");
      playOvalOutroAnimation(() => {
        console.log("🎯 HOME→PORTFOLIO outro completed");
      });

      isAnimating.current = true;
      resetAnimations();
      setShouldPlayHomeToPortfolio(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (isPortfolioOrCasestudy(to) && from === "contact") {
      // Going from contact to portfolio/casestudy pages  
      console.log("🎯 Triggering CONTACT to portfolio animation");

      // SIMPLE: Trigger white oval outro animation for portfolio transition
      console.log("🟣 Triggering white ovals for CONTACT→PORTFOLIO");
      playContactOvalOutroAnimation(() => {
        console.log("🎯 CONTACT→PORTFOLIO outro completed");
      });

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