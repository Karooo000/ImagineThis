import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function Glasses(props) {
  const viewport = useThree(state => state.viewport);
  const scaleFactor = 1 - window.innerWidth / 1600;
  const glassesScaleFactor = scaleFactor * 22.895 + 22.895 - 1;

  const armRef = useRef();
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("http://localhost:5173/src/assets/Glasses.glb");
  const { ref, mixer, names, actions, clips } = useAnimations(animations, group);

  console.log(actions);

  useEffect(() => {
    //First scroll
    const animationDuration = actions.WholeAnim._clip.duration;
    const clip = actions.WholeAnim;
    const frame = animationDuration / 120;
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
      scrollTrigger: {
        trigger: "#section2",
        start: "top bottom",
        end: "bottom bottom",
        endTrigger: "#scroll",
        scrub: 1,
        toggleActions: "restart restart reverse reverse",
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
  });

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
    gsap.to(armRef.current.position, {
      y: pointer.current.y / 15 + 0.5,
      ease: "power1.easeOut",
    });
    gsap.to(armRef.current.rotation, {
      y: pointer.current.y / 5,
      ease: "power1.easeOut",
    });
    gsap.to(armRef.current.rotation, {
      x: pointer.current.x / 50 + 0,
      ease: "power1.easeOut",
    });
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Scene'>
        <group name='Empty' position={[-0.145, -0.186, -0.268]} rotation={[0.016, -0.044, 0.001]} scale={1.1}>
          <PerspectiveCamera
            name='Camera'
            makeDefault
            far={1000}
            near={0.1}
            fov={glassesScaleFactor}
            position={[5.564, 4.326, 4.88]}
            rotation={[-0.813, 0.857, 0.673]}
          />
        </group>
        <group ref={armRef}>
          <group name='Armature'>
            <group name='Handle_L'>
              <skinnedMesh
                name='Circle015'
                geometry={nodes.Circle015.geometry}
                material={materials["Plastic white"]}
                skeleton={nodes.Circle015.skeleton}
              />
              <skinnedMesh
                name='Circle015_1'
                geometry={nodes.Circle015_1.geometry}
                material={materials["blue rubber"]}
                skeleton={nodes.Circle015_1.skeleton}
              />
            </group>
            <group name='Handle_R'>
              <skinnedMesh
                castShadow
                name='Circle009'
                geometry={nodes.Circle009.geometry}
                material={materials["Plastic white"]}
                skeleton={nodes.Circle009.skeleton}
              />
              <skinnedMesh
                name='Circle009_1'
                geometry={nodes.Circle009_1.geometry}
                material={materials["blue rubber"]}
                skeleton={nodes.Circle009_1.skeleton}
              />
            </group>
            <primitive object={nodes.Bone} />
            <primitive object={nodes.Bone001} />
          </group>

          <group name='Glass'>
            <mesh name='Circle014' castShadow receiveShadow geometry={nodes.Circle014.geometry} material={materials.Glass} />
            <mesh name='Circle014_1' castShadow receiveShadow geometry={nodes.Circle014_1.geometry} material={materials["Glass B"]} />
            <group name='Edge'>
              <mesh name='mesh001' castShadow receiveShadow geometry={nodes.mesh001.geometry} material={materials["Plastic white"]} />
              <mesh name='mesh001_1' castShadow receiveShadow geometry={nodes.mesh001_1.geometry} material={materials.Logo} />
            </group>
            <mesh
              name='Nose'
              castShadow
              receiveShadow
              geometry={nodes.Nose.geometry}
              material={materials["Nose rubber"]}
              position={[0, 0, 0.012]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("http://localhost:5173/src/assets/Glasses.glb");
