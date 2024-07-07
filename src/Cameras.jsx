
import { PerspectiveCamera } from "@react-three/drei";

export default function Camera(props) {


  let isMobileSize = window.innerWidth < 1280
  let isTabletSize = 550 < window.innerWidth && window.innerWidth < 1280

 //FOV based on screensize ( responsive )
 console.log("camera fired")

  const fovOriginal = 22.895

  const scaleFactorDesktop = window.innerWidth / 1512
  const scaleFactorTablet = window.innerWidth / 1300
  const scaleFactorDesktopMob = window.innerWidth / 991

  //desktop FOV
  let scaleCof = 1 - scaleFactorDesktop
  let fovInBetween = scaleCof * scaleCof * fovOriginal

  let fovNewClamp = fovOriginal + fovInBetween
  let fovNew = fovNewClamp > 25 ? 25 : fovNewClamp



  // Mobile FOV
  let scaleCofMob = 1 - scaleFactorTablet
  let fovInBetweenMob = scaleCofMob * scaleCofMob * fovOriginal
  let fovNewMob = fovOriginal + fovInBetweenMob

  // Mobile FOV
  let fovInBetweenTab = scaleCofMob * fovOriginal
  let fovNewTab = fovOriginal + fovInBetweenTab

  const mainCameraSettings = {
    name: "Camera001",
    makeDefault: props.deskIsTrue,
    far: 1000,
    near:0.1,
    fov:fovNew,
    position:[0.458, -0.146, -0.191],
    rotation:[2.628, 1.009, -2.527],
    scale: 0.181
}

  const mobCameraSettings = {
    name: "MobCamera",
    makeDefault: props.mobIsTrue,
    far: 1000,
    near: 0.1,
    fov: isTabletSize ? fovNewTab : fovNewMob,
    position: [0, 23.456, 0],
    rotation: [-Math.PI / 2, 0, 0],
    scale: 7.614
  }

console.log(props.deskIsTrue, props.mobIsTrue)

    
return(
    <>
    <group name="Empty-move_camera" position={[0, 0, -0.02]} scale={0.99}>
           <PerspectiveCamera {...mainCameraSettings}/>
    </group>
    
     <group
            name="Empty_-_move_mob_camera"
            position={[0.111, 0.287, 0.038]}
            rotation={[1.743, -0.265, -1.402]}
            scale={0.027}>
            <PerspectiveCamera {...mobCameraSettings} />
         </group>
    </>
)
     

    }

