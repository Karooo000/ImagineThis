import { useGLTF, PerspectiveCamera, useAnimations, useProgress, useTexture } from "@react-three/drei";

export default function Camera(props) {
    const { nodes, materials, animations } = useGLTF("http://localhost:5173/src/assets/dopo99.glb");
     //FOV based on screensize ( responsive )

     let isMobileSize = window.innerWidth < 1280
     let isTabletSize = 550 < window.innerWidth && window.innerWidth < 1280

  const fovOriginal = 22.895

  const scaleFactorDesktop = window.innerWidth / 1512
  const scaleFactorTablet = window.innerWidth / 1300
  const scaleFactorDesktopMob = window.innerWidth / 991

  //desktop FOV
  let scaleCof = 1 - scaleFactorDesktop
  let fovInBetween = scaleCof * scaleCof * fovOriginal
  let fovNew = fovOriginal + fovInBetween

  // Mobile FOV
  let scaleCofMob = 1 - scaleFactorTablet
  let fovInBetweenMob = scaleCofMob * scaleCofMob * fovOriginal
  let fovNewMob = fovOriginal + fovInBetweenMob

  // Mobile FOV
  let fovInBetweenTab = scaleCofMob * fovOriginal
  let fovNewTab = fovOriginal + fovInBetweenTab

    return (

        <>
        <group name="Empty-move_camera" position={[0, 0, -0.02]} scale={0.99}>
        <PerspectiveCamera
          name="Camera001"
          makeDefault={!isMobileSize}
          far={1000}
          near={0.1}
          fov={fovNew}
          position={[0.458, -0.146, -0.191]}
          rotation={[2.628, 1.009, -2.527]}
          scale={0.181}
        />
        </group>
        <group
            name="Empty_-_move_mob_camera"
            position={[0.111, 0.287, 0.038]}
            rotation={[1.743, -0.265, -1.402]}
            scale={0.027}>
            <PerspectiveCamera
            name="MobCamera"
            makeDefault={isMobileSize}
            far={1000}
            near={0.1}
            fov={isTabletSize ? fovNewTab : fovNewMob}
            position={[0, 23.456, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={7.614}
            />
        </group>
        <group
            name="Empty_-_Intro_Camera"
            position={[-0.579, 1.825, 4.895]}
            rotation={[0, -0.719, 0]}
            scale={1.481}>
            <PerspectiveCamera
            name="Camera_-_Intro"
            makeDefault={false}
            far={1000}
            near={0.1}
            fov={fovNew}
            position={[0.458, -0.146, -0.191]}
            rotation={[2.628, 1.009, -2.527]}
            />
        </group>
        </>
    )

    
}
