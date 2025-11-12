import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { WorkItem } from "../work_item_services/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripVertical, Clock, CheckCircle2, Circle, Calendar, Option, Ellipsis } from "lucide-react";

type Props = {
    workItems: WorkItem[];
    updateWorkItemStatus: (itemId: number, newStatus: WorkItem["status"]) => void;
};

const KanbanView = ({ workItems, updateWorkItemStatus }: Props) => {
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        const newStatus = destination.droppableId as WorkItem["status"];
        updateWorkItemStatus(Number(draggableId), newStatus);
    };

    const columns: Record<string, { title: string; color: string; icon: any; bgColor: string; borderColor: string }> = {
        pending: {
            title: "To Do",
            color: "text-slate-700 dark:text-slate-300",
            icon: Circle,
            bgColor: "bg-slate-50/80 dark:bg-slate-900/40",
            borderColor: "border-slate-200 dark:border-slate-700"
        },
        in_progress: {
            title: "In Progress",
            color: "text-blue-700 dark:text-blue-300",
            icon: Clock,
            bgColor: "bg-blue-50/80 dark:bg-blue-950/40",
            borderColor: "border-blue-200 dark:border-blue-800"
        },
        completed: {
            title: "Done",
            color: "text-emerald-700 dark:text-emerald-300",
            icon: CheckCircle2,
            bgColor: "bg-emerald-50/80 dark:bg-emerald-950/40",
            borderColor: "border-emerald-200 dark:border-emerald-800"
        },
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high":
                return "bg-red-500";
            case "medium":
                return "bg-amber-500";
            default:
                return "bg-slate-400";
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-[calc(100vh-120px)] dark:bg-slate-950/50">
                {Object.entries(columns).map(([status, { title, color, icon: StatusIcon, bgColor, borderColor }]) => {
                    const columnItems = workItems.filter((i) => i.status === status);

                    return (
                        <div key={status} className="flex-1 flex flex-col min-w-[280px] max-w-[365px]">
                            {/* Column Header */}
                            <div className="mb-3 flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={`h-4 w-4 ${color}`} />
                                    <h3 className={`text-sm font-semibold ${color}`}>
                                        {title}
                                    </h3>
                                    <span className={`text-xs ${color} opacity-60`}>
                                        {columnItems.length}
                                    </span>
                                </div>
                            </div>

                            {/* Scrollable Column Content */}
                            <Droppable droppableId={status}>
                                {(provided: any, snapshot: any) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 overflow-y-auto space-y-2 p-3 rounded-sm border-1 ${borderColor} ${bgColor} transition-all duration-200 ${snapshot.isDraggingOver
                                            ? "ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-950 " +
                                            (status === 'pending' ? 'ring-slate-400' :
                                                status === 'in_progress' ? 'ring-blue-400' :
                                                    'ring-emerald-400')
                                            : ""
                                            }`}
                                        style={{
                                            scrollbarWidth: 'thin',
                                        }}
                                    >
                                        {columnItems.map((item, index) => {
                                            const isOverdue = item.due_date && new Date(item.due_date) < new Date();

                                            return (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={String(item.id)}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="group"
                                                        >
                                                            <Card
                                                                className={`rounded-md transition-all duration-150 ${snapshot.isDragging
                                                                    ? "shadow-md rotate-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                                                    : "shadow-none border border-1 border-black py-0 bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60"
                                                                    }`}
                                                            >
                                                                <CardContent className="p-3 space-y-1 py-4" {...provided.dragHandleProps}>
                                                                    {/* Title and Priority */}
                                                                    <div className="flex items-start gap-2">
                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className="text-xs font-light text-slate-900 dark:text-slate-200 leading-snug break-words">
                                                                                {item.title}
                                                                            </h4>
                                                                        </div>
                                                                        <div>
                                                                            <Ellipsis className="h-6 w-6 p-1 hover:bg-slate-100 " />
                                                                        </div>
                                                                    </div>



                                                                    {/* Footer: Due Date and Avatar */}
                                                                    <div className="flex items-center justify-between pt-1">
                                                                        <div className="flex gap-2">
                                                                            <div className="flex items-center gap-1">
                                                                                <Calendar className={`h-3 w-3 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`} />
                                                                                <span className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                                                                    {item.due_date
                                                                                        ? new Date(item.due_date).toLocaleDateString('en-US', {
                                                                                            month: 'short',
                                                                                            day: 'numeric'
                                                                                        })
                                                                                        : "No date"}
                                                                                </span>
                                                                            </div>
                                                                            {/* Project */}
                                                                            {item.project?.name && (
                                                                                <div className="text-[10px] rounded bg-slate-100 dark:bg-slate-700 px-2 py-1 inline text-slate-500 dark:text-slate-400">
                                                                                    {item.project.name}
                                                                                </div>
                                                                            )}
                                                                            {/* Priority */}
                                                                            <div className="flex items-center">
                                                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getPriorityColor(item.priority)}`} />
                                                                            </div>

                                                                        </div>

                                                                        <TooltipProvider delayDuration={100}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Avatar className="h-5 w-5 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors cursor-pointer">
                                                                                        <AvatarFallback className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                                                            {item.assigned_to?.[0]?.first_name
                                                                                                ?.charAt(0)
                                                                                                ?.toUpperCase() || "?"}
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="top" className="text-xs">
                                                                                    <p>
                                                                                        {item.assigned_to?.[0]?.first_name
                                                                                            ? `${item.assigned_to[0].first_name} ${item.assigned_to[0].last_name || ''}`.trim()
                                                                                            : "Unassigned"}
                                                                                    </p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                        {columnItems.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <StatusIcon className={`h-6 w-6 mb-2 opacity-20 ${color}`} />
                                                <p className="text-xs text-slate-400 dark:text-slate-600">
                                                    No tasks
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanView;