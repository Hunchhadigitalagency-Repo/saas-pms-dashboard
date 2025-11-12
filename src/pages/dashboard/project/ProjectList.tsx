import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, ChevronDown, Filter, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchProjects } from "./project_services/FetchProject"
import type { Project } from "./project_services/FetchProject"
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { ProjectForm } from "./components/ProjectForm"
import { ProjectDetailDrawer } from "./components/ProjectDetailDrawer"
import { deleteProject } from "./project_services/DeleteProject";
import { ProjectListSkeleton } from "./components/ProjectListSkeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [priorityFilter, setPriorityFilter] = useState<string>("")
    const [dueDateFilter, setDueDateFilter] = useState<string>("")
    const [sortField, setSortField] = useState<string>("")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"add" | "edit">("add")
    const [editProjectId, setEditProjectId] = useState<number | undefined>()
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [projectToView, setProjectToView] = useState<Project | null>(null)
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state for add/edit
    const [formData, setFormData] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at'>>({
        name: "",
        description: "",
        status: "active",
        priority: "medium",
        meeting_link: "",
        due_date: "",
        team_members: []
    })

    const loadProjects = async () => {
        try {
            setLoading(true)
            const data = await fetchProjects()
            setProjects(data)
            setError(null)
        } catch (err) {
            console.error("Failed to load projects:", err)
            setError("Failed to load projects. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])

    const updateProjectStatus = (projectId: number, newStatus: Project['status']) => {
        setProjects(prev =>
            prev.map(project =>
                project.id === projectId
                    ? { ...project, status: newStatus }
                    : project
            )
        )
    }

    const updateProjectPriority = (projectId: number, newPriority: Project['priority']) => {
        setProjects(prev =>
            prev.map(project =>
                project.id === projectId
                    ? { ...project, priority: newPriority }
                    : project
            )
        )
    }

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const getSortIcon = (field: string) => {
        if (sortField !== field) return <ArrowUpDown size={14} className="opacity-50" />
        return sortDirection === "asc" ?
            <ArrowUp size={14} className="text-blue-600" /> :
            <ArrowDown size={14} className="text-blue-600" />
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800 hover:bg-green-200"
            case "completed": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "on_hold": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800 hover:bg-red-200"
            case "medium": return "bg-orange-100 text-orange-800 hover:bg-orange-200"
            case "low": return "bg-gray-100 text-gray-800 hover:bg-gray-200"
            default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const formatDisplayValue = (value: string) => {
        if (!value) return "";
        if (value === "on_hold") return "On Hold";
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const filteredProjects = projects.filter((project) => {
        return (
            project.name.toLowerCase().includes(search.toLowerCase()) &&
            (statusFilter ? project.status === statusFilter : true) &&
            (priorityFilter ? project.priority === priorityFilter : true) &&
            (dueDateFilter ? project.due_date === dueDateFilter : true)
        )
    })

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (!sortField) return 0

        let aValue: string | number = ""
        let bValue: string | number = ""

        switch (sortField) {
            case "name":
                aValue = a.name.toLowerCase()
                bValue = b.name.toLowerCase()
                break
            case "status":
                aValue = a.status
                bValue = b.status
                break
            case "priority":
                const priorityOrder = { "high": 3, "medium": 2, "low": 1 }
                aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
                bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
                break
            case "due_date":
                aValue = new Date(a.due_date).getTime()
                bValue = new Date(b.due_date).getTime()
                break
            case "team_members":
                aValue = a.team_members.map((m: any) => m.user.username).join(", ").toLowerCase()
                bValue = b.team_members.map((m: any) => m.user.username).join(", ").toLowerCase()
                break
            case "meeting_link":
                aValue = a.meeting_link || ""
                bValue = b.meeting_link || ""
                break
            default:
                return 0
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    // Delete project functions
    const openDeleteModal = (projectId: number) => {
        setProjectToDelete(projectId)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (projectToDelete) {
            setIsDeleting(true);
            try {
                await deleteProject(projectToDelete);
                loadProjects(); // Reload projects after deletion
                setDeleteModalOpen(false);
                setProjectToDelete(null);
            } catch (error) {
                console.error("Failed to delete project:", error);
                // Optionally, show an error message to the user
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const openAddModal = () => {
        setFormMode("add");
        setFormData({
            name: "",
            description: "",
            status: "active",
            priority: "medium",
            meeting_link: "",
            due_date: "",
            team_members: []
        });
        setEditProjectId(undefined);
        setFormOpen(true);
    };

    const openEditModal = (project: Project) => {
        setFormMode("edit");
        setFormData({
            name: project.name,
            description: project.description || "",
            status: project.status,
            priority: project.priority,
            meeting_link: project.meeting_link || "",
            due_date: project.due_date,
            team_members: [...project.team_members]
        });
        setEditProjectId(project.id);
        setFormOpen(true);
    };

    const handleFormSubmitSuccess = () => {
        loadProjects();
    };

    // View project functions
    const openViewDrawer = (project: Project) => {
        setProjectToView(project)
        setViewDrawerOpen(true)
    }

    if (loading) {
        return <ProjectListSkeleton />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DeleteConfirmationDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />

            <ProjectForm
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmitSuccess={handleFormSubmitSuccess}
                formData={formData}
                setFormData={setFormData}
                mode={formMode}
                projectId={editProjectId}
            />

            <ProjectDetailDrawer
                open={viewDrawerOpen}
                onOpenChange={setViewDrawerOpen}
                project={projectToView}
            />

            {/* Main Content */}
            <Card className="shadow-none border-none p-0">
                <CardContent>
                    {/* Search & Filters */}
                    <div className="flex justify-between gap-4">
                        <div className="flex item-center gap-2">
                            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator
                                        orientation="vertical"
                                        className="mr-2 data-[orientation=vertical]:h-4"
                                    />
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href="#">
                                                    Dashboard
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Projects</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                            </header>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                                <Input
                                    placeholder="Search projects..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-7 h-8 rounded-md text-xs placeholder:text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal whitespace-nowrap">
                                            <Filter size={12} />
                                            Filters
                                            {(statusFilter || priorityFilter || dueDateFilter) && (
                                                <Badge variant="secondary" className="ml-1 text-xs">
                                                    {[statusFilter, priorityFilter, dueDateFilter].filter(Boolean).length}
                                                </Badge>
                                            )}
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-60 p-3">
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Status</label>
                                                <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="All Statuses" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Statuses</SelectItem>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Priority</label>
                                                <Select value={priorityFilter || "all"} onValueChange={(value) => setPriorityFilter(value === "all" ? "" : value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="All Priorities" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Priorities</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Due Date</label>
                                                <Input
                                                    type="date"
                                                    value={dueDateFilter}
                                                    onChange={(e) => setDueDateFilter(e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setStatusFilter("")
                                                        setPriorityFilter("")
                                                        setDueDateFilter("")
                                                    }}
                                                    className="flex-1"
                                                >
                                                    Clear All
                                                </Button>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    onClick={openAddModal}
                                    className="gap-2 h-8 rounded-md cursor-pointer text-xs font-normal bg-secondary whitespace-nowrap hover:text-secondary hover:bg-white border border-secondary transition-colors"
                                >
                                    <Plus size={12} />
                                    Add Project
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border">
                                    <th className="text-left p-4 text-xs w-[40%] text-gray-700">
                                        <button
                                            onClick={() => handleSort("name")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Project Name
                                            {getSortIcon("name")}
                                        </button>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <button
                                            onClick={() => handleSort("status")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Status
                                            {getSortIcon("status")}
                                        </button>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <button
                                            onClick={() => handleSort("priority")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Priority
                                            {getSortIcon("priority")}
                                        </button>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <button
                                            onClick={() => handleSort("due_date")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Due Date
                                            {getSortIcon("due_date")}
                                        </button>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <button
                                            onClick={() => handleSort("meeting_link")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Meet Link
                                            {getSortIcon("meeting_link")}
                                        </button>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <button
                                            onClick={() => handleSort("team_members")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Team Members
                                            {getSortIcon("team_members")}
                                        </button>
                                    </th>
                                    <th className="text-right font-normal p-4 text-xs text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProjects.map((project) => (
                                    <tr key={project.id} className="border hover:bg-gray-50">
                                        <td className="px-3 py-1 text-xs"><span className="font-medium font-bold">{project.name}</span> <br /> <span
                                            className="text-gray-500 font-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: project.description.slice(0, 60) + '...',
                                            }}
                                        ></span> </td>
                                        <td className="px-3 py-1 text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="p-0 h-auto">
                                                        <span
                                                            className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}
                                                        >
                                                            {formatDisplayValue(project.status)}
                                                            <ChevronDown size={12} />
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => updateProjectStatus(project.id, "active")}>
                                                        Active
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateProjectStatus(project.id, "completed")}>
                                                        Completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateProjectStatus(project.id, "on_hold")}>
                                                        On Hold
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="px-3 py-1 text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="p-0 h-auto">
                                                        <span
                                                            className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(project.priority)}`}
                                                        >
                                                            {formatDisplayValue(project.priority)}
                                                            <ChevronDown size={12} />
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => updateProjectPriority(project.id, "high")}>
                                                        High
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateProjectPriority(project.id, "medium")}>
                                                        Medium
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateProjectPriority(project.id, "low")}>
                                                        Low
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="px-3 py-1 text-xs">
                                            {new Date(project.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-1 text-xs">
                                            {project.meeting_link ? (
                                                <a
                                                    href={project.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#00897B" />
                                                        <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#00897B" />
                                                        <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="#00897B" />
                                                    </svg>
                                                    Join
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-1">
                                            <div className="flex items-center">
                                                {project.team_members.length > 0 ? (
                                                    <div className="flex -space-x-2">
                                                        {project.team_members.map((member: any) => (
                                                            <TooltipProvider key={member.user.id}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                            <Avatar className="w-4 h-4 p-3 border-2 border-white bg-black">
                                                                                <AvatarFallback className="text-xs text-white bg-slate-400/10">
                                                                                    {member.user.first_name.charAt(0).toUpperCase()}
                                                                                    {member.user.last_name.charAt(0).toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                                        <span className="text-xs">
                                                                            {member.user.first_name} {member.user.last_name}
                                                                        </span>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-1 text-right text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="flex items-center text-sm gap-2"
                                                        onClick={() => openViewDrawer(project)}
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center text-xs gap-2"
                                                        onClick={() => openEditModal(project)}
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center text-xs gap-2"
                                                        onClick={() => openDeleteModal(project.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {sortedProjects.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 py-6">
                                            No projects found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}