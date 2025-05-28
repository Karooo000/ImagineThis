import { Canvas } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense } from "react";

import {useProgress, Environment} from "@react-three/drei";




function App() {

//https://glassescode.netlify.app/hospital_room_2_1k.hdr


  return (
    <>
     <Canvas shadows>
        <Environment files='src/assets/hospital_room_2_1k.hdr' environmentIntensity={0.1}  />
        <ambientLight intensity={0.15}/>
        <Suspense fallback={null}>
         <group>
           <mesh >
              <boxGeometry args={[1, 1, 1]} />
              
              <meshStandardMaterial
        color="#00aaff"
        metalness={0.5}
        roughness={0.3}
      />
            </mesh>
          </group>
       </Suspense>
      </Canvas>
    </>

  );
}

export default App;