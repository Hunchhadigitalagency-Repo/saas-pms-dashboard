import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Flag, Clock, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchDueWorkItems } from "../services/dashboard_due_work_items/FetchDueWorkItems";
import type { DueWorkItem } from "../services/dashboard_due_work_items/types";

const calculateDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = now.getTime() - due.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export function OverdueTasks() {
    const [overdueTasks, setOverdueTasks] = useState<DueWorkItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDueWorkItems();
                setOverdueTasks(data);
            } catch (error) {
                console.error("Failed to fetch due work items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="border  gap-3 py-3 shadow-none rounded-md h-[378px] flex flex-col">
            <CardHeader className="px-4 py-0 flex-shrink-0">
                <CardTitle className="text-sm font-light">Overdue Tasks</CardTitle>
                <CardDescription className="text-xs">
                    Tasks past due date. Prioritize high impact items.
                </CardDescription>
            </CardHeader>
            <Separator className="flex-shrink-0 py-0 my-0" />
            <CardContent className="p-0 flex-1 overflow-hidden">
                {loading ? (
                    <div className="p-4 text-xs text-muted-foreground flex items-center justify-center h-full">
                        Loading...
                    </div>
                ) : overdueTasks.length === 0 ? (
                    <div className="p-4 text-xs text-muted-foreground flex items-center justify-center h-full">
                        No overdue tasks. You're all caught up!
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <ul className="divide-y divide-gray-100">
                            {overdueTasks.map((task) => {
                                const priorityColor =
                                    task.priority === "high"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : task.priority === "medium"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200";

                                const StatusIcon = task.status === "blocked" ? AlertCircle : task.status === "in_progress" ? Clock : CheckCircle2;
                                const daysOverdue = calculateDaysOverdue(task.due_date);

                                return (
                                    <li key={task.id} className="p-3 hover:bg-gray-50/50 transition-colors">
                                        <div className="">
                                            <div className="flex justify-between min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={`h-5 px-2 text-[10px] border ${priorityColor}`}>
                                                        <Flag className="h-3 w-3 mr-1" />
                                                        {task.priority.toUpperCase()}
                                                    </Badge>
                                                    {daysOverdue > 0 && (
                                                        <div className="flex items-center gap-1 text-red-600">
                                                            <AlertCircle className="h-3 w-3" />
                                                            <span className="text-xs font-medium">{daysOverdue}d</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Badge variant="secondary" className="text-[10px] h-6">
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {task.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                            <div className="flex-shrink-0 mt-2">
                                                <h4 className="text-xs font-regular text-gray-900 mb-1 line-clamp-2">
                                                    {task.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {task.project.name}{task.assigned_to.length > 0 ? ` • ${task.assigned_to.map(u => u.first_name).join(', ')}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}