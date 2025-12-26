// components/WorkItemDetailDrawer.tsx
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
import type { WorkItem } from "../../services/work_item_services/FetchWorkItems"

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
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "pending": return "outline"
            case "in_progress": return "default"
            case "completed": return "secondary"
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

    const formatChoice = (choice: string) => {
        return choice.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    if (!item) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader>
                        <DrawerTitle>{item.title}</DrawerTitle>
                        <DrawerDescription>
                            <div className="flex gap-2 mt-2">
                                <Badge variant={getStatusVariant(item.status)}>
                                    {formatChoice(item.status)}
                                </Badge>
                                <Badge variant={getPriorityVariant(item.priority)}>
                                    {formatChoice(item.priority)} Priority
                                </Badge>
                            </div>
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Description</h3>
                            <p className="text-sm text-gray-600">
                                {item.description || "No description provided"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Project</h3>
                            <p className="text-sm text-gray-600">
                                {item.project.name || "No project assigned"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Due Date</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(item.due_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Assigned To</h3>
                            <div className="flex flex-wrap gap-2">
                                {item.assigned_to.length > 0 ? (
                                    item.assigned_to.map(user => (
                                        <div key={user.id} className="flex items-center gap-1 bg-secondary rounded-full py-1 px-3">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{user.username}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No one assigned</p>
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
