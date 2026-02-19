"use client";
import { lora } from "@/fonts/lora";
import noise from "@/public/noise-overlay-300.png";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { SplitText, DrawSVGPlugin, ScrollTrigger } from "gsap/all";

import gsap from "gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText, ScrollTrigger, DrawSVGPlugin);

export function ScrollTriggerDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Set scroller default once at top level
  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      ScrollTrigger.defaults({ scroller });

      // Delay refresh until after all children have mounted & laid out
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: scrollerRef, dependencies: [] },
  );

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "aspect-video w-full overflow-y-auto overflow-x-hidden relative",
        lora.className,
      )}
      style={
        {
          "--dark-green": "#1DB000",
          "--light-green": "#3CDE1B",
          "--font": "#3C3C3C",
          "--line": "#C6C6C6",
          "--bg": "#ffffff",
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 w-full object-fill h-full bg-repeat opacity-10 mix-blend-hard-light pointer-events-none"
        style={{
          backgroundImage: `url(${noise.src})`,
          zIndex: 90,
        }}
      />
      <TitleSection />
      <DescriptionSection />
      <div className="h-80" />
    </div>
  );
}

export function TitleSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      SplitText.create("h1", {
        type: "words, chars",
        wordsClass: "word",
        mask: "words",
      });

      gsap.from("h1 .word", {
        y: "100%",
        ease: "circ.inOut",
      });
    },
    {
      scope: containerRef,
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={containerRef}
      // Use min-h so it fills scroller viewport but doesn't collapse
      className="flex min-h-full items-center justify-center px-4"
    >
      <h1 className="title font-black text-[clamp(2rem,9vw,4.75rem)] leading-[1.2] pb-[0.1em] flex flex-col gap-[0.1em] relative right-[0.4em] [&>span]:-mb-[0.24em]">
        <span className="block relative text-left text-(--dark-green) italic font-thin">
          gsap
        </span>
        <span className="block relative text-right uppercase font-thin">
          scroll
        </span>
        <span className="block relative text-left uppercase font-thin">
          triggered
        </span>
        <span className="block relative left-[1.5em] text-right text-(--dark-green) italic font-thin">
          animations
        </span>
      </h1>
    </div>
  );
}

// No longer needs scrollerRef prop — uses ScrollTrigger.defaults
export function DescriptionSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const title = container.querySelector("h2");
      const paths = container.querySelectorAll("path");
      if (!title || paths.length === 0) return;

      // Set initial states explicitly so there's no flash
      gsap.set(title, { opacity: 0 });
      gsap.set(paths, { drawSVG: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          // scroller inherited from ScrollTrigger.defaults
          start: "top 80%",
          end: "bottom 20%",
          markers: false,
          toggleActions: "play reset play reverse",
        },
      });

      tl.to(title, {
        opacity: 1,
        duration: 1,
      });

      tl.to(
        paths,
        {
          drawSVG: "0% 100%",
          stagger: 0.3,
        },
        "-=0.4",
      );
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-112 p-6 md:p-10 flex items-stretch justify-stretch"
    >
      <div className="title-container border-2 border-(--line) p-10 w-full flex items-center justify-center">
        <h2 className="text-[clamp(1.375rem,4.2vw,3rem)] leading-[1.35] text-center text-balance max-w-7xl">
          <ScrollTriggerWord /> enables anyone to create{" "}
          <span className="whitespace-nowrap">jaw-dropping</span>{" "}
          <ScrollBasedWord /> animations with minimal code. Infinitely flexible.
          Scrub, pin, snap, or just <TriggerAnythingWord /> scroll-related, even
          if it has nothing to do{" "}
          <span className="whitespace-nowrap">with animation.</span>
        </h2>
      </div>
    </div>
  );
}

const ScrollTriggerWord = () => (
  <span className="relative">
    <Highlighted1 className="absolute top-[0.2em] left-0 w-[6em] mix-blend-multiply" />
    ScrollTrigger
  </span>
);
const ScrollBasedWord = () => (
  <span className="whitespace-nowrap relative">
    <Highlighted2 className="absolute bottom-0 left-0 mix-blend-multiply" />
    scroll-based
  </span>
);
const TriggerAnythingWord = () => (
  <span className="whitespace-nowrap relative">
    <Highlighted3 className="absolute bottom-0 left-0 mix-blend-multiply" />
    trigger anything
  </span>
);

export const Highlighted1 = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 238 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0.68306 20.9995C44.7761 18.8457 73.3363 15.3457 237.683 13.9995"
      stroke="#3CDE1B"
      strokeWidth="28"
    />
  </svg>
);

export const Highlighted2 = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 244 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M117.31 1C51.6512 2.5873 1 4.92139 1 33.7483C1 49.5614 27.3792 51.9417 49.1706 50.7288C70.9621 49.5159 191.389 50.7288 197.123 50.7288C213.18 50.7288 243 43.4514 243 28.8967C243 1 120.342 4.57143 98.5504 4.57143"
      stroke="#3CDE1B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Highlighted3 = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 309 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0.141418 3.97803C7.14142 2.97803 280.641 6.97803 308.641 0.978027"
      stroke="#3CDE1B"
      strokeWidth="2"
    />
  </svg>
);
