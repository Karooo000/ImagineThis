import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import gsap from 'gsap'

const modelURL = 'https://imaginethiscode.netlify.app/fractalNEWV4.glb'

export default function Model({ focusRef, ...props }) {


  const { nodes, materials } = useGLTF(modelURL)

  const glowingRef = useRef()
  const cameraRef = useRef()
  const wholeModel = useRef()
 


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
        position={[-0.039, 1.607, 1.757]}
        rotation={[-0.442, 0.068, 0.032]}
      />
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
