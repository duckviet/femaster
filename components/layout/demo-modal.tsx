import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { IconMaximize } from "@tabler/icons-react";

interface DemoModalProps {
  children: React.ReactNode;
}

export function DemoModal({ children }: DemoModalProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1 text-xs absolute top-2 right-2 bg-background border border-accent"
        onClick={() => setIsDemoModalOpen(true)}
        disabled={!children}
      >
        <IconMaximize className="size-3" />
        Extend
      </Button>
      {children}
      <Dialog open={isDemoModalOpen} onOpenChange={setIsDemoModalOpen}>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="min-w-[90vw] h-[95vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Live Demo</DialogTitle>
          </DialogHeader>
          <div className=" w-full overflow-auto rounded-md border bg-background relative  p-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
