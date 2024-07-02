import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";


import IntroAnimations from "./IntroAnimations";
import Animations from "./Animations";
import { useGSAP } from "@gsap/react";





gsap.registerPlugin(ScrollTrigger);

export default function Model(props) {

 const group = useRef();
 const { nodes, materials, animations } = useGLTF("http://localhost:5173/src/assets/DopoDraco.glb");
 const { ref, mixer, names, actions, clips } = useAnimations(
   animations,
   group
 );
 const { progress } = useProgress();
 const viewport = useThree((state) => state.viewport);



  let isMobileSize = window.innerWidth < 1280
  let isTabletSize = 550 < window.innerWidth && window.innerWidth < 1280

 //FOV based on screensize ( responsive )

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


 // Scroll to top on reload

 window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

// Trying camera swap on breakpoint 



let mobCameraTrue
let deskCamera

window.addEventListener("resize", () => {

  ScrollTrigger.refresh()

  if(window.innerWidth < 1280){
    mobCameraTrue = true
    deskCamera = false
    console.log(deskCamera, mobCameraTrue)
    
  } else {
    mobCameraTrue = false
    deskCamera = true
    console.log(deskCamera, mobCameraTrue)
  }
})
/*
//Which camera is active

let innitialNormalDesk = isMobileSize ? false : true
let innitialNormalMob = isMobileSize ? true : false

  
  const [introCameraTrue, setIntroCameraTrue] = useState(innitialNormalDesk);
  const [normalCameraTrue, setNormalCameraTrue] = useState(false);

  //const [mobIntroCameraTrue, setMobIntroCameraTrue] = useState(innitialNormalMob);
  const [mobNormalCameraTrue, setMobNormalCameraTrue] = useState(innitialNormalMob);



//console.log(actions)

  useLayoutEffect(() => {
      if(progress > 99){
          
       

          const introClip = actions.IntroAction
          const introClipMob = actions.IntroMobb

          let whichClip = isMobileSize ? introClipMob : introClip
        
            
          introClip.clampWhenFinished = true
          introClip.loop = false
          introClip.repetitions = 1
        
          introClipMob.clampWhenFinished = true
          introClipMob.loop = false
          introClipMob.repetitions = 1
          
          
          setTimeout(() => {
            console.log("play should run")
            whichClip.play()
          }, "2200")

          
          
            setTimeout(() => {
              console.log("reser should have happened")
              whichClip.fadeOut(0.1)
              document.querySelector("html").style.position = "relative"
            }, "3100")

     

        setTimeout(() => {
            console.log("camera swap")
            if(!isMobileSize){
              setIntroCameraTrue(false)
             setNormalCameraTrue(true)
             setMobNormalCameraTrue(false)

            }else{
              //setMobIntroCameraTrue(false)
              setMobNormalCameraTrue(true)
              setIntroCameraTrue(false)
              setNormalCameraTrue(false)
            }


            
            document.querySelector("html").style.position = "relative"
        }, "4200")
    }
    
  }, [])
  
*/

  /*

  useLayoutEffect(() => {
    if(mobSwitcher !== innitialIsMob){
      setInnitialIsMob(prev => !prev)
  
      if(!isMobileSize){
        if(!introCameraTrue){
          setNormalCameraTrue(true)
          setMobNormalCameraTrue(false)
          ScrollTrigger.refresh()
          //deskNormalCamera.updateProjectionMatrix()
          //deskNormalCamera.matrixWorldNeedsUpdate = true
          //PerspectiveCamera.render.makeDefault = true
        }
      }else{
        if(!mobIntroCameraTrue){
        setNormalCameraTrue(false)
          setMobNormalCameraTrue(true)
          ScrollTrigger.refresh()
          //mobCameraa.updateProjectionMatrix()
          //mobCameraa.matrixWorldNeedsUpdate = true
          //PerspectiveCamera.render.makeDefault = true
      }
  
      console.log("breakpoint has been swapped")
    }}

  }, [mobSwitcher])
  */



  

  useLayoutEffect(() => {
    // so you can click on the btns
    const rootDiv = document.getElementById("root")
    rootDiv.childNodes[0].style.pointerEvents = "none"

      //make numbers glow

    nodes.numbers_as_mesh.material.color.r = 2;
    nodes.numbers_as_mesh.material.color.g = 2;
    nodes.numbers_as_mesh.material.color.b = 2;

    nodes.numbers_as_mesh.material.emissive.r = 1;
    nodes.numbers_as_mesh.material.emissive.g = 1;
    nodes.numbers_as_mesh.material.emissive.b = 1;
    nodes.numbers_as_mesh.material.emissiveIntensity = 1.1;
    nodes.numbers_as_mesh.material.toneMapped = false;

  }, []);


  useGSAP(() => {

    console.log("gsap hook")

    /* Scroll animation STARTS */

      let whichAnimLenght = isMobileSize ? 150 : 120
      let whichDuration = isMobileSize ? 6 : 5

      const clipMob = actions.MobCamera
      const clipDesktop = actions.WholeAnim;
  
      let clip = isMobileSize ? clipMob : clipDesktop
  
      const animationDuration = clip._clip.duration;
      const frame = animationDuration / whichAnimLenght;
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
      immediateRender: false,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "bottom bottom",
        endTrigger: "#section-6",
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
        duration: whichDuration,
      }
    );

    /* Scroll animation FINISHES */

    /* Intro Animation STARTS */

    setTimeout(() => {

      if(progress > 99){
        //console.log("anim starts")



        let moveBlackLeftOval = gsap.fromTo
        ('.black-oval.lower', 
          {scale:4},
          {scale: 1, duration: 1 , ease: "power4.out", delay: 0.5},
      );
          
          let moveBlackRightOval = gsap.fromTo
          ('.black-oval.upper', 
          {scale:4 },
          {scale: 1, duration: 1, ease: "power4.out", delay: 0.5},
      );

          let moveBlueLeftOval = gsap.fromTo
          ('.blue-oval.lower', 
          {scale:2},
          {scale: 1, duration: 1, ease: "power4.out", delay: 0.5},
      );

          let moveBlueRightOval = gsap.fromTo
          ('.blue-oval.upper', 
          {scale:2 },
          {scale: 1, duration: 1, ease: "power4.out", delay: 0.5},
      );
   
    
         let moveHeading = gsap.fromTo
         ('.h1', 
           {xPercent: -110},
           {xPercent: 0, duration: 0.8, ease: "power4.out", delay: 1.5},
       );

           let moveHeading2 = gsap.fromTo
           ('.text.bank', 
           {xPercent: 130},
           {xPercent: 0, duration: 0.8, ease: "power4.out", delay: 1.5},
       );

           let moveHeading3 = gsap.fromTo
           ('.text.large', 
               {y: 110, opacity: 0},
               {y: 0, opacity: 1, duration: 0.8, ease: "power4.out", delay: 1.6},
           );

           let moveHeroSticker = gsap.fromTo
           ('.yellow-ribbon-contain', 
               { opacity: 0},
               {opacity: 1, duration: 2, ease: "power4.out", delay: 1.8},
           );
 
        }
      }, "1500")

/* Intro Animation FINISHES */

/* All anim for all screens */
         /* Leave first screen Animations */
            
            let heroLeave = gsap.timeline({
              ease: "power4.out",
              scrollTrigger: {
                trigger: "#section-2",
                start: "top bottom",
                end: "bottom 20%",
                scrub: 1,
                
              },
            })

          heroLeave
          .to(".black-oval.lower", {opacity: 0, yPercent: -100, scale: 0, duration: 0.5}, "sameTime")
          .to(".blue-oval.lower", {opacity: 0, yPercent: -100, scale: 0, duration: 0.5}, "sameTime")
          .to(".black-oval.upper", {opacity: 0, yPercent: 25, xPercent: -150, scale: 0, duration: 0.5}, "sameTime")
          .to(".blue-oval.upper", {opacity: 0, yPercent: 25, xPercent: -150, scale: 0, duration: 0.5}, "sameTime")
          .to(".h1", {opacity: 0, xPercent: 100, duration: 0.5}, "sameTime")
          .to(".text.bank", {opacity: 0, xPercent: -200, duration: 0.5}, "sameTime")
          .to(".text.large", {opacity: 0, yPercent: -10, duration: 0.2}, "sameTime")
          .to(".yellow-ribbon-contain", {opacity: 0, yPercent: -75, duration: 0.2}, "sameTime")

          /* Second screen intro & outro */ 

          // lines

          gsap.set(".line.left", { xPercent: -110, opacity: 0 });

          const tlLineLeft = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-2",
              start: "top 30%",
              end: "bottom 50%",
              endTrigger: "#section-2",
              scrub: 1,
            }
          })

          tlLineLeft.to(".line.left", {
              xPercent: 0,
              opacity: 1,
              ease: "expo",
              duration: 0.5,
            });
            tlLineLeft.to(".line.left", {
              xPercent: -110,
              opacity: 0,
              ease: "expo",
              duration: 0.5,
            });

          gsap.set(".line.right", { xPercent: 110, opacity: 0 });

          const tlLineRight = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-2",
              start: "top 30%",
              end: "bottom 50%",
              endTrigger: "#section-2",
              scrub: 1,
            }
          })

          tlLineRight.to(".line.right", {
              xPercent: 0,
              opacity: 1,
              ease: "expo",
              duration: 0.5,
          });

          tlLineRight.to(".line.right", {
            xPercent: 110,
            opacity: 0,
            ease: "expo",
            duration: 0.5,
        });

          //circles-contain
          gsap.set(".circles-contain.desktop", { scale: 0, opacity: 0 });

          const tlCirclesContain = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-2",
              start: "top 35%",
              end: "bottom 50%",
              endTrigger: "#section-2",
              scrub: 1,
            }
          })

          tlCirclesContain.to(".circles-contain.desktop", {
              scale: 1,
              opacity: 1,
              ease: "power4.out",
              duration: 0.5,
          });
          tlCirclesContain.to(".circles-contain.desktop", {
            scale: 0,
            opacity: 0,
            ease: "power4.out",
            duration: 0.5,
        });

          //info-contain-screen2
          gsap.set(".info-contain-screen2", { yPercent: 100, opacity: 0 });

          const tlSecScreenInfoContain = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-2",
              start: "top 35%",
              end: "bottom 50%",
              endTrigger: "#section-2",
              scrub: 1,
            }
          })

          tlSecScreenInfoContain.to(".info-contain-screen2", {
              yPercent: 0,
              opacity: 1,
              ease: "power4.out",
              duration: 1,
          });
          tlSecScreenInfoContain.to(".info-contain-screen2", {
            yPercent: -100,
            opacity: 0,
            ease: "power4.out",
            duration: 1,
        });


        let mm = gsap.matchMedia()

        /* Desktop only animations */

        mm.add("(min-width: 1280px)", () => {
          /* Sceen 3 intro & Outro Starts */
          //line-long
          gsap.set(".line-long", { scale: 0 });


          const tlLongLineScreen3 = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-4",
                start: "top 30%",
                end: "bottom 50%",
                endTrigger: "#section-4",
                scrub: 1,
              }
            })
            tlLongLineScreen3.to(".line-long", {
              scale: 1,
              ease: "power4.out",
              duration: 0.5,
            })
            tlLongLineScreen3.to(".line-long", {
              scale: 0,
              ease: "power4.out",
              duration: 0.5,
            })

            //line-vertical.desktop
            gsap.set(".line-vertical.desktop", { scale: 0 });


            const tlLeftVerticalLineScreen3 = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-4",
                  start: "top 30%",
                  end: "bottom 50%",
                  endTrigger: "#section-4",
                  scrub: 1,
                }
              })
              tlLeftVerticalLineScreen3.to(".line-vertical.desktop", {
                scale: 1,
                ease: "power4.out",
                duration: 0.5,
              })
              tlLeftVerticalLineScreen3.to(".line-vertical.desktop", {
                scale: 0,
                ease: "power4.out",
                duration: 0.5,
              })

              //line-vertical-right.desktop
              gsap.set(".line-vertical-right.desktop", { scale: 0 });

              const tlRightVerticalLineScreen3 = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-4",
                    start: "top 30%",
                    end: "bottom 50%",
                    endTrigger: "#section-4",
                    scrub: 1,
                  }
                })
                tlRightVerticalLineScreen3.to(".line-vertical-right.desktop", {
                  scale: 1,
                  ease: "power4.out",
                  duration: 0.5,
                })
                tlRightVerticalLineScreen3.to(".line-vertical-right.desktop", {
                  scale: 0,
                  ease: "power4.out",
                  duration: 0.5,
                })

                //move-contain.first
                gsap.set(".move-contain.first", { yPercent: 100, opacity: 0 });

                const tlMovetext1 = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-4",
                      start: "top 30%",
                      end: "bottom 50%",
                      endTrigger: "#section-4",
                      scrub: 1,
                    }
                  })
                  tlMovetext1.to(".move-contain.first", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetext1.to(".move-contain.first", {
                    opacity: 0,
                    yPercent: -100,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                   //move-contain.second
                gsap.set(".move-contain.second", { yPercent: 100, opacity: 0 });

                const tlMovetext2 = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-4",
                      start: "top 20%",
                      end: "bottom 50%",
                      endTrigger: "#section-4",
                      scrub: 1,
                    }
                  })
                  tlMovetext2.to(".move-contain.second", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetext2.to(".move-contain.second", {
                    opacity: 0,
                    yPercent: -100,
                    ease: "power4.out",
                    duration: 0.5,
                  })

                //move-contain.third
                gsap.set(".move-contain.third", { yPercent: 100, opacity: 0 });

                const tlMovetext3 = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-4",
                      start: "top 10%",
                      end: "bottom 50%",
                      endTrigger: "#section-4",
                      scrub: 1,
                    }
                  })
                  tlMovetext3.to(".move-contain.third", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetext3.to(".move-contain.third", {
                    opacity: 0,
                    yPercent: -100,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  //bottom-contain
                  gsap.set(".bottom-contain.third", { yPercent: 100, opacity: 0 });

                  const tlMovetextContainer3 = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-4",
                        start: "top 10%",
                        end: "bottom 50%",
                        endTrigger: "#section-4",
                        scrub: 1,
                      }
                    })
                    tlMovetextContainer3.to(".bottom-contain.third", {
                      opacity: 1,
                      yPercent: 0,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    tlMovetextContainer3.to(".bottom-contain.third", {
                      opacity: 0,
                      yPercent: -100,
                      ease: "power4.out",
                      duration: 0.5,
                    })

          /* Screen 3 intro & Outro finishes */

          /* Screen 4 intro & Outro starts */
              //comes-text
              gsap.set(".comes-text", { xPercent: -10, opacity: 0 });

              const tlMovetextComes = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-5",
                    start: "top 50%",
                    end: "bottom 50%",
                    endTrigger: "#section-5",
                    scrub: 1,
                  }
                })
                tlMovetextComes.to(".comes-text", {
                  opacity: 1,
                  xPercent: 0,
                  ease: "power4.out",
                  duration: 0.5,
                })
                tlMovetextComes.to(".comes-text", {
                  opacity: 0,
                  xPercent: 30,
                  ease: "power4.out",
                  duration: 0.5,
                })

                //with-text
                gsap.set(".with-text", { yPercent: -100, opacity: 0 });

                const tlMovetextWith = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-5",
                      start: "top 50%",
                      end: "bottom 50%",
                      endTrigger: "#section-5",
                      scrub: 1,
                    }
                  })
                  tlMovetextWith.to(".with-text", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetextWith.to(".with-text", {
                    opacity: 0,
                    yPercent: 30,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                   //a-text
                gsap.set(".a-text", { yPercent: 30, opacity: 0 });

                const tlMovetextA = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-5",
                      start: "top 50%",
                      end: "bottom 50%",
                      endTrigger: "#section-5",
                      scrub: 1,
                    }
                  })
                  tlMovetextA.to(".a-text", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetextA.to(".a-text", {
                    opacity: 0,
                    yPercent: -10,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  //protective-text
                  gsap.set(".protective-text", { xPercent: -30, opacity: 0 });

                  const tlMovetextProtective = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-5",
                        start: "top 40%",
                        end: "bottom 50%",
                        endTrigger: "#section-5",
                        scrub: 1,
                      }
                    })
                    tlMovetextProtective.to(".protective-text", {
                      opacity: 1,
                      xPercent: 0,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    tlMovetextProtective.to(".protective-text", {
                      opacity: 0,
                      xPercent: 20,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    //sleeve-text
                    gsap.set(".sleeve-text", { xPercent: 30, opacity: 0 });

                    const tlMovetextSleeve = gsap.timeline({
                        scrollTrigger: {
                          trigger: "#section-5",
                          start: "top 40%",
                          end: "bottom 50%",
                          endTrigger: "#section-5",
                          scrub: 1,
                        }
                      })
                      tlMovetextSleeve.to(".sleeve-text", {
                        opacity: 1,
                        xPercent: 0,
                        ease: "power4.out",
                        duration: 0.5,
                      })
                      tlMovetextSleeve.to(".sleeve-text", {
                        opacity: 0,
                        xPercent: -20,
                        ease: "power4.out",
                        duration: 0.5,
                      })

          /* Screen 4 intro & Outro finishes */

          /* Screen 5 intro starts */
          //yellow-price-contain
          gsap.set(".yellow-price-contain", { scale: 0});

          const tlYellowPriceContain = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-6",
                start: "top 40%",
                end: "bottom bottom",
                endTrigger: "#section-6",
                scrub: 1,
              }
            })
            tlYellowPriceContain.to(".yellow-price-contain", {
              scale: 1,
              ease: "power4.out",
              duration: 0.5,
            })

            //screen5-shadow.cover
            gsap.set(".screen5-shadow.cover", { opacity: 0, scale: 0.3, yPercent: -100});

            const tlScreen5CoverShadow = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-6",
                  start: "top 20%",
                  end: "bottom bottom",
                  endTrigger: "#section-6",
                  scrub: 1,
                }
              })
              tlScreen5CoverShadow.to(".screen5-shadow.cover", {
                opacity: 0.8,
                scale: 1,
                yPercent: 0,
                ease: "power4.out",
                duration: 0.5,
              })

                 //screen5-shadow.battery
            gsap.set(".screen5-shadow.battery", { opacity: 0, scale: 0.3, yPercent: -100});

            const tlScreen5BatteryShadow = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-6",
                  start: "top 2%",
                  end: "bottom bottom",
                  endTrigger: "#section-6",
                  scrub: 1,
                }
              })
              tlScreen5BatteryShadow.to(".screen5-shadow.battery", {
                opacity: 0.7,
                scale: 1,
                yPercent: 0,
                ease: "power4.out",
                duration: 0.5,
              })


          /* Screen 5 intro fnishes */   

           /* Extras timelines starts */
          //big-blue-oval

          gsap.set(".big-blue-oval", { xPercent: 0, yPercent: 100,scale: 0, opacity: 0 });


          const tlBlueOval = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-6",
                start: "top 50%",
                end: "bottom bottom",
                endTrigger: "#section-6",
                scrub: true,
              }
            })
            tlBlueOval.to(".big-blue-oval", {
              yPercent: 0,
              xPercent: 0,
              scale: 1,
              opacity: 0.2,
              ease: "expo",
              duration: 0.5,
            })
            tlBlueOval.to(".big-blue-oval", {
              yPercent: -20,
              xPercent: 0,
              scale: 0.8,
              opacity: 0.15,
              ease: "none",
              duration: 0.5,
            })
            tlBlueOval.to(".big-blue-oval", {
             yPercent: -10,
             xPercent: 0,
             scale: 0.8,
             opacity: 0.2,
             ease: "none",
             duration: 0.5,
           })
           tlBlueOval.to(".big-blue-oval", {
             yPercent: -15,
             xPercent: -28,
             scale: 0.7,
             opacity: 0.1,
             ease: "none",
             duration: 0.5,
           })

           //white-oval
      gsap.set(".white-oval", { yPercent: 0,scale: 0, opacity: 0 });

      const tlWhiteOval = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-2",
            start: "top 50%",
            end: "bottom 50%",
            endTrigger: "#section-2",
            scrub: true,
          }
        })
        tlWhiteOval.to(".white-oval", {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "expo",
          duration: 0.5,
        })
        tlWhiteOval.to(".white-oval", {
          yPercent: 75,
          scale: 0,
          opacity: 0,
          ease: "none",
          duration: 0.2,
        })
 
           //darker-oval
      gsap.set(".darker-oval", { yPercent: 0,scale: 0, opacity: 0 });

      const tlDarkOval = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-2",
            start: "top 50%",
            end: "bottom 50%",
            endTrigger: "#section-2",
            scrub: true, 
          }
        })
        tlDarkOval.to(".darker-oval", {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "expo",
          duration: 0.5,
        })
        tlDarkOval.to(".darker-oval", {
          yPercent: 75,
          scale: 0,
          opacity: 0,
          ease: "none",
          duration: 0.2,
        })

        gsap.set(".screen2-shadow", { yPercent: 0,scale: 0, opacity: 0 });
 
        const tlShadow = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-2",
              start: "top 50%",
              end: "bottom 50%",
              endTrigger: "#section-2",
              scrub: true,
            }
          })
          tlShadow.to(".screen2-shadow", {
            yPercent: 0,
            scale: 1,
            opacity: 0.65,
            ease: "expo",
            duration: 0.5,
          })
          tlShadow.to(".screen2-shadow", {
            yPercent: 75,
            scale: 0,
            opacity: 0,
            ease: "none",
            duration: 0.2,
          })

          //bottom-glow
          gsap.set(".bottom-glow", { scale:0.8 , opacity: 0, xPercent: 0 });
      
        const tlBottomGlow = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-4",
            start: "top 30%",
            end: "bottom bottom",
            endTrigger: "#section-6",
            scrub: true,
          }})

          tlBottomGlow.to(".bottom-glow", {
            xPercent: 0,
            scale: 1, 
            opacity: 1,
            duration: 0.5,
          })
          tlBottomGlow.to(".bottom-glow", {
            xPercent: 0,
            scale: 1, 
            opacity: 1,
            duration: 0.5,
          })
          tlBottomGlow.to(".bottom-glow", {
            xPercent: -30,
            scale: 0.6, 
            opacity: 0.75,
            duration: 0.5,
          })

           //screen3-shadow
           gsap.set(".screen3-shadow", { yPercent: 0,scale: 0, opacity: 0 });
 
           const tlShadow3 = gsap.timeline({
               scrollTrigger: {
                 trigger: "#section-4",
                 start: "top 50%",
                 end: "bottom 70%",
                 endTrigger: "#section-4",
                 scrub: true,
               }
             })
             tlShadow3.to(".screen3-shadow", {
               yPercent: 0,
               scale: 1,
               opacity: 0.65,
               ease: "expo",
               duration: 0.5,
             })
             tlShadow3.to(".screen3-shadow", {
               yPercent: 50,
               scale: 0.8,
               opacity: 0,
               ease: "none",
               duration: 0.2,
             })

             //screen4-shadow
             gsap.set(".screen4-shadow", { yPercent: 0,scale: 0, opacity: 0 });
 
             const tlShadow4 = gsap.timeline({
                 scrollTrigger: {
                   trigger: "#section-5",
                   start: "top 50%",
                   end: "bottom 80%",
                   endTrigger: "#section-5",
                   scrub: true,
                 }
               })
               tlShadow4.to(".screen4-shadow", {
                 yPercent: 0,
                 scale: 1,
                 opacity: 0.65,
                 ease: "expo",
                 duration: 0.5,
               })
               tlShadow4.to(".screen4-shadow", {
                 yPercent: 10,
                 scale: 0.8,
                 opacity: 0,
                 ease: "none",
                 duration: 0.2,
               })
     
             })
   
           })

       
           
 
         /* Extras timelines finishes */

     

        

         

        
         


  


  //batterybank material swap

const blueCol = document.querySelector(".col-blue")
const grayCol = document.querySelector(".col-gray")

const [isBlueTrue, setIsBlueTrue] = useState(true);


let pbMaterial = isBlueTrue ? 'PB material' : 'PB Gray'


blueCol.addEventListener("click", blueClick)
grayCol.addEventListener("click", grayClick)

    function blueClick(){
        setIsBlueTrue(true)
    }

    function grayClick(){
        setIsBlueTrue(false)   
    }



return (
  <group ref={group} {...props} dispose={null}>
    <group name="Scene">
      <group
        name="Empty_-_move_cover"
        position={[0.002, -0.82, -0.002]}
        rotation={[0.009, -0.078, -0.001]}
        scale={0.032}>
        <mesh
          name="stitch"
          castShadow
          receiveShadow
          geometry={nodes.stitch.geometry}
          material={materials['Cover material']}
          position={[0.003, 0.286, 0.003]}
          scale={31.091}
        />
      </group>
      <group name="Empty_-_move_battery" rotation={[0.07, -0.099, 0.071]}>
        <mesh
          name="Battery_bank"
          castShadow
          receiveShadow
          geometry={nodes.Battery_bank.geometry}
          material={materials[pbMaterial]}
          position={[0, -0.001, 0]}
          scale={0.993}
        />
        <spotLight
          name="k_soft_shadow_light"
          intensity={0.62866}
          angle={0.323}
          penumbra={0.15}
          decay={2}
          position={[0.565, -0.083, -0.489]}
          rotation={[3.09, 0.89, 1.722]}>
          <group position={[0, 0, -1]} />
        </spotLight>
        <spotLight
          name="Keylight"
          intensity={0.470288}
          angle={0.277}
          penumbra={0.15}
          decay={2}
          position={[0.638, 0.27, 0.07]}
          rotation={[-1.431, 1.155, 0.056]}>
          <group position={[0, 0, -1]} />
        </spotLight>
        <mesh
          name="numbers_as_mesh"
          castShadow
          receiveShadow
          geometry={nodes.numbers_as_mesh.geometry}
          material={materials['numbers glow material']}
          position={[0.0105, 0.061, 0.022]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={0.009}
        />
      </group>
      <spotLight
        name="light-frame5"
        intensity={0.4446}
        angle={0.255}
        penumbra={0.335}
        decay={2}
        position={[0.881, 0.15, 1.223]}
        rotation={[-0.12, 0.628, -1.517]}
        scale={0.714}>
        <group position={[0, 0, -1]} />
      </spotLight>
      <spotLight
        name="Spot_1"
        intensity={0.6896}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        position={[0, 3.229, 0]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[0, 0, -1]} />
      </spotLight>
      
      <mesh
        name="Plane_for_gray"
        castShadow
        receiveShadow
        geometry={nodes.Plane_for_gray.geometry}
        material={materials['PB Gray']}
        position={[16.174, -11.861, -62.359]}
      />
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
     
    </group>
  </group>
)
}


useGLTF.preload('http://localhost:5173/src/assets/DopoDraco.glb')


/*
materials[pbMaterial]
k_soft_shadow_light - 0.62866
Keylight - 0.470288
light-frame5 - 0.4446
Spot_1 - 0.6896
normalCameraTrue
introCameraTrue
fovNew
*/

