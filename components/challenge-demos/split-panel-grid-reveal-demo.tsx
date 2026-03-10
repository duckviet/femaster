"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export function SplitPanelGridRevealDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      const section = sectionRef.current;
      const grid = gridRef.current;
      const imageWrap = imageWrapRef.current;
      const overlay = overlayRef.current;

      if (!scroller || !section || !grid || !imageWrap || !overlay) return;

      gsap.set(grid, {
        gridTemplateColumns: "58% 42%",
        gridTemplateRows: "40% 60%",
      });
      gsap.set(imageWrap, { scale: 1.15 });
      gsap.set(overlay, { y: 32, opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        grid,
        {
          gridTemplateColumns: "45% 55%",
          gridTemplateRows: "34% 66%",
          duration: 1,
          ease: "none",
        },
        0,
      );

      timeline.to(
        imageWrap,
        {
          scale: 1,
          duration: 1,
          ease: "none",
        },
        0,
      );

      timeline.to(
        overlay,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.25,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={scrollerRef}
      className="aspect-video w-full overflow-y-auto overflow-x-hidden bg-[#f6f9ea]"
    >
      <div ref={containerRef} className="relative h-[250vh] w-full">
        <section ref={sectionRef} className="h-svh w-full">
          <div
            ref={gridRef}
            className="grid h-full w-full bg-[#b7e7a8]"
            style={{
              gridTemplateColumns: "58% 42%",
              gridTemplateRows: "40% 60%",
            }}
          >
            <div className="border-r border-b border-[#6eb893]/55 px-6 py-6 md:px-12 md:py-10">
              <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-semibold leading-none tracking-tight text-[#104634]">
                Tone of Voice
              </h2>
            </div>

            <div className="border-b border-[#6eb893]/55 px-6 py-6 md:px-10 md:py-8">
              <div className="flex h-full items-start justify-end text-xs font-medium text-[#104634]/80">
                Made by Konpo Studio
              </div>
            </div>

            <div className="border-r border-[#6eb893]/55 px-6 py-8 md:px-12 md:py-10">
              <p className="max-w-[24ch] text-[clamp(1.1rem,2vw,2rem)] leading-tight text-[#1a3c2a]">
                Our voice reflects who we are. It is calm, confident, and caring
                in every message we share.
              </p>
              <button
                type="button"
                className="mt-8 inline-grid h-12 w-12 place-items-center rounded-full bg-[#1a3c2a] text-lg text-white"
              >
                ↗
              </button>
            </div>

            <div className="overflow-hidden p-3 md:p-5">
              <div
                ref={imageWrapRef}
                className="relative h-full w-full overflow-hidden rounded-2xl will-change-transform"
              >
                <img
                  src="/demo-image/split-panel-reveal/image.png"
                  alt="Redefining Workplace Support"
                  className="h-full w-full object-cover"
                />

                <div
                  ref={overlayRef}
                  className="absolute bottom-6 left-6 z-20 text-white md:bottom-8 md:left-8"
                >
                  <span className="block text-[clamp(2rem,4vw,3.25rem)] italic leading-none">
                    Redefining
                  </span>
                  <span className="block pt-2 text-[clamp(1rem,2vw,1.6rem)] leading-tight tracking-wide">
                    Workplace
                    <br />
                    Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
