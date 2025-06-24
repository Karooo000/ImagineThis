import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react"

import {useProgress, Environment, OrbitControls, Sparkles, PerspectiveCamera} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, DepthOfField } from '@react-three/postprocessing';

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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
  const is404 = location.pathname !== "/" && location.pathname !== "/contact-us";

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
        window.goToPath("/contact-us");
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.goToPath("/");
    };

    /* ===== EVENT LISTENERS ===== */
    const contactBtn = document.querySelector(".contactus-btn");
    const worksBtn = document.querySelector(".works-btn");
    const submitBtn = document.querySelector(".submit-button");
    const homeBtn = document.querySelector(".home-btn");
    const logoBtn = document.querySelector(".logo-btn");  // Add logo button selector

    // Contact button listeners
    if (contactBtn) {
        contactBtn.addEventListener("mouseenter", handleContactEnter);
        contactBtn.addEventListener("mouseleave", handleContactLeave);
        contactBtn.addEventListener("click", handleContactClick);
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
        homeBtn.addEventListener("mouseenter", handleHomeEnter);
        homeBtn.addEventListener("mouseleave", handleHomeLeave);
        homeBtn.addEventListener("click", handleHomeClick);
    }

    // Logo button listener - same functionality as home button
    if (logoBtn) {
        logoBtn.addEventListener("click", handleHomeClick);
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
    };
    /* ===== BUTTON HOVER EFFECTS END ===== */
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
  const prevPath = useRef(location.pathname);
  const [shouldPlayContactIntro, setShouldPlayContactIntro] = useState(false);
  const [shouldPlayBackContact, setShouldPlayBackContact] = useState(false);
  const isAnimating = useRef(false);
  const is404 = location.pathname !== "/" && location.pathname !== "/contact-us";

  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = location.pathname === "/";
    const showContact = location.pathname === "/contact-us";

    // Don't run animations for 404 page
    if (is404) return;

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
  }, [location, is404]);

  // Handle animation triggers
  useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;

    if (isAnimating.current || is404) {
      return;
    }

    if (from === "/" && to === "/contact-us") {
      console.log("Setting Contact Intro animation");
      isAnimating.current = true;
      setShouldPlayContactIntro(true);
      setShouldPlayBackContact(false);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else if (from === "/contact-us" && to === "/") {
      console.log("Setting Back Contact animation");
      isAnimating.current = true;
      setShouldPlayContactIntro(false);
      setShouldPlayBackContact(true);
      setTimeout(() => {
        isAnimating.current = false;
      }, 1000); // Adjust timeout based on your animation duration
    } else {
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

export function App() {
  useEffect(() => {
    window.goToPath = (path) => {
      window.history.pushState({}, "", path);
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PageContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;