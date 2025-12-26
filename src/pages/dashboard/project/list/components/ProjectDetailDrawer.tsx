import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileClock, AlertTriangle } from "lucide-react"
import type { Project } from "../services/FetchProject"

interface ProjectDetailDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project: Project | null
}

export function ProjectDetailDrawer({
    open,
    onOpenChange,
    project,
}: ProjectDetailDrawerProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800"
            case "completed": return "bg-blue-100 text-blue-800"
            case "on_hold": return "bg-yellow-100 text-yellow-800"
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

    const formatDisplayValue = (value: string) => {
        if (!value) return "";
        if (value === "on_hold") return "On Hold";
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    if (!project) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="h-full w-full sm:w-[500px] ml-auto">
                <div className="h-full flex flex-col">
                    <DrawerHeader className="text-left border-b">
                        <DrawerTitle className="text-xl font-semibold">{project.name}</DrawerTitle>
                        <DrawerDescription className="sr-only">
                            View detailed information about this project
                        </DrawerDescription>
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 ">
                                    <FileClock className="h-4 w-4 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-600">Status</span>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
                                    {formatDisplayValue(project.status)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 ">
                                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-600">Priority</span>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                    {formatDisplayValue(project.priority)}
                                </span>
                            </div>
                        </div>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Description</h3>
                            {project.description ? (
                                <div
                                    className="text-sm text-gray-600 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: project.description }}
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No description provided</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Due Date</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(project.due_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Meet Link</h3>
                            {project.meeting_link ? (
                                <a
                                    href={project.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#00897B" />
                                        <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#00897B" />
                                        <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="#00897B" />
                                    </svg>
                                    Join Meeting
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500">No meeting link</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Team Members</h3>
                            <div className="flex items-center">
                                {(project.team_members?.length ?? 0) > 0 ? (
                                    <div className="flex -space-x-2">
                                        {(project.team_members ?? []).map((member: any, idx: number) => {
                                            const user = member?.user || {}
                                            const firstInitial = user.first_name ? String(user.first_name).charAt(0).toUpperCase() : (user.username ? String(user.username).charAt(0).toUpperCase() : "?")
                                            const lastInitial = user.last_name ? String(user.last_name).charAt(0).toUpperCase() : ""
                                            const key = user.id ?? member.id ?? idx
                                            return (
                                                <TooltipProvider key={key}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                <Avatar className="w-8 h-8 border-2 border-white bg-black">
                                                                    <AvatarFallback className="text-xs text-white bg-slate-400/10">
                                                                        {firstInitial}{lastInitial}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                            <span className="text-xs">
                                                                {user.first_name ?? user.username ?? "Unknown"} {user.last_name ?? ""}
                                                                {member.role && ` (${member.role})`}
                                                            </span>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No team members</p>
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
