import { Canvas, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment, OrbitControls, Sparkles} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, Selection, SelectiveBloom, } from '@react-three/postprocessing';

import Model from "./NeuralFractal.jsx"


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

//https://glassescode.netlify.app/hospital_room_2_1k.hdr

//<ambientLight intensity={0.1}/>



//<OrbitControls />

  return (
    <>
     <Canvas shadows >
  
        <Environment files='src/assets/hospital_room_2_1k.hdr' environmentIntensity={0.15}  />

        <CameraLayerSetup />
        <ambientLight intensity={0.05}/>
        
        <Suspense fallback={null}>
        <group>
          <Model/>

          <Sparkles count={30} color="#34ebe8" scale={[1.15, 1.15, 1.15]}  position={[0, 1, 0]} noise={40} speed={0.1} />
          <Sparkles count={30} color="#365f9c" scale={[1.15, 1.15, 1.15]} position={[0, 1, 0]} noise={40} speed={0.1} />
          <Sparkles count={30} color="#f7f389" scale={[1.15, 1.15, 1.15]} position={[0, 1, 0]} noise={40} speed={0.1} />
          <Sparkles count={30} color="#ffffff" scale={[1.15, 1.15, 1.15]} position={[0, 1, 0]} noise={40} speed={0.1} />

        {/*   <Sparkles position={[0, 1, 0]}
            count={55}                // number of sparkles
            scale={[1.15, 1.15, 1.15]}          // area they cover
            size={2}                   // pixel size
            speed={0.1}                // animation speed
            noise={40}                  // jitter
            //color="#c7eded"            // glow color
            color="#1c5252"  
          /> */}
        </group>
       </Suspense>

       <EffectComposer multisampling={4}>
          <Bloom
            mipmapBlur
            intensity={1.5}              // Adjust to your taste
            luminanceThreshold={1.0}     // Only bloom > 1.0 colors
            luminanceSmoothing={0.0}
            radius={0.1}
          />
          <HueSaturation saturation={0.55} />
        </EffectComposer>

        
      </Canvas>
    </>

  );
}

export default App;