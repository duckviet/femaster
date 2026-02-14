"use client";

import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  type PointerEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

const springConfig = { stiffness: 150, damping: 8, mass: 0.15 };
const sizeSpringConfig = { stiffness: 220, damping: 14 };

export function CustomCursorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const [isInside, setIsInside] = useState(false);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  const cursorX = useSpring(targetX, springConfig);
  const cursorY = useSpring(targetY, springConfig);

  const left = useTransform(cursorX, (v) => `${v}px`);
  const top = useTransform(cursorY, (v) => `${v}px`);

  const cursorW = useMotionValue(18);
  const cursorH = useMotionValue(18);
  const smoothW = useSpring(cursorW, sizeSpringConfig);
  const smoothH = useSpring(cursorH, sizeSpringConfig);

  const borderRadius = useMotionValue(50);
  const smoothRadius = useSpring(borderRadius, sizeSpringConfig);
  const radiusStr = useTransform(smoothRadius, (v) => `${v}%`);

  const snapToContainerCenter = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    animate(cursorX, centerX, { type: "spring", stiffness: 220, damping: 18 });
    animate(cursorY, centerY, { type: "spring", stiffness: 220, damping: 18 });
  }, [cursorX, cursorY]);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (isSnapped) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX.set(x);
      targetY.set(y);
    },
    [isSnapped, targetX, targetY],
  );

  const handlePointerEnter = useCallback(() => {
    setIsInside(true);
    if (!isSnapped) {
      snapToContainerCenter();
    }
  }, [isSnapped, snapToContainerCenter]);

  const handlePointerLeave = useCallback(() => {
    setIsInside(false);
    setIsSnapped(false);
    cursorW.set(18);
    cursorH.set(18);
    borderRadius.set(50);
  }, [borderRadius, cursorH, cursorW]);

  const onTitleEnter = useCallback<PointerEventHandler<HTMLHeadingElement>>(
    (event) => {
      setIsSnapped(true);
      snapToContainerCenter();
      const rect = event.currentTarget.getBoundingClientRect();
      cursorW.set(rect.width + 24);
      cursorH.set(rect.height + 12);
      borderRadius.set(12);
    },
    [borderRadius, cursorH, cursorW, snapToContainerCenter],
  );

  const onTitleLeave = useCallback(() => {
    setIsSnapped(false);
    cursorW.set(18);
    cursorH.set(18);
    borderRadius.set(50);
  }, [borderRadius, cursorH, cursorW]);

  const statusLabel = useMemo(() => {
    if (!isInside) return "Move vào vùng demo";
    if (isSnapped) return "Snapped";
    return "Tracking";
  }, [isInside, isSnapped]);

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Custom Cursor</h3>
        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </div>

      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="relative h-64 rounded-lg border bg-black text-green-400 flex items-center justify-center cursor-none overflow-hidden"
      >
        <h1
          onPointerEnter={onTitleEnter}
          onPointerLeave={onTitleLeave}
          className="uppercase text-[8vh] leading-none relative cursor-none pl-[0.1em] opacity-60 hover:opacity-100 transition-opacity duration-300"
        >
          Start
        </h1>

        <motion.div
          aria-hidden
          className="absolute top-0 left-0 pointer-events-none z-10 border-2 border-green-400 mix-blend-difference"
          style={{
            left,
            top,
            width: smoothW,
            height: smoothH,
            borderRadius: radiusStr,
            x: "-50%",
            y: "-50%",
            opacity: isInside ? 1 : 0,
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Di chuột trong vùng demo. Hover vào tiêu đề để cursor snap về giữa và
        phóng to.
      </p>
    </div>
  );
}
