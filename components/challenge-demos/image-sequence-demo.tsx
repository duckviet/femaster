"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { fitContent, remap } from "@/lib/math";
import { cn } from "@/lib/utils";
import { Audiowide } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-audiowide",
});

const geistMono = Geist_Mono({
  weight: "variable",
  display: "swap",
  variable: "--font-geist-mono",
});

gsap.registerPlugin(SplitText, ScrollTrigger);

export function ImageSequenceDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useRef<number>(0);

  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      SplitText.create("h1", {
        type: "chars",
        charsClass:
          "char++ bg-linear-to-t from-black/10 to-white to-70% bg-clip-text",
        mask: "chars",
      });

      gsap.from("h1 .char", {
        x: "100%",
        rotateY: "90deg",
        stagger: 0.02,
        duration: 0.5,
        ease: "circ.out",
      });

      gsap
        .timeline({
          ease: "linear",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .to(progress, {
          current: 0.4,
          duration: 0.4,
        })
        .to(
          ".title",
          {
            autoAlpha: 0,
            duration: 0.1,
          },
          "<+0.01",
        )
        .to(".cameras", {
          autoAlpha: 1,
          repeat: 1,
          yoyo: true,
          duration: 0.1,
          repeatDelay: 0.2,
        })
        .to(progress, {
          duration: 0.8,
          current: 1,
        })
        .to(
          ".wheels",
          {
            autoAlpha: 1,
            duration: 0.2,
          },
          "-=0.2",
        );
    },
    { scope: scrollerRef },
  );

  return (
    <div
      ref={scrollerRef}
      className={cn(
        audiowide.variable,
        geistMono.variable,
        geistMono.className,
        "aspect-video w-full overflow-y-auto overflow-x-hidden bg-black",
      )}
    >
      {/* Tall inner container drives the scroll */}
      <div ref={containerRef} className="relative h-[400%]">
        {/* Single sticky "viewport" — holds canvas + all overlay sections */}
        <div className="sticky top-0 w-full aspect-video">
          <ImageSequence progress={progress} />

          <section className="title absolute inset-0">
            <h1 className="uppercase absolute text-[8vw] w-full text-center -bottom-[0.1em] leading-none right-[0.05em] tracking-widest text-transparent">
              Perseverance
            </h1>
          </section>

          <section className="cameras absolute inset-0 opacity-0">
            <div className="absolute top-1/2 -translate-y-1/2 right-[5%] max-w-[40%] text-white">
              <h2 className="text-[clamp(1.25rem,3.5vw,3.75rem)] mb-2">
                Cameras
              </h2>
              <p className="text-[clamp(0.65rem,1.4vw,1rem)] text-balance">
                Mounted on the &quot;head&quot; of the rover&apos;s long-necked
                mast. The SuperCam on the Perseverance rover examines rocks and
                soils with a camera, laser, and spectrometers to seek chemical
                materials that could be related to past life on Mars.
              </p>
            </div>
          </section>

          <section className="wheels absolute inset-0 opacity-0">
            <div className="absolute bottom-[10%] left-[5%] max-w-[40%] text-white">
              <h2 className="text-[clamp(1.25rem,3.5vw,3.75rem)] mb-2">
                Wheels
              </h2>
              <p className="text-[clamp(0.65rem,1.4vw,1rem)] text-balance">
                The wheels are made of aluminium, with cleats for traction and
                curved titanium spokes for springy support.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ImageSequence({ progress }: { progress: React.RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    const images: Record<number, HTMLImageElement> = {};

    for (let index = 0; index < 300; index++) {
      const img = new Image();
      const imageNumber = (index + 1).toString().padStart(4, "0");
      img.src = `/demo-image/sequence/${imageNumber}.webp`;
      img.onload = () => {
        images[index + 1] = img;
      };
    }

    function drawImage() {
      if (!canvas || !ctx) return;

      let frame = remap(progress.current, 0, 1, 1, 300);
      frame = Math.round(frame);

      const imageToRender = images[frame];
      if (!imageToRender) return;

      const { x, y, width, height } = fitContent(
        canvas.width,
        canvas.height,
        imageToRender.width,
        imageToRender.height,
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageToRender, x, y, width, height);
    }

    gsap.ticker.add(drawImage);

    return () => {
      gsap.ticker.remove(drawImage);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [progress]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
