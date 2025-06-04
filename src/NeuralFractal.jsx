import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


import gsap from 'gsap'

//const modelURL = 'https://imaginethiscode.netlify.app/fractalNEWV4.glb'
const modelURL = "http://localhost:5173/Fractal2.glb"


export default function Model({ focusRef, shouldPlayContactIntro, shouldPlayBackContact, ...props }) {
  const group = useRef()
  const glowingRef = useRef()
  const cameraRef = useRef()
  const wholeModel = useRef()
  const lastPlayedAnimation = useRef(null)

  const { nodes, materials, animations } = useGLTF(modelURL)
  const { actions } = useAnimations(animations, group)

 console.log("testing")
  //const cameraAction = actions["Empty - CameraAction"]

  /** Play animations based on navigation */
  useEffect(() => {
    const contractIntroAction = actions["ContractIntroAction"];
    const backwardsContactAction = actions["BackwardsContact"];

    if (!contractIntroAction || !backwardsContactAction) {
      console.warn("One or both animation actions not found");
      return;
    }

    // Configure animations
    [contractIntroAction, backwardsContactAction].forEach(action => {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    });

    const playAnimation = (action) => {
      // Stop all animations immediately
      Object.values(actions).forEach(a => {
        a.stop();
        a.enabled = false;
      });

      // Enable and play the target animation
      action.enabled = true;
      action.timeScale = 1;
      action.time = 0;
      action.play();
      lastPlayedAnimation.current = action;
    };

    if (shouldPlayContactIntro && lastPlayedAnimation.current !== contractIntroAction) {
      console.log("Playing ContractIntroAction");
      playAnimation(contractIntroAction);
    } else if (shouldPlayBackContact && lastPlayedAnimation.current !== backwardsContactAction) {
      console.log("Playing BackwardsContact");
      playAnimation(backwardsContactAction);
    }

    return () => {
      // Don't stop animations on cleanup to maintain positions
    };
  }, [shouldPlayContactIntro, shouldPlayBackContact, actions]);


  // Set glowing mesh to layer 1
  useEffect(() => {
    if (glowingRef.current) {
      glowingRef.current.layers.set(1)
    }
  }, [])


/* Idle animation and mousemove */

const baseTime = useRef(0)
const targetRotation = useRef({ x: 0, y: 0 })

// Track mouse movement relative to screen
useEffect(() => {
  const handleMouseMove = event => {
    const canvas = document.getElementById("root")
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    // Normalize to range [-1, 1], then scale
    targetRotation.current = {
      x: (y - 0.5) * 0.1,
      y: (x - 0.5) * 0.3,
    }
  }

  document.addEventListener("mousemove", handleMouseMove)
  return () => document.removeEventListener("mousemove", handleMouseMove)
}, [])

useFrame((_, delta) => {
  if (!wholeModel.current) return

  baseTime.current += delta

  // Base idle animation (slow sway)
  const idleX = Math.sin(baseTime.current * 0.5) * 0.04
  const idleY = Math.cos(baseTime.current * 0.5) * 0.08

  // Combined target rotation
  const finalX = idleX + targetRotation.current.x
  const finalY = idleY + targetRotation.current.y

  // Smoothly interpolate (lerp)
  wholeModel.current.rotation.x += (finalX - wholeModel.current.rotation.x) * 0.01
  wholeModel.current.rotation.y += (finalY - wholeModel.current.rotation.y) * 0.01
})

/* Idle animation and mousemove ENDS*/

  return (
      <group ref={group} {...props} dispose={null} >
      <pointLight
        intensity={0.054351413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
       <group name="Empty_-_Camera" position={[-0.008, 0.823, -0.033]} scale={0.14}>
          <PerspectiveCamera
            name="Camera"
            makeDefault={true}
            far={100}
            near={0.1}
            fov={22.895}
            position={[-0.217, 5.606, 12.792]}
            rotation={[-0.442, 0.068, 0.032]}
            scale={7.146}
          />
        </group>
      <group ref={wholeModel}>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.NeuralFractal.geometry}
        material={materials.NeuralMaterial}
        position={[0.022, 0, -0.024]}
        rotation={[Math.PI, 0, Math.PI]}
      />

        <mesh
          ref={glowingRef}
          castShadow
          receiveShadow
          geometry={nodes.Spheres.geometry}
          //material={materials.Spheres}
          position={[0, 0.853, 0]}
          rotation={[Math.PI, 0, Math.PI]}
        >
      
        <meshStandardMaterial
                  //color="#c7eded"
                  color="#3a73ff"
                  emissive={[0.78 * 2, 0.93 * 2, 0.93 * 2]}
                  emissiveIntensity={1.5}
                  toneMapped={false}
                />
      
        </mesh>
      </group>
      <pointLight
        intensity={0.0363054}
        decay={2}
        color="#3a73ff"
        position={[-0.004, 0.526, -0.131]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <spotLight
        intensity={0.0463054}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        color="#ffe58e"
        position={[0, 1.523, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
         <mesh
        castShadow
        receiveShadow
        geometry={nodes.FocusTarget.geometry}
        material={nodes.FocusTarget.material}
        position={[-0.199, 0.788, 0.054]}
        ref={focusRef}
        visible={false}
      />
</group>

    
  )
}

useGLTF.preload(modelURL)

