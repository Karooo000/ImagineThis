import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, SoftShadows } from "@react-three/drei";
import Glasses from "./Glasses.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Shadowssss from "./Shadowssss.jsx";
import BottomShadows from "./BottomShadows.jsx";

import { EffectComposer, Bloom } from "@react-three/postprocessing"; // Bloom effects

gsap.registerPlugin(ScrollTrigger);

export default function App(props) {
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
  // Page smooth scrolling behavior
  const lenis = new Lenis({
    lerp: 0.1,
    direction: "vertical", // vertical, horizontal
    gestureDirection: "vertical", // vertical, horizontal, both
    smooth: true,
    wheelMultiplier: 1.5,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Required for Lenis
  function raf(time) {
    lenis.raf(time);
    // Required to sync ScrollTrigger with Lenis smooth scroll.
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  */

  return (
    <Canvas shadows dpr={[1, 2]}>
      <SoftShadows samples={20} />
      <Environment files='http://localhost:5173/src/assets/skidpan_1k.exr' />
      <Shadowssss />
      <BottomShadows />
      <Suspense fallback={null}>
        <group>
          <Glasses />
        </group>
      </Suspense>
    </Canvas>
  );
}
