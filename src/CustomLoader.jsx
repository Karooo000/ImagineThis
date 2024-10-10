import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useRef } from "react";

let loadingScreen = document.getElementById("loadingScreen")
let loadingBar = document.querySelector(".loading-bar")
let loadingNumbers = document.querySelector(".numbers-loading")

export default function CustomLoader() {
      /* Loading screen */

  const { progress } = useProgress();
  const loadingGone = useRef()

  

  // get a reference to the elements we want to animate
  


gsap.to(".numbers-loading", {
    innerText:99,
    duration: 5,
    snap : {
       innerText: 1
    }
  });




 

 

  //let visibleNumber = progress.toFixed(0);

  //loadingNumbers.innerText = visibleNumber

  loadingBar.style.width =`${progress}%`

  setTimeout(() => {
      if(progress > 99){
        
        loadingNumbers.innerText = progress

        loadingGone.current = gsap.timeline()

        loadingGone.current
        .to(".wrapper-loading", {yPercent: -70, opacity: 0, duration: 0.25},"sameTimeeee")
        .to(loadingBar, {xPercent: 100}, "sameTimeeee")
        .to(".loading-blue-oval.left", {marginTop:"60vh", scale: 1.3, duration: 0.5}, "sameTimeeee")
        .to(".loading-blue-oval.right", {marginBottom:"60vh", scale: 1.3, duration: 0.5}, "sameTimeeee")
        .to(".loading-black-oval.left", {marginTop:"60vh", scale: 2.2, duration: 0.5}, "sameTimeeee")
        .to(".loading-black-oval.right", {marginBottom: "60vh", scale: 2.2, duration: 0.5}, "sameTimeeee")
        
        

        setTimeout(() => {
            loadingScreen.classList.remove("active")
        }, "1200")
        
      }
  }, "1200")




  }