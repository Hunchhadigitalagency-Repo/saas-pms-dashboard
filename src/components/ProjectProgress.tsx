import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";

interface Project {
  name: string;
  progress: number;
  status: string;
  priority: string;
  dueDate: string;
}

const projects: Project[] = [
  { name: "Website Redesign", progress: 20, status: "In Progress", priority: "High", dueDate: "2025-12-01" },
  { name: "Mobile App Development", progress: 75, status: "In Progress", priority: "Medium", dueDate: "2025-11-20" },
  { name: "API Integration", progress: 45, status: "In Progress", priority: "High", dueDate: "2025-11-15" },
  { name: "Database Migration", progress: 90, status: "Completed", priority: "High", dueDate: "2025-10-30" },
  { name: "New Feature X", progress: 60, status: "In Progress", priority: "Medium", dueDate: "2025-12-10" },
  { name: "Marketing Campaign", progress: 30, status: "In Progress", priority: "Low", dueDate: "2025-11-25" },
  { name: "UI/UX Overhaul", progress: 50, status: "In Progress", priority: "Medium", dueDate: "2025-12-05" },
  { name: "Backend Refactoring", progress: 80, status: "In Progress", priority: "High", dueDate: "2025-11-30" },
];

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-400";
  return "bg-red-500";
};

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Completed":
//       return "bg-green-100 text-green-700";
//     case "In Progress":
//       return "bg-blue-100 text-blue-700";
//     case "Pending":
//       return "bg-yellow-100 text-yellow-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ProjectProgress = () => {
  return (
    <Card className="border shadow-none rounded-md gap-3 py-3">
      <CardHeader className="px-4 py-0">
        <CardTitle className="text-sm font-light">Project Progress</CardTitle>
        <CardDescription className="text-xs">
          An overview of the progress of active projects.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-4 max-h-64 overflow-y-auto">
        {projects.map((project) => (
          <div key={project.name} className="flex items-center justify-between gap-4">
            {/* Left side: project info */}
            <div className="flex flex-col space-y-1">
              <div className="font-base text-sm text-gray-700 truncate">{project.name}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-light ${getPriorityColor(project.priority)}`}>
                  {project.priority} Priority
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  {project.dueDate}
                </span>
              </div>
            </div>

            {/* Right side: progress bar */}
            <div className="flex flex-col items-end w-1/3">
              <div className="text-sm font-medium mb-1">{project.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
