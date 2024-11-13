import gsap from "gsap";

export default function Preloader() {

    let tl = gsap.timeline({ repeat: -1 });

       tl.to(".dot-first", { opacity: 1, duration: 0.5})
         .to(".dot-second", { opacity: 1, duration: 0.5 })
         .to(".dot-third", { opacity: 1, duration: 0.5 });

}