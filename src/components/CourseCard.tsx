import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  title: string;
  totalModules: number;
  completedModules: number;
  icon?: React.ReactNode;
}

export const CourseCard = ({ 
  title, 
  totalModules, 
  completedModules,
  icon 
}: CourseCardProps) => {
  const progressPercent = (completedModules / totalModules) * 100;
  const isCompleted = completedModules === totalModules;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
          {icon || <BookOpen className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isCompleted ? (
              <span className="text-sm text-green-500 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {completedModules}/{totalModules} modules
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Progress value={progressPercent} className="h-2" />
      </div>
    </div>
  );
};
