"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export function SplitPanelRevealDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      const split = splitRef.current;
      const leftPanel = leftPanelRef.current;
      const rightPanel = rightPanelRef.current;
      const image = imageRef.current;
      const overlay = overlayRef.current;

      if (!scroller || !split || !leftPanel || !rightPanel || !image) return;

      // Điểm bắt đầu: Panel trái chiếm 70%, Panel phải chiếm 30%
      const fromPct = 70;
      // Điểm kết thúc: Panel trái chiếm 45%, Panel phải chiếm 55%
      const toPct = 45;

      // Thiết lập trạng thái ban đầu
      gsap.set(leftPanel, {
        clipPath: `inset(0 ${100 - fromPct}% 0 0)`,
      });
      gsap.set(rightPanel, {
        clipPath: `inset(0 0 0 ${fromPct}%)`,
      });
      gsap.set(image, { scale: 1.2 });
      if (overlay) gsap.set(overlay, { y: 40, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: split,
          scroller,
          start: "top top",
          end: "+=150%", // Chiều dài cuộn
          scrub: 1, // Làm mượt chuyển động
          pin: true, // Ghim màn hình lại khi đang chạy hiệu ứng
          pinSpacing: true,
        },
      });

      tl.from(
        ".title", // Đảm bảo có dấu chấm nếu là className="title"
        {
          fontSize: "6rem", // Kích thước lúc bắt đầu (rất to)
          duration: 0.5,
          ease: "power2.out",
        },
        0, // Chạy cùng lúc với các hiệu ứng clip-path
      )
        .to(
          leftPanel,
          {
            clipPath: `inset(0 ${100 - toPct}% 0 0)`,
            ease: "none",
          },
          0,
        )
        .to(
          rightPanel,
          {
            clipPath: `inset(0 0 0 ${toPct}%)`,
            ease: "none",
          },
          0,
        )
        .to(
          image,
          {
            scale: 1,
            ease: "none",
          },
          0,
        );

      if (overlay) {
        tl.to(
          overlay,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
          },
          0.2, // Chạy sau khi bắt đầu một chút
        );
      }
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={scrollerRef}
      className="aspect-video overflow-y-auto overflow-x-hidden"
    >
      <div
        ref={containerRef}
        className="relative h-[250vh] w-full bg-[#f6f9ea]"
      >
        <div ref={splitRef} className="h-svh w-full relative">
          {/* Left Panel: Chứa text, nằm tuyệt đối để đè lên nhau */}
          <div
            ref={leftPanelRef}
            className="absolute inset-0 z-20 flex flex-col justify-center bg-linear-to-b from-[#d4f5a0] to-[#e9efe0] px-6 md:px-20"
          >
            <div className="max-w-xl">
              <h2 className="title text-nowrap mb-5 text-[clamp(2rem,4.6vw,4.5rem)] font-medium leading-none tracking-tight text-[#1a3c2a]">
                Tone of Voice
              </h2>
              <p className="max-w-[38ch] text-sm leading-7 text-[#1a3c2a] md:text-base">
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
          </div>

          {/* Right Panel: Chứa ảnh */}
          <div
            ref={rightPanelRef}
            className="absolute inset-0 z-10 overflow-hidden"
          >
            <div ref={imageRef} className="h-full w-full will-change-transform">
              <img
                src="/demo-image/split-panel-reveal/image.png"
                alt="Redefining Workplace Support"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Overlay text trên ảnh */}
            <div
              ref={overlayRef}
              className="absolute bottom-40 left-1/2 z-30 -translate-x-1/2 text-white text-center md:left-auto md:right-10 md:translate-x-0 md:text-right"
            >
              <span className="block text-[clamp(2rem,4vw,3.5rem)] italic">
                Redefining
              </span>
              <span className="block text-[clamp(1.05rem,2vw,1.65rem)] tracking-wide">
                Workplace Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
