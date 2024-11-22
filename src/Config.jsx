import { Canvas, useThree, useFrame } from "@react-three/fiber";
import React, { useState, useEffect, useRef, Suspense, useLayoutEffect } from "react";
import {useProgress, Environment, PresentationControls, OrbitControls, ContactShadows, PerspectiveCamera} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { ConfigModel } from "./ConfigModel";

import gsap from "gsap";


gsap.registerPlugin()

let isMobileSize = window.innerWidth < 1280
let isTabletSize = 550 < window.innerWidth && window.innerWidth < 1280

//FOV based on screensize ( responsive )

 const fovOriginal = 22.895

 const scaleFactorDesktop = window.innerWidth / 1512
 const scaleFactorTablet = window.innerWidth / 1300
 const scaleFactorDesktopMob = window.innerWidth / 991

 //desktop FOV
 let scaleCof = 1 - scaleFactorDesktop
 let fovInBetween = scaleCof * scaleCof * fovOriginal

 let fovNewClamp = fovOriginal + fovInBetween
 let fovNew = fovNewClamp > 25 ? 25 : fovNewClamp


function Config() {
  const controlsRef = useRef()
  const myCamera = useRef()


const [forceChangeX, setForceChangeX] = useState(0.000)
const [forceChangeY, setForceChangeY] = useState(0.000)
const [forceChangeZ, setForceChangeZ] = useState(0.000)
console.log(myCamera.current?.position)


let newCameraPosX = {var:0.000}
let oldCameraPosX = {var: 0.006}
let inBetweenCameraPosX

let newCameraPosY = {var:0}
let oldCameraPosY = {var: 0.069}
let inBetweenCameraPosY

let newCameraPosZ = {var: 0.000}
let oldCameraPosZ = {var: -0.373}
let inBetweenCameraPosZ




function handleEnd() {
    newCameraPosX = {var : myCamera.current.position.x}
    newCameraPosY = {var : myCamera.current.position.y}
    newCameraPosZ = {var : myCamera.current.position.z}

    setForceChangeX(c => c + 1)
    setForceChangeY(c => c + 1)
    setForceChangeZ(c => c + 1)

    if(newCameraPosX.var !== oldCameraPosX.var){
        gsap.to(newCameraPosX, { var: 0.006, ease: "none", onUpdate: changeNumber });
    } 
    if(newCameraPosY.var !== oldCameraPosY.var){
        gsap.to(newCameraPosY, { var: 0.069, ease: "none", onUpdate: changeNumber });
    } 
    if(newCameraPosZ.var !== oldCameraPosZ.var){
        gsap.to(newCameraPosZ, { var: -0.373, ease: "none", onUpdate: changeNumber });
    } 
}



function changeNumber() {
    inBetweenCameraPosX = parseFloat(newCameraPosX.var.toFixed(4));
    inBetweenCameraPosY = parseFloat(newCameraPosY.var.toFixed(4));
    inBetweenCameraPosZ = parseFloat(newCameraPosZ.var.toFixed(4));

    setForceChangeX(inBetweenCameraPosX);
    setForceChangeY(inBetweenCameraPosY);
    setForceChangeZ(inBetweenCameraPosZ);

    myCamera.current.position.x = inBetweenCameraPosX
    myCamera.current.position.y = inBetweenCameraPosY
    myCamera.current.position.z = inBetweenCameraPosZ

  }

  /**
   <PerspectiveCamera
            ref={myCamera}
            makeDefault={true}
            far={1000}
            near={0.1}
            fov={22.895}
            position={[0.006, 0.069, -0.373]}
            rotation={[-3.1, 0.007, 3.141]}
            scale={0.172}
          />
   */

//camera={{ position: [0.006, 0.069, -0.373], fov: 22.895, near:0.1, far:1000, rotation:[-3.1, 0.007, 3.141], scale:0.172 }}


  return (
    <>
     <Canvas shadows dpr={[1, 2]} >
     <PerspectiveCamera
            ref={myCamera}
            makeDefault={true}
            far={1000}
            near={0.1}
            fov={fovNew}
            position={[0.006, 0.069, -0.373]}
            rotation={[-3.1, 0.007, 3.141]}
            scale={0.172}
          />
        <Environment files='http://localhost:5173/src/assets/skidpan_1k.exr' background={false} environmentIntensity={0.1} environmentRotation={[0, Math.PI, 0]}/>
        <ambientLight intensity={0.15}/>
        <Suspense fallback={null}>
          <group>
            <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} onEnd={handleEnd}/>
            <ConfigModel />
            <ContactShadows position={[0, -0.025, 0]} opacity={0.2} scale={1} />
          </group>
       </Suspense>
      </Canvas>
    </>

  );
}

export default Config;