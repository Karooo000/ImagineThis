import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useWindowSize() {
    //console.log("custom hook fired")
    let isMobileSize = window.innerWidth < 1280

  
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      mobCameraTrue: undefined,
      deskCameraTrue: undefined
    });
    

    useEffect(() => {
        console.log("useffect fired")
        ScrollTrigger.refresh()
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          mobCameraTrue: isMobileSize ? true : false,
          deskCameraTrue: isMobileSize ? false : true
        });

    
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, [isMobileSize]);
    return windowSize ;
  }