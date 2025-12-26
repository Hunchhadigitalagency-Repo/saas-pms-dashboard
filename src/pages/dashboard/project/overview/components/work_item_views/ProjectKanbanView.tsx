import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { WorkItem } from "../../services/work_item_services/FetchWorkItems"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, CheckCircle2, Circle, Flag, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
    workItems: WorkItem[];
    updateWorkItemStatus: (itemId: number, newStatus: WorkItem["status"]) => void;
    openViewDrawer: (item: WorkItem) => void;
    openEditModal: (item: WorkItem) => void;
    openDeleteModal: (itemId: number) => void;
};

const ProjectKanbanView = ({ workItems, updateWorkItemStatus, openViewDrawer, openEditModal, openDeleteModal }: Props) => {
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



    const getPriorityFlagColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high":
                return "text-red-500";
            case "medium":
                return "text-amber-500";
            default:
                return "text-slate-400";
        }
    };

    const getDueDateChipColor = (dueDate: string | null) => {
        if (!dueDate) return { bgColor: "bg-slate-100 dark:bg-slate-700", textColor: "text-slate-600 dark:text-slate-300", label: "No date" };

        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { bgColor: "bg-red-100 dark:bg-red-900/30", textColor: "text-red-700 dark:text-red-300", label: "Overdue" };
        } else if (diffDays <= 3) {
            return { bgColor: "bg-orange-100 dark:bg-orange-900/30", textColor: "text-orange-700 dark:text-orange-300", label: "Urgent" };
        } else if (diffDays <= 7) {
            return { bgColor: "bg-yellow-100 dark:bg-yellow-900/30", textColor: "text-yellow-700 dark:text-yellow-300", label: "Soon" };
        } else {
            return { bgColor: "bg-green-100 dark:bg-green-900/30", textColor: "text-green-700 dark:text-green-300", label: "On track" };
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
                                                                className={`rounded-md transition-all duration-150 cursor-pointer hover:shadow-md ${snapshot.isDragging
                                                                    ? "shadow-md rotate-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                                                    : "shadow-none border border-1 border-black py-0 bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60"
                                                                    }`}
                                                                onClick={(e) => {
                                                                    const target = e.target as HTMLElement;
                                                                    // Check if click is on button, menu, or their children
                                                                    if (target.closest('button') || target.closest('[role="menu"]') || target.closest('[role="menuitem"]')) {
                                                                        return;
                                                                    }
                                                                    openViewDrawer(item);
                                                                }}
                                                            >
                                                                <CardContent className="p-3 space-y-1 py-4" {...provided.dragHandleProps}>
                                                                    {/* Action Menu */}
                                                                    <div className="flex items-start justify-between mb-2 gap-2">
                                                                        <div className="flex items-start gap-2">
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-xs font-light text-slate-900 dark:text-slate-200 leading-snug break-words">
                                                                                    {item.title}
                                                                                </h4>
                                                                            </div>
                                                                        </div>
                                                                        {/* Action Menu */}
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-6 w-6 p-0 -mt-1 -mr-1 shrink-0"
                                                                                >
                                                                                    <MoreHorizontal size={14} className="text-slate-500" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-auto">
                                                                                <DropdownMenuItem
                                                                                    className="flex items-center text-[11px] gap-2 cursor-pointer"
                                                                                    onClick={() => openViewDrawer(item)}
                                                                                >
                                                                                    <Eye size={12} />
                                                                                    View
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    className="flex items-center text-[11px] gap-2 cursor-pointer"
                                                                                    onClick={() => openEditModal(item)}
                                                                                >
                                                                                    <Edit size={12} />
                                                                                    Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    className="flex items-center text-[11px] gap-2 cursor-pointer"
                                                                                    onClick={() => openDeleteModal(item.id)}
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                    Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                    {/* Title */}


                                                                    {/* Footer: Due Date and Assigned To */}
                                                                    <div className="flex items-center justify-between pt-3 gap-2">
                                                                        <div className="flex items-center gap-2">
                                                                            {/* Priority Flag */}
                                                                            <TooltipProvider delayDuration={100}>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Flag className={`h-4 w-4 ${getPriorityFlagColor(item.priority)} cursor-pointer fill-current`} />
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent side="top" className="text-xs">
                                                                                        <p className="capitalize">{item.priority} Priority</p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

                                                                            {/* Due Date Chip */}
                                                                            {item.due_date && (
                                                                                <TooltipProvider delayDuration={100}>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <div className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer ${getDueDateChipColor(item.due_date).bgColor} ${getDueDateChipColor(item.due_date).textColor}`}>
                                                                                                {new Date(item.due_date).toLocaleDateString('en-US', {
                                                                                                    month: 'short',
                                                                                                    day: 'numeric'
                                                                                                })}
                                                                                            </div>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent side="top" className="text-xs">
                                                                                            <p>{getDueDateChipColor(item.due_date).label}</p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            )}
                                                                        </div>

                                                                        {/* Assigned To - Multiple Members */}
                                                                        <div className="flex items-center">
                                                                            {item.assigned_to.length > 0 ? (
                                                                                <div className="flex -space-x-2">
                                                                                    {item.assigned_to.map((user) => (
                                                                                        <TooltipProvider key={user.id} delayDuration={100}>
                                                                                            <Tooltip>
                                                                                                <TooltipTrigger asChild>
                                                                                                    <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                                                        <Avatar className="h-7 w-7 p-0 border-2 border-white dark:border-slate-800 bg-black cursor-pointer">
                                                                                                            <AvatarImage src={user.profile?.profile_picture || undefined} alt={user.username} className="object-cover" />
                                                                                                            <AvatarFallback className="text-[11px] font-semibold text-white bg-slate-400/50">
                                                                                                                {user.username.charAt(0).toUpperCase()}
                                                                                                            </AvatarFallback>
                                                                                                        </Avatar>
                                                                                                    </div>
                                                                                                </TooltipTrigger>
                                                                                                <TooltipContent side="top" className="bg-black text-white rounded px-2 py-1">
                                                                                                    <span className="text-[11px]">{user.first_name} {user.last_name}</span>
                                                                                                </TooltipContent>
                                                                                            </Tooltip>
                                                                                        </TooltipProvider>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-[10px] text-gray-400">-</span>
                                                                            )}
                                                                        </div>
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

export default ProjectKanbanView;
