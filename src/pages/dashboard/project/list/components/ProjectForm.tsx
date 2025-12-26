import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { successOptions, errorOptions } from "@/core/utils/toast-styles"
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
import QuillEditor from "@/components/ui/text-editor-quill/rich-text-editor-quill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    X, UserPlus, Calendar,
    AlertTriangle,
    FileClock,
    Loader2
} from "lucide-react"
import { type Project, type TeamMember } from "../../types/types"
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
import { type User } from "../../types/types"
import { createProject } from "../services/CreateProject"
import { updateProject } from "../services/UpdateProject"

interface ProjectFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmitSuccess: (savedProject: Project) => void
    formData: Omit<Project, 'id' | 'created_at' | 'updated_at'>
    setFormData: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void
    mode: "add" | "edit"
    projectId?: number
}

export function ProjectForm({
    open,
    onOpenChange,
    onSubmitSuccess,
    formData,
    setFormData,
    mode,
    projectId
}: ProjectFormProps) {
    const [teamMemberInput, setTeamMemberInput] = useState("")
    const [teamMemberRoleInput, setTeamMemberRoleInput] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        async function fetchData() {
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
            fetchData()
        }
    }, [open])

    const addTeamMember = () => {
        if (teamMemberInput.trim() && teamMemberRoleInput.trim()) {
            const selectedUser = users.find(u => u.username === teamMemberInput.trim());
            if (selectedUser && !formData.team_members.some(tm => tm.user.id === selectedUser.id)) {
                const newMember: TeamMember = {
                    user: selectedUser,
                    role: teamMemberRoleInput.trim()
                }

                setFormData({
                    ...formData,
                    team_members: [...formData.team_members, newMember]
                })
                setTeamMemberInput("")
                setTeamMemberRoleInput("")
            }
        }
    }

    const removeTeamMember = (userId: number) => {
        setFormData({
            ...formData,
            team_members: formData.team_members.filter((member) => member.user.id !== userId)
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const projectPayload = {
            ...formData,
            team_members: formData.team_members.map(member => (
                member.user.id
            ))
        };

        try {
            let savedProject: Project;
            if (mode === 'add') {
                savedProject = await createProject(projectPayload);
                toast.success(`Project "${savedProject.name}" created successfully 🚀`, successOptions);
            } else if (mode === 'edit' && projectId) {
                savedProject = await updateProject(projectId, projectPayload);
                toast.success(`Project "${savedProject.name}" updated successfully ✨`, successOptions);
            } else {
                throw new Error('Invalid mode or missing project ID');
            }
            onSubmitSuccess(savedProject);
            onOpenChange(false);
        } catch (error) {
            console.error(`Failed to ${mode === 'add' ? 'create' : 'update'} project:`, error);
            toast.error(`Failed to ${mode === 'add' ? 'create' : 'update'} project`, errorOptions);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1050px] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-3 pb-4 border-b">
                    <DialogTitle className="text-xs font-medium flex items-center gap-2">
                        {mode === "add" ? "Add New Project" : "Edit Project"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {mode === "add"
                            ? "Fill in the details to create a new project. All fields are required unless marked optional."
                            : "Update the project details below."}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-3 max-h-[70vh] overflow-y-auto">
                    <fieldset disabled={isSubmitting} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-medium flex items-center gap-1">
                                Project Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter a clear and descriptive name"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-medium">
                                Description (Optional)
                            </Label>
                            <QuillEditor
                                value={formData.description || ""}
                                onChange={(val) => setFormData({ ...formData, description: val })}
                                placeholder="Provide details about this project"
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-medium flex items-center gap-1">
                                    <FileClock className="h-4 w-4" /> Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-medium flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4" /> Priority <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value as Project['priority'] })}
                                >
                                    <SelectTrigger id="priority" className="w-full">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date" className="text-xs font-medium flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> Due Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    id="due_date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meeting_link" className="text-xs font-medium">
                                Meeting Link (Optional)
                            </Label>
                            <Input
                                id="meeting_link"
                                value={formData.meeting_link}
                                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                placeholder="https://meet.google.com/..."
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium flex items-center gap-1">
                                <UserPlus className="h-4 w-4" /> Team Members
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {formData.team_members.map((member) => (
                                        <div
                                            key={member.user.id}
                                            className="relative group"
                                            style={{ zIndex: hoveredAvatar === member.user.id ? 10 : 1 }}
                                            onMouseEnter={() => setHoveredAvatar(member.user.id)}
                                            onMouseLeave={() => setHoveredAvatar(null)}
                                        >
                                            <Avatar className="h-8 w-8 border-2 border-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                                                <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                                    {member.user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute inset-0 cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p>{member.user.username} ({member.role})</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {hoveredAvatar === member.user.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeamMember(member.user.id)}
                                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 z-20"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

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
                                    <DropdownMenuContent align="start" className="w-64">
                                        <DropdownMenuLabel>Add Team Member</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search members..."
                                                className="mb-2"
                                                value={teamMemberInput}
                                                onChange={(e) => setTeamMemberInput(e.target.value)}
                                            />
                                            <Input
                                                placeholder="Role..."
                                                className="mb-2"
                                                value={teamMemberRoleInput}
                                                onChange={(e) => setTeamMemberRoleInput(e.target.value)}
                                            />
                                            <div className="max-h-48 overflow-y-auto">
                                                {users
                                                    .filter(user =>
                                                        user.username.toLowerCase().includes(teamMemberInput.toLowerCase())
                                                    )
                                                    .filter(user => !formData.team_members.some(tm => tm.user.id === user.id))
                                                    .map(user => (
                                                        <DropdownMenuItem
                                                            key={user.id}
                                                            onSelect={() => {
                                                                const newMember: TeamMember = { user, role: teamMemberRoleInput || 'Member' };
                                                                setFormData({ ...formData, team_members: [...formData.team_members, newMember] });
                                                                setTeamMemberInput('');
                                                                setTeamMemberRoleInput('');
                                                            }}
                                                            className="flex items-center gap-2 p-2 cursor-pointer"
                                                        >
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className="text-xs">
                                                                    {user.username.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium">{user.username}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))}
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <DialogFooter className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        <span className="text-red-500">*</span> Required fields
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "add" ? "Create Project" : "Save Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}