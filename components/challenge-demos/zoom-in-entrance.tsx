import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

export function ZoomInEntranceDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Bắt đầu: thu nhỏ như poster, ở giữa màn hình
      tl.set(container, { scale: 0.2, y: "-30%" })

        // Chữ WAKA trên: trượt xuống vào vị trí
        .from(
          ".text-top",
          {
            yPercent: -100,
            duration: 1.4,
            autoAlpha: 0,
          },
          "<", // chạy cùng lúc
        )
        // Chữ WAKA dưới: trượt lên vào vị trí
        .from(
          ".text-bottom",
          {
            yPercent: 100,
            duration: 1.4,
            autoAlpha: 0,
          },
          "<",
        )
        // Ảnh: fade + scale nhẹ
        .from(
          ".image-section",
          {
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "expo.in",
          },
          "<0.3",
        )
        .to(container, {
          scale: 1,
          duration: 4,
          delay: 1.5, // ← đứng yên 1s
          y: 0,
        });
    },
    { scope: containerRef },
  );

  return (
    <div
      className="aspect-video w-full overflow-x-hidden overflow-y-auto bg-[#e3dcd6]"
      style={{ scrollbarWidth: "none" }}
    >
      <div ref={containerRef} className="bg-[#f5f0eb] p-2">
        {/* WAKA trên */}
        <div className="overflow-hidden ">
          <svg
            viewBox="0 0 100 22"
            className="text-top block w-full"
            preserveAspectRatio="xMinYMin meet"
          >
            <text
              x="0"
              y="18"
              textLength="100"
              lengthAdjust="spacingAndGlyphs"
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                fontFamily: "inherit",
                fill: "currentColor",
                userSelect: "none",
              }}
            >
              WAKA
            </text>
          </svg>
        </div>

        {/* Ảnh giữa */}
        <div className="image-section flex gap-2">
          <img
            src="/demo-image/waka/waka-1.jpg"
            className="w-1/4 h-full"
            alt="waka 1"
          />
          <img
            src="/demo-image/waka/waka-2.jpg"
            className="w-3/4 h-full"
            alt="waka 2"
          />
        </div>

        {/* WAKA dưới */}
        <div className="overflow-hidden">
          <svg
            viewBox="0 0 100 22"
            className="text-bottom block w-full"
            preserveAspectRatio="xMinYMin meet"
          >
            <text
              x="0"
              y="18"
              textLength="100"
              lengthAdjust="spacingAndGlyphs"
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                fontFamily: "inherit",
                fill: "currentColor",
              }}
            >
              WAKA
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
