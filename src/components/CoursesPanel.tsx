import { CourseCard } from "@/components/CourseCard";
import { KeyRound, TrendingUp, Users, Trophy } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "The \"Golden Handcuffs\" Escape Plan",
    description: "Engineer a safe, high-reward career pivot without starting from the bottom.",
    totalModules: 5,
    completedModules: 2,
    icon: <KeyRound className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Breaking the Invisible Ceiling",
    description: "Shift from \"High-Performing Doer\" to \"Strategic Leader.\"",
    totalModules: 5,
    completedModules: 0,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Power, Politics, and Influence",
    description: "Navigate workplace friction without burnout.",
    totalModules: 5,
    completedModules: 5,
    icon: <Users className="h-5 w-5" />,
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            totalModules={course.totalModules}
            completedModules={course.completedModules}
            icon={course.icon}
          />
        ))}
      </div>
    </div>
  );
};
