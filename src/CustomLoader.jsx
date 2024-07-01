import { useProgress } from "@react-three/drei";
import gsap from "gsap";

export default function CustomLoader() {
      /* Loading screen */

  const { progress } = useProgress();
 

  let loadingScreen = document.getElementById("loadingScreen")
  let loadingBar = document.querySelector(".loading-bar")
  let loadingNumbers = document.getElementById("numbersLoading")

  let visibleNumber = progress.toFixed(0);

  loadingNumbers.innerText = visibleNumber

  loadingBar.style.width =`${progress}%`

  setTimeout(() => {
      if(progress > 99){

        let loadingGone = gsap.timeline()

        loadingGone
        .to(".wrapper-loading", {yPercent: -70, opacity: 0, duration: 0.25},"sameTime")
        .to(loadingBar, {xPercent: 100}, "sameTime")
        .to(".loading-blue-oval.left", {marginTop:"60vh", scale: 2, duration: 1}, "sameTime")
        .to(".loading-blue-oval.right", {marginBottom:"60vh", scale: 2, duration: 1}, "sameTime")
        .to(".loading-black-oval.left", {marginTop:"60vh", scale: 4, duration: 1}, "sameTime")
        .to(".loading-black-oval.right", {marginBottom: "60vh", scale: 4, duration: 1}, "sameTime")
        

        setTimeout(() => {
            loadingScreen.classList.remove("active")
        }, "1000")
        
      }
  }, "1200")




  }