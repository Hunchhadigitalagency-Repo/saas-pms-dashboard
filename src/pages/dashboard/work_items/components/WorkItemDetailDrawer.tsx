import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileClock, AlertTriangle, Calendar, Briefcase, User as UserIcon } from "lucide-react"
import type { WorkItem } from "../work_item_services/types"

interface WorkItemDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item: WorkItem | null
}

export function WorkItemDetailDrawer({
    open,
    onOpenChange,
    item
}: WorkItemDetailDrawerProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "in_progress": return "bg-blue-100 text-blue-800"
            case "completed": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800"
            case "medium": return "bg-orange-100 text-orange-800"
            case "low": return "bg-gray-100 text-gray-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const formatChoice = (choice: string) => {
        if (!choice) return "";
        return choice.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    if (!item) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-full w-full sm:w-[700px] ml-auto">
                <div className="h-full flex flex-col">
                    <DrawerHeader className="text-left border-b">
                        <DrawerTitle className="text-xl font-semibold">{item.title}</DrawerTitle>
                        <DrawerDescription className="sr-only">
                            View detailed information about this work item
                        </DrawerDescription>
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 ">
                                    <FileClock className="h-4 w-4 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-600">Status</span>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {formatChoice(item.status)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 ">
                                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-600">Priority</span>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                    {formatChoice(item.priority)}
                                </span>
                            </div>
                        </div>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Description</h3>
                            {item.description ? (
                                <div
                                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No description provided</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="h-4 w-4 text-gray-700" />
                                <h3 className="font-semibold text-sm">Project</h3>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md inline-block">
                                {item.project.name || "No project assigned"}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-gray-700" />
                                <h3 className="font-semibold text-sm">Due Date</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                                {item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "No due date"}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <UserIcon className="h-4 w-4 text-gray-700" />
                                <h3 className="font-semibold text-sm">Assigned To</h3>
                            </div>
                            <div className="flex items-center">
                                {item.assigned_to.length > 0 ? (
                                    <div className="flex -space-x-2">
                                        {item.assigned_to.map((user) => (
                                            <TooltipProvider key={user.id}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                            <Avatar className="w-8 h-8 border-2 border-white bg-black">
                                                                <AvatarImage src={user.profile?.profile_picture || undefined} alt={user.username} className="object-cover" />
                                                                <AvatarFallback className="text-xs text-white bg-slate-400/10">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                        <span className="text-xs">{user.first_name ?? user.username}</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No one assigned</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}