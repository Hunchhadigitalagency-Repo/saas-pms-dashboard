
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const teamWorkload = [
    {
        id: 1,
        name: "Alice Johnson",
        initials: "AJ",
        role: "Frontend Developer",
        tasks: {
            completed: 4,
            overdue: 1,
            pending: 3,
        },
        workload: "high",
    },
    {
        id: 2,
        name: "Bob Williams",
        initials: "BW",
        role: "Backend Developer",
        tasks: {
            completed: 2,
            overdue: 0,
            pending: 3,
        },
        workload: "medium",
    },
    {
        id: 3,
        name: "Charlie Brown",
        initials: "CB",
        role: "Full Stack Developer",
        tasks: {
            completed: 8,
            overdue: 2,
            pending: 2,
        },
        workload: "high",
    },
    {
        id: 4,
        name: "Diana Prince",
        initials: "DP",
        role: "UI/UX Designer",
        tasks: {
            completed: 6,
            overdue: 0,
            pending: 1,
        },
        workload: "low",
    },
    {
        id: 5,
        name: "Eve Smith",
        initials: "ES",
        role: "DevOps Engineer",
        tasks: {
            completed: 3,
            overdue: 1,
            pending: 4,
        },
        workload: "medium",
    },
];

const workloadStyles: { [key: string]: string } = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
};

export function TeamWorkload() {
    return (
        <Card className="border  gap-3 py-3 shadow-none rounded-md h-[378px] flex flex-col">
            <CardHeader className="px-4 py-0 flex-shrink-0">
                <CardTitle className="text-sm font-light">Team Workload</CardTitle>
                <CardDescription className="text-sm">
                    Task distribution and workload across team members
                </CardDescription>
            </CardHeader>
            <Separator className="flex-shrink-0 py-0 my-0" />
            <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="p-0 space-y-4">
                        {teamWorkload.map((member) => {
                            const totalTasks = member.tasks.completed + member.tasks.pending + member.tasks.overdue;
                            const completionRate = totalTasks > 0 ? Math.round((member.tasks.completed / totalTasks) * 100) : 0;

                            return (
                                <div key={member.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                                            {member.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {member.name}
                                                </h4>
                                                <p className="text-xs text-gray-600">
                                                    {member.role}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${workloadStyles[member.workload]} text-xs border`}>
                                                    {member.workload} workload
                                                </Badge>
                                                {member.tasks.overdue > 0 && (
                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-4">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="flex items-center gap-1 text-green-600">
                                                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-sm font-medium">{member.tasks.completed}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Completed Tasks</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="flex items-center gap-1 text-yellow-600">
                                                                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                                                                <span className="text-sm font-medium">{member.tasks.pending}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Pending Tasks</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <div className="flex items-center gap-1 text-red-600">
                                                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                                                <span className="text-sm font-medium">{member.tasks.overdue}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Overdue Tasks</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {totalTasks} total
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {completionRate}% complete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
