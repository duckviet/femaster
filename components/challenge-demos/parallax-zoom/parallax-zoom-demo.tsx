import { useRef } from "react";
import Picture1 from "@/public/demo-image/parallax-zoom/1.png";
import Picture2 from "@/public/demo-image/parallax-zoom/2.png";
import Picture3 from "@/public/demo-image/parallax-zoom/3.png";
import Picture4 from "@/public/demo-image/parallax-zoom/4.png";
import Picture5 from "@/public/demo-image/parallax-zoom/5.png";
import Picture6 from "@/public/demo-image/parallax-zoom/6.png";
import Picture7 from "@/public/demo-image/parallax-zoom/7.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const pictures = [
  { src: Picture1, alt: "waka 1", scale: 4, className: "" },
  {
    src: Picture2,
    alt: "waka 2",
    scale: 5,
    className: "-top-[30vh] left-[5vw] w-[35vw] h-[30vh]",
  },
  {
    src: Picture3,
    alt: "waka 3",
    scale: 6,
    className: "-top-[10vh] -left-[25vw] w-[20vw] h-[45vh]",
  },
  {
    src: Picture4,
    alt: "waka 4",
    scale: 5,
    className: "left-[27.5vw] w-[25vw] h-[25vh]",
  },
  {
    src: Picture5,
    alt: "waka 5",
    scale: 6,
    className: "top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]",
  },
  {
    src: Picture6,
    alt: "waka 6",
    scale: 8,
    className: "top-[27.5vh] -left-[22.5vw] w-[30vw] h-[25vh]",
  },
  {
    src: Picture7,
    alt: "waka 7",
    scale: 9,
    className: "top-[22.5vh] left-[25vw] w-[15vw] h-[15vh]",
  },
];

export function ParallaxZoomDemo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (!container || !wrapper) return;

      const els = gsap.utils.toArray<HTMLElement>(".el");

      els.forEach((el, index) => {
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: pictures[index].scale,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              scroller: wrapper,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: containerRef },
  );
  return (
    <div
      ref={wrapperRef}
      className=" scroll-container  aspect-video w-full overflow-x-hidden overflow-y-auto bg-[#5e5a56]"
    >
      <div
        ref={containerRef}
        className="h-[300vh] relative mt-[50vh] mb-[100vh] bg-amber-300"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {pictures.map((image, index) => (
            <div
              key={index}
              className="el w-full h-full absolute top-0 flex items-center justify-center"
            >
              <div
                className={cn("relative w-[25vw] h-[25vh]", image.className)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  placeholder="blur"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
