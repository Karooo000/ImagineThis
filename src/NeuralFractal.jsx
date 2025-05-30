import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture } from '@react-three/drei'

const modelURL = '/fractalNEW.glb'

export default function Model(props) {


  const { nodes, materials } = useGLTF(modelURL)
  const glowingRef = useRef()
  const cameraRef = useRef()

  const alphaMap = useTexture('public/AlphaV2.png')

  // Set glowing mesh to layer 1
  useEffect(() => {
    if (glowingRef.current) {
      glowingRef.current.layers.set(1)
    }
  }, [])

  //console.log(Object.entries(materials).flatMap(([k, v]) => Object.entries(v).filter(([key, val]) => val?.isTexture)))


  return (
    <group {...props} dispose={null}>
      <pointLight
        intensity={0.0154351413}
        decay={2}
        position={[4.076, 5.904, -1.005]}
        rotation={[-1.839, 0.602, 1.932]}
      />

      {/* Expose camera ref to enable layers in App.jsx */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={true}
        far={100}
        near={0.1}
        fov={22.895}
        position={[1.985, 1.473, -1.914]}
        rotation={[-2.79, 0.1, 3.105]}
      />

      {/* Your main fractal mesh on default layer 0 */}
      <mesh
        //castShadow
        //receiveShadow
        geometry={nodes.NeuralFractal.geometry}
        //material={materials.NeuralMaterial}
        position={[1.262, 0.976, -0.247]}
        scale={0.01}
      >
           <meshStandardMaterial
                map={materials.NeuralMaterial.map}
                roughnessMap={materials.NeuralMaterial.roughnessMap}
                alphaMap={alphaMap}
                transparent={true}
                ior={1.5} 
                //depthWrite={true}
                //depthTest={true}
                //side={2} // DoubleSide
                //alphaTest={0.01} // Optional: removes fully transparent pixels
            />
      </mesh>

      {/* Glowing mesh on layer 1 */}
      <mesh
        ref={glowingRef}
        //castShadow
        //receiveShadow
        geometry={nodes.Spheres.geometry}
        position={[1.262, 0.976, -0.247]}
        scale={0.01}
      >
        <meshStandardMaterial
          color="#34ebe8"
          emissive="#34ebe8"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>

    
  )
}

useGLTF.preload(modelURL)
