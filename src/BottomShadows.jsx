import React, { useLayoutEffect, useState } from "react";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BottomShadows(props) {
  const [opacityy, setOpacityy] = useState(0);

  let num2 = { var: 0 };
  let opacityCounter2;

  useLayoutEffect(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#section5",
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      })
      .to(num2, { var: 0.8, ease: "none", onUpdate: changeNumber });
  }, [opacityy]);

  function changeNumber() {
    opacityCounter2 = parseFloat(num2.var.toFixed(1));
    setOpacityy(opacityCounter2);
  }

  return <ContactShadows resolution={256} position={[0, -1, 0]} opacity={opacityy} blur={2.5} scale={12} />;
}
