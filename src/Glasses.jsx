import React, { useRef, useEffect, useLayoutEffect, useState,  } from "react";
import { useGLTF, PerspectiveCamera, useAnimations, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);






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

 let fovNewClamp = fovOriginal + fovInBetween
 let fovNew = fovNewClamp > 25 ? 25 : fovNewClamp

 //anim variables

 let whichAnimLenghtMob = 150;
 let whichAnimLenghtDesk = 120;

 let whichDurationMob = 6.25;
 let whichDurationDesk = 5;

 window.onbeforeunload = function () {
  setTimeout(() => {

    window.scroll({ top: -1, left: 0});
  
  }, 10); 
}







export default function Model(props) {

 const group = useRef();

 const heroLeave = useRef()
 const tlMovetextComes = useRef()
 const tlDesk = useRef()
 const tlMob = useRef()
 const tlMovetextWith = useRef()
 const tlMovetextA = useRef()
 const tlMovetextProtective = useRef()
 const tlMovetextSleeve = useRef()
 const mm = useRef()
 const mmm = useRef()
 const tlYellowPriceContain = useRef()
 const tlSecScreenInfoContain = useRef()
 const tlLineUpper = useRef()
 const tlCirclesContain = useRef()
 const tlThirdMobScreenInfoContain = useRef()
 const tlLineLower = useRef()
 const tlCirclesContainMobLower = useRef()
 const tlMovetextStagger = useRef()
 const tlLongLineScreen3 = useRef()
 const tlLeftVerticalLineScreen3 = useRef()
 const tlBottomScreen4Contain = useRef()
 const tlBlueOval = useRef()
 const tlBottomGlow = useRef()
 const tlShadow4 = useRef()
 const tlShadow5 = useRef()
 const tlScreen5CoverShadow = useRef()
 const tlScreen5BatteryShadow = useRef()
 


 const { nodes, materials, animations } = useGLTF("https://dopocodee.netlify.app/Dopo22.glb");
 
 //"http://localhost:5173/src/assets/Dopo22.glb"
 //"https://dopocodee.netlify.app/Dopo22.glb"
 const { ref, mixer, names, actions, clips } = useAnimations(
   animations,
   group
 );
 const { progress } = useProgress();
 const viewport = useThree((state) => state.viewport);

//console.log(mixer)

/*
useFrame((state, delta) => {
  mixer.update(delta);
  // console.log(ca);
});
*/




 useEffect(() => {
  //actions.MobAnim.play()
  //actions.DeskAction.play()
  

  //Anim
 setTimeout(() => {

  if(progress > 99){
    //console.log("anim starts")



    let moveBlackLeftOval = gsap.fromTo
    ('.black-oval.lower', 
      {scale:3},
      {scale: 1, duration: 1 , ease: "power4.out", delay: 0.5},
  );
      
      let moveBlackRightOval = gsap.fromTo
      ('.black-oval.upper', 
      {scale:3},
      {scale: 1, duration: 1, ease: "power4.out", delay: 0.5},
  );

      let moveBlueLeftOval = gsap.fromTo
      ('.blue-oval.lower', 
      {scale:2, zIndex: -6},
      {scale: 1,zIndex: -6 , duration: 1, ease: "power4.out", delay: 0.5},
  );

      let moveBlueRightOval = gsap.fromTo
      ('.blue-oval.upper', 
      {scale:2, zIndex: -6 },
      {scale: 1,zIndex: -6, duration: 1, ease: "power4.out", delay: 0.5},
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

    

    actions.IntroDesk.clampWhenFinished = true
    actions.IntroMob.clampWhenFinished = true

    setTimeout(()=> {
      //console.log(isMobileSize)
      isMobileSize ? actions.IntroMob.play().fadeOut(0.6) : actions.IntroDesk.play().fadeOut(.6)


    }, "600")

  

  }, "1600")


 }, [])

 


 // Scroll to top on reload




  if(progress > 99){
    document.querySelector("html").style.position = "relative"
  }

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    mobCameraTrue: window.innerWidth < 1280 ? true : false,
    deskCameraTrue: window.innerWidth < 1280 ? false : true,
  });

  

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {

      /*
      if(tlDesk.current && tlMob.current){
        window.innerWidth < 1280 ? tlDesk.current.pause(true) : tlMob.current.pause(true)
        console.log(tlDesk)
      }
      
      */



      // Set window width/height to state



      setWindowSize({
        width: window.innerWidth,
        mobCameraTrue: window.innerWidth < 1280 ? true : false,
        deskCameraTrue: window.innerWidth < 1280 ? false : true,
      });

      ScrollTrigger.refresh();
      gsap.matchMediaRefresh();
      
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSize]);

  /*
  useEffect(() => {

    ScrollTrigger.refresh();
    gsap.matchMediaRefresh();
    


    //console.log("ran")
  }, [windowSize]);
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

    /* Scroll animation STARTS */

   

    const clipMob = actions.MobAnim;
    const clipDesktop = actions.DeskAction;

    const animationDurationMob = clipMob._clip.duration;
    const animationDurationDesk = clipDesktop._clip.duration;

    const frameMob = animationDurationMob / whichAnimLenghtMob;
    const frameDesk = animationDurationDesk / whichAnimLenghtDesk;
    // if it runs until the last frame, it will restart from frame 1, didn't found a solution for this yet.
    const maxMob = animationDurationMob - frameMob;
    const maxDesk = animationDurationDesk - frameDesk;

    mmm.current = gsap.matchMedia();

    mmm.current.add("(min-width: 1280px)", () => {
      
      clipDesktop.play();
      //console.log("desktop clip plays")

      const mixerDesk = clipDesktop.getMixer();
      const proxyDesk = {
        get time() {
          return mixerDesk.time;
        },
        set time(value) {
          clipDesktop.paused = false;
          mixerDesk.setTime(value);
          clipDesktop.paused = true;
        },
      };

      // for some reason must be set to 0 otherwise the clip will not be properly paused.
      proxyDesk.time = 0;

      tlDesk.current = gsap.timeline({
        ease: "none",
        //immediateRender: false,
        scrollTrigger: {
          trigger: "#section-2",
          start: "top bottom",
          end: "bottom bottom",
          endTrigger: "#section-6",
          scrub: 1,
          toggleActions: "restart restart reverse reverse",
        },
      });
      tlDesk.current.set(proxyDesk, { time: 0 });

      tlDesk.current.to(
        proxyDesk,

        {
          time: maxDesk,
          ease: "none",
          duration: whichDurationDesk,
        }
      );
      /*
      return () => { // optional
        tlDesk.current.kill()
      };
      */
    });

    mmm.current.add("(max-width: 1279px)", () => {
      
      clipMob.play();
      //console.log("mob clip plays")

      const mixerMob = clipMob.getMixer();
      const proxyMob = {
        get time() {
          return mixerMob.time;
        },
        set time(value) {
          clipMob.paused = false;
          mixerMob.setTime(value);
          clipMob.paused = true;
         // clipDesktop.paused=true
        },
      };

      // for some reason must be set to 0 otherwise the clip will not be properly paused.
      proxyMob.time = 0;

      tlMob.current = gsap.timeline({
        ease: "none",
        //immediateRender: false,
        scrollTrigger: {
          trigger: "#section-2",
          start: "top bottom",
          end: "bottom bottom",
          endTrigger: "#section-6",
          scrub: 1,
          toggleActions: "restart restart reverse reverse",
        },
      });
      tlMob.current.set(proxyMob, { time: 0 });

      tlMob.current.to(
        proxyMob,

        {
          time: maxMob,
          ease: "none",
          duration: whichDurationMob,
        }
      );

      /*
      return () => { // optional
        tlMob.current.kill()
      };
      */
    });
    /* Scroll animation FINISHES */

    /* Intro Animation STARTS */

 

/* Intro Animation FINISHES */

/* All anim for all screens STARTS */
         /* Leave first screen Animations */
            
            heroLeave.current = gsap.timeline({
              ease: "power4.out",
              scrollTrigger: {
                trigger: "#section-2",
                start: "top bottom",
                end: "bottom 20%",
                scrub: 1,
                
              },
            })

          heroLeave.current
          .to(".black-oval.lower", {opacity: 0, yPercent: -100, scale: 0, duration: 0.5}, "sameTime")
          .to(".blue-oval.lower", {opacity: 0, yPercent: -100, scale: 0, duration: 0.5}, "sameTime")
          .to(".black-oval.upper", {opacity: 0, yPercent: 25, xPercent: -150, scale: 0, duration: 0.5}, "sameTime")
          .to(".blue-oval.upper", {opacity: 0, yPercent: 25, xPercent: -150, scale: 0, duration: 0.5}, "sameTime")
          .to(".h1", {opacity: 0, xPercent: 100, duration: 0.5}, "sameTime")
          .to(".text.bank", {opacity: 0, xPercent: -200, duration: 0.5}, "sameTime")
          .to(".text.large", {opacity: 0, yPercent: -10, duration: 0.2}, "sameTime")
          .to(".yellow-ribbon-contain", {opacity: 0, yPercent: -75, duration: 0.2}, "sameTime")

 
           /* Screen 4 intro & Outro starts */
              //comes-text
              gsap.set(".comes-text", { xPercent: -10, opacity: 0 });

              tlMovetextComes.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-5",
                    start: "top 50%",
                    end: "bottom 50%",
                    endTrigger: "#section-5",
                    scrub: 1,
                  }
                })
                tlMovetextComes.current.to(".comes-text", {
                  opacity: 1,
                  xPercent: 0,
                  ease: "power4.out",
                  duration: 0.5,
                })
                tlMovetextComes.current.to(".comes-text", {
                  opacity: 0,
                  xPercent: 30,
                  ease: "power4.out",
                  duration: 0.5,
                })

              

                //with-text
                gsap.set(".with-text", { yPercent: -100, opacity: 0 });

                tlMovetextWith.current = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-5",
                      start: "top 50%",
                      end: "bottom 50%",
                      endTrigger: "#section-5",
                      scrub: 1,
                    }
                  })
                  tlMovetextWith.current.to(".with-text", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetextWith.current.to(".with-text", {
                    opacity: 0,
                    yPercent: 30,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                   //a-text
                gsap.set(".a-text", { yPercent: 30, opacity: 0 });

                tlMovetextA.current = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-5",
                      start: "top 50%",
                      end: "bottom 50%",
                      endTrigger: "#section-5",
                      scrub: 1,
                    }
                  })
                  tlMovetextA.current.to(".a-text", {
                    opacity: 1,
                    yPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlMovetextA.current.to(".a-text", {
                    opacity: 0,
                    yPercent: -10,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  //protective-text
                  gsap.set(".protective-text", { xPercent: -30, opacity: 0 });

                  tlMovetextProtective.current = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-5",
                        start: "top 40%",
                        end: "bottom 50%",
                        endTrigger: "#section-5",
                        scrub: 1,
                      }
                    })
                    tlMovetextProtective.current.to(".protective-text", {
                      opacity: 1,
                      xPercent: 0,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    tlMovetextProtective.current.to(".protective-text", {
                      opacity: 0,
                      xPercent: 20,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    //sleeve-text
                    gsap.set(".sleeve-text", { xPercent: 30, opacity: 0 });

                    tlMovetextSleeve.current = gsap.timeline({
                        scrollTrigger: {
                          trigger: "#section-5",
                          start: "top 40%",
                          end: "bottom 50%",
                          endTrigger: "#section-5",
                          scrub: 1,
                        }
                      })
                      tlMovetextSleeve.current.to(".sleeve-text", {
                        opacity: 1,
                        xPercent: 0,
                        ease: "power4.out",
                        duration: 0.5,
                      })
                      tlMovetextSleeve.current.to(".sleeve-text", {
                        opacity: 0,
                        xPercent: -20,
                        ease: "power4.out",
                        duration: 0.5,
                      })

          /* Screen 4 intro & Outro finishes */

          

              /* Screen 5 intro starts */
          //yellow-price-contain
          gsap.set(".yellow-price-contain", { scale: 0});

          tlYellowPriceContain.current = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-6",
                start: "top 40%",
                end: "bottom bottom",
                endTrigger: "#section-6",
                scrub: 1,
              }
            })
            tlYellowPriceContain.current.to(".yellow-price-contain", {
              scale: 1,
              ease: "power4.out",
              duration: 0.5,
            })
            /* Screen 5 intro FINISHES */

        /* All anim for all screens FINISHES */

        mm.current = gsap.matchMedia()

        /* Desktop only animations */

        mm.current.add("(min-width: 1280px)", () => {

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

          /* Screen 3 intro & Outro Starts */
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
                trigger: "#section-2",
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
              opacity: 0.1,
              ease: "expo",
              duration: 0.5,
            })
            tlBlueOval.to(".big-blue-oval", {
              yPercent: -20,
              xPercent: 0,
              scale: 0.8,
              opacity: 0.05,
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
                 /* Extras timelines finishes */
                 
     
             })

             /* Animation for Desktop FINISHES*/

             /* Animation for Tablet & Mobile STARTS*/

             mm.current.add("(max-width: 1279px)", () => {

              /* Second screen Mobile STARTS */
               //info-contain-screen2
               gsap.set(".info-contain-screen2", { yPercent: 100, opacity: 0 });

               

               tlSecScreenInfoContain.current = gsap.timeline({
                 scrollTrigger: {
                   trigger: "#section-2",
                   start: "top 75%",
                   end: "bottom 25%",
                   endTrigger: "#section-2",
                   scrub: 1,
                 }
               })

               tlSecScreenInfoContain.current.to(".info-contain-screen2", {
                   yPercent: 0,
                   opacity: 1,
                   ease: "power4.out",
                   duration: 1,
               });
               tlSecScreenInfoContain.current.to(".info-contain-screen2", {
                 yPercent: -100,
                 opacity: 0,
                 ease: "power4.out",
                 duration: 1,
             });
                // lines

                gsap.set(".line.upper", { yPercent: -110, opacity: 0 });

                tlLineUpper.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-2",
                    start: "top 75%",
                    end: "bottom 25%",
                    endTrigger: "#section-2",
                    scrub: 1,
                  }
                })

                tlLineUpper.current.to(".line.upper", {
                    yPercent: 0,
                    opacity: 1,
                    ease: "expo",
                    duration: 0.5,
                  });
                  tlLineUpper.current.to(".line.upper", {
                    yPercent: -110,
                    opacity: 0,
                    ease: "expo",
                    duration: 0.5,
                  });


                  

                  //circles-contain
                gsap.set(".circles-contain.mob-upper", { scale: 0, opacity: 0 });

                tlCirclesContain.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-2",
                    start: "top 75%",
                    end: "bottom 25%",
                    endTrigger: "#section-2",
                    scrub: 1,
                  }
                })

                tlCirclesContain.current.to(".circles-contain.mob-upper", {
                    scale: 1,
                    opacity: 1,
                    ease: "power4.out",
                    duration: 0.5,
                });
                tlCirclesContain.current.to(".circles-contain.mob-upper", {
                  scale: 0,
                  opacity: 0,
                  ease: "power4.out",
                  duration: 0.5,
              });

               /* Screen 2 Tablet & Mobile FINISHES */

              /* Screen 3 Tablet & Mobile STARTS */

             

              gsap.set(".screen3-mob-container", { yPercent: 100, opacity: 0 });

               tlThirdMobScreenInfoContain.current = gsap.timeline({
                 scrollTrigger: {
                   trigger: "#section-3",
                   start: "top 75%",
                   end: "bottom 25%",
                   endTrigger: "#section-3",
                   scrub: 1,
                 }
               })

               tlThirdMobScreenInfoContain.current.to(".screen3-mob-container", {
                   yPercent: 0,
                   opacity: 1,
                   ease: "power4.out",
                   duration: 1,
               });
               tlThirdMobScreenInfoContain.current.to(".screen3-mob-container", {
                 yPercent: -100,
                 opacity: 0,
                 ease: "power4.out",
                 duration: 1,
             });
                // lines

                gsap.set(".line.lower", { yPercent: -110, opacity: 0 });

                tlLineLower.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-3",
                    start: "top 75%",
                    end: "bottom 25%",
                    endTrigger: "#section-3",
                    scrub: 1,
                  }
                })

                tlLineLower.current.to(".line.lower", {
                    yPercent: 0,
                    opacity: 1,
                    ease: "expo",
                    duration: 0.5,
                  });
                  tlLineLower.current.to(".line.lower", {
                    yPercent: -110,
                    opacity: 0,
                    ease: "expo",
                    duration: 0.5,
                  });

                  

                  //circles-contain
                gsap.set(".circles-contain.mob-lower", { scale: 0, opacity: 0 });

                tlCirclesContainMobLower.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-3",
                    start: "top 75%",
                    end: "bottom 25%",
                    endTrigger: "#section-3",
                    scrub: 1,
                  }
                })

                tlCirclesContainMobLower.current.to(".circles-contain.mob-lower", {
                    scale: 1,
                    opacity: 1,
                    ease: "power4.out",
                    duration: 0.5,
                });
                tlCirclesContainMobLower.current.to(".circles-contain.mob-lower", {
                  scale: 0,
                  opacity: 0,
                  ease: "power4.out",
                  duration: 0.5,
              });

              /* Screen 3 Tablet & Mobile FINISHES */

              /* Screen 4 Tablet & Mobile STARTS */

              //one-info-contain
              gsap.set(".move-contain", { yPercent: 100, opacity: 0 });

              tlMovetextStagger.current = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-4",
                    start: "top 60%",
                    end: "bottom 50%",
                    endTrigger: "#section-4",
                    scrub: 1,
                  }
                })
                tlMovetextStagger.current.to(".move-contain", {
                  stagger: 0.1,
                  opacity: 1,
                  yPercent: 0,
                  ease: "power4.out",
                  duration: 0.5,
                })
                tlMovetextStagger.current.to(".move-contain", {
                  stagger: 0.1,
                  opacity: 0,
                  yPercent: -100,
                  ease: "power4.out",
                  duration: 0.5,
                })

                //line-long
                gsap.set(".line-long", {xPercent: 120 });

                



                tlLongLineScreen3.current = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-4",
                      start: "top 30%",
                      end: "bottom 50%",
                      endTrigger: "#section-4",
                      scrub: 1,
                    }
                  })
                  tlLongLineScreen3.current.to(".line-long", {
                    xPercent: 0,
                    ease: "power4.out",
                    duration: 0.5,
                  })
                  tlLongLineScreen3.current.to(".line-long", {
                    xPercent: 120,
                    ease: "power4.out",
                    duration: 0.5,
                  })

                  //line-vertical.mob
                  gsap.set(".line-vertical.mob", { scale: 0 });


                  tlLeftVerticalLineScreen3.current = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-4",
                        start: "top 30%",
                        end: "bottom 50%",
                        endTrigger: "#section-4",
                        scrub: 1,
                      }
                    })
                    tlLeftVerticalLineScreen3.current.to(".line-vertical.mob", {
                      scale: 1,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    tlLeftVerticalLineScreen3.current.to(".line-vertical.mob", {
                      scale: 0,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    //bottom-info-contain
                    gsap.set(".bottom-info-contain", { yPercent: 110, opacity: 0 });

                    


                  tlBottomScreen4Contain.current = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-4",
                        start: "top 10%",
                        end: "bottom 50%",
                        endTrigger: "#section-4",
                        scrub: 1,
                      }
                    })
                    tlBottomScreen4Contain.current.to(".bottom-info-contain", {
                      yPercent: 0,
                      opacity: 1,
                      ease: "power4.out",
                      duration: 0.5,
                    })
                    tlBottomScreen4Contain.current.to(".bottom-info-contain", {
                      yPercent: -110,
                      opacity: 0,
                      ease: "power4.out",
                      duration: 0.5,
                    })

              /* Screen 4 Tablet & Mobile FINISHES */
              /* Extras timelines starts */
          //big-blue-oval

          gsap.set(".big-blue-oval", { xPercent: 0, yPercent: 100,scale: 0, opacity: 0 });


          tlBlueOval.current = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-2",
                start: "top 50%",
                end: "bottom bottom",
                endTrigger: "#section-6",
                scrub: true,
              }
            })
            tlBlueOval.current.to(".big-blue-oval", {
              yPercent: 0,
              xPercent: 0,
              scale: 1,
              opacity: 0.1,
              ease: "expo",
              duration: 0.5,
            })
            tlBlueOval.current.to(".big-blue-oval", {
              yPercent: -10,
              xPercent: 0,
              scale: 0.8,
              opacity: 0.1,
              ease: "none",
              duration: 0.5,
            })
            tlBlueOval.current.to(".big-blue-oval", {
             yPercent: -20,
             xPercent: 20,
             scale: 0.8,
             opacity: 0.2,
             ease: "none",
             duration: 0.5,
           })
           tlBlueOval.current.to(".big-blue-oval", {
             yPercent: -15,
             xPercent: 0,
             scale: 0.9,
             opacity: 0.1,
             ease: "none",
             duration: 0.5,
           })
           tlBlueOval.current.to(".big-blue-oval", {
            yPercent: -50,
            xPercent: 0,
            scale: 0.6,
            opacity: 0.1,
            ease: "none",
            duration: 0.5,
          })

          

          //bottom-glow
          gsap.set(".bottom-glow", { scale:0.8 , opacity: 0, xPercent: 0, yPercent: 0 });
      
        tlBottomGlow.current = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-4",
            start: "top 30%",
            end: "bottom bottom",
            endTrigger: "#section-6",
            scrub: true,
          }})

          tlBottomGlow.current.to(".bottom-glow", {
            yPercent: 10,
            xPercent: 20,
            scale: 1, 
            opacity: 1,
            duration: 0.5,
          })
          tlBottomGlow.current.to(".bottom-glow", {
            yPercent: 70,
            xPercent: 0,
            scale: 1, 
            opacity: 1,
            duration: 0.5,
          })
          tlBottomGlow.current.to(".bottom-glow", {
            yPercent: -170,
            xPercent: 0,
            scale: 1, 
            opacity: 0.75,
            duration: 0.5,
          })
          
          


             //screen4-shadow
             gsap.set(".screen3-shadow-mob", { yPercent: 0,scale: 0, opacity: 0 });
 
             tlShadow4.current = gsap.timeline({
                 scrollTrigger: {
                   trigger: "#section-4",
                   start: "top 50%",
                   end: "bottom 80%",
                   endTrigger: "#section-4",
                   scrub: true,
                 }
               })
               tlShadow4.current.to(".screen3-shadow-mob", {
                 yPercent: 0,
                 scale: 1,
                 opacity: 0.65,
                 ease: "expo",
                 duration: 0.5,
               })
               tlShadow4.current.to(".screen3-shadow-mob", {
                 yPercent: 10,
                 scale: 0.8,
                 opacity: 0,
                 ease: "none",
                 duration: 0.2,
               })

                  //screen4-shadow
             gsap.set(".screen4-shadow", { yPercent: 0,scale: 0, opacity: 0 });
 
             tlShadow5.current = gsap.timeline({
                 scrollTrigger: {
                   trigger: "#section-5",
                   start: "top 50%",
                   end: "bottom 80%",
                   endTrigger: "#section-5",
                   scrub: true,
                 }
               })
               tlShadow5.current.to(".screen4-shadow", {
                 yPercent: 0,
                 scale: 1,
                 opacity: 0.65,
                 ease: "expo",
                 duration: 0.5,
               })
               tlShadow5.current.to(".screen4-shadow", {
                 yPercent: 10,
                 scale: 0.8,
                 opacity: 0,
                 ease: "none",
                 duration: 0.2,
               })

               

            //screen5-shadow.cover
            gsap.set(".screen5-shadow.cover", { opacity: 0, scale: 0.3, yPercent: -100});

            tlScreen5CoverShadow.current = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-6",
                  start: "top 20%",
                  end: "bottom bottom",
                  endTrigger: "#section-6",
                  scrub: 1,
                }
              })
              tlScreen5CoverShadow.current.to(".screen5-shadow.cover", {
                opacity: 0.4,
                scale: 1,
                yPercent: -10,
                ease: "power4.out",
                duration: 0.5,
              })

                 //screen5-shadow.battery
            gsap.set(".screen5-shadow.battery", { opacity: 0, scale: 0.3, yPercent: -100});

            tlScreen5BatteryShadow.current = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-6",
                  start: "top 20%",
                  end: "bottom bottom",
                  endTrigger: "#section-6",
                  scrub: 1,
                }
              })
              tlScreen5BatteryShadow.current.to(".screen5-shadow.battery", {
                opacity: 0.4,
                scale: 1,
                yPercent: 0,
                ease: "power4.out",
                duration: 0.5,
              })
                 /* Extras timelines finishes */


             })
   
           }, [isMobileSize])

       
           
 
       

  //batterybank material swap

const blueCol = document.querySelector(".col-blue")
const grayCol = document.querySelector(".col-gray")

const [isBlueTrue, setIsBlueTrue] = useState(true);


let pbMaterial = isBlueTrue ? 'PB material' : 'PB material Gray'


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
    <group name='Scene'>
      <spotLight
        name='k_soft_shadow_light'
        intensity={0.3087028}
        angle={0.323}
        penumbra={0.15}
        decay={2}
        position={[1.133, -0.005, -0.665]}
        rotation={[-3.06, 0.989, 1.641]}
      >
        <group position={[0, 0, -1]} />
      </spotLight>
      <spotLight
        name='Keylight'
        intensity={0.088046}
        angle={0.374}
        penumbra={0.15}
        decay={2}
        position={[1.105, 0.285, -0.311]}
        rotation={[-2.053, 1.188, 0.67]}
      >
        <group position={[0, 0, -1]} />
      </spotLight>
      <spotLight
        name='light-frame5'
        intensity={0.152217}
        angle={0.255}
        penumbra={0.335}
        decay={2}
        position={[-1.02, 0.187, -0.989]}
        rotation={[-2.854, -0.761, -2.481]}
        scale={0.714}
      >
        <group position={[0, 0, -1]} />
      </spotLight>
      <directionalLight name='Sun' intensity={0.8879} decay={2} position={[-0.052, 0.456, -0.358]} rotation={[-2.208, -0.299, -0.049]}>
        <group position={[0, 0, -1]} />
      </directionalLight>
      <spotLight
        name='Rim_light'
        intensity={0.0217406}
        angle={Math.PI / 8}
        penumbra={0.15}
        decay={2}
        position={[0, 0.263, 1.554]}
        rotation={[-0.207, 0.005, 0.001]}
      >
        <group position={[0, 0, -1]} />
      </spotLight>
      <group name='Empty-Cover' position={[0, -0.315, -0.011]} scale={0.037}>
        <mesh
          name='Cover'
          castShadow
          receiveShadow
          geometry={nodes.Cover.geometry}
          material={materials["Cover material"]}
          position={[0.002, -0.172, 0.288]}
          scale={27.135}
        />
      </group>
      <group name='Empty-Powerbank' position={[-0.039, 0.097, -0.069]} scale={0.037}>
        <mesh
          name='numbers_as_mesh'
          castShadow
          receiveShadow
          geometry={nodes.numbers_as_mesh.geometry}
          material={materials.numbers_glow_material}
          position={[0.346, 1.601, 0.02]}
          rotation={[1.529, 0.077, -1.668]}
          scale={24.817}
        />
        <mesh
          name='Powerbank'
          castShadow
          receiveShadow
          geometry={nodes.Powerbank.geometry}
          material={materials[pbMaterial]}
          position={[0.002, -0.172, 0.304]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={27.135}
        />
      </group>
      <group name='Empty-CameraDesk' position={[0.033, 0.009, -0.031]} rotation={[1.358, 0.031, 2.627]} scale={0.037}>
        <PerspectiveCamera
          name='Camera-Desktop'
          makeDefault={windowSize.deskCameraTrue}
          far={1000}
          near={0.1}
          fov={fovNew}
          position={[0.002, 14.676, 0.288]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={5.896}
        />
      </group>
      <group name='Empty-CameraMob' position={[0.002, 0.103, -0.049]} rotation={[1.231, 0.08, 2.593]} scale={0.04}>
        <PerspectiveCamera
          name='Camera-Mob'
          makeDefault={windowSize.mobCameraTrue}
          far={1000}
          near={0.1}
          fov={fovNew}
          position={[0.002, 14.676, 0.288]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={5.896}
        />
      </group>

      <group>
      <mesh
          name="Plane_for_gray"
          castShadow
          receiveShadow
          geometry={nodes.Plane_for_gray.geometry}
          material={materials['PB material Gray']}
          position={[-1.654, 0.081, -0.21]}
          scale={0.063}
        />
        <pointLight name='Bottom_light' intensity={0.1435} decay={2} position={[-0.038, -0.08, -0.211]} rotation={[-Math.PI / 2, 0, 0]} />
      </group>
    </group>
  </group>
);
}

useGLTF.preload("https://dopocodee.netlify.app/Dopo22.glb");

//useGLTF.preload('https://dopocodee.netlify.app/Dopo22.glb')


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