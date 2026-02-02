import { FileText, Files, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tools = [
  {
    id: 1,
    title: "Resume Builder",
    description: "Upload job description, get ATS-optimized resume",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Template Resumes",
    description: "Industry-specific resume templates",
    icon: <Files className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Interview Prep",
    description: "Practice with AI-powered mock interviews",
    icon: <Mic className="h-5 w-5" />,
  },
];

export const HiringToolkit = () => {
  return (
    <div className="flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/50">
        <h2 className="text-xl font-bold text-foreground">Hiring Toolkit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Land your dream role faster
        </p>
      </div>

      {/* Tools List */}
      <div className="p-4 space-y-3">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 bg-card"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
