"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  children?: React.ReactNode;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onNewChat,
  children
}: MobileDrawerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-y-0 left-0 h-full w-80 p-0 m-0 rounded-none border-r">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Conversations
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="touch-target"
                aria-label="Close conversations menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-3 mt-4">
              <Button
                onClick={onNewChat}
                className="w-full mobile-button"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              <Input
                placeholder="Search conversations..."
                className="mobile-input"
                aria-label="Search conversations"
              />
            </div>
          </DialogHeader>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}