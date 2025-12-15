import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "@/components/WaitlistModal";

interface ChatHeaderProps {
  hasMessages: boolean;
  onClear: () => void;
}

export function ChatHeader({ hasMessages, onClear }: ChatHeaderProps) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
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

        <div className="flex items-center gap-2">
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
          <Button
            size="sm"
            onClick={() => setWaitlistOpen(true)}
            className="bg-gradient-accent hover:opacity-90 transition-opacity"
          >
            Join Waitlist
          </Button>
        </div>
      </header>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  );
}
