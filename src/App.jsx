import { Canvas } from "@react-three/fiber";
import Model from "/src/PowerBank.jsx";
import { ContactShadows,  useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";

import CustomLoader from "./CustomLoader";

import IntroAnimations from "./IntroAnimations";
import IntroAnimationsMob from "./IntroAnimationsMob";




function App() {

  
  IntroAnimations();
  
  CustomLoader();
 

  return (
    <>
      <Canvas>
        <Model />
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={1.1}
            intensity={0.15}
            levels={3}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </>

  );
}

export default App;
