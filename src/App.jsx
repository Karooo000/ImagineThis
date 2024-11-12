import { Canvas } from "@react-three/fiber";
//import Model from "/src/PowerBank.jsx";
import React, { useState, useEffect, useRef } from "react";

import { ContactShadows,  useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Preloader from "./Preloader";

//import CustomLoader from "./CustomLoader";


gsap.registerPlugin(ScrollTrigger);





function App() {

  Preloader()

  //testimonials
  let tlTestimonials = gsap.timeline({
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 80%",
      end: "bottom top",
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity < 0) return;
        const timeScale = 3 + velocity / 400;
        gsap.timeline().to(tlTestimonials, { duration: 0.1, timeScale }).to(tlTestimonials, { duration: 1.5, timeScale: 1 });
      },
    },
  });

  tlTestimonials.to("#upper", {
    duration: 20,
    ease: "none",
    x: `-50%`,
    repeat: -1,
  });

  let tlTestimonials2 = gsap.timeline({
    scrollTrigger: {
      trigger: "#testimonials",
      start: "top 80%",
      end: "bottom top",
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity < 0) return;
        const timeScale = 3 + velocity / 400;
        gsap.timeline().to(tlTestimonials2, { duration: 0.1, timeScale }).to(tlTestimonials2, { duration: 1.5, timeScale: 1 });
      },
    },
  });

  tlTestimonials2.to("#lower", {
    duration: 20,
    ease: "none",
    x: `50%`,
    repeat: -1,
  });



  /*
  CustomLoader();

  let isMobileSize = window.innerWidth < 1280


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);


  }, [isMobileSize]);
  */
  /*

  <Canvas key={`${windowSize.width}-${windowSize.height}`}
  style={{ width: "100%", height: "100%" }}>
    */

  //console.log(windowSize.width-windowSize.height)

  //console.log(isMobileSize)

  /*
        <Canvas key={isMobileSize ? 'mobile' : 'desktop'}
  style={{ width: "100%", height: "100%" }}>
      
        <Model />
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={1.1}
            intensity={0.15}
            levels={3}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
  */



  return (
    <>

    </>

  );
}

export default App;