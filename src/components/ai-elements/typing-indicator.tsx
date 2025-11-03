import { cn } from '@/lib/utils';

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
