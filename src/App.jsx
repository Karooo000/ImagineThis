import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react"

import {useProgress, Environment, OrbitControls, Sparkles, PerspectiveCamera} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, DepthOfField } from '@react-three/postprocessing';

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

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

if (typeof window !== 'undefined') {
  window.goToPath = (path) => {
    window.history.pushState({}, "", path);
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };
}

function Scene({ shouldPlayContactIntro, shouldPlayBackContact }) {
  const location = useLocation();
  const is404 = location.pathname !== "/" && location.pathname !== "/index.html" && location.pathname !== "/contact-us";

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
        console.log("🔥 Contact button clicked");
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            console.log("🔥 Closing mobile menu");
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        window.goToPath("/contact-us");
    };

    const handleHomeClick = (e) => {
        console.log("🔥 Home button clicked");
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu if clicking from mobile menu
        const mobileMenuContainer = document.querySelector('.menu-open-wrap-dopo');
        if (mobileMenuContainer && mobileMenuContainer.classList.contains('menu-open')) {
            console.log("🔥 Closing mobile menu");
            mobileMenuContainer.classList.remove('menu-open');
        }
        
        // Always navigate to root path, not index.html
        window.goToPath("/");
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

    console.log("🔧 Setting up event listeners...");
    console.log("🔧 Contact button found:", contactBtn);
    console.log("🔧 Home button found:", homeBtn);
    console.log("🔧 Mobile contact button found:", mobileContactBtn);
    console.log("🔧 Mobile home button found:", mobileHomeBtn);
    console.log("🔧 Final mobile home button found:", finalMobileHomeBtn);
    console.log("🔧 Footer contact button found:", footerContactBtn);
    console.log("🔧 Footer home button found:", footerHomeBtn);
    console.log("🔧 Footer logo button found:", footerLogoBtn);
    console.log("🔧 Final footer home button found:", finalFooterHomeBtn);
    console.log("🔧 Footer home button alternatives:", {
        alt1: footerHomeBtnAlt1,
        alt2: footerHomeBtnAlt2,
        alt3: footerHomeBtnAlt3
    });
    console.log("🔧 Alternative mobile home buttons:", {
        alt1: mobileHomeBtnAlt1,
        alt2: mobileHomeBtnAlt2,
        alt3: mobileHomeBtnAlt3
    });

    // Contact button listeners
    if (contactBtn) {
        console.log("🔧 Attaching contact button listeners");
        
        // Test multiple event types to see what's working
        contactBtn.addEventListener("mouseenter", handleContactEnter);
        contactBtn.addEventListener("mouseleave", handleContactLeave);
        contactBtn.addEventListener("click", handleContactClick, true); // Use capture to get priority
        
        // Add additional test listeners
        contactBtn.addEventListener("mousedown", (e) => {
            console.log("🔥 Contact button MOUSEDOWN detected");
        }, true);
        
        contactBtn.addEventListener("pointerdown", (e) => {
            console.log("🔥 Contact button POINTERDOWN detected");
        }, true);
        
        console.log("🔧 Contact button setup complete");
        
    } else {
        console.warn("🔧 Contact button not found!");
    }

    // Works button listeners
    if (worksBtn) {
        worksBtn.addEventListener("mouseenter", handleWorksEnter);
        worksBtn.addEventListener("mouseleave", handleWorksLeave);
    }

    // Submit button listeners
    if (submitBtn) {
        submitBtn.addEventListener("mouseenter", handleSubmitEnter);
        submitBtn.addEventListener("mouseleave", handleSubmitLeave);
    }

    // Home button listener
    if (homeBtn) {
        console.log("🔧 Found home button:", homeBtn);
        console.log("🔧 Home button href:", homeBtn.href);
        console.log("🔧 Home button data-path:", homeBtn.getAttribute("data-path"));
        
        homeBtn.addEventListener("mouseenter", handleHomeEnter);
        homeBtn.addEventListener("mouseleave", handleHomeLeave);
        homeBtn.addEventListener("click", handleHomeClick, true); // Use capture to ensure we get it first
    } else {
        console.warn("🔧 Home button not found!");
    }

    // Logo button listener - same functionality as home button
    if (logoBtn) {
        logoBtn.addEventListener("click", handleHomeClick);
    }

    // Mobile menu button listeners
    if (mobileContactBtn) {
        console.log("🔧 Attaching mobile contact button listeners");
        mobileContactBtn.addEventListener("click", handleContactClick, true);
    } else {
        console.warn("🔧 Mobile contact button not found!");
    }

    if (finalMobileHomeBtn) {
        console.log("🔧 Attaching mobile home button listeners to:", finalMobileHomeBtn);
        finalMobileHomeBtn.addEventListener("click", handleHomeClick, true);
    } else {
        console.warn("🔧 Mobile home button not found with any selector!");
    }

    // Footer button listeners
    if (footerContactBtn) {
        console.log("🔧 Attaching footer contact button listeners");
        footerContactBtn.addEventListener("click", handleContactClick, true);
    }

    if (finalFooterHomeBtn) {
        console.log("🔧 Attaching footer home button listeners to:", finalFooterHomeBtn);
        console.log("🔧 Footer home button href:", finalFooterHomeBtn.href);
        console.log("🔧 Footer home button data-path:", finalFooterHomeBtn.getAttribute("data-path"));
        finalFooterHomeBtn.addEventListener("click", handleHomeClick, true);
        
        // Test click detection
        finalFooterHomeBtn.addEventListener("mousedown", (e) => {
            console.log("🔥 Footer home button MOUSEDOWN detected");
        }, true);
        
        // Test if button is clickable
        const rect = finalFooterHomeBtn.getBoundingClientRect();
        const styles = getComputedStyle(finalFooterHomeBtn);
        console.log("🔧 Footer home button clickability:", {
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
            display: styles.display,
            visibility: styles.visibility,
            pointerEvents: styles.pointerEvents,
            visible: rect.width > 0 && rect.height > 0
        });
    } else {
        console.warn("🔧 Footer home button not found with any selector!");
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
    setTimeout(setupEventListeners, 100);
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
  const location = useLocation();
  const navigate = useNavigate();
  const prevPath = useRef(location.pathname);
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const isAnimating = useRef(false);
  const is404 = location.pathname !== "/" && location.pathname !== "/index.html" && location.pathname !== "/contact-us";
  const hasInitialized = useRef(false);
  
  console.log("🔄 PageContent render - location.pathname:", location.pathname);
  console.log("🔄 PageContent state - shouldPlayContactIntro:", shouldPlayContactIntro, "shouldPlayBackContact:", shouldPlayBackContact);

  // WEBFLOW INTEGRATION FIX: Ensure contact container exists and is ready for animations
  useEffect(() => {
    if (location.pathname === "/contact-us") {
      const prepareContactContainer = () => {
        const contactContainer = document.querySelector(".container.contact");
        if (contactContainer) {
          console.log("🎨 WEBFLOW: Preparing contact container for animation");
          
          // Only ensure basic visibility and display, let animations handle opacity
          contactContainer.style.visibility = "visible";
          contactContainer.style.display = "flex";
          
          // Don't force opacity - let the animation system handle it
          // Only force opacity as emergency fallback after animations should have completed
          setTimeout(() => {
            const currentOpacity = contactContainer.style.opacity || window.getComputedStyle(contactContainer).opacity;
            if (currentOpacity === "0" || currentOpacity === "" || currentOpacity === "0px") {
              console.log("🚨 EMERGENCY: Animation didn't work, forcing visibility");
              contactContainer.style.opacity = "1";
              if (window.gsap) {
                window.gsap.set(contactContainer, { opacity: 1 });
              }
            }
          }, 1200); // After intro animation should complete
          
        } else {
          console.warn("🚨 WEBFLOW: Contact container not found in DOM");
        }
      };
      
      // Prepare container when found
      setTimeout(prepareContactContainer, 100);
      setTimeout(prepareContactContainer, 300);
    }
  });

  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = location.pathname === "/" || location.pathname === "/index.html";
    const showContact = location.pathname === "/contact-us";
    
    console.log("🎨 Container visibility logic - showHome:", showHome, "showContact:", showContact);
    console.log("🎨 Current pathname:", location.pathname);
    console.log("🎨 Found containers - home:", !!homeContainer, "contact:", !!contactContainer);
    
    if (contactContainer) {
      console.log("🎨 Contact container current styles:", {
        opacity: gsap.getProperty(contactContainer, "opacity"),
        visibility: gsap.getProperty(contactContainer, "visibility"),
        display: gsap.getProperty(contactContainer, "display")
      });
    }

    // Don't run animations for 404 page
    if (is404) return;

    // WEBFLOW SMART FIX: Prepare container for animation, don't override opacity immediately
    if (showContact && contactContainer) {
      console.log("🎨 WEBFLOW: Preparing contact container for smooth animation");
      
      // Ensure basic structure is ready, but let animations handle opacity
      contactContainer.style.visibility = "visible";
      contactContainer.style.display = "flex";
      
      // Don't immediately force opacity - let the timeline animation handle it
      // Only clear any conflicting transforms that might prevent animation
      if (window.gsap) {
        gsap.set(contactContainer, { 
          visibility: "visible",
          display: "flex",
          // Don't set opacity here - let the timeline handle it
          clearProps: "transform" // Clear any conflicting transforms
        });
      }
    }

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

    // Gentle safety mechanism: ensure contact container becomes visible if animation fails
    // This preserves the intro animation while providing fallback
    if (showContact && contactContainer) {
      // Only check after the intro animation should have completed
      setTimeout(() => {
        const currentOpacity = gsap.getProperty(contactContainer, "opacity");
        console.log("🔍 Animation completion check: Contact container opacity is", currentOpacity);
        
        // Only intervene if opacity is still 0 after animation time
        if (currentOpacity === 0 || currentOpacity === "0") {
          console.log("🚨 Gentle fallback: Animation didn't complete, smoothly fading in");
          
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
  }, [location, is404]);

  // Handle animation triggers
  useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;
    const isExternalNav = sessionStorage.getItem('isExternalNavigation');
    
    console.log("🎯 Animation trigger useEffect - from:", from, "to:", to, "hasInitialized:", hasInitialized.current, "isExternalNav:", isExternalNav);

    // Clear external navigation flag after checking it
    if (isExternalNav) {
      sessionStorage.removeItem('isExternalNavigation');
    }

    // On first initialization, set the previous path properly
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      console.log("🎯 First initialization - current path:", to);
      // If we're landing directly on contact page (from external navigation)
      if (to === "/contact-us") {
        console.log("Initial load on contact page - triggering intro animation");
        console.log("Animation states - shouldPlayContactIntro: true, shouldPlayBackContact: false");
        isAnimating.current = true;
        setShouldPlayContactIntro(true);
        setShouldPlayBackContact(false);
        setTimeout(() => {
          isAnimating.current = false;
        }, 1000);
        prevPath.current = to;
        return;
      }
    }

    if (isAnimating.current || is404) {
      return;
    }

        if (to === "/contact-us" && (from !== "/contact-us" || isExternalNav)) {
      // Trigger contact intro animation when going TO contact from anywhere else (including external pages)
      console.log("✅ Setting Contact Intro animation from:", from || "external/unknown page", "isExternalNav:", isExternalNav);
      console.log("✅ Animation states - shouldPlayContactIntro: true, shouldPlayBackContact: false");
      isAnimating.current = true;
      setShouldPlayContactIntro(true);
      setShouldPlayBackContact(false);
      setTimeout(() => {
isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else if (from === "/contact-us" && (to === "/" || to === "/index.html")) {
      console.log("✅ Setting Back Contact animation from:", from, "to:", to);
      console.log("✅ Animation states - shouldPlayContactIntro: false, shouldPlayBackContact: true");
      isAnimating.current = true;
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else {
      console.log("❌ No animation triggered - from:", from, "to:", to);
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(false);
    }

    prevPath.current = to;
  }, [location, is404]);

  return <Scene 
    shouldPlayContactIntro={shouldPlayContactIntro}
    shouldPlayBackContact={shouldPlayBackContact}
  />;
}

function AppContent() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.goToPath = (path) => {
      console.log("🚀 window.goToPath called with:", path);
      navigate(path);
    };

    // Redirect /index.html to / for consistency
    if (window.location.pathname === '/index.html') {
      console.log("🔀 Redirecting from /index.html to /");
      navigate('/', { replace: true });
      return;
    }

    // Check for intended route from sessionStorage (for navigation from standalone pages)
    const intendedRoute = sessionStorage.getItem('intendedRoute');
    if (intendedRoute) {
      console.log("📱 Found intended route from sessionStorage:", intendedRoute);
      sessionStorage.removeItem('intendedRoute');
      
      // Mark that this is an external navigation for the animation logic
      sessionStorage.setItem('isExternalNavigation', 'true');
      
      // For Webflow integration, we need to ensure containers exist before navigating
      const waitForWebflowContainers = () => {
        const contactContainer = document.querySelector('.container.contact');
        const homeContainer = document.querySelector('.container.home');
        
        if (contactContainer && homeContainer) {
          console.log("📱 Webflow containers found, navigating to intended route:", intendedRoute);
          window.goToPath(intendedRoute);
        } else {
          console.log("📱 Waiting for Webflow containers to load...");
          setTimeout(waitForWebflowContainers, 100);
        }
      };
      
      // Small delay to ensure Webflow has loaded, then check for containers
      setTimeout(waitForWebflowContainers, 300);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="*" element={<PageContent />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;