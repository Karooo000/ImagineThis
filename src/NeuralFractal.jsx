import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import gsap from 'gsap'

const modelURL = '/fractalNEWV10.glb'

export default function Model(props) {


  const { nodes, materials } = useGLTF(modelURL)

  const glowingRef = useRef()
  const cameraRef = useRef()
  const wholeModel = useRef()

  //const alphaMap = useTexture('public/AlphaMask.jpg')

  // Set glowing mesh to layer 1
  useEffect(() => {
    if (glowingRef.current) {
      glowingRef.current.layers.set(1)
    }
  }, [])


/* 
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
     
     
      gsap.to(wholeModel.current.rotation, {
        x: pointer.current.y / 50 ,
        ease: "power1.easeOut",
      });
      
      gsap.to(wholeModel.current.rotation, {
        y: pointer.current.x / 50 ,
        ease: "power1.easeOut",
      });
        
    });
  
 */

/* 
    const baseTime = useRef(0)
const mouseOffset = useRef({ x: 0, y: 0 })

useEffect(() => {
  const handleMouseMove = event => {
    const canvas = document.getElementById("root")
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    mouseOffset.current = {
      x: (x - 0.5) * 0.3, // Adjust sensitivity
      y: (y - 0.5) * 0.3,
    }
  }

  document.addEventListener("mousemove", handleMouseMove)
  return () => document.removeEventListener("mousemove", handleMouseMove)
}, [])

useFrame((state, delta) => {
  if (!wholeModel.current) return

  // Base orbit angle over time
  baseTime.current += delta
  const baseX = Math.sin(baseTime.current * 0.2) * 0.05
  const baseY = Math.cos(baseTime.current * 0.2) * 0.05

  // Combine base orbit + mouse offset
  const targetX = baseX + mouseOffset.current.y
  const targetY = baseY + mouseOffset.current.x

  // Smoothly apply to camera position or rotation
  wholeModel.current.position.x += (targetY - wholeModel.current.position.x) * 0.05
  wholeModel.current.position.y += (targetX - wholeModel.current.position.y) * 0.05

  // Optional: keep looking at center
  //cameraRef.current.lookAt(0, 0.5, 0)
})

 */

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
  wholeModel.current.rotation.x += (finalX - wholeModel.current.rotation.x) * 0.05
  wholeModel.current.rotation.y += (finalY - wholeModel.current.rotation.y) * 0.02
})


  return (
      <group {...props} dispose={null} >
      <pointLight
        intensity={0.054351413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={true}
        far={100}
        near={0.1}
        fov={22.895}
        position={[-0.079, 1.571, 1.778]}
        rotation={[-0.442, 0.068, 0.032]}
      />
      <group ref={wholeModel}>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.NeuralFractal.geometry}
        material={materials.NeuralMaterial}
      />

        <mesh
          ref={glowingRef}
          castShadow
          receiveShadow
          geometry={nodes.Spheres.geometry}
          //material={materials.Spheres}
          position={[0.022, 0.853, -0.024]}
        >
      
        <meshStandardMaterial
                  color="#c7eded"
                  //color="ff0000"
                  emissive={[0.78 * 3, 0.93 * 3, 0.93 * 3]}
                  //emissive={[0.204 * 5, 0.922 * 5, 0.91 * 5]}
                  emissiveIntensity={1.5}
                  toneMapped={false}
                />
      
        </mesh>
      </group>
      <pointLight
        intensity={0.163054}
        decay={2}
        color="#3a73ff"
        position={[-0.004, 0.526, -0.131]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <spotLight
        intensity={0.163054}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        color="#ffe58e"
        position={[0, 1.523, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
</group>

    
  )
}

useGLTF.preload(modelURL)
