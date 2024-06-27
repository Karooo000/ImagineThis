import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";





gsap.registerPlugin(ScrollTrigger);

export default function PowerBank(props) {

 // IntroAnimations();
 const group = useRef();
 const { nodes, materials, animations } = useGLTF("http://localhost:5173/src/assets/dopo44.glb");

 const { ref, mixer, names, actions, clips } = useAnimations(
   animations,
   group
 );
 const { progress } = useProgress();
 const viewport = useThree((state) => state.viewport);

  // Scroll to top on reload

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }



  let isMobileSize = window.innerWidth < 1280
  let isTabletSize = 550 < window.innerWidth && window.innerWidth < 1280

  //Fov conditional

  const fovOriginal = 22.895

  const scaleFactorDesktop = window.innerWidth / 1512
  const scaleFactorTablet = window.innerWidth / 1300
  const scaleFactorDesktopMob = window.innerWidth / 991
 

  let scaleCof = 1 - scaleFactorDesktop
  let fovInBetween = scaleCof * scaleCof * fovOriginal
  
  let fovNew = fovOriginal + fovInBetween


  let scaleCofMob = 1 - scaleFactorTablet
  let fovInBetweenMob = scaleCofMob * scaleCofMob * fovOriginal
  let fovInBetweenTab = scaleCofMob * fovOriginal

  let fovNewMob = fovOriginal + fovInBetweenMob
  let fovNewTab = fovOriginal + fovInBetweenTab





 

  useLayoutEffect(() => {


  console.log(actions)
  
    const introClip = actions.IntroAction
    const introClipMob = actions.MobIntro
      
    introClip.clampWhenFinished = true
    introClip.loop = true
    introClip.repetitions = 1
  
  
    introClipMob.clampWhenFinished = true
    introClipMob.loop = false
    introClipMob.repetitions = 1

    setTimeout(() => {

      if(isMobileSize){
        console.log("Mob play should run")
        introClipMob.play()
      }else{
        console.log("Desk play should run")
        introClip.play()
      } }, "2900")


      setTimeout(() => {
        if(isMobileSize){
            console.log("Mob fadeout")
            introClipMob.fadeOut(0.1)
          }else{
            console.log("Desk fadeout")
            introClip.fadeOut(0.1)
          }
        document.querySelector("html").style.position = "relative"
      }, "4100")
      

   

   
    
  }, [])


  const [prevsize, setPrevSize] = useState(isMobileSize)

  useEffect(() => {
    if(prevsize !== isMobileSize){
        ScrollTrigger.refresh()
        console.log("breakpoint")
        setPrevSize(prev => !prev)
    }
  }, [isMobileSize])

 

  useEffect(() => {
    const rootDiv = document.getElementById("root")
    rootDiv.childNodes[0].style.pointerEvents = "none"

  });



  useGSAP(() => {

      let whichAnimLenght = isMobileSize ? 150 : 120
      let whichDuration = isMobileSize ? 6 : 5

      const clipMob = actions.MobCameraNew
      const clipDesktop = actions.WholeAnim;
  
      let clip = isMobileSize ? clipMob : clipDesktop
  
      const animationDuration = clip._clip.duration;
      const frame = animationDuration / whichAnimLenght;
      // if it runs until the last frame, it will restart from frame 1, didn't found a solution for this yet.
      const max = animationDuration - frame;
  
     
  
      clip.play();
  
      const mixer = clip.getMixer();
      const proxy = {
        get time() {
          return mixer.time;
        },
        set time(value) {
          clip.paused = false;
          mixer.setTime(value);
          clip.paused = true;
        },
      };
  
      // for some reason must be set to 0 otherwise the clip will not be properly paused.
      proxy.time = 0;
  

    let tl = gsap.timeline({
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "bottom bottom",
        endTrigger: "#scroll",
        scrub: 1,
        toggleActions: "restart restart reverse reverse",
      },
    });
    tl.set(proxy, { time: 0 });
  
    tl.to(
      proxy,
  
      {
        time: max,
        ease: "none",
        duration: whichDuration,
      }
    );
  })

  

  //make numbers glow

  nodes.numbers_as_mesh.material.color.r = 2;
  nodes.numbers_as_mesh.material.color.g = 2;
  nodes.numbers_as_mesh.material.color.b = 2;

  nodes.numbers_as_mesh.material.emissive.r = 1;
  nodes.numbers_as_mesh.material.emissive.g = 1;
  nodes.numbers_as_mesh.material.emissive.b = 1;
  nodes.numbers_as_mesh.material.emissiveIntensity = 1.1;
  nodes.numbers_as_mesh.material.toneMapped = false;


  //batterybank material swap

const blueCol = document.querySelector(".col-blue")
const grayCol = document.querySelector(".col-gray")

const [isBlueTrue, setIsBlueTrue] = useState(true);


let pbMaterial = isBlueTrue ? 'PB material' : 'PB Gray'


blueCol.addEventListener("click", blueClick)
grayCol.addEventListener("click", grayClick)

    function blueClick(){
        setIsBlueTrue(true)
    }

    function grayClick(){
        setIsBlueTrue(false)   
    }


return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Empty_-_move_cover" position={[0, -0.847, 0]} scale={0.032}>
          <mesh
            name="stitch"
            castShadow
            receiveShadow
            geometry={nodes.stitch.geometry}
            material={materials['Cover material']}
            position={[0.003, 0.286, 0.003]}
            scale={31.091}
          />
        </group>
        <group name="Empty_-_move_battery" rotation={[0.07, -0.098, 0.049]}>
          <mesh
            name="Battery_bank"
            castShadow
            receiveShadow
            geometry={nodes.Battery_bank.geometry}
            material={materials['PB material']}
            position={[0, -0.001, 0]}
            scale={0.993}
          />
          <spotLight
            name="k_soft_shadow_light"
            intensity={0.62866}
            angle={0.323}
            penumbra={0.15}
            decay={2}
            position={[0.565, -0.083, -0.489]}
            rotation={[3.09, 0.89, 1.722]}>
            <group position={[0, 0, -1]} />
          </spotLight>
          <spotLight
            name="Keylight"
            intensity={0.4446}
            angle={0.277}
            penumbra={0.15}
            decay={2}
            position={[0.638, 0.27, 0.07]}
            rotation={[-1.431, 1.155, 0.056]}>
            <group position={[0, 0, -1]} />
          </spotLight>
          <mesh
            name="numbers_as_mesh"
            castShadow
            receiveShadow
            geometry={nodes.numbers_as_mesh.geometry}
            material={materials['numbers glow material']}
            position={[0.0115, 0.061, 0.022]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={0.009}
          />
        </group>
        <spotLight
          name="light-frame5"
          intensity={0.6896}
          angle={0.255}
          penumbra={0.335}
          decay={2}
          position={[0.881, 0.15, 1.223]}
          rotation={[-0.12, 0.628, -1.517]}
          scale={0.714}>
          <group position={[0, 0, -1]} />
        </spotLight>
        <group
          name="Empty-move_camera"
          position={[0.095, 0.337, -0.083]}
          rotation={[0.166, 1.129, -0.141]}
          scale={0.041}>
          <PerspectiveCamera
            name="Camera001"
            makeDefault={true}
            far={1000}
            near={0.1}
            fov={fovNew}
            position={[16.734, -0.486, -0.337]}
            rotation={[2.032, 1.274, -1.881]}
            scale={0.683}
          />
        </group>
        <mesh
          name="Plane_for_gray"
          castShadow
          receiveShadow
          geometry={nodes.Plane_for_gray.geometry}
          material={materials['PB Gray']}
          position={[16.174, -11.861, -62.359]}
        />
      </group>
    </group>
  )
}

useGLTF.preload('http://localhost:5173/src/assets/dopo44.glb')

/*
materials[pbMaterial]
k_soft_shadow_light - 0.62866
Keylight - 0.470288
light-frame5 - 0.4446
Spot_1 - 0.6896
normalCameraTrue
introCameraTrue
fovNew
isTabletSize ? fovNewTab : fovNewMob
*/

