import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

let filename = "http://localhost:5173/src/assets/OakleyConfigV20.glb"




export function ConfigModel(props) {
    const { nodes, materials } = useGLTF(filename)

    let generalMaterialsArray = ["Blue Glasses", 'Black glasses', 'Red Glasses', 'Yellow Glasses']
    let glassMaterialsArray = ['colGlass', 'ColBlackGlass', 'ColRedGlass', 'ColYellowGlass']
    let innerTextTopArray = ["Saphire lenses/", "Black lenses/", "Road lenses/", "24K lenses"]
    let innerTextBottomArray = ["Polished white frame", "Matte black frame", "Matte black frame", "Matte carbon frame"]
    

    const [generalMaterial, setGeneralMaterial] = useState(generalMaterialsArray[0])
    const [glassMaterial, setGlassMaterial] = useState(glassMaterialsArray[0])

    
    const blueColOption = document.getElementById("bluee")
    const blackColOption = document.getElementById("blackk")
    const pinkColOption = document.getElementById("pinkk")
    const yellowColOption = document.getElementById("yelloww")

    const colorOptionTextTop = document.getElementById("col-name-lensess")
    const colorOptionTextBottom = document.getElementById("col-name-framee")


    blueColOption.addEventListener("click", blueClickFunction)
    blackColOption.addEventListener("click", blackClickFunction)
    pinkColOption.addEventListener("click", pinkClickFunction)
    yellowColOption.addEventListener("click", yellowClickFunction)

    function blueClickFunction(){
      setGeneralMaterial(generalMaterialsArray[0])
      setGlassMaterial(glassMaterialsArray[0])
      colorOptionTextTop.innerText = innerTextTopArray[0]
      colorOptionTextBottom.innerText = innerTextBottomArray[0]
    }

    function blackClickFunction(){
      setGeneralMaterial(generalMaterialsArray[1])
      setGlassMaterial(glassMaterialsArray[1])
      colorOptionTextTop.innerText = innerTextTopArray[1]
      colorOptionTextBottom.innerText = innerTextBottomArray[1]
    }

    function pinkClickFunction(){
      setGeneralMaterial(generalMaterialsArray[2])
      setGlassMaterial(glassMaterialsArray[2])
      colorOptionTextTop.innerText = innerTextTopArray[2]
      colorOptionTextBottom.innerText = innerTextBottomArray[2]
    }

    function yellowClickFunction(){
      setGeneralMaterial(generalMaterialsArray[3])
      setGlassMaterial(glassMaterialsArray[3])
      colorOptionTextTop.innerText = innerTextTopArray[3]
      colorOptionTextBottom.innerText = innerTextBottomArray[3]
    }
   
    
    console.log("works")
    //position={[0,-0.015,0]}


    return (
      <group {...props} dispose={null} >
        <PerspectiveCamera
          makeDefault={false}
          far={1000}
          near={0.1}
          fov={22.895}
          position={[0.006, 0.078, -0.408]}
          rotation={[-3.1, 0.007, 3.141]}
          scale={0.172}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Glass.geometry}
          material={materials[generalMaterial]}
          rotation={[0.816, 0, 0]}>
          <group rotation={[-0.333, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.mesh001.geometry}
              material={materials[glassMaterial]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.mesh001_1.geometry}
              material={materials['Black glass']}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Handle_Longer_L.geometry}
            material={materials[generalMaterial]}
            rotation={[-0.333, 0, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Handle_Longer_R.geometry}
            material={materials[generalMaterial]}
            rotation={[-0.333, 0, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-BlackGlass'].geometry}
            material={materials.ColBlackGlass}
            position={[0.088, 0.005, -0.016]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-BlackMaterial'].geometry}
            material={materials['Black glasses']}
            position={[0.088, 0.005, -0.016]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-RedMaterial'].geometry}
            material={materials['Red Glasses']}
            position={[0.089, 0.006, -0.014]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-RedMaterial001'].geometry}
            material={materials.ColRedGlass}
            position={[0.089, 0.006, -0.014]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-YellowMaterial'].geometry}
            material={materials['Yellow Glasses']}
            position={[0.088, 0.004, -0.018]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['Plane-YellowMaterial001'].geometry}
            material={materials.ColYellowGlass}
            position={[0.088, 0.004, -0.018]}
            rotation={[2.824, 1.455, -Math.PI]}
            scale={0.001}
          />
        </mesh>
        <directionalLight
          intensity={0.683}
          decay={2}
          position={[-0.002, 0.083, -0.036]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <pointLight
          intensity={0.243514}
          decay={2}
          position={[0, -0.042, 0.015]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    )
  }
useGLTF.preload(filename)
