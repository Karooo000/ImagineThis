import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react"

import {useProgress, Environment, OrbitControls, Sparkles} from "@react-three/drei";
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
    /* Button hover effects START*/
  const worksText = new SplitType(".works-text", {
    types: "words, chars",
    tagName: "span",
  });

  const contactText = new SplitType(".contactus-text", {
    types: "words, chars",
    tagName: "span",
  });

  const worksAnim = gsap.to(worksText.chars, {
    paused: true,
    yPercent: -100,
    stagger: 0.03,
  });

  const contactAnim = gsap.to(contactText.chars, {
    paused: true,
    yPercent: -100,
    stagger: 0.03,
  });

  const handleEnter = () => contactAnim.play();
  const handleLeave = () => contactAnim.reverse();
  /* Button hover effects END*/

    /* React Router Starts*/

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

  const contactBtn = document.querySelector(".contactus-btn");
  const homeBtn = document.querySelector(".logo-btn");

  if (contactBtn) {
    /** Hover stuff */
    contactBtn.addEventListener("mouseenter", handleEnter);
    contactBtn.addEventListener("mouseleave", handleLeave);
    /** Router stuff */
    contactBtn.addEventListener("click", handleContactClick);
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", handleHomeClick);
  }

  // 🧼 CLEANUP:
  return () => {
    if (contactBtn) {
      /** Hover stuff */
      contactBtn.removeEventListener("mouseenter", handleEnter);
      contactBtn.removeEventListener("mouseleave", handleLeave);
      /** Router stuff */
      contactBtn.removeEventListener("click", handleContactClick);
    }
    if (homeBtn) {
      homeBtn.removeEventListener("click", handleHomeClick);
    }
  };
  /* React Router Ends*/
}, []);






  return (
    <>
     <Canvas shadows >
  
        <Environment files='https://imaginethiscode.netlify.app/hospital_room_2_1k.hdr' environmentIntensity={0.005}/>

        <CameraLayerSetup />
        <Suspense fallback={null}>

        <group>
          <Model 
            focusRef={focusRef} 
            shouldPlayContactIntro={shouldPlayContactIntro}
            shouldPlayBackContact={shouldPlayBackContact}
          />

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
          <DepthOfField
            focalLength={1.6}    // Try larger, e.g. 0.5, 1.0
            bokehScale={50}      // Increase for bigger blur shapes
            focusDistance={0.5}  // You can experiment with this (distance from camera)
            target={focusRef.current}
            layers={[0, 1]}  
          />
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

  // Handle fade between home and contact containers
  useEffect(() => {
    const homeContainer = document.querySelector(".container.home");
    const contactContainer = document.querySelector(".container.contact");

    const showHome = location.pathname === "/";
    const showContact = location.pathname === "/contact-us";

    const tl = gsap.timeline();

    if (showHome && contactContainer && homeContainer) {
      tl.to(contactContainer, {
        autoAlpha: 0,
        duration: 0.4,
        onComplete: () => gsap.set(contactContainer, { display: "none" }),
      })
        .set(homeContainer, { display: "flex" })
        .to(homeContainer, { autoAlpha: 1, duration: 0.6 });
    }

    if (showContact && homeContainer && contactContainer) {
      tl.to(homeContainer, {
        autoAlpha: 0,
        duration: 0.4,
        onComplete: () => gsap.set(homeContainer, { display: "none" }),
      })
        .set(contactContainer, { display: "flex" })
        .to(contactContainer, { autoAlpha: 1, duration: 0.6 });
    }
  }, [location]);

  // Handle animation triggers
  useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;

    console.log("Navigation:", { from, to });

    if (isAnimating.current) {
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
  }, [location]);

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