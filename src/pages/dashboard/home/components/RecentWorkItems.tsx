
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const recentWorkItems = [
    {
        id: 1,
        title: "Fix login button bug",
        project: "E-commerce Platform",
        status: "in_progress",
        priority: "high",
        dueDate: "2024-01-15",
    },
    {
        id: 2,
        title: "Design new dashboard layout",
        project: "Mobile App Redesign",
        status: "completed",
        priority: "medium",
        dueDate: "2024-01-10",
    },
    {
        id: 3,
        title: "Set up CI/CD pipeline",
        project: "Internal Tools",
        status: "pending",
        priority: "low",
        dueDate: "2024-01-20",
    },
    {
        id: 4,
        title: "Write API documentation",
        project: "E-commerce Platform",
        status: "in_progress",
        priority: "medium",
        dueDate: "2024-01-18",
    },
    {
        id: 5,
        title: "Implement user authentication",
        project: "Mobile App Redesign",
        status: "pending",
        priority: "high",
        dueDate: "2024-01-22",
    },
    {
        id: 6,
        title: "Optimize database queries",
        project: "Internal Tools",
        status: "completed",
        priority: "medium",
        dueDate: "2024-01-12",
    },
];

const statusStyles: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
};

const priorityStyles: { [key: string]: string } = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-gray-600",
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'in_progress':
            return <Clock className="h-4 w-4 text-blue-600" />;
        case 'pending':
            return <Circle className="h-4 w-4 text-yellow-600" />;
        default:
            return <Circle className="h-4 w-4 text-gray-600" />;
    }
};

export function RecentWorkItems() {
    return (
        <Card className="border  gap-3 py-3 shadow-none rounded-md h-[378px] flex flex-col">
            <CardHeader className="px-4 py-0 flex-shrink-0">
                <CardTitle className="text-sm font-light">Recent Work Items</CardTitle>
                <CardDescription className="text-sm">Latest tasks and their current status</CardDescription>
            </CardHeader>
            <Separator className="flex-shrink-0 py-0 my-0" />
            <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="p-0 space-y-4">
                        {recentWorkItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(item.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {item.title}
                                        </h4>
                                        <Badge className={`${statusStyles[item.status]} text-xs border`}>
                                            {item.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {item.project}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-medium ${priorityStyles[item.priority]}`}>
                                            {item.priority} priority
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">
                                            Due: {new Date(item.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
