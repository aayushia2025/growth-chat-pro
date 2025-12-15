import { CourseCard } from "@/components/CourseCard";
import { MessageSquare, Mic, Sparkles, Trophy } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Communication Course",
    totalModules: 5,
    completedModules: 2,
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Executive Communication",
    totalModules: 5,
    completedModules: 0,
    icon: <Mic className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Powerful Presence",
    totalModules: 5,
    completedModules: 5,
    icon: <Sparkles className="h-6 w-6" />,
  },
];

export const CoursesPanel = () => {
  const completedCourses = courses.filter(
    (c) => c.completedModules === c.totalModules
  ).length;

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/50">
        <h2 className="text-xl font-bold text-foreground">My Courses</h2>
        <div className="flex items-center gap-2 mt-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-muted-foreground">
            {completedCourses}/{courses.length} courses completed
          </span>
        </div>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            totalModules={course.totalModules}
            completedModules={course.completedModules}
            icon={course.icon}
          />
        ))}
      </div>
    </div>
  );
};
