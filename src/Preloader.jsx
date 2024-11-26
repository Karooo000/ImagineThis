import { useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";


const preLoader = document.querySelector(".contain-preloader")

export default function Preloader() {

  const { progress } = useProgress();
  const loadingGone = useRef()

    let tl = gsap.timeline({ repeat: -1 });

       tl.to(".dot-first", { opacity: 1, duration: 0.5})
         .to(".dot-second", { opacity: 1, duration: 0.5 })
         .to(".dot-third", { opacity: 1, duration: 0.5 });

    
  setTimeout(() => {
    if(progress > 99){
      //preLoader.classList.remove("active")
      console.log("code ran")
      
      

      loadingGone.current = gsap.timeline()

      loadingGone.current
      .to(preLoader, {yPercent: -170, opacity: 0, duration: 1},"sameTimeeee")
      
      

      setTimeout(() => {
          preLoader.classList.remove("active")
      }, "1200")
      
      
    }
}, "1200")

}