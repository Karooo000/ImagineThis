import { useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";


const preLoader = document.querySelector(".contain-preloader")
const preLoaderContain = document.querySelector(".preload-new")

export default function Preloader() {

  const { progress } = useProgress();
  const loadingGone = useRef()

/* 
    let tl = gsap.timeline({ repeat: -1 });

       tl.to(".dot-first", { opacity: 1, duration: 0.5})
         .to(".dot-second", { opacity: 1, duration: 0.5 })
         .to(".dot-third", { opacity: 1, duration: 0.5 }); */

         gsap.to("#procentage", {
          innerText:99,
          duration: 35,
          snap : {
             innerText: 1
          }
        });

    
  setTimeout(() => {
    if(progress > 99){
      //preLoader.classList.remove("active")
      //console.log("code ran")
      
      

      loadingGone.current = gsap.timeline()
    

      loadingGone.current
      //.to(preLoader, {yPercent: -170, opacity: 0, duration: 1},"sameTimeeee")
     /*  .to(".left-text", {yPercent: 0, opacity: 1, duration: 1}, "happensSameTime")
      .to(".right-text", {yPercent: 0, opacity: 1, duration: 1}, "happensSameTime")
      .to(".left-text", {xPercent: -500, opacity: 0, duration: 2}, "happensSameTimeSecond")
      .to(".right-text", {xPercent: 500, opacity: 0, duration: 2}, "happensSameTimeSecond")
      .to(".wegotyou-text", {yPercent: 0, opacity: 1, duration: 1})
      .to(".wegotyou-text", {yPercent: -100, opacity: 0, duration: 2, delay: 1})
      .to(".introducing-text", {yPercent: 0, opacity: 1, duration: 1})
      .to(".introducing-text", {yPercent: -100, opacity: 0, duration: 2, delay: 1})
      .to(".theonlysportsglasses", {yPercent: 0, opacity: 1, duration: 1})
      .to(".youwilleverneed", {yPercent: 0, opacity: 1, duration: 1})
      .to(".theonlysportsglasses", {yPercent: -100, opacity: 0, duration: 2, delay: 1})
      .to(".youwilleverneed", {yPercent: -100, opacity: 0, duration: 2, delay: 1}) */
      .to(preLoaderContain, {yPercent: -170, opacity: 0, duration: 1})
      
      

      setTimeout(() => {
          preLoaderContain.classList.remove("active")
      }, "1200")
      
      
    }
}, "2200")

}