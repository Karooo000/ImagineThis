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
        // Trigger page state change event for animation system
        window.dispatchEvent(new CustomEvent('pageStateChange', { 
          detail: { from: window.currentPageState || 'home', to: 'contact' }
        }));
        window.currentPageState = 'contact';
      }
    } else if (path === "/") {
      // Handle home navigation
      const contactContainer = document.querySelector(".container.contact");
      const homeContainer = document.querySelector(".container.home");
      
      if (contactContainer && homeContainer) {
        // Trigger page state change event for animation system
        window.dispatchEvent(new CustomEvent('pageStateChange', { 
          detail: { from: window.currentPageState || 'contact', to: 'home' }
        }));
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

function Scene({ shouldPlayContactIntro, shouldPlayBackContact, shouldPlayHomeToPortfolio, shouldPlayPortfolioToHome }) {
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
        
        // Always navigate to root path, not index.html
        window.goToPath("/");
    };

    const handleWorksClick = (e) => {
        // Store the original href before preventing default
        const originalHref = e.currentTarget.href;
        
        // Prevent default navigation temporarily
        e.preventDefault();
        e.stopPropagation();
        
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
  // Webflow-compatible page state management
  const [currentPageState, setCurrentPageState] = useState(() => 
    typeof window !== 'undefined' ? window.getCurrentPageState() : 'home'
  );
  const prevPageState = useRef((() => {
    // Detect if we came from portfolio/casestudy via referrer
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer && (referrer.includes('portfolio') || referrer.includes('casestudy'))) {
        return referrer.includes('portfolio') ? 'portfolio' : 'casestudy';
      }
    }
    return 'home';
  })());
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const [shouldPlayHomeToPortfolio, setShouldPlayHomeToPortfolio] = useState(false);
  const [shouldPlayPortfolioToHome, setShouldPlayPortfolioToHome] = useState(false);
  const isAnimating = useRef(false);
  const hasInitialized = useRef(false);
  


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
        setShouldPlayContactIntro(true);
        setShouldPlayBackContact(false);
        setShouldPlayHomeToPortfolio(false);
        setShouldPlayPortfolioToHome(false);
        sessionStorage.removeItem('intendedRoute');
      }
    };

    checkPortfolioReturn();

    return () => {
      window.triggerHomeToPortfolioAnimation = null;
      window.removeEventListener('directPortfolioAnimation', handleDirectPortfolioAnimation);
    };
  }, []);

  // Listen for page state changes from navigation system (for contact/home only)
  useEffect(() => {
    const handlePageStateChange = (event) => {
      const { from, to } = event.detail;
      console.log("🔄 Page state change:", from, "→", to);
      
      prevPageState.current = from;
      setCurrentPageState(to);
    };

    window.addEventListener('pageStateChange', handlePageStateChange);
    
    return () => {
      window.removeEventListener('pageStateChange', handlePageStateChange);
    };
  }, []);

  // EMERGENCY CONTAINER CHECK: Ensure containers exist and are visible when needed
  useEffect(() => {
    if (currentPageState === "contact") {
      const checkAndForceVisibility = () => {
        const contactContainer = document.querySelector(".container.contact");
        const homeContainer = document.querySelector(".container.home");
        
        console.log("🚨 EMERGENCY CHECK:", {
          contactFound: !!contactContainer,
          homeFound: !!homeContainer,
          pageState: currentPageState
        });

        if (contactContainer) {
          const opacity = window.getComputedStyle(contactContainer).opacity;
          const visibility = window.getComputedStyle(contactContainer).visibility;
          console.log("🚨 Contact container current state:", { opacity, visibility });
          
          // Force visibility regardless of current state
          contactContainer.style.visibility = "visible";
          contactContainer.style.display = "flex";
          contactContainer.style.opacity = "1";
          contactContainer.style.zIndex = "25";
          
          console.log("🚨 FORCED contact container visibility");
        } else {
          console.error("🚨 ERROR: Contact container not found in DOM!");
        }

        if (homeContainer) {
          homeContainer.style.visibility = "hidden";
          homeContainer.style.opacity = "0";
          homeContainer.style.zIndex = "-1";
        }
      };

      // Try multiple times to ensure it works
      checkAndForceVisibility();
      setTimeout(checkAndForceVisibility, 100);
      setTimeout(checkAndForceVisibility, 300);
      setTimeout(checkAndForceVisibility, 500);
      setTimeout(checkAndForceVisibility, 1000);
    }
  }, [currentPageState]);



  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = currentPageState === "home";
    const showContact = currentPageState === "contact";
    


    // Container animations should work on all pages

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
        duration: 0.6
      }
    });

    if (showHome && contactContainer && homeContainer) {
      // First set initial states
      gsap.set(homeContainer, { 
        visibility: "visible",
        opacity: 0,
        yPercent: 3
      });
      
      tl.to(contactContainer, {
        opacity: 0,
        yPercent: -3,
        onComplete: () => gsap.set(contactContainer, { visibility: "hidden", yPercent: 0 })
      })
      .to(homeContainer, { 
        opacity: 1,
        yPercent: 0
      }, "-=0.4"); // Start slightly before previous animation ends
    }

    if (showContact && homeContainer && contactContainer) {
      // First set initial states
      gsap.set(contactContainer, { 
        visibility: "visible",
        opacity: 0,
        yPercent: 3
      });

      tl.to(homeContainer, {
        opacity: 0,
        yPercent: -3,
        onComplete: () => gsap.set(homeContainer, { visibility: "hidden", yPercent: 0 })
      })
      .to(contactContainer, { 
        opacity: 1,
        yPercent: 0
      }, "-=0.4"); // Start slightly before previous animation ends
    }

    // Safety mechanism: ensure contact container becomes visible if animation fails
    if (showContact && contactContainer) {
      // Only check after the intro animation should have completed
      setTimeout(() => {
        const currentOpacity = gsap.getProperty(contactContainer, "opacity");
        console.log("🔍 Animation completion check: Contact container opacity is", currentOpacity);
        
        // Only intervene if opacity is still 0 after animation time
        if (currentOpacity === 0 || currentOpacity === "0") {
          console.log("🚨 Safety fallback: Animation didn't complete, smoothly fading in");
          
          // Use a gentle fade in instead of immediate visibility
          gsap.to(contactContainer, { 
            opacity: 1,
            yPercent: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }, 1000); // Wait for intro animation to complete (600ms timeline + buffer)
    }
  }, [currentPageState]);

  // Handle animation triggers based on page state changes
  useEffect(() => {
    const from = prevPageState.current;
    const to = currentPageState;
    
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
      setShouldPlayPortfolioToHome(false);
    };

    if (to === "contact" && from !== "contact") {
      // Trigger contact intro animation when going TO contact from anywhere else (including external pages like portfolio)
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayContactIntro(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else if (from === "contact" && to === "home") {
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayBackContact(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else if (to === "home" && isPortfolioOrCasestudy(from)) {
      // Coming back to home from portfolio/casestudy pages
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayPortfolioToHome(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else if (isPortfolioOrCasestudy(to) && from === "home") {
      // Going from home to portfolio/casestudy pages  
      isAnimating.current = true;
      resetAnimations();
      setShouldPlayHomeToPortfolio(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000);
    } else {
      resetAnimations();
    }

    prevPageState.current = to;
  }, [currentPageState]);

  return <Scene 
    shouldPlayContactIntro={shouldPlayContactIntro}
    shouldPlayBackContact={shouldPlayBackContact}
    shouldPlayHomeToPortfolio={shouldPlayHomeToPortfolio}
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