import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function IntroAnimations() {

    const { progress } = useProgress();

    const powerHeading = document.getElementById("powerHeading")

    let isMobileSize = window.innerWidth < 768

    //const viewport = useThree((state) => state.viewport);

    //console.log(isMobileSize)

    //console.log(scaleFactorDesktop) 
  /*
    let isMobileSize = window.innerWidth < 768

  
   gsap.config({trialWarn: false})

      let mm = gsap.matchMedia()

      mm.add({
        isMobile: "(max-width: 768)",
        isDesktop: "(mix-width: 769)",
      }, (context) => {
        let {isMobile, isDesktop} = context.conditions
        */

        // Animations here

        setTimeout(() => {

        if(progress > 99){
          //console.log("anim starts")
      
      
          let ovalUpper =  gsap.fromTo(
            ".oval-cover.upper",
            {  
                scale: 4,
            },
            {
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
            }
          );

          let ovalLower =  gsap.fromTo(
            ".oval-cover.bottom",
            {  
                scale: 4,
            },
            {
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
            }
          );

      
           let moveHeading = gsap.fromTo
           ('.h1-like.power', 
             {xPercent: -110},
             {xPercent: 0, duration: 0.8, ease: "power4.out", delay: 0.5},
         );

             let moveHeading2 = gsap.fromTo
             ('.h1-like.border.bank', 
             {xPercent: 130},
             {xPercent: 0, duration: 0.8, ease: "power4.out", delay: 0.5},
         );

             let moveHeading3 = gsap.fromTo
             ('.h2-like.gray-border.large', 
                 {y: 110, opacity: 0},
                 {y: 0, opacity: 1, duration: 0.8, ease: "power4.out", delay: 0.6},
             );

             let moveHeroSticker = gsap.fromTo
             ('.hero-sticker', 
                 { opacity: 0},
                 {opacity: 1, duration: 2, ease: "power4.out", delay: 0.8},
             );
   
          

      }
  }, "2200")
  



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
          .to(".oval-cover.bottom", {opacity: 0, yPercent: -100, scale: 0, duration: 0.5}, "sameTime")
          .to(".oval-cover.upper", {opacity: 0, yPercent: 25, xPercent: -150, scale: 0, duration: 0.5}, "sameTime")
          .to(".h1-like.power", {opacity: 0, xPercent: 100, duration: 0.5}, "sameTime")
          .to(".h1-like.border.bank", {opacity: 0, xPercent: -200, duration: 0.5}, "sameTime")
          .to(".h2-like.gray-border.large", {opacity: 0, yPercent: -10, duration: 0.2}, "sameTime")
          .to(".hero-sticker", {opacity: 0, yPercent: -75, duration: 0.2}, "sameTime")
          .to(".hero-oval.first", {opacity: 0, yPercent: -25, duration: 0.2}, "sameTime")



          // I set opacity: 0 in the CSS to avoid the flash of unstyled content. Also, it's always best to set your transforms directly via GSAP instead of just in the CSS. Faster performance and more accurate.
          gsap.set(".line.left", { xPercent: 110, opacity: 0 });

          gsap.to(".line.left", {
              xPercent: 0,
              opacity: 1,
              ease: "expo",
              duration: 0.5,
              immediateRender: false, // otherwise scrollTrigger will force the render right away and the starting values that get locked in would be affected by the from() above
              scrollTrigger: {
                  trigger: "#section-2",
                  start: "top 30%",
                  end: "bottom 45%",
                  scrub: 1,
                  
              }
          });

          gsap.set(".line.right", { xPercent: -110, opacity: 0 });

          gsap.to(".line.right", {
              xPercent: 0,
              opacity: 1,
              ease: "expo",
              duration: 0.5,
              immediateRender: false, // otherwise scrollTrigger will force the render right away and the starting values that get locked in would be affected by the from() above
              scrollTrigger: {
                  trigger: "#section-2",
                  start: "top 30%",
                  end: "bottom 45%",
                  scrub: 1,
                  
              }
          });

          //circles-contain

          gsap.set(".circles-contain", { scale: 0, opacity: 0 });

          gsap.to(".circles-contain", {
              scale: 1,
              opacity: 1,
              ease: "expo",
              duration: 0.5,
              immediateRender: false, // otherwise scrollTrigger will force the render right away and the starting values that get locked in would be affected by the from() above
              scrollTrigger: {
                  trigger: "#section-2",
                  start: "top 20%",
                  end: "bottom 65%",
                  scrub: 1,
                  
                  
              }
          });





      //text-wrap
      gsap.set(".text-wrap", { yPercent: 50, opacity: 0 });

      gsap.to(".text-wrap", {
          yPercent: 0,
          opacity: 1,
          ease: "expo",
          duration: 0.5,
          immediateRender: false, // otherwise scrollTrigger will force the render right away and the starting values that get locked in would be affected by the from() above
          scrollTrigger: {
              trigger: "#section-2",
              start: "top 20%",
              end: "bottom 65%",
              scrub: 1,
              
              
          }
      });

      /* SECOND SCREEN INTRO & OUTRO */

      //blue oval
      gsap.set(".tester-oval", { yPercent: 25,scale: 0, opacity: 0 });


       const tlBlueOval = gsap.timeline({
           scrollTrigger: {
             trigger: "#section-2",
             start: "top 50%",
             end: "bottom bottom",
             endTrigger: ".section-container.price",
             scrub: true,
           }
         })
         tlBlueOval.to(".tester-oval", {
           yPercent: 0,
           xPercent: 0,
           scale: 1,
           opacity: 1,
           ease: "expo",
           duration: 0.5,
         })
         tlBlueOval.to(".tester-oval", {
           yPercent: -50,
           xPercent: 0,
           scale: 0.7,
           opacity: 0.4,
           ease: "none",
           duration: 0.5,
         })
         tlBlueOval.to(".tester-oval", {
          yPercent: -30,
          xPercent: 0,
          scale: 0.8,
          opacity: 0.85,
          ease: "none",
          duration: 0.5,
        })
        tlBlueOval.to(".tester-oval", {
          yPercent: 10,
          xPercent: -28,
          scale: 0.7,
          opacity: 0.6,
          ease: "none",
          duration: 0.5,
        })

      //white-oval
      gsap.set(".white-oval", { yPercent: 25,scale: 0, opacity: 0 });

      const tlWhiteOval = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-2",
            start: "top 50%",
            end: "bottom 97%",
            endTrigger: "#section-3",
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
      gsap.set(".darker-oval", { yPercent: 25,scale: 0, opacity: 0 });

      const tlDarkOval = gsap.timeline({
          scrollTrigger: {
            trigger: "#section-2",
            start: "top 50%",
            end: "bottom 97%",
            endTrigger: "#section-3",
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

 //scree2-shadow
 gsap.set(".scree2-shadow", { yPercent: -25,scale: 0, opacity: 0 });
 
 const tlShadow = gsap.timeline({
     scrollTrigger: {
       trigger: "#section-2",
       start: "top 50%",
       end: "bottom 97%",
       endTrigger: "#section-3",
       scrub: true,
     }
   })
   tlShadow.to(".scree2-shadow", {
     yPercent: 0,
     scale: 1,
     opacity: 0.9,
     ease: "expo",
     duration: 0.5,
   })
   tlShadow.to(".scree2-shadow", {
     yPercent: 75,
     scale: 0,
     opacity: 0,
     ease: "none",
     duration: 0.2,
   })
   


   /* THIRD SCREEN INTRO & OUTRO */

   //line-stucture


   gsap.set(".line-stucture", { scale: 0, opacity: 1 });
 
 const tlMidLine = gsap.timeline({
     scrollTrigger: {
       trigger: "#section-3",
       start: "top 20%",
       end: "top 60%",
       endTrigger: "#section-4",
       scrub: true,
     }
   })
   tlMidLine.to(".line-stucture", {
     scale: 1,
     opacity: 1,
     ease: "expo",
     duration: 0.5,
   })


   //side-line

   gsap.set(".side-line", { scale: 0, opacity: 1 });
   
 
 const tlSideLine = gsap.timeline({
     scrollTrigger: {
       trigger: "#section-3",
       start: "top 20%",
       end: "top 60%",
       endTrigger: "#section-4",
       scrub: true,
     }
   })
   tlSideLine.to(".side-line", {
     scale: 1,
     opacity: 1,
     ease: "expo",
     duration: 0.5,
   })
 


        //move-text-1
        gsap.set(".move-text-1.first", { yPercent: -150, opacity: 0 });
        gsap.set(".move-text-1.sec", { yPercent: -150, opacity: 0 });
        gsap.set(".move-text-1.third", { yPercent: -250, opacity: 0 });
        gsap.set(".paragraph.sec3", { yPercent: -500, opacity: 0 });
        gsap.set(".yel-container", { opacity: 0 });
       

      
      const tlTextMove1 = gsap.timeline({
          ease: "power4.out",
          scrollTrigger: {
            trigger: "#section-3",
            start: "top 20%",
            end: "bottom bottom",
            endTrigger: "#section-3",
            scrub: 1.5,
          }
        })
        tlTextMove1.to(".move-text-1.first", {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
        }, "<+=15%")
        tlTextMove1.to(".move-text-1.sec", {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
        }, "<+=15%")
        tlTextMove1.to(".paragraph.sec3", {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
        }, "<+=100%")
        tlTextMove1.to(".move-text-1.third", {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
        }, "<+=15%")
        tlTextMove1.to(".yel-container", {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
        }, "<+=100%")

        //Shadow
        gsap.set(".screen3-shadow", { yPercent: -80, scale:0.99, opacity: 0 });
      
        const tlShadow3 = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-3",
              start: "top 20%",
              end: "top 90%" ,
              endTrigger: "#section-4",
              scrub: true,
            }
          })
          tlShadow3.to(".screen3-shadow", {
            yPercent: 0,
            scale: 1, 
            opacity: 0.75,
            duration: 0.5,
          })
          tlShadow3.to(".screen3-shadow", {
              yPercent: 60,
              scale: 0.85, 
              opacity: 0,
              duration: 0.2,
            })

          //bottom-glow
          gsap.set(".bottom-glow", { yPercent: -80, scale:0.99, opacity: 0, xPercent: 0 });
      
          const tlBottomGlow = gsap.timeline({
              scrollTrigger: {
                trigger: "#section-3",
                start: "top 20%",
                end: "bottom bottom",
                endTrigger: "#section-5",
                scrub: true,
              }
            })
            tlBottomGlow.to(".bottom-glow", {
              yPercent: 100,
              xPercent: 0,
              scale: 1, 
              opacity: 0.85,
              duration: 0.5,
            })
            tlBottomGlow.to(".bottom-glow", {
              yPercent: 10,
              xPercent: 0,
              scale: 1, 
              opacity: 0.85,
              duration: 0.5,
            })
            tlBottomGlow.to(".bottom-glow", {
              yPercent: 10,
              xPercent: -30,
              scale: 0.6, 
              opacity: 0.85,
              duration: 0.5,
            })



            //text-comes

            /* FOURTH screen Animations */
            gsap.set(".text-comes.comes", { xPercent: -50});
      
            const tlComes = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-4",
                  start: "top 15%",
                  end: "top 75%",
                  endTrigger: "#section-5",
                  scrub: 1,
                }
              })
              tlComes.to(".text-comes.comes", {
                xPercent: 0,
                duration: 0.5,
              })
              tlComes.to(".text-comes.comes", {
                xPercent: 25,
                duration: 0.5,
              })

              gsap.set(".text-comes.with.withh", { xPercent: 100, opacity: 0});
      
            const tlWith = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-4",
                  start: "top 15%",
                  end: "top 75%",
                  endTrigger: "#section-5",
                  scrub: 1,
                }
              })
              tlWith.to(".text-comes.with.withh", {
                  opacity: 1,
                xPercent: -5,
                duration: 0.5,
              })
              tlWith.to(".text-comes.with.withh", {
                xPercent: -25,
                opacity: 0,
                duration: 0.5,
              })

              gsap.set(".text-comes.with.a", { opacity: 0, yPercent: -35});
      
              const tlA = gsap.timeline({
                  scrollTrigger: {
                    trigger: "#section-4",
                    start: "top 15%",
                    end: "top 75%",
                    endTrigger: "#section-5",
                    scrub: 1,
                  }
                })
                tlA.to(".text-comes.with.a", {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.5,
                })
                tlA.to(".text-comes.with.a", {
                  yPercent: 25,
                  opacity: 0.2,
                  duration: 0.5,
                })

                gsap.set(".text-comes.protective", { opacity: 0.7, yPercent: 75});
      
                const tlProtective = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-4",
                      start: "top 15%",
                      end: "top 75%",
                      endTrigger: "#section-5",
                      scrub: 1,
                    }
                  })
                  tlProtective.to(".text-comes.protective", {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.5,
                  })
                  tlProtective.to(".text-comes.protective", {
                    yPercent: -25,
                    opacity: 0.2,
                    duration: 0.5,
                  })
     

                  gsap.set(".text-comes.sleeve", { xPercent: 75, yPercent: 0, opacity: 0});
      
                  const tlSleeve = gsap.timeline({
                      scrollTrigger: {
                        trigger: "#section-4",
                        start: "top 15%",
                        end: "top 75%",
                        endTrigger: "#section-5",
                        scrub: 1,
                      }
                    })
                    tlSleeve.to(".text-comes.sleeve", {
                      xPercent: 0,
                      yPercent: 0,
                       opacity: 1,
                      duration: 0.5,
                    })
                    tlSleeve.to(".text-comes.sleeve", {
                      xPercent: -25,
                      yPercent: -25,
                      opacity: 0,
                      duration: 0.5,
                    })


                    //screen4-shadow
                    gsap.set(".screen4-shadow", { yPercent: -80, scale:0.99, opacity: 0 });
      
        const tlShadow4 = gsap.timeline({
            scrollTrigger: {
              trigger: "#section-4",
              start: "top 20%",
              end: "top 90%" ,
              endTrigger: "#section-5",
              scrub: true,
            }
          })
          tlShadow4.to(".screen4-shadow", {
            yPercent: 0,
            scale: 1, 
            opacity: 0.75,
            duration: 0.5,
          })
          tlShadow4.to(".screen4-shadow", {
              yPercent: 40,
              scale: 0.85, 
              opacity: 0,
              duration: 0.2,
            })

            //screen5-shadow
            gsap.set(".screen5-shadow.battery", { yPercent: -290, xPercent: 10, scale:0.99, opacity: 0 });
      
            const tlShadow5 = gsap.timeline({
                scrollTrigger: {
                  trigger: "#section-5",
                  start: "top 10%",
                  end: "bottom bottom" ,
                  endTrigger: "#section-5",
                  scrub: 1,
                }
              })
            
              tlShadow5.to(".screen5-shadow.battery", {
                  yPercent: -150,
                  xPercent: 5,
                  scale: 1, 
                  opacity: 0,
                 
                })
              tlShadow5.to(".screen5-shadow.battery", {
                  yPercent: 0,
                  xPercent: 0,
                  scale: 1, 
                  opacity: 0.5,
                 
                })

                gsap.set(".screen5-shadow.cover", { yPercent: -700, xPercent: 20, scale:0.99, opacity: 0 });
      
                const tlShadow5Cover = gsap.timeline({
                    scrollTrigger: {
                      trigger: "#section-5",
                      start: "top 60%",
                      end: "bottom bottom" ,
                      endTrigger: "#section-5",
                      scrub: true,
                     
                    }
                  })
                  tlShadow5Cover.to(".screen5-shadow.cover", {
                    yPercent: -300,
                    xPercent: 10,
                    scale: 1, 
                    opacity: 0,
                   
                  })
                  tlShadow5Cover.to(".screen5-shadow.cover", {
                      yPercent: -100,
                      xPercent: 13,
                      scale: 1, 
                      opacity: 0,
                     
                    })
                  tlShadow5Cover.to(".screen5-shadow.cover", {
                      yPercent: 0,
                      xPercent: 0,
                      scale: 1, 
                      opacity: 0.6,
                     
                    })

                    //price-yel-block
                    gsap.set(".price-yel-block", { scale:0 });
      
                    const tlYellowPrice = gsap.timeline({
                        scrollTrigger: {
                          trigger: "#section-5",
                          start: "top 20%",
                          end: "bottom bottom" ,
                          endTrigger: "#section-5",
                          scrub: 2,
                        }
                      })
                      tlYellowPrice.to(".price-yel-block", {
                        scale: 1, 
                      })

  

        
        // Animations here

        /*
      })
        */
     
      
     
   
                      return(
                        <></>
                      )
            


}