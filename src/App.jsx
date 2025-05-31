import { Canvas, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment, OrbitControls} from "@react-three/drei";
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
     <Canvas shadows>
        <Environment files='src/assets/hospital_room_2_1k.hdr' environmentIntensity={0.15}  />

        <CameraLayerSetup />
        <ambientLight intensity={0.05}/>
        
        <Suspense fallback={null}>
        <group>
          <Model/>
        </group>
       </Suspense>

        <Selection>
          <EffectComposer multisampling={4}>
            <SelectiveBloom
              intensity={8.75}
              
              luminanceThreshold={0}
              luminanceSmoothing={0.1}
              width={3300}
              height={3300}
              radius={1.45}
            />
            <HueSaturation saturation={0.75} />
          </EffectComposer>
          </Selection>
      </Canvas>
    </>

  );
}

export default App;