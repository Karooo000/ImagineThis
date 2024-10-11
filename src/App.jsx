import { Canvas } from "@react-three/fiber";
import Model from "/src/PowerBank.jsx";
import React, { useState, useEffect, useRef } from "react";

import { ContactShadows,  useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import CustomLoader from "./CustomLoader";








function App() {


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
  /*

  <Canvas key={`${windowSize.width}-${windowSize.height}`}
  style={{ width: "100%", height: "100%" }}>
    */

  //console.log(windowSize.width-windowSize.height)

  //console.log(isMobileSize)


  return (
    <>
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
    </>

  );
}

export default App;