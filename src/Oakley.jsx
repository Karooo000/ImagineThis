import React, { useRef, useEffect, useLayoutEffect, useState,  } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useThree, useFrame } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

let filename = "http://localhost:5173/src/assets/OakleyAnimV1.glb"

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


export default function Model(props) {
    const group = useRef()
    const mmm = useRef()
    const tlDesk = useRef()
    const wholeModel = useRef()

    const { nodes, materials, animations, scene } = useGLTF(filename)
    const { actions } = useAnimations(animations, group)

    

    
   


    useGSAP(() => {

        /* Scroll animation STARTS */
        let whichAnimLenghtDesk = 240;
        let whichDurationDesk = 10;
    
    
        //const clipMob = actions.MobAnim;
        const clipDesktop = actions.CameraDesk;

        //console.log(actions.CameraDesk)
    
        //const animationDurationMob = clipMob._clip.duration;
        const animationDurationDesk = clipDesktop._clip.duration;
    
        //const frameMob = animationDurationMob / whichAnimLenghtMob;
        const frameDesk = animationDurationDesk / whichAnimLenghtDesk;

        // if it runs until the last frame, it will restart from frame 1, didn't find a solution for this yet.
        //const maxMob = animationDurationMob - frameMob;
        const maxDesk = animationDurationDesk - frameDesk;
    
        mmm.current = gsap.matchMedia();
    
        mmm.current.add("(min-width: 1280px)", () => {
          
          clipDesktop.play();
          //console.log("desktop clip plays")
    
          const mixerDesk = clipDesktop.getMixer();
          const proxyDesk = {
            get time() {
              return mixerDesk.time;
            },
            set time(value) {
              clipDesktop.paused = false;
              mixerDesk.setTime(value);
              clipDesktop.paused = true;
            },
          };
    
          // for some reason must be set to 0 otherwise the clip will not be properly paused.
          proxyDesk.time = 0;
    
          tlDesk.current = gsap.timeline({
            ease: "none",
            //immediateRender: false,
            scrollTrigger: {
              trigger: "#section2",
              start: "top bottom",
              end: "bottom bottom",
              endTrigger: "#scroll-contain",
              scrub: 1,
              toggleActions: "restart restart reverse reverse",
            },
          });
          tlDesk.current.set(proxyDesk, { time: 0 });
    
          tlDesk.current.to(
            proxyDesk,
    
            {
              time: 4.9999,
              ease: "none",
              duration: whichDurationDesk,
            }
          );
 
        });
    
        /*
        mmm.current.add("(max-width: 1279px)", () => {
          
          clipMob.play();
          //console.log("mob clip plays")
    
          const mixerMob = clipMob.getMixer();
          const proxyMob = {
            get time() {
              return mixerMob.time;
            },
            set time(value) {
              clipMob.paused = false;
              mixerMob.setTime(value);
              clipMob.paused = true;
             // clipDesktop.paused=true
            },
          };
    
          // for some reason must be set to 0 otherwise the clip will not be properly paused.
          proxyMob.time = 0;
    
          tlMob.current = gsap.timeline({
            ease: "none",
            //immediateRender: false,
            scrollTrigger: {
              trigger: "#section-2",
              start: "top bottom",
              end: "bottom bottom",
              endTrigger: "#section-6",
              scrub: 1,
              toggleActions: "restart restart reverse reverse",
            },
          });
          tlMob.current.set(proxyMob, { time: 0 });
    
          tlMob.current.to(
            proxyMob,
    
            {
              time: maxMob,
              ease: "none",
              duration: whichDurationMob,
            }
          );
    
          /*
          return () => { // optional
            tlMob.current.kill()
          };
          *//*
        });
        */
    })


    //Camera moves on mousemove
    const pointer = useRef({ x: 0, y: 0 });
    useEffect(() => {
      // Listen for mouse move events on the document
      document.addEventListener("mousemove", handleMouseMove);
  
      // Remove the event listener when the component unmounts
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);
  
    const handleMouseMove = event => {
      const canvas = document.getElementById("root");
      const canvasRect = canvas.getBoundingClientRect();
  
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;
  
      // Calculate the mouse position relative to the canvas
      pointer.current = {
        x: (mouseX / canvasRect.width) * 2 - 1,
        y: -(mouseY / canvasRect.height) * 2 + 1,
      };
    };
  
    useFrame(() => {
        /*
      gsap.to(wholeModel.current.position, {
        y: pointer.current.y / 0.001 + 0.0005,
        ease: "power1.easeOut",
      });*/
     
      gsap.to(wholeModel.current.rotation, {
        x: pointer.current.y / 50 ,
        ease: "power1.easeOut",
      });
      
      gsap.to(wholeModel.current.rotation, {
        y: pointer.current.x / 50 ,
        ease: "power1.easeOut",
      });
        
    });
  



        /* Scroll animation FINISHES */
    

        return (
            <group ref={group} {...props} dispose={null}>
              <group name="Scene">
                <group name="Armature001" ref={wholeModel} position={[0, -0.028, -0.082]} scale={0.559}>
                  <mesh
                    name="BézierCircle001"
                    castShadow
                    receiveShadow
                    geometry={nodes.BézierCircle001.geometry}
                    material={nodes.BézierCircle001.material}
                    position={[0.006, -0.209, 0.165]}
                    rotation={[0.101, 0, 0]}
                    scale={0.193}>
                    <mesh
                      name="BézierCircle"
                      castShadow
                      receiveShadow
                      geometry={nodes.BézierCircle.geometry}
                      material={nodes.BézierCircle.material}
                      position={[0, 0.103, -0.017]}
                    />
                  </mesh>
                  <mesh
                    name="Glass"
                    castShadow
                    receiveShadow
                    geometry={nodes.Glass.geometry}
                    material={materials['Blue Glasses']}
                    position={[0.001, 0.05, 0.147]}
                    scale={[0.186, 0.151, 0.151]}
                  />
                  <group name="GlassTester" position={[0.001, 0.05, 0.147]} scale={[0.186, 0.151, 0.151]}>
                    <mesh
                      name="mesh001"
                      castShadow
                      receiveShadow
                      geometry={nodes.mesh001.geometry}
                      material={materials.colGlass}
                    />
                    <mesh
                      name="mesh001_1"
                      castShadow
                      receiveShadow
                      geometry={nodes.mesh001_1.geometry}
                      material={materials['Black glass']}
                    />
                  </group>
                  <mesh
                    name="Helmet"
                    castShadow
                    receiveShadow
                    geometry={nodes.Helmet.geometry}
                    material={materials.HelmetMaterial}
                    position={[0.001, 0.027, 171.515]}
                    rotation={[-2.743, 0, Math.PI]}
                    scale={0.003}
                  />
                  <primitive object={nodes.Bone} />
                </group>
                <group
                  name="CameraRig"
                  position={[0, 0.058, 0]}
                  rotation={[1.276, -0.001, -3.14]}
                  scale={0.073}>
                  <PerspectiveCamera
                    name="Camera"
                    makeDefault={true}
                    far={1000}
                    near={0.1}
                    fov={fovNew}
                    position={[0, 6.441, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={2.368}
                  />
                </group>
                <directionalLight
                  name="Sun"
                  intensity={0.683}
                  decay={2}
                  position={[-0.002, 0.083, -0.036]}
                  rotation={[-Math.PI / 2, 0, 0]}>
                  <group position={[0, 0, -1]} />
                </directionalLight>
                <pointLight
                  name="Point"
                  intensity={0.243514}
                  decay={2}
                  position={[0, -0.042, 0.015]}
                  rotation={[-Math.PI / 2, 0, 0]}
                />
              </group>
            </group>
          )
        }
        
  
  useGLTF.preload(filename)
