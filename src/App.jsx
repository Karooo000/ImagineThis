import { Canvas, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment, OrbitControls} from "@react-three/drei";
import { EffectComposer, Bloom, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';

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
     <Canvas shadows>
        <Environment files='src/assets/hospital_room_2_1k.hdr' environmentIntensity={0.35}  />

        <CameraLayerSetup />
        
        <Suspense fallback={null}>
        <group>
          <Model/>
        </group>
       </Suspense>

       <EffectComposer multisampling={4}>
          <Bloom
            mipmapBlur
            intensity={1.75}
            luminanceThreshold={0.3} // Lower so emissive mesh glows
            luminanceSmoothing={0.99}
            height={300}
            radius={0.45}
          />
          <HueSaturation saturation={0.45} />{/* increase saturation (0 default, positive >1 higher) */}
          <BrightnessContrast
            //brightness={0.15} // brightness. min: -1, max: 1
            contrast={0.15} // contrast: min -1, max: 1
          />
          
        </EffectComposer>
      </Canvas>
    </>

  );
}

export default App;