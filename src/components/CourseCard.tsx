import { BookOpen, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  title: string;
  description?: string;
  totalModules: number;
  completedModules: number;
  icon?: React.ReactNode;
}

export const CourseCard = ({ 
  title, 
  description,
  totalModules, 
  completedModules,
  icon 
}: CourseCardProps) => {
  const isCompleted = completedModules === totalModules;

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg shrink-0 ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
          {icon || <BookOpen className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-relaxed tracking-normal">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {isCompleted ? (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {completedModules}/{totalModules} modules
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress Circles */}
      <div className="mt-3 flex items-center justify-center gap-0">
        {Array.from({ length: totalModules }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                index < completedModules
                  ? 'bg-green-500 border-green-500'
                  : 'bg-muted border-muted-foreground/30'
              }`}
            />
            {index < totalModules - 1 && (
              <div
                className={`w-4 h-0.5 transition-colors duration-300 ${
                  index < completedModules - 1
                    ? 'bg-green-500'
                    : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
