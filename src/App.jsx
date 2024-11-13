import { Canvas } from "@react-three/fiber";
//import Model from "/src/PowerBank.jsx";
import React, { useState, useEffect, useRef } from "react";

import { ContactShadows,  useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import Preloader from "./Preloader";

//import CustomLoader from "./CustomLoader";


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

//custom cursor

/*
const cursor = document.getElementById("cursor")
const moveCursor = (event) => {
  const y = event.pageY
  const x = event.pageX
  const scrollLeft = window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft
  const scrollTop = window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop

  cursor.style.left = x - scrollLeft + "px"
  cursor.style.top = y - scrollTop + "px"
}

document.addEventListener("mousemove", moveCursor)
*/


const ball = document.getElementById("cursor");
const ballSmall = document.getElementById("cursorSmall");

let mouseX = 0;
let mouseY = 0;

let mouseXSmall = 0;
let mouseYSmall = 0;

let ballX = 0;
let ballY = 0;

let ballXSmall = 0;
let ballYSmall = 0;

let speed = 0.1;
let speedSmall = 0.3;


function animate(){
  
  let distX = mouseX - ballX;
  let distY = mouseY - ballY;

  let distXSmall = mouseXSmall - ballXSmall;
  let distYSmall = mouseYSmall - ballYSmall;
  
  
  ballX = ballX + (distX * speed);
  ballY = ballY + (distY * speed);

    
  ballXSmall = ballXSmall + (distXSmall * speedSmall);
  ballYSmall = ballYSmall + (distYSmall * speedSmall);


 
  
  requestAnimationFrame(animate);
}
animate();

document.addEventListener("mousemove", function(event){


  //pageX, pageY
  mouseX = event.pageX;
  mouseY = event.pageY;

  mouseXSmall = event.pageX;
  mouseYSmall = event.pageY;

  const scrollLeft = window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft
  const scrollTop = window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop

  const scrollLeftSmall = window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft
  const scrollTopSmall = window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop

  
  
  //cursor.style.left = x - scrollLeft + "px"
  //cursor.style.top = y - scrollTop + "px"

  ball.style.left = ballX - scrollLeft + "px";
  ball.style.top = ballY - scrollTop + "px";

  ballSmall.style.left = ballXSmall - scrollLeftSmall + "px";
  ballSmall.style.top = ballYSmall - scrollTopSmall + "px";
})


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