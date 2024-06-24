import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";


import IntroAnimations from "./IntroAnimations";
import IntroAnimationsMob from "./IntroAnimationsMob";
import { useGSAP } from "@gsap/react";





gsap.registerPlugin(ScrollTrigger);

export default function Model(props) {

 // IntroAnimations();
 const group = useRef();
 const { nodes, materials, animations } = useGLTF("http://localhost:5173/src/assets/dopoMob2.glb");

 const { ref, mixer, names, actions, clips } = useAnimations(
   animations,
   group
 );
 const { progress } = useProgress();
 const viewport = useThree((state) => state.viewport);



  let isMobileSize = window.innerWidth < 768



 //Scale based on screensize ( responsive )

  const fovOriginal = 22.895

  const scaleFactorDesktop = window.innerWidth / 1512

  let scaleCof = 1 - scaleFactorDesktop
  let fovInBetween = scaleCof * scaleCof * fovOriginal
  
  let fovNew = fovOriginal + fovInBetween

  const scaleFactorDesktopMob = window.innerWidth / 768

  let scaleCofMob = 1 - scaleFactorDesktopMob
  let fovInBetweenMob = scaleCofMob * scaleCofMob * fovOriginal
  let fovNewMob = fovOriginal + fovInBetweenMob

 // Scroll to top on reload

 window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

//Which camera is active

let innitialNormalDesk = isMobileSize ? false : true
let innitialNormalMob = isMobileSize ? true : false

  
  const [introCameraTrue, setIntroCameraTrue] = useState(innitialNormalDesk);
  const [normalCameraTrue, setNormalCameraTrue] = useState(false);

  const [mobNormalCameraTrue, setMobNormalCameraTrue] = useState(innitialNormalMob);

  //const [camera] = useThree()
  //console.log(camera)



  useLayoutEffect(() => {
    if(progress > 99){
        setTimeout(() => {
            console.log("camera swap")
            if(!isMobileSize){
              setIntroCameraTrue(false)
             setNormalCameraTrue(!normalCameraTrue)
             setMobNormalCameraTrue(false)
             ScrollTrigger.refresh()

            }else{
              setMobNormalCameraTrue(mobNormalCameraTrue)
              ScrollTrigger.refresh()
            }


            
            document.querySelector("html").style.position = "relative"
        }, "4200")
    }
    
  }, [])

  //console.log(isMobileSize + " isMobile size") 

  const [mobSwitcher, setMobSwitcher] = useState(isMobileSize)
  const [innitialIsMob, setInnitialIsMob] = useState(isMobileSize)

  //console.log(introCameraTrue + " intro")
 // console.log(normalCameraTrue + " normal")
  //console.log(mobNormalCameraTrue + " mob")

  useMemo(() => {
    setMobSwitcher(isMobileSize)
  }, [isMobileSize])

  const mobCameraa = useRef()
  const deskNormalCamera = useRef()

  //console.log(mobSwitcher, innitialIsMob)
  const { camera } = useThree()
  console.log(camera)
  

  useEffect(() => {
    if(mobSwitcher !== innitialIsMob){
      setInnitialIsMob(prev => !prev)
  
      if(!isMobileSize){
        if(!introCameraTrue){
          setNormalCameraTrue(true)
          setMobNormalCameraTrue(false)
          //deskNormalCamera.updateProjectionMatrix()
          //deskNormalCamera.matrixWorldNeedsUpdate = true
          //PerspectiveCamera.render.makeDefault = true
        }
      }else{
        setNormalCameraTrue(false)
          setMobNormalCameraTrue(true)
          //mobCameraa.updateProjectionMatrix()
          //mobCameraa.matrixWorldNeedsUpdate = true
          //PerspectiveCamera.render.makeDefault = true
      }
  
      console.log("breakpoint has been swapped")
    }
    console.log("rerender")
  }, [mobSwitcher])

  //console.log(PerspectiveCamera)

  const { scene, canvas } = useThree()
  console.log(scene, canvas)

  /*

  const get = useThree((state) => state.get);
	
const onResize = () => {
    const customProjectionMatrix = calculateCustomProjectionMatrix(get().size, spec);
    camera.projectionMatrix.copy(customProjectionMatrix );
};

window.addEventListener('resize', onResize);

*/
  /*

  const { get, set } = useThree(({ get, set }) => ({ get, set }));

  useEffect(() => {
    const changeView = () => {
      if (get().camera.name === "MobCamera" && isMobileSize) {
        set({ camera: mobCameraa.current });
      } else {
        set({ camera: deskNormalCamera.current });
      }
    };
    changeView();

    window.addEventListener("resize", changeView);
    return () => window.removeEventListener("resize", changeView);
  }, [get, set]);
*/


  useEffect(() => {


    const rootDiv = document.getElementById("root")
    rootDiv.childNodes[0].style.pointerEvents = "none"

    const introClip = actions.introAction

    
    introClip.clampWhenFinished = true
    introClip.loop = false
    introClip.repetitions = 1


    if(progress > 99){
        setTimeout(() => {
            introClip.play()
        }, "2900")
    }

    //console.log(actions)
  


  });

  useGSAP(() => {

      let whichAnimLenght = isMobileSize ? 150 : 120

      const clipMob = actions.MobCamera
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
        snap: 0.25,
      },
    });
    tl.set(proxy, { time: 0 });
  
    tl.to(
      proxy,
  
      {
        time: max,
        ease: "none",
        duration: 5,
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
      <group
        name="Empty_-_move_cover"
        position={[0, -0.847, 0]}
        rotation={[0, -0.001, 0]}
        scale={0.032}>
        <mesh
          name="stitch"
          castShadow
          receiveShadow
          geometry={nodes.stitch.geometry}
          material={materials['Cover material']}
          position={[0, 0.313, 0]}
          scale={31.309}
        />
      </group>
      <group name="Empty_-_move_battery" rotation={[0.07, -0.098, 0.049]}>
        <mesh
          name="Battery_bank"
          castShadow
          receiveShadow
          geometry={nodes.Battery_bank.geometry}
          material={materials[pbMaterial]}
        />
        <spotLight
          name="k_soft_shadow_light"
          intensity={ 0.62866}
          angle={0.323}
          penumbra={0.15}
          decay={2}
          position={[0.565, -0.083, -0.489]}
          rotation={[3.09, 0.89, 1.722]}>
          <group position={[0, 0, -1]} />
        </spotLight>
        <spotLight
          name="Keylight"
          intensity={0.470288}
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
          position={[0.0105, 0.062, 0.022]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={0.009}
        />
      </group>
      <spotLight
        name="light-frame5"
        intensity={0.4446}
        angle={0.255}
        penumbra={0.335}
        decay={2}
        position={[0.881, 0.15, 1.223]}
        rotation={[-0.12, 0.628, -1.517]}
        scale={0.714}>
        <group position={[0, 0, -1]} />
      </spotLight>
      <spotLight
        name="Spot_1"
        intensity={0.6896}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        position={[0, 3.229, 0]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[0, 0, -1]} />
      </spotLight>
      <group name="Empty-move_camera" position={[0, 0, -0.02]} scale={0.99}>
        <PerspectiveCamera
          ref={deskNormalCamera}
          name="Camera001"
          makeDefault={normalCameraTrue}
          far={1000}
          near={0.1}
          fov={fovNew}
          position={[0.458, -0.146, -0.191]}
          rotation={[2.628, 1.009, -2.527]}
          scale={0.181}
        />
      </group>
      <group name="Empty-intro_camera" position={[0.377, 0.191, -0.042]} scale={0.028}>
        <PerspectiveCamera
          name="Camera-Intro"
          makeDefault={introCameraTrue}
          far={1000}
          near={0.1}
          fov={fovNew}
          position={[16.094, -5.137, -7.411]}
          rotation={[2.628, 1.009, -2.527]}
          scale={6.381}
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
    
      <group
        name="Empty_-_move_mob_camera"
        position={[0.021, 0.028, 0.011]}
        rotation={[1.508, -0.309, -2.193]}
        scale={0.031}>
        <PerspectiveCamera
          ref={mobCameraa}
          name="MobCamera"
          makeDefault={mobNormalCameraTrue}
          far={1000}
          near={0.1}
          fov={fovNewMob}
          position={[0, 23.456, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={7.614}
        />
      </group>
    </group>
  </group>
)
}

useGLTF.preload('http://localhost:5173/src/assets/dopoMob2.glb')

/*
materials[pbMaterial]
k_soft_shadow_light - 0.62866
Keylight - 0.470288
light-frame5 - 0.4446
Spot_1 - 0.6896
normalCameraTrue
introCameraTrue
fovNew
*/

