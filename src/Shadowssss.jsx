import React, { useLayoutEffect, useState } from "react";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Shadddd(props) {
  const [opacity, setOpacity] = useState(0.8);

  let num = { var: 0.8 };
  let opacityCounter;

  useLayoutEffect(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#section2",
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      })
      .to(num, { var: 0, ease: "none", onUpdate: changeNumber });
  }, [opacity]);

  function changeNumber() {
    opacityCounter = parseFloat(num.var.toFixed(1));
    setOpacity(opacityCounter);
  }

  return <ContactShadows resolution={256} position={[0, -1, 0]} opacity={opacity} blur={2.5} scale={12} />;
}
