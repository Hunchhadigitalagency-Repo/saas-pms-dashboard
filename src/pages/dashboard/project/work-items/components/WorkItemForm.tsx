import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/text-editor-lexical/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
    X, UserPlus, Calendar, FolderOpen, Clock,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
    FileClock
} from "lucide-react"
import { type WorkItem, type User } from "../work_item_services/FetchWorkItems"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { getMyClientUsers } from "@/core/utils/getMyClientUsers"
import { createWorkItem } from "../work_item_services/CreateWorkItem"
import { updateWorkItem } from "../work_item_services/UpdateWorkItem"

interface WorkItemFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmitSuccess: () => void
    formData: Omit<WorkItem, 'id' | 'created_at' | 'updated_at'>
    setFormData: (data: Omit<WorkItem, 'id' | 'created_at' | 'updated_at'>) => void
    mode: "add" | "edit"
    workItemId?: number
}

export function WorkItemForm({
    open,
    onOpenChange,
    onSubmitSuccess,
    formData,
    setFormData,
    mode,
    workItemId
}: WorkItemFormProps) {
    const [assigneeInput, setAssigneeInput] = useState("")
    const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await getMyClientUsers()
                if (usersData) {
                    setUsers(usersData)
                }
            } catch (error) {
                console.error("Failed to fetch users:", error)
            }
        }

        if (open) {
            fetchUsers()
        }
    }, [open])

    const addAssignee = (user: User) => {
        if (!formData.assigned_to.some(u => u.id === user.id)) {
            setFormData({
                ...formData,
                assigned_to: [...formData.assigned_to, user]
            })
        }
    }

    const removeAssignee = (userId: number) => {
        setFormData({
            ...formData,
            assigned_to: formData.assigned_to.filter(u => u.id !== userId)
        })
    }

    const handleSubmit = async () => {
        setLoading(true)
        const payload = {
            ...formData,
            project: formData.project.id,
            assigned_to: formData.assigned_to.map(u => u.id)
        };

        try {
            if (mode === 'add') {
                await createWorkItem(payload);
            } else if (mode === 'edit' && workItemId) {
                await updateWorkItem(workItemId, payload);
            }
            onSubmitSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(`Failed to ${mode === 'add' ? 'create' : 'update'} work item:`, error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1050px] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-3 pb-4 border-b">
                    <DialogTitle className="text-xs font-medium flex items-center gap-2">
                        {mode === "add" ? (
                            <>
                                Add New Work Item
                            </>
                        ) : (
                            <>
                                Edit Work Item
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {mode === "add"
                            ? "Fill in the details to create a new work item. All fields are required unless marked optional."
                            : "Update the work item details below."}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-3 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-medium flex items-center gap-1">
                                Work Item Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter a clear and descriptive title"
                                className="w-full"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-medium">
                                Description (Optional)
                            </Label>
                            <RichTextEditor
                                value={formData.description || ""}
                                onChange={(val) => setFormData({ ...formData, description: val })}
                                placeholder="Provide details about this work item"
                                className="min-h-[120px]"
                            />
                        </div>

                        {/* Status & Priority in a grid */}
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-medium flex items-center gap-1">
                                    <FileClock className="h-4 w-4" /> Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value as WorkItem['status'] })}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <div className="flex items-center gap-2">
                                            {formData.status === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                                            {formData.status === "in_progress" && <RefreshCw className="h-4 w-4 text-blue-500" />}
                                            {formData.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                            <span>
                                                {formData.status === "pending" && "Pending"}
                                                {formData.status === "in_progress" && "In Progress"}
                                                {formData.status === "completed" && "Completed"}
                                                {!formData.status && "Select status"}
                                            </span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                Pending
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="h-4 w-4 text-blue-500" />
                                                In Progress
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                Completed
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-medium flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4" /> Priority <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value as WorkItem['priority'] })}
                                >
                                    <SelectTrigger id="priority" className="w-full">
                                        <div className="flex items-center gap-2">
                                            {formData.priority === "high" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                            {formData.priority === "medium" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                            {formData.priority === "low" && <AlertCircle className="h-4 w-4 text-gray-500" />}
                                            <span>
                                                {formData.priority === "high" && "High"}
                                                {formData.priority === "medium" && "Medium"}
                                                {formData.priority === "low" && "Low"}
                                                {!formData.priority && "Select priority"}
                                            </span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                High
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                Medium
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="low">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-gray-500" />
                                                Low
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="text-xs font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> Due Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        id="dueDate"
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>

                            {/* Project Display (Read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="project" className="text-xs font-medium flex items-center gap-1">
                                    <FolderOpen className="h-4 w-4" /> Project
                                </Label>
                                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 text-gray-700">
                                    <FolderOpen className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs font-medium">{formData.project.name || "Current Project"}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    This work item belongs to the current project
                                </p>
                            </div>
                        </div>

                        {/* Assignees Field */}
                        <div className="space-y-2">
                            <Label htmlFor="assignedTo" className="text-xs font-medium flex items-center gap-1">
                                <UserPlus className="h-4 w-4" /> Assigned To
                            </Label>

                            <div className="flex items-center gap-2">
                                {/* Avatar Stack */}
                                <div className="flex -space-x-2">
                                    {formData.assigned_to.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className="relative group"
                                            style={{ zIndex: hoveredAvatar === user.id ? 10 : 1 }}
                                            onMouseEnter={() => setHoveredAvatar(user.id)}
                                            onMouseLeave={() => setHoveredAvatar(null)}
                                        >
                                            <Avatar className="h-8 w-8 border-2 border-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                                                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Tooltip with name */}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute inset-0 cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>{user.username}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {/* Remove button - only visible on hover */}
                                            {hoveredAvatar === user.id && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAssignee(user.id);
                                                    }}
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 z-20"
                                                    aria-label={`Remove ${user.username}`}
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add Assignee Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 z-10"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56">
                                        <DropdownMenuLabel>Assign Team Member</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search members..."
                                                className="mb-2"
                                                value={assigneeInput}
                                                onChange={(e) => setAssigneeInput(e.target.value)}
                                            />
                                            <div className="max-h-60 overflow-y-auto">
                                                {users
                                                    .filter(member =>
                                                        member.username.toLowerCase().includes(assigneeInput.toLowerCase()) ||
                                                        member.email.toLowerCase().includes(assigneeInput.toLowerCase())
                                                    )
                                                    .filter(member => !formData.assigned_to.some(u => u.id === member.id))
                                                    .map(member => (
                                                        <DropdownMenuItem
                                                            key={member.id}
                                                            onSelect={() => addAssignee(member)}
                                                            className="flex items-center gap-2 p-2 cursor-pointer"
                                                        >
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className="text-xs">
                                                                    {member.username.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">{member.username}</span>
                                                                <span className="text-xs text-gray-500">{member.email}</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))}
                                            </div>
                                            {users.filter(member =>
                                                !formData.assigned_to.some(u => u.id === member.id) &&
                                                (member.username.toLowerCase().includes(assigneeInput.toLowerCase()) ||
                                                    member.email.toLowerCase().includes(assigneeInput.toLowerCase()))
                                            ).length === 0 && (
                                                    <div className="text-center py-4 text-sm text-gray-500">
                                                        No team members found
                                                    </div>
                                                )}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {formData.assigned_to.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {formData.assigned_to.length} team member{formData.assigned_to.length !== 1 ? 's' : ''} assigned
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row sm:justify-between sm:space-x-3">
                    <div className="text-sm text-gray-500 mb-3 sm:mb-0 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Fields marked with * are required</span>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 sm:flex-none"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.title || !formData.status || !formData.priority || !formData.due_date || loading}
                            className="flex-1 sm:flex-none"
                        >
                            {loading ? "Saving..." : mode === "add" ? "Create Work Item" : "Save Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}