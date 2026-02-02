import { useRef, useEffect, useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { CoursesPanel } from "@/components/CoursesPanel";
import { HiringToolkit } from "@/components/HiringToolkit";
import { useCareerChat } from "@/hooks/useCareerChat";
import { WaitlistModal } from "@/components/WaitlistModal";

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useCareerChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const handleInteraction = () => {
    setWaitlistOpen(true);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <>
      <div 
        className="flex h-screen bg-gradient-subtle cursor-pointer"
        onClick={handleInteraction}
      >
        {/* Left 2/3 - Chat */}
        <div className="w-2/3 flex flex-col border-r border-border">
          <ChatHeader hasMessages={hasMessages} onClear={clearMessages} />

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
          >
            {!hasMessages ? (
              <WelcomeScreen onSuggestionClick={handleInteraction} />
            ) : (
              <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <ChatInput onSend={handleInteraction} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Right 1/3 - Hiring Toolkit (top) + Courses (bottom) */}
        <div className="w-1/3 flex flex-col">
          <div className="flex-shrink-0">
            <HiringToolkit />
          </div>
          <div className="flex-1 overflow-hidden border-t border-border">
            <CoursesPanel />
          </div>
        </div>
      </div>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  );
};

export default Index;
