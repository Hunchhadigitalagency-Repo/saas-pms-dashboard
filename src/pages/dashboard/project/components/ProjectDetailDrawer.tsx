
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Project } from "../project_services/FetchProject"

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
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "active": return "default"
            case "completed": return "secondary"
            case "on_hold": return "outline"
            default: return "default"
        }
    }

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case "high": return "destructive"
            case "medium": return "default"
            case "low": return "secondary"
            default: return "default"
        }
    }

    if (!project) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader>
                        <DrawerTitle>{project.name}</DrawerTitle>
                        <DrawerDescription>
                            <div className="flex gap-2 mt-2">
                                <Badge variant={getStatusVariant(project.status)}>
                                    {project.status}
                                </Badge>
                                <Badge variant={getPriorityVariant(project.priority)}>
                                    {project.priority} Priority
                                </Badge>
                            </div>
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Description</h3>
                            <p className="text-sm text-gray-600">
                                {project.description || "No description provided"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Due Date</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(project.due_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Meet Link</h3>
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
                                <p className="text-sm text-gray-600">No meeting link</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Team Members</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.team_members.length > 0 ? (
                                    project.team_members.map((member: any) => (
                                        <div key={member.user.id} className="flex items-center gap-1 bg-secondary rounded-full py-1 px-3">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback>
                                                    {member.user.first_name.charAt(0).toUpperCase()}
                                                    {member.user.last_name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                                {member.user.username} ({member.role})
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No team members</p>
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
