import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { IconMaximize } from "@tabler/icons-react";

interface DemoModalProps {
  children: React.ReactNode;
}

export function DemoModal({ children }: DemoModalProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const inlineRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1 text-xs absolute z-20 top-2 right-2 bg-background border border-accent"
        onClick={() => setIsDemoModalOpen(true)}
        disabled={!children}
      >
        <IconMaximize className="size-3" />
        Extend
      </Button>

      {/* Luôn mount children, chỉ ẩn bằng CSS khi modal mở
          → tránh unmount/remount làm fitty mất context */}
      <div
        ref={inlineRef}
        style={{ display: isDemoModalOpen ? "none" : undefined }}
      >
        {children}
      </div>

      <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="min-w-[90vw] h-[95vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Live Demo</DialogTitle>
          </DialogHeader>
          {/* Render riêng trong modal — component sẽ mount lại khi mở modal,
                nhưng lúc này container đã có kích thước thật */}
          {isDemoModalOpen && children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
