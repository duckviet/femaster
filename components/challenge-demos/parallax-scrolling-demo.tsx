"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Picture1 from "@/public/demo-image/parallax-scrolling/1.png";
import Picture2 from "@/public/demo-image/parallax-scrolling/2.png";
import Picture3 from "@/public/demo-image/parallax-scrolling/3.png";

gsap.registerPlugin(ScrollTrigger);

const word = "with gsap";
const images = [
  {
    src: Picture1,
    alt: "Parallax image 1",
    className: "h-[60vh] w-[50vh] z-[1]",
  },
  {
    src: Picture2,
    alt: "Parallax image 2",
    className: "left-[55vw] top-[15vh] h-[40vh] w-[30vh] z-[2]",
  },
  {
    src: Picture3,
    alt: "Parallax image 3",
    className: "left-[27.5vw] top-[40vh] h-[25vh] w-[20vh] z-[3]",
  },
];

export function ParallaxScrollingDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);
  const imagesRef = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      const scroller = scrollerRef.current;
      const title = titleRef.current;

      if (!container || !scroller || !title) return;

      const layer2 = imagesRef.current[1];
      const layer3 = imagesRef.current[2];
      if (!layer2 || !layer3) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      timeline
        .to(title, { y: -50 }, 0)
        .to(layer2, { y: -150 }, 0)
        .to(layer3, { y: -255 }, 0);

      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        timeline.to(
          letter,
          {
            top: Math.floor(Math.random() * -75) - 25,
          },
          0,
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={scrollerRef}
      className="aspect-video w-full overflow-x-hidden overflow-y-auto bg-zinc-950"
    >
      <div ref={containerRef} className="mt-[10vh] min-h-screen h-[180vh]">
        <div className="ml-[10vw]">
          <div>
            <h1
              ref={titleRef}
              className="m-0 mt-2.5 text-[5vw] leading-[5vw] uppercase text-white"
            >
              Parallax
            </h1>
            <h1 className="m-0 mt-2.5 text-[5vw] leading-[5vw] uppercase text-white">
              Scroll
            </h1>
            <p className="m-0 mt-2.5 text-[3vw] uppercase text-white">
              {word.split("").map((letter, index) => (
                <span
                  key={`letter-${index}`}
                  ref={(element) => {
                    lettersRef.current[index] = element;
                  }}
                  className="relative"
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="relative mt-[5vh] flex w-full justify-center">
          {images.map((image, index) => (
            <div
              key={`image-${index}`}
              ref={(element) => {
                imagesRef.current[index] = element;
              }}
              className={`absolute ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
