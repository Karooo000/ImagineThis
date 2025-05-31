import React, { useRef, useEffect } from 'react'
import { useGLTF, PerspectiveCamera, useTexture } from '@react-three/drei'
import { Select } from '@react-three/postprocessing'

const modelURL = '/fractalNEWV10.glb'

export default function Model(props) {


  const { nodes, materials } = useGLTF(modelURL)
  const glowingRef = useRef()
  const cameraRef = useRef()

  //const alphaMap = useTexture('public/AlphaMask.jpg')

  // Set glowing mesh to layer 1
  useEffect(() => {
    if (glowingRef.current) {
      glowingRef.current.layers.set(1)
    }
  }, [])

  //console.log(Object.entries(materials).flatMap(([k, v]) => Object.entries(v).filter(([key, val]) => val?.isTexture)))

  /*
    <meshStandardMaterial
                map={materials.NeuralMaterial.map}
                //roughnessMap={materials.NeuralMaterial.roughnessMap}
                alphaMap={alphaMap}
                transparent={true}
                ior={1.5} 
                //depthWrite={true}
                //depthTest={true}
                //side={2} // DoubleSide
                //alphaTest={0.01} // Optional: removes fully transparent pixels
            />
  */

  return (
      <group {...props} dispose={null}>
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
       <Select enabled>
        <meshStandardMaterial
                  color="#34ebe8"
                  emissive="#34ebe8"
                  emissiveIntensity={10.5}
                  toneMapped={false}
                />
       </Select>
        </mesh>
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
