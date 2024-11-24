import { Canvas, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment, SoftShadows, View} from "@react-three/drei";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";

import Model from "/src/Oakley.jsx"

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import Preloader from "./Preloader";


gsap.registerPlugin(ScrollTrigger);





function App() {

 


  Preloader()

  //pics
  let tlPics = gsap.timeline({
    scrollTrigger: {
      trigger: "#pics",
      start: "top 80%",
      end: "bottom top",
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity < 0) return;
        const timeScale = 3 + velocity / 400;
        gsap.timeline().to(tlPics, { duration: 0.1, timeScale }).to(tlPics, { duration: 1.5, timeScale: 1 });
      },
    },
  });

  tlPics.to("#upperpics", {
    duration: 30,
    ease: "none",
    x: `-50%`,
    repeat: -1,
  });

  let tlPics2 = gsap.timeline({
    scrollTrigger: {
      trigger: "#pics",
      start: "top 80%",
      end: "bottom top",
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity < 0) return;
        const timeScale = 3 + velocity / 400;
        gsap.timeline().to(tlPics2, { duration: 0.1, timeScale }).to(tlPics2, { duration: 1.5, timeScale: 1 });
      },
    },
  });

  tlPics2.to("#lowerpics", {
    duration: 30,
    ease: "none",
    x: `50%`,
    repeat: -1,
  });

  let tlPics3 = gsap.timeline({
    scrollTrigger: {
      trigger: "#pics",
      start: "top 80%",
      end: "bottom top",
      onUpdate(self) {
        const velocity = self.getVelocity();
        if (velocity < 0) return;
        const timeScale = 3 + velocity / 400;
        gsap.timeline().to(tlPics3, { duration: 0.1, timeScale }).to(tlPics3, { duration: 1.5, timeScale: 1 });
      },
    },
  });

  tlPics3.to("#bottompics", {
    duration: 30,
    ease: "none",
    x: `-50%`,
    repeat: -1,
  });

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

    //CTA btn A animation

    let ctaBtnText = new SplitType(".cta-text.a", {
      types: "words, chars",
      tagName: "span",
    });

let ctaBtn = document.querySelector(".cta-btn.a");


let ctaBtnAnim = gsap.to(ctaBtnText.chars, {
  paused: true,
  yPercent: -100,
  stagger: {
    each: 0.02,
  },
});

ctaBtn.addEventListener("mouseenter", () =>
  ctaBtnAnim.play(),
);
ctaBtn.addEventListener("mouseleave", () =>
  ctaBtnAnim.reverse(),
);


    //CTA btn B animation

    let ctaBtnTextB = new SplitType(".cta-text.b", {
      types: "words, chars",
      tagName: "span",
    });

let ctaBtnB = document.querySelector(".cta-btn.b");


let ctaBtnAnimB = gsap.to(ctaBtnTextB.chars, {
  paused: true,
  yPercent: -100,
  stagger: {
    each: 0.02,
  },
});

ctaBtnB.addEventListener("mouseenter", () =>
  ctaBtnAnimB.play(),
);
ctaBtnB.addEventListener("mouseleave", () =>
  ctaBtnAnimB.reverse(),
);


    //CTA btn Footer animation

    let ctaBtnTextFooter = new SplitType(".cta-text.footer", {
      types: "words, chars",
      tagName: "span",
    });

let ctaBtnFooter = document.querySelector(".cta-btn.footer");


let ctaBtnAnimFooter = gsap.to(ctaBtnTextFooter.chars, {
  paused: true,
  yPercent: -100,
  stagger: {
    each: 0.02,
  },
});

ctaBtnFooter.addEventListener("mouseenter", () =>
  ctaBtnAnimFooter.play(),
);
ctaBtnFooter.addEventListener("mouseleave", () =>
  ctaBtnAnimFooter.reverse(),
);

let isMobileSize = window.innerWidth < 991


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

///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/kloofendal_48d_partly_cloudy_puresky_1k.hdr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/quarry_04_puresky_1k.hdr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/skidpan_1k.exr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/skidpan_1kPhotoshopped.hdr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/Less-exporu.hdr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/less-expov2.hdr
///Users/karolinbraun/Documents/GitHub/Oakley/src/assets/more-expo.hdr


  return (
    <>
     <Canvas key={isMobileSize ? 'mobile' : 'desktop'}
  style={{ width: "100%", height: "100%" }} shadows dpr={[1, 2]}>
        <Environment files='http://localhost:5173/src/assets/skidpan_1k.exr' environmentIntensity={0.1}  />
        <ambientLight intensity={0.15}/>
        <Suspense fallback={null}>
          <group>
            <Model/>
          </group>
       </Suspense>
      </Canvas>
    </>

  );
}

export default App;