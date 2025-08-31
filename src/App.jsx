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


    // ROBUST: Initialize oval containers for navigation animations
    const initializeNavigationOvals = () => {
      // Initialize white ovals for navigation (home to portfolio)
      const introAnimContainer = document.querySelector(".intro-anim-home");
      if (introAnimContainer) {
        // DON'T add finished class - it sets opacity: 0 via CSS
        // Instead, just hide it with display: none
        introAnimContainer.style.display = "none";
        
        // Initialize intro ovals (for home to portfolio animation)
        const introOvals = document.querySelectorAll(".intro-anim-home .oval-white-home");
        gsap.set(introOvals, { 
          scale: 0,
          opacity: 0,
          transformOrigin: "center center"
        });
      }
      
      // Ensure white outro container is ready but hidden
      const whiteOutroContainer = document.querySelector(".outro-anim-home");
      if (whiteOutroContainer) {
        // CRITICAL: Remove finished class that would set opacity: 0
        whiteOutroContainer.classList.remove('finished');
        whiteOutroContainer.style.display = 'none'; // Hidden by default
        
        const whiteOvals = whiteOutroContainer.querySelectorAll(".oval-white-home-outro");
        gsap.set(whiteOvals, {
          scale: 1, // Keep at scale 1 (visible size) - will animate to 0 during navigation
          opacity: 1, // Keep at opacity 1 (visible) - will animate to 0 during navigation
          transformOrigin: "center center"
        });
      }
    };
    
    // Initialize with delay to ensure Webflow is ready
    setTimeout(initializeNavigationOvals, 100);

    /**
     * ROBUST: Oval expand animation for Home/Contact to Portfolio navigation
     * 
     * This creates a smooth transition when navigating TO portfolio pages.
     * The sequence is:
     * 1. 3D model animation plays first
     * 2. After delay, this oval animation starts
     * 3. Ovals expand from center outward to cover screen
     * 4. Navigation to portfolio.html happens after animation completes
     */
    window.playOvalExpandAnimation = (onComplete) => {
      const introAnimContainer = document.querySelector(".intro-anim-home");
      const introOvals = introAnimContainer?.querySelectorAll(".oval-white-home");
      
      if (!introAnimContainer || !introOvals || introOvals.length === 0) {
        console.warn("⚠️ Intro animation container or ovals not found");
        onComplete && onComplete();
        return;
      }
      
      console.log("🟣 Starting oval expand animation for portfolio navigation");
      
      // Make container visible
      // Don't use finished class - just control display directly
      introAnimContainer.style.display = 'block';
      introAnimContainer.style.visibility = 'visible';
      introAnimContainer.style.opacity = '1';
      introAnimContainer.style.pointerEvents = 'none';
      
      // Animate ovals expanding from center outward
      const timeline = gsap.timeline();
      
      // Opacity animates first
      timeline.to(introOvals, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: 0.15,
          from: "center"
        }
      }, 0);
      
      // Scale animates slightly after
      timeline.to(introOvals, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: 0.2,
          from: "center"
        }
      }, 0.1);
      
      // Complete animation
      timeline.eventCallback("onComplete", () => {
        console.log("🟣 Oval expand animation completed");
        
        // Set white background to prevent flicker during navigation
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
  // SIMPLIFIED: Track 3D model loading progress
  const { progress } = useProgress();
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // SIMPLIFIED: Single state for preloader status
  const [preloaderState, setPreloaderState] = useState(() => {
    if (typeof window === 'undefined') return 'hidden';
    
    // ROBUST: Use performance API to detect actual reload vs navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isHardReload = navigationType === 'reload';
    
    // Check if coming from portfolio pages (more comprehensive check)
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    // CRITICAL: Hard reload should NEVER be considered "from portfolio"
    // Even if referrer shows portfolio, a hard reload means user refreshed the page
    const isFromPortfolio = !isHardReload && referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
    // Check if we're on the home page (not portfolio)
    const isOnHomePage = currentUrl.includes('index.html') || 
                        currentUrl.endsWith('/') || 
                        (!currentUrl.includes('portfolio') && !currentUrl.includes('casestudy'));
    
    // BULLETPROOF RULE: Show preloader ONLY on:
    // 1. Hard reload (F5, Ctrl+R, browser refresh)
    // 2. AND we're on the home page
    // 3. AND we're NOT coming from portfolio pages
    // Note: Reset session storage on hard reload to ensure fresh state
    let hasPreloaderShown = sessionStorage.getItem('preloaderShown') === 'true';
    
    // CRITICAL: Reset preloader session on hard reload (unless from portfolio)
    if (isHardReload && !isFromPortfolio) {
      sessionStorage.removeItem('preloaderShown');
      hasPreloaderShown = false;
      console.log("🔄 Hard reload detected - reset preloader session");
    }
    
    const shouldShowPreloader = isHardReload && isOnHomePage && !isFromPortfolio && !hasPreloaderShown;
    
    // AGGRESSIVE: Hide preloader immediately if it shouldn't be shown
    if (!shouldShowPreloader) {
      // IMMEDIATE: Inject CSS into head to hide preloader before any rendering
      const immediateStyle = document.createElement('style');
      immediateStyle.textContent = '.pre-loader { display: none !important; }';
      document.head.insertBefore(immediateStyle, document.head.firstChild);
      
      const preloader = document.querySelector('.pre-loader');
      if (preloader) {
        // Multiple methods to ensure it's hidden
        preloader.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        preloader.setAttribute('data-permanently-hidden', 'true');
        preloader.classList.add('hide');
        preloader.classList.remove('show');
        console.log("🚫 AGGRESSIVELY hid preloader with multiple methods");
      }
    }
    
    console.log("🎯 PRELOADER INIT:", {
      navigationType,
      isHardReload,
      isFromPortfolio,
      isOnHomePage,
      hasPreloaderShown,
      shouldShowPreloader,
      referrer,
      currentUrl
    });
    
    return shouldShowPreloader ? 'visible' : 'hidden';
  });
  
  // Track preloader timing
  const [preloaderStartTime] = useState(Date.now());

  // ROBUST: Initialize preloader and oval containers on mount
  useEffect(() => {
    console.log("🚀 INITIALIZING PRELOADER SYSTEM");
    
      const preloader = document.querySelector('.pre-loader');
    const whiteOvalContainer = document.querySelector('.outro-anim-home');
    const darkOvalContainer = document.querySelector('.outro-anim-home-dark');
    
    if (preloaderState === 'visible') {
      console.log("🎯 SHOWING PRELOADER for hard reload");
      
      // Only show if not permanently hidden
      if (preloader && !preloader.getAttribute('data-permanently-hidden')) {
        preloader.style.display = 'flex';
        preloader.style.visibility = 'visible';
        preloader.classList.add('show');
        console.log("✅ Showed preloader for hard reload");
      }
      
      // Hide white ovals during preloader
      if (whiteOvalContainer) {
        whiteOvalContainer.style.display = 'none';
      }
      
      // Ensure dark ovals are ready (they're part of preloader)
      if (darkOvalContainer) {
        darkOvalContainer.style.display = 'block';
        darkOvalContainer.style.visibility = 'visible';
        
        // Set dark ovals to initial state
        const darkOvals = darkOvalContainer.querySelectorAll('.oval-white-home-outro');
        gsap.set(darkOvals, {
          scale: 1,
          opacity: 1,
          transformOrigin: "center center"
        });
      }
    } else {
      console.log("🎯 ENSURING PRELOADER HIDDEN for navigation");
      
      // Ensure preloader is permanently hidden
      if (preloader) {
        preloader.style.display = 'none';
        preloader.setAttribute('data-permanently-hidden', 'true');
        console.log("🚫 Confirmed preloader permanently hidden");
      }
      
      // Prepare white ovals for navigation animations (but keep container hidden)
      if (whiteOvalContainer) {
        whiteOvalContainer.style.display = 'none'; // Hidden by default - only show during navigation
        whiteOvalContainer.style.visibility = 'visible';
        
        // Set white ovals to initial state (ready for navigation animation)
        const whiteOvals = whiteOvalContainer.querySelectorAll('.oval-white-home-outro');
        gsap.set(whiteOvals, {
          scale: 1, // Keep at scale 1 - will animate to 0 during navigation
          opacity: 1, // Keep at opacity 1 - will animate to 0 during navigation  
          transformOrigin: "center center"
        });
      }
      
      // Hide dark ovals for navigation
      if (darkOvalContainer) {
        darkOvalContainer.style.display = 'none';
      }
    }
    
    console.log("🚀 PRELOADER SYSTEM INITIALIZED");
  }, [preloaderState]);


  
  // ROBUST: Single source of truth for page state
  const [currentPageState, setCurrentPageState] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    console.log("🔍 Initial page detection - path:", path, "hash:", hash);
    
    // Portfolio/casestudy pages
    if (path.includes('portfolio') || path.includes('casestudy')) {
      return path.includes('portfolio') ? 'portfolio' : 'casestudy';
    }
    
    // Contact via hash
    if (hash === '#contact') {
      return 'contact';
    }
    
    // Default to home
    return 'home';
  });
  
  // ROBUST: Animation state management
  const prevPageState = useRef('home');
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const [shouldPlayHomeToPortfolio, setShouldPlayHomeToPortfolio] = useState(false);
  const [shouldPlayContactToPortfolio, setShouldPlayContactToPortfolio] = useState(false);
  const [shouldPlayPortfolioToHome, setShouldPlayPortfolioToHome] = useState(false);
  const isAnimating = useRef(false);
  const hasInitialized = useRef(false);
  
  // SIMPLIFIED: Monitor 3D model loading progress
  useEffect(() => {
    console.log("🔍 3D Model loading progress:", progress, "%");
    
    if (progress === 100 && !modelLoaded) {
      console.log("🎯 3D Model fully loaded!");
      setModelLoaded(true);
    }
  }, [progress, modelLoaded]);

  // SIMPLIFIED: Fallback timer for model loading
  useEffect(() => {
    if (preloaderState === 'visible' && !modelLoaded) {
      const fallbackTimer = setTimeout(() => {
        console.log("🎯 Fallback: Marking model as loaded after 3s");
        setModelLoaded(true);
      }, 3000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [preloaderState, modelLoaded]);

  // ROBUST: Handle preloader completion when model loads
  useEffect(() => {
    if (preloaderState === 'visible' && modelLoaded) {
      console.log("🎯 MODEL LOADED - Processing preloader completion");
      
      const elapsed = Date.now() - preloaderStartTime;
      const minDisplayTime = 4000; // 4 seconds minimum
      
      // Calculate delay to ensure minimum display time
      const delay = Math.max(0, minDisplayTime - elapsed);
      
      console.log("🕐 Preloader timing:", {
        elapsed: elapsed + "ms",
        delay: delay + "ms",
        decision: delay > 0 ? "Wait for minimum 4s" : "Finish immediately"
      });
      
      setTimeout(() => {
        console.log("🎯 Starting preloader finish sequence");
        finishPreloader();
      }, delay);
    }
  }, [preloaderState, modelLoaded, preloaderStartTime]);

  // ROBUST: Preloader finish sequence - clean and simple
  const finishPreloader = () => {
    console.log("🎯 STARTING PRELOADER FINISH SEQUENCE");
    
    // Step 1: Animate preloader content up and fade out
    const preloaderContent = document.querySelector('.preloader-content');
    
    // Step 2: Prepare dark oval container and ovals (BEFORE content animation)
    const darkOvalContainer = document.querySelector('.outro-anim-home-dark');
    const darkOvals = darkOvalContainer?.querySelectorAll('.oval-white-home-outro');
    
    if (preloaderContent) {
      gsap.to(preloaderContent, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          console.log("🎯 Preloader content animated out");
        }
      });
      
      // Start dark ovals animation with TIGHT OVERLAP (after 0.1s for minimal gap)
      setTimeout(() => {
        if (darkOvals && darkOvals.length > 0) {
            console.log("🟣 Starting dark ovals outro animation with", darkOvals.length, "ovals");
            
            // CRITICAL: Make dark oval container visible
            darkOvalContainer.style.display = 'block';
            darkOvalContainer.style.visibility = 'visible';
            
            // Ensure dark ovals are fully visible before animation
            gsap.set(darkOvals, {
              scale: 1,
              opacity: 1,
              transformOrigin: "center center"
            });
            
            console.log("🔍 Dark container now visible:", {
              display: darkOvalContainer.style.display,
              visibility: darkOvalContainer.style.visibility
            });
            
            // Step 3: Start 3D animation IMMEDIATELY (parallel with oval animation)
            const isContactPage = window.location.hash === '#contact';
            if (isContactPage) {
              setShouldPlayContactIntro(true);
              console.log("🎯 Triggered contact intro animation (parallel with ovals)");
            } else {
              setShouldPlayPortfolioToHome(true);
              console.log("🎯 Triggered home intro animation (parallel with ovals)");
            }
            
            // Create timeline for dark ovals with scale starting before opacity
            const darkTimeline = gsap.timeline({
              onStart: () => {
                console.log("🟣 Dark ovals animation STARTED");
              },
            });
            
            // Scale animation starts immediately
            darkTimeline.to(darkOvals, {
              scale: 0,
              duration: 1.0, // Slightly faster: 1.0s instead of 1.2s
              ease: "power2.in",
              stagger: {
                amount: 0.35, // Slightly faster stagger
                from: "outside"
              }
            }, 0);
            
            // Opacity animation starts 0.2s later
            darkTimeline.to(darkOvals, {
              opacity: 0,
              duration: 0.8, // Faster opacity
              ease: "power2.in",
              stagger: {
                amount: 0.35,
                from: "outside"
              }
            }, 0.2); // Start opacity 0.2s after scale
            
            // Add onComplete callback to the timeline
            darkTimeline.call(() => {
                console.log("🟣 Dark ovals animation completed");
                
              // Step 4: Clean up after oval animation finishes (shorter gap)
              setTimeout(() => {
                  // Hide preloader PERMANENTLY
                const preloader = document.querySelector('.pre-loader');
                if (preloader) {
                  preloader.style.display = 'none';
                    preloader.setAttribute('data-permanently-hidden', 'true');
                    console.log("🚫 Preloader permanently hidden after animation");
                  }
                  
                  // Hide dark oval container after animation
                  darkOvalContainer.style.display = 'none';
                  
                  // Prepare white ovals for navigation (but keep container hidden)
                  const whiteOvalContainer = document.querySelector('.outro-anim-home');
                  if (whiteOvalContainer) {
                    whiteOvalContainer.style.display = 'none'; // Hidden by default - only show during navigation
                    whiteOvalContainer.style.visibility = 'visible';
                    
                    const whiteOvals = whiteOvalContainer.querySelectorAll('.oval-white-home-outro');
                    gsap.set(whiteOvals, {
                      scale: 1, // Keep at scale 1 - ready for navigation animations
                      opacity: 1, // Keep at opacity 1 - ready for navigation animations
                      transformOrigin: "center center"
                    });
                  }
                  
                  // Update state (3D animation already started)
                  setPreloaderState('finished');
                  sessionStorage.setItem('preloaderShown', 'true');
                  
                  console.log("🎯 PRELOADER SEQUENCE COMPLETED - 3D animation running");
                }, 50); // Shorter gap between content and ovals
            });
          } else {
            console.warn("⚠️ No dark ovals found for overlapped animation");
          }
        }, 100); // Start ovals 0.1s into content animation (tight overlap!)
    } else {
      console.warn("⚠️ No preloader content found, skipping animation");
      setPreloaderState('finished');
    }
  };

  // DEBUGGING: Add manual testing functions for development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugPreloader = () => {
        console.log("🔍 Preloader debug:", {
          preloaderState,
          modelLoaded,
          progress,
          preloaderElement: document.querySelector(".pre-loader"),
          whiteContainer: document.querySelector(".outro-anim-home"),
          darkContainer: document.querySelector(".outro-anim-home-dark")
        });
      };
      
      window.forceFinishPreloader = () => {
        console.log("🎯 Manually finishing preloader");
        finishPreloader();
      };

      window.resetPreloader = () => {
        console.log("🔄 Resetting preloader state");
        sessionStorage.removeItem('preloaderShown');
        setPreloaderState('visible');
        setModelLoaded(false);
        console.log("🔄 State reset - reload page to see preloader");
      };

      window.testNavigationOvals = () => {
        console.log("🧪 Testing navigation oval animation");
        playNavigationOvalAnimation(() => {
          console.log("🧪 Navigation oval test completed");
        });
      };

      window.testExpandOvals = () => {
        console.log("🧪 Testing expand oval animation");
        if (window.playOvalExpandAnimation) {
          window.playOvalExpandAnimation(() => {
            console.log("🧪 Expand oval test completed");
          });
        }
      };

      window.testDarkOvals = () => {
        console.log("🧪 Testing dark oval visibility and animation");
        const darkContainer = document.querySelector('.outro-anim-home-dark');
        const darkOvals = darkContainer?.querySelectorAll('.oval-white-home-outro');
        
        console.log("🔍 Dark container:", darkContainer);
        console.log("🔍 Dark ovals found:", darkOvals?.length);
        console.log("🔍 Dark container styles:", {
          display: darkContainer?.style.display,
          visibility: darkContainer?.style.visibility,
          zIndex: darkContainer?.style.zIndex
        });
        
        if (darkOvals && darkOvals.length > 0) {
          // Make them visible and animate
          gsap.set(darkOvals, {
            scale: 1,
            opacity: 1,
            transformOrigin: "center center"
          });
          
          setTimeout(() => {
            gsap.to(darkOvals, {
              scale: 0,
              opacity: 0,
              duration: 2.0,
              ease: "power2.in",
              stagger: {
                amount: 0.5,
                from: "outside"
              }
            });
          }, 1000);
        }
      };
    }
  }, [preloaderState, modelLoaded, progress]);

  // PROTECTION: Prevent multiple white oval animations
  const isWhiteOvalAnimating = useRef(false);

  // ROBUST: White oval animation for navigation FROM portfolio TO home/contact
  const playNavigationOvalAnimation = (onComplete) => {
    console.log("🔍 playNavigationOvalAnimation CALLED - this should appear when navigating from portfolio");
    
    // Prevent multiple simultaneous animations
    if (isWhiteOvalAnimating.current) {
      console.warn("⚠️ White oval animation already running - skipping");
      onComplete && onComplete();
      return;
    }
    isWhiteOvalAnimating.current = true;
    
    // Find the white oval container and ovals
    
    const whiteContainer = document.querySelector(".outro-anim-home");
    const whiteOvals = whiteContainer?.querySelectorAll(".oval-white-home-outro");
    
    if (!whiteContainer || !whiteOvals || whiteOvals.length === 0) {
      console.warn("⚠️ White oval container or ovals not found for navigation");
      onComplete && onComplete();
      return;
    }

    // Ensure dark container is hidden during navigation
      const darkContainer = document.querySelector('.outro-anim-home-dark');
      if (darkContainer) {
      darkContainer.style.display = 'none';
    }

    // CRITICAL: Set body background to white immediately to prevent dark flash
    document.body.style.backgroundColor = 'white';
    
    // Set up white container for navigation animation
    // CRITICAL: Remove finished class that sets opacity: 0
    whiteContainer.classList.remove('finished');
    whiteContainer.style.display = 'block';
    whiteContainer.style.visibility = 'visible';
    whiteContainer.style.opacity = '1'; // Explicitly set opacity to 1
    whiteContainer.style.position = 'fixed';
    whiteContainer.style.top = '0';
    whiteContainer.style.left = '0';
    whiteContainer.style.width = '100vw';
    whiteContainer.style.height = '100vh';
    whiteContainer.style.zIndex = '999999'; // Much higher z-index
    whiteContainer.style.pointerEvents = 'none';
    // CRITICAL: Override Webflow's 'overflow: clip' with cssText
    whiteContainer.style.cssText += 'overflow: visible !important;';
    


    // GENTLE RESET: Use GSAP-friendly initialization
    whiteOvals.forEach((oval, index) => {
      // Add visible class for Webflow combo class
      oval.classList.add('visible');
    });
    
    // Set initial state via GSAP only (no cssText interference)
    gsap.set(whiteOvals, {
      scale: 1,
      opacity: 1,
      display: "block",
      transformOrigin: "center center"
    });





    // Start immediately - no delay, sync with 3D animation
    setTimeout(() => {
      
      // CRITICAL: Remove 'finished' class and aggressive protection
      whiteContainer.classList.remove('finished');
      
      // SETUP-ONLY PROTECTION: Aggressive protection during setup, then stop completely
      let protectionInterval;
      
      const setupProtection = () => {
        let setupChecks = 0;
        const maxSetupChecks = 10; // Run for about 0.5 seconds (10 * 50ms)
        
        protectionInterval = setInterval(() => {
          setupChecks++;
          
          // CRITICAL: Prevent 'finished' class from being added by Webflow
          if (whiteContainer.classList.contains('finished')) {
            whiteContainer.classList.remove('finished');
          }
          
          // Force container properties during setup
          const containerStyles = window.getComputedStyle(whiteContainer);
          if (containerStyles.display === 'none') {
            whiteContainer.style.display = 'block';
          }
          if (containerStyles.visibility === 'hidden') {
            whiteContainer.style.visibility = 'visible';
          }
          
          // Gentle oval protection during setup only
          whiteOvals.forEach((oval, index) => {
            const computed = window.getComputedStyle(oval);
            if (computed.display === 'none') {
              oval.style.display = 'block';
            }
            // Don't force transform during setup to avoid GSAP conflicts
          });
          
          // Stop protection after setup period
          if (setupChecks >= maxSetupChecks) {
            clearInterval(protectionInterval);
            console.log("🛡️ Setup protection completed - ready for flicker-free animation");
          }
        }, 50); // Fast checks during setup only
      };
      
      // Start setup protection immediately
      setupProtection();

      // Delay animation start until after setup protection completes
      setTimeout(() => {
        console.log("🎬 Starting flicker-free GSAP animation");
        
        // Use GSAP timeline for smooth animation
        const timeline = gsap.timeline({
          onStart: () => {
            // Reset body background as soon as animation starts (brief white flash only)
        document.body.style.backgroundColor = '';
            console.log("🎬 Animation started - body background reset");
          },
          onComplete: () => {
            console.log("🟣 TIMELINE COMPLETED - animation finished");
            
            // Hide the container
            whiteContainer.style.display = 'none';
            whiteContainer.style.visibility = 'hidden';
            
            // Reset animation flag
            isWhiteOvalAnimating.current = false;
      
      onComplete && onComplete();
          }
        });
      
      // Add scale animation to timeline (starts immediately)
      timeline.to(whiteOvals, {
        scale: 0,
        duration: 1.2, // Visible duration: 1.2s
        ease: "power2.out",
        stagger: 0.12, // Visible stagger: 0.12s

        onStart: () => {
          console.log("🟣 White ovals scale animation STARTED");
        }
      }, 0); // Start at time 0
      
      // Add opacity animation to timeline (starts 0.3s later)
      timeline.to(whiteOvals, {
        opacity: 0,
        duration: 1.0, // Visible duration: 1.0s
        ease: "power2.out",
        stagger: 0.12, // Visible stagger: 0.12s
  
        onStart: () => {
          console.log("🟣 White ovals opacity animation STARTED");
        }
      }, 0.3); // Start 0.3 seconds after timeline begins
      
      }, 600); // Wait for setup protection to complete (0.6 seconds)
      
    }, 100); // Minimal delay - start almost immediately
  };

  // ROBUST: Contact-specific oval animation for navigation FROM portfolio TO contact
  const playContactNavigationOvalAnimation = (onComplete) => {
    
    // Prevent multiple simultaneous animations
    if (isWhiteOvalAnimating.current) {
      console.warn("⚠️ White oval animation already running - skipping contact animation");
      onComplete && onComplete();
      return;
    }
    isWhiteOvalAnimating.current = true;
    
    // Use white container for contact navigation (same as home navigation)
    const whiteContainer = document.querySelector(".outro-anim-home");
    const whiteOvals = whiteContainer?.querySelectorAll(".oval-white-home-outro");
    
    if (!whiteContainer || !whiteOvals || whiteOvals.length === 0) {
      console.warn("⚠️ White oval container or ovals not found for contact navigation");
      onComplete && onComplete();
      return;
    }

    console.log("🟣 Found", whiteOvals.length, "white ovals for contact navigation");

    // Ensure dark container is hidden
    const darkContainer = document.querySelector('.outro-anim-home-dark');
    if (darkContainer) {
      darkContainer.style.display = 'none';
    }

    // CRITICAL: Set body background to white immediately to prevent dark flash
    document.body.style.backgroundColor = 'white';

    // Set up container for animation
    // CRITICAL: Remove finished class that sets opacity: 0
    whiteContainer.classList.remove('finished');
    whiteContainer.style.display = 'block';
    whiteContainer.style.visibility = 'visible';
    whiteContainer.style.opacity = '1'; // Explicitly set opacity to 1
    whiteContainer.style.position = 'fixed';
    whiteContainer.style.top = '0';
    whiteContainer.style.left = '0';
    whiteContainer.style.width = '100vw';
    whiteContainer.style.height = '100vh';
    whiteContainer.style.zIndex = '9999';
    whiteContainer.style.pointerEvents = 'none';
    // CRITICAL: Override Webflow's 'overflow: clip' with cssText
    whiteContainer.style.cssText += 'overflow: visible !important;';

    // Set up ovals for animation
    whiteOvals.forEach((oval, index) => {
      oval.classList.add('visible');
      
      // FIX Z-FIGHTING: Give each oval a distinct z-index to prevent layering conflicts
      oval.style.zIndex = 100 + index; // Each oval gets a unique z-index
      oval.style.position = 'relative'; // Ensure z-index takes effect
      
      // Restore original radial gradient background
      oval.style.backgroundImage = ''; // Reset to CSS default
      oval.style.backgroundColor = '';
      oval.style.borderRadius = '50%';
    });

    // Set ovals to full visibility initially
    gsap.set(whiteOvals, {
      scale: 1,
      opacity: 1,
      transformOrigin: "center center"
    });

    // Start FAST outro animation immediately - sync with 3D, scale first

    
    // Start scale animation immediately
    gsap.to(whiteOvals, {
      scale: 0,
      duration: 1.2, // Visible duration: 1.2s
        ease: "power2.out",
      stagger: 0.12, // Visible stagger: 0.12s

      z: 0.01, // Maintain 3D context
      onStart: () => {
        // Reset body background as soon as animation starts (brief white flash only)
        document.body.style.backgroundColor = '';
        console.log("🎬 Contact animation started - body background reset");
      }
    });
    
    // Start opacity animation slightly later (0.3s delay)
    gsap.to(whiteOvals, {
      opacity: 0,
      duration: 1.0, // Visible duration: 1.0s
      ease: "power2.out",
      stagger: 0.12, // Visible stagger: 0.12s
      delay: 0.3, // Start 0.3 seconds after scale begins

      onComplete: () => {
        
        // Hide the container
        whiteContainer.style.display = 'none';
        whiteContainer.style.visibility = 'hidden';
        
        // Reset animation flag
        isWhiteOvalAnimating.current = false;
      
      onComplete && onComplete();
      }
    });
  };

  
  // ROBUST: Handle navigation from portfolio pages
  useEffect(() => {
    // Only run this logic if NOT showing preloader (i.e., navigation scenario)
    if (preloaderState !== 'visible') {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const referrer = document.referrer;
      const currentUrl = window.location.href;
    
      console.log("🔍 Navigation intro logic - path:", path, "hash:", hash);
    console.log("🔍 Referrer:", referrer);
    
      // ROBUST: Check if this is navigation from portfolio
      // CRITICAL: Only consider it navigation from portfolio if it's NOT a hard reload
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      const isHardReload = navigationType === 'reload';
    
      const isNavigationFromPortfolio = !isHardReload && referrer && (
      referrer.includes('portfolio') || 
      referrer.includes('casestudy') ||
      referrer.includes('oakley') ||
      referrer.includes('dopo')
    );
    
      // Ensure we're on the home page (not on portfolio pages)
      const isOnHomePage = currentUrl.includes('index.html') || 
                          currentUrl.endsWith('/') || 
                          (!currentUrl.includes('portfolio') && !currentUrl.includes('casestudy'));
      
      if (isNavigationFromPortfolio && isOnHomePage) {
        console.log("🔍 Navigation FROM portfolio TO home detected - setting up white oval outro");
        console.log("🔍 About to call playNavigationOvalAnimation...");
        
        const whiteContainer = document.querySelector(".outro-anim-home");
        if (whiteContainer) {
          // CRITICAL: Set body background to white immediately to prevent dark flash
          document.body.style.backgroundColor = 'white';
          
          // Set up immediate outro overlay (covers screen during navigation)
          whiteContainer.style.display = 'block';
          whiteContainer.style.visibility = 'visible';
          whiteContainer.style.position = 'fixed';
          whiteContainer.style.top = '0';
          whiteContainer.style.left = '0';
          // FIX: Use window dimensions instead of viewport units to prevent flicker
          whiteContainer.style.width = window.innerWidth + 'px';
          whiteContainer.style.height = window.innerHeight + 'px';
          whiteContainer.style.zIndex = '9999';
          whiteContainer.style.pointerEvents = 'none';
          // CRITICAL: Override Webflow's 'overflow: clip' with cssText
          whiteContainer.style.cssText += 'overflow: visible !important;';
          
          // CRITICAL: Set ovals to FULL visibility initially (scale 1, opacity 1)
          const whiteOvals = whiteContainer.querySelectorAll(".oval-white-home-outro");
          if (whiteOvals.length > 0) {
            console.log("🟣 Setting up", whiteOvals.length, "white ovals for outro animation");
            
            // DEBUG: Check initial oval state
            console.log("🔍 INITIAL WHITE OVAL STATE:", {
              containerFound: !!whiteContainer,
              containerClasses: whiteContainer.className,
              ovalCount: whiteOvals.length,
              firstOvalClasses: whiteOvals[0]?.className,
              containerRect: whiteContainer.getBoundingClientRect(),
              firstOvalRect: whiteOvals[0]?.getBoundingClientRect()
            });
            
                // Set up ovals for animation
    whiteOvals.forEach((oval, index) => {
      oval.classList.add('visible');
      
      // FIX Z-FIGHTING: Give each oval a distinct z-index to prevent layering conflicts
      oval.style.zIndex = 100 + index; // Each oval gets a unique z-index
      oval.style.position = 'relative'; // Ensure z-index takes effect
      
      // Restore original radial gradient background
      oval.style.backgroundImage = ''; // Reset to CSS default
      oval.style.backgroundColor = '';
      oval.style.borderRadius = '50%';
    });

            gsap.set(whiteOvals, {
          scale: 1,
          opacity: 1,
          transformOrigin: "center center"
        });
        
            // Determine destination and play appropriate animation
        const isContactPage = hash === '#contact';
            const isHomePage = (path === '/' || path === '/index.html') && hash !== '#contact';
        
        if (isContactPage) {
              // Start 3D animation immediately (parallel with ovals)
              setShouldPlayContactIntro(true);
              console.log("🎯 Started contact intro animation (parallel with ovals)");
              
              // Start oval animation immediately (no delay)
              playContactNavigationOvalAnimation(() => {
                console.log("🎯 Contact navigation oval animation completed");
              });
            } else if (isHomePage) {
              // Start 3D animation immediately (parallel with ovals)
              setShouldPlayPortfolioToHome(true);
              console.log("🎯 Started home intro animation (parallel with ovals)");
              
              // Start oval animation immediately (no delay)
              playNavigationOvalAnimation(() => {
                console.log("🎯 Home navigation oval animation completed");
              });
            }
            } else {
            console.warn("⚠️ No white ovals found for navigation animation");
        }
      } else {
          console.warn("⚠️ White oval container not found");
      }
      } else if (isNavigationFromPortfolio && !isOnHomePage) {
        console.log("🔍 Navigation from portfolio detected but not to home page - skipping oval animation");
            } else if (!isNavigationFromPortfolio) {
        console.log("🔍 Not navigation from portfolio - no oval animation needed");
    }
    }
  }, [preloaderState]); // Only depend on preloader state

  // Background flicker prevention is handled in oval animations

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

    // ROBUST: Handle intended routes from external pages
    const handleIntendedRoute = () => {
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      
      if (intendedRoute === '/contact-us') {
        setCurrentPageState('contact');
        setShouldPlayContactIntro(true);
        sessionStorage.removeItem('intendedRoute');
        console.log("🎯 Handled intended contact route");
      }
    };

    handleIntendedRoute();
    
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

  // Container management is now handled by individual animation functions



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

    // Initialize properly on first run
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevPageState.current = to;
      return; // Don't trigger animations on initialization
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



    // ROBUST: Handle page transitions with appropriate animations
    if (to === "contact" && from !== "contact") {
      console.log("🎯 Transitioning TO contact");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactIntro(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (from === "contact" && to === "home") {
      console.log("🎯 Transitioning FROM contact TO home");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayBackContact(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (to === "home" && isPortfolioOrCasestudy(from)) {
      console.log("🎯 Transitioning FROM portfolio TO home");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayPortfolioToHome(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (isPortfolioOrCasestudy(to) && from === "home") {
      console.log("🎯 Transitioning FROM home TO portfolio");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayHomeToPortfolio(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else if (isPortfolioOrCasestudy(to) && from === "contact") {
      console.log("🎯 Transitioning FROM contact TO portfolio");
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactToPortfolio(true);
      setTimeout(() => { isAnimating.current = false; }, 1000);
      
    } else {
      console.log("🎯 No animation needed for:", from, "→", to);
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