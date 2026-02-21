"use client";
import Image from "next/image";
import Pic1 from "@/public/demo-image/perspective-section-transition/1.jpg";
import Pic2 from "@/public/demo-image/perspective-section-transition/2.jpeg";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function PerspectiveSectionTransitionDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      const container = containerRef.current;
      if (!scroller || !container) return;

      const section1 = container.querySelector(".section-1");
      const section2 = container.querySelector(".section-2");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Section1: scale 1→0.8, rotate 0→-5
      tl.fromTo(
        section1,
        { scale: 1, rotate: 0 },
        { scale: 0.8, rotate: -5, ease: "none" },
        0,
      );

      // Section2: scale 0.8→1, rotate 5→0
      tl.fromTo(
        section2,
        { scale: 0.8, rotate: 5 },
        { scale: 1, rotate: 0, ease: "none" },
        0,
      );
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={scrollerRef}
      className="aspect-video w-full overflow-x-hidden overflow-y-auto"
    >
      <div ref={containerRef} className="relative h-[200vh]">
        <div className="section-1 sticky top-0 h-screen bg-[#C72626] text-[3.5vw] flex flex-col items-center justify-center text-white pb-[10vh] will-change-transform">
          <p>Scroll Perspective</p>
          <div className="flex gap-4">
            <p>Section</p>
            <div className="relative w-[12.5vw]">
              <Image src={Pic1} alt="img" placeholder="blur" fill />
            </div>
            <p>Transition</p>
          </div>
        </div>

        <div className="section-2 relative h-screen will-change-transform">
          <Image src={Pic2} alt="img" placeholder="blur" fill />
        </div>
      </div>
    </main>
  );
}
