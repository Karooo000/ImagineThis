import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment, OrbitControls, Sparkles} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, DepthOfField } from '@react-three/postprocessing';

import Model from "./NeuralFractal.jsx"

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


function App() {

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



  return (
    <>
     <Canvas shadows >
  
        <Environment files='src/assets/hospital_room_2_1k.hdr' environmentIntensity={0.005}/>

        <CameraLayerSetup />
        <Suspense fallback={null}>

        <group>
          <Model focusRef={focusRef}/>

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
          <HueSaturation saturation={0.55} />
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

export default App;