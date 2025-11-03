"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuToggle: () => void;
  conversationTitle?: string;
  currentModeId?: string;
  onModeChange: (modeId: string) => void;
}

export function MobileHeader({
  onMenuToggle,
  conversationTitle,
  currentModeId,
  onModeChange
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all duration-300">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden touch-target"
            aria-label="Open conversations menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold truncate text-base-mobile md:text-lg">
              {conversationTitle || "AI Chat"}
            </h1>
          </div>
        </div>s
      </div>
    </header>
  );
}