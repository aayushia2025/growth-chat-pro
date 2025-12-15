import { Sparkles, TrendingUp, MessageCircle, Target } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: TrendingUp,
    text: "I want to change careers, but I can't afford a pay cut or to start over",
  },
  {
    icon: Target,
    text: "I feel stuck at my current level and my hard work isn't leading to a promotion",
  },
  {
    icon: MessageCircle,
    text: "I'm successful on paper but exhausted in reality. How do I set boundaries without hurting my reputation?",
  },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 animate-fade-in">
      {/* Logo / Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow mb-6">
        <Sparkles className="w-8 h-8 text-accent-foreground" />
      </div>

      {/* Headline */}
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-3">
        Meet Your <span className="italic">Mentor</span>
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Expand your career potential and experience growth with these personalized recommendations.
      </p>

      {/* Suggestion Cards */}
      <div className="w-full max-w-lg space-y-3">
        <p className="text-sm text-muted-foreground text-center mb-4">What's top of mind today?</p>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl shadow-soft hover:shadow-medium hover:border-accent/30 transition-all duration-200 text-left group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <suggestion.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[15px] text-foreground">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
