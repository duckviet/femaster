"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Background1 from "@/public/demo-image/perspective-section-transition/1.jpg";
import Background2 from "@/public/demo-image/perspective-section-transition/2.jpeg";

gsap.registerPlugin(ScrollTrigger);

export function BackgroundImageParallaxDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      const container = containerRef.current;
      if (!scroller || !container) return;

      const intro = container.querySelector(".intro");
      const introImage = container.querySelector(".intro-img");
      const section = container.querySelector(".section");
      const sectionImage = container.querySelector(".section-img");

      if (!intro || !introImage || !section || !sectionImage) return;

      // --- Intro: ảnh trôi xuống khi scroll ---
      const introTween = gsap.to(introImage, {
        yPercent: 150,
        ease: "none",
        scrollTrigger: {
          trigger: intro,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const sectionTween = gsap.fromTo(
        sectionImage,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        introTween.scrollTrigger?.kill();
        sectionTween.scrollTrigger?.kill();
        introTween.kill();
        sectionTween.kill();
      };
    },

    { scope: containerRef },
  );

  return (
    <div
      ref={scrollerRef}
      className="aspect-video w-full overflow-x-hidden overflow-y-auto bg-black"
    >
      <main ref={containerRef}>
        <div className="intro h-screen overflow-hidden">
          <div className="intro-img relative h-full w-full">
            <Image
              src={Background1}
              fill
              alt="intro background"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        <div className="my-40 flex justify-center">
          <p className="max-w-[50vw] text-center text-[7.5vw] uppercase leading-none text-white">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        {/* ── SECTION ── */}
        <div
          className="section relative flex h-screen items-center justify-center overflow-hidden"
          style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
          {/* Text overlay */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-20 mix-blend-difference">
            <p className="w-[50vw] self-end text-[2vw] uppercase text-white">
              Beauty and quality need the right time to be conceived and
              realised even in a world that is in too much of a hurry.
            </p>
            <p className="text-[5vw] uppercase text-white">
              Background Parallax
            </p>
          </div>

          {/* Parallax background */}
          <div className="fixed left-0 top-[-10vh] h-[120vh] w-full">
            <div className="section-img relative h-full w-full">
              <Image
                src={Background2}
                fill
                alt="section background"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── SPACER ── */}
        <div className="h-[60vh]" />
      </main>
    </div>
  );
}
