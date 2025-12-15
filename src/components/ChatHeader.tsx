import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  hasMessages: boolean;
  onClear: () => void;
}

export function ChatHeader({ hasMessages, onClear }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-medium">Mentor</h1>
          <p className="text-xs text-muted-foreground">AI-powered career guidance</p>
        </div>
      </div>

      {hasMessages && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New chat
        </Button>
      )}
    </header>
  );
}
