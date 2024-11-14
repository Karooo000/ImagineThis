import React, { useRef, useEffect, useLayoutEffect, useState,  } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);


export default function Model(props) {
    const group = useRef()
    const mmm = useRef()
    const tlDesk = useRef()

    const { nodes, materials, animations } = useGLTF('http://localhost:5173/src/assets//OakleyV6.glb')
    const { actions } = useAnimations(animations, group)

    useGSAP(() => {

        /* Scroll animation STARTS */
        let whichAnimLenghtDesk = 240;
        let whichDurationDesk = 10;
    
    
        //const clipMob = actions.MobAnim;
        const clipDesktop = actions.CameraDesk;

        console.log(actions.CameraDesk)
    
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
              markers: true
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
        /* Scroll animation FINISHES */
        return (
            <group ref={group} {...props} dispose={null}>
              <group name="Scene">
                <group name="Armature001" position={[0, -0.028, -0.082]} scale={0.559}>
                  <primitive object={nodes.Bone} />
                </group>
                <mesh
                  name="Helmet"
                  castShadow
                  receiveShadow
                  geometry={nodes.Helmet.geometry}
                  material={materials.HelmetMaterial}
                  position={[0, -0.013, 95.768]}
                  rotation={[-2.743, 0, Math.PI]}
                  scale={0.002}
                />
                <mesh
                  name="BézierCircle001"
                  castShadow
                  receiveShadow
                  geometry={nodes.BézierCircle001.geometry}
                  material={nodes.BézierCircle001.material}
                  position={[0.003, -0.145, 0.01]}
                  rotation={[0.101, 0, 0]}
                  scale={0.108}>
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
                  name="Plane-BlackMaterial"
                  castShadow
                  receiveShadow
                  geometry={nodes['Plane-BlackMaterial'].geometry}
                  material={materials['Black glasses']}
                  position={[-1.962, 0.013, -0.027]}
                  scale={0.004}
                />
                <mesh
                  name="Plane-RedMaterial"
                  castShadow
                  receiveShadow
                  geometry={nodes['Plane-RedMaterial'].geometry}
                  material={materials['Red Glasses']}
                  position={[-1.972, 0.013, -0.027]}
                  scale={0.004}
                />
                <mesh
                  name="Plane-YellowMaterial"
                  castShadow
                  receiveShadow
                  geometry={nodes['Plane-YellowMaterial'].geometry}
                  material={materials['Yellow Glasses']}
                  position={[-1.95, 0.013, -0.027]}
                  scale={0.004}
                />
                <group
                  name="CameraRig"
                  position={[0, 0.05, 0]}
                  rotation={[1.423, -0.001, -3.14]}
                  scale={0.073}>
                  <PerspectiveCamera
                    name="Camera"
                    makeDefault={true}
                    far={1000}
                    near={0.1}
                    fov={22.895}
                    position={[0, 6.441, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={2.368}
                  />
                </group>
                <mesh
                  name="Glass"
                  castShadow
                  receiveShadow
                  geometry={nodes.Glass.geometry}
                  material={materials['Blue Glasses']}
                  scale={[0.104, 0.085, 0.085]}
                />
              </group>
            </group>
          )
        }
  
  useGLTF.preload('http://localhost:5173/src/assets/OakleyV6.glb')
