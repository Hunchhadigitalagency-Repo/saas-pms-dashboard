import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { successOptions, errorOptions } from "@/core/utils/toast-styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, ChevronDown, Filter } from "lucide-react"
import { fetchProjects } from "./services/FetchProject"
import type { Project } from "./services/FetchProject"
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { ProjectForm } from "./components/ProjectForm"
import { ProjectDetailDrawer } from "./components/ProjectDetailDrawer"
import { deleteProject } from "./services/DeleteProject";
import { updateProject } from "./services/UpdateProject";
import { ProjectListSkeleton } from "./components/ProjectListSkeleton";

import TableView, { type SortConfigItem } from "./views/TableView";
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
    const [sortConfig, setSortConfig] = useState<SortConfigItem[]>([])


    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"add" | "edit">("add")
    const [editProjectId, setEditProjectId] = useState<number | undefined>()
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [projectToView, setProjectToView] = useState<Project | null>(null)
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatingIds, setUpdatingIds] = useState<number[]>([]);

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
            // Normalize data to ensure team_members is always an array
            const normalized = data.map((p) => ({ ...p, team_members: p.team_members ?? [] }))
            setProjects(normalized)
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

    // Optimistic update: update UI immediately, call API, revert on failure
    const updateProjectStatus = async (projectId: number, newStatus: Project['status']) => {
        const prevProjects = projects.map(p => ({ ...p }))
        // mark as updating
        setUpdatingIds(prev => Array.from(new Set([...prev, projectId])))

        // Optimistically update local state
        setProjects(prev =>
            prev.map(project =>
                project.id === projectId
                    ? { ...project, status: newStatus }
                    : project
            )
        )

        const project = projects.find(p => p.id === projectId);
        const oldStatus = project?.status;

        try {
            const updated = await updateProject(projectId, { status: newStatus })
            // Merge server response with local project to avoid wiping fields that server omits
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated, team_members: updated.team_members ?? p.team_members } : p))
            setError(null)
            toast.success(
                `Status for "${project?.name}" updated from ${oldStatus} to ${newStatus}`,
                successOptions
            );
        } catch (err) {
            console.error("Failed to update project status:", err)
            setError("Failed to update project status. Please try again.")
            toast.error("Failed to update project status", errorOptions);
            // Revert optimistic update
            setProjects(prevProjects)
        } finally {
            // remove from updating
            setUpdatingIds(prev => prev.filter(id => id !== projectId))
        }
    }

    const updateProjectPriority = async (projectId: number, newPriority: Project['priority']) => {
        const prevProjects = projects.map(p => ({ ...p }))
        // mark as updating
        setUpdatingIds(prev => Array.from(new Set([...prev, projectId])))

        // Optimistically update local state
        setProjects(prev =>
            prev.map(project =>
                project.id === projectId
                    ? { ...project, priority: newPriority }
                    : project
            )
        )

        const project = projects.find(p => p.id === projectId);
        const oldPriority = project?.priority;

        try {
            const updated = await updateProject(projectId, { priority: newPriority })
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated, team_members: updated.team_members ?? p.team_members } : p))
            setError(null)
            toast.success(
                `Priority for "${project?.name}" updated from ${oldPriority} to ${newPriority}`,
                successOptions
            );
        } catch (err) {
            console.error("Failed to update project priority:", err)
            setError("Failed to update project priority. Please try again.")
            toast.error("Failed to update project priority", errorOptions);
            // Revert optimistic update
            setProjects(prevProjects)
        } finally {
            setUpdatingIds(prev => prev.filter(id => id !== projectId))
        }
    }

    const handleSort = (field: string) => {
        setSortConfig(prev => {
            const existingIndex = prev.findIndex(item => item.field === field);
            if (existingIndex >= 0) {
                const existingItem = prev[existingIndex];

                // Specific logic for STATUS (3-state cycle)
                if (field === "status") {
                    if (existingItem.direction === "asc") {
                        // Asc (Active Top) -> Desc (Completed Top)
                        const newConfig = [...prev];
                        newConfig[existingIndex] = { ...existingItem, direction: "desc" };
                        return newConfig;
                    } else if (existingItem.direction === "desc") {
                        // Desc (Completed Top) -> On Hold (On Hold Top)
                        const newConfig = [...prev];
                        newConfig[existingIndex] = { ...existingItem, direction: "on_hold" };
                        return newConfig;
                    } else {
                        // On Hold (On Hold Top) -> Reset (Unsorted)
                        return prev.filter(item => item.field !== field);
                    }
                }

                // Logic for PRIORITY (3-state cycle)
                if (field === "priority") {
                    if (existingItem.direction === "asc") {
                        // Asc (Low) -> Desc (High)
                        const newConfig = [...prev];
                        newConfig[existingIndex] = { ...existingItem, direction: "desc" };
                        return newConfig;
                    } else if (existingItem.direction === "desc") {
                        // Desc (High) -> Medium First
                        const newConfig = [...prev];
                        newConfig[existingIndex] = { ...existingItem, direction: "medium_first" };
                        return newConfig;
                    } else {
                        // Medium First -> Reset (Unsorted)
                        return prev.filter(item => item.field !== field);
                    }
                }

                // Default logic (Asc -> Desc -> Remove)
                if (existingItem.direction === "asc") {
                    const newConfig = [...prev];
                    newConfig[existingIndex] = { ...existingItem, direction: "desc" };
                    return newConfig;
                } else {
                    return prev.filter(item => item.field !== field);
                }
            } else {
                return [...prev, { field, direction: "asc" }];
            }
        });
    }

    const filteredProjects = projects.filter((project) => {
        return (
            project.name.toLowerCase().includes(search.toLowerCase()) &&
            (statusFilter ? project.status === statusFilter : true) &&
            (priorityFilter ? project.priority === priorityFilter : true) &&
            (dueDateFilter ? project.due_date === dueDateFilter : true)
        )
    })

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        for (const { field, direction } of sortConfig) {
            let aValue: string | number = ""
            let bValue: string | number = ""

            switch (field) {
                case "name":
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
                case "status":
                    // Default ASC map: Active(1) -> On Hold(2) -> Completed(3)
                    // ON_HOLD map: On Hold(1) -> Active(2) -> Completed(3) (or similar)

                    if (direction === "on_hold") {
                        const onHoldOrder = { "on_hold": 1, "active": 2, "completed": 3 }
                        aValue = onHoldOrder[a.status as keyof typeof onHoldOrder] || 99
                        bValue = onHoldOrder[b.status as keyof typeof onHoldOrder] || 99
                    } else {
                        const statusOrder = { "active": 1, "on_hold": 2, "completed": 3 }
                        aValue = statusOrder[a.status as keyof typeof statusOrder] || 99
                        bValue = statusOrder[b.status as keyof typeof statusOrder] || 99
                    }
                    break
                case "priority":
                    // Default ASC map: Low(1) -> Medium(2) -> High(3)
                    // MEDIUM_FIRST map: Medium(1) -> High(2) -> Low(3)

                    if (direction === "medium_first") {
                        const mediumOrder = { "medium": 1, "high": 2, "low": 3 }
                        aValue = mediumOrder[a.priority as keyof typeof mediumOrder] || 99
                        bValue = mediumOrder[b.priority as keyof typeof mediumOrder] || 99
                    } else {
                        const priorityOrder = { "high": 3, "medium": 2, "low": 1 }
                        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
                        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
                    }
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
                    continue
            }

            if (field === "status" && direction === "on_hold") {
                if (aValue < bValue) return -1
                if (aValue > bValue) return 1
            } else if (field === "priority" && direction === "medium_first") {
                if (aValue < bValue) return -1
                if (aValue > bValue) return 1
            } else {
                // For Asc/Desc directions
                if (aValue < bValue) return direction === "asc" ? -1 : 1
                if (aValue > bValue) return direction === "asc" ? 1 : -1
            }
        }
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
            const prevProjects = [...projects];

            // Optimistically remove from UI
            setProjects(prev => prev.filter(p => p.id !== projectToDelete));
            setDeleteModalOpen(false);

            const project = projects.find(p => p.id === projectToDelete);

            try {
                await deleteProject(projectToDelete);
                setProjectToDelete(null);
                setError(null);
                toast.success(`Project "${project?.name}" deleted successfully`, successOptions);
            } catch (error) {
                console.error("Failed to delete project:", error);
                setError("Failed to delete project. Please try again.");
                toast.error("Failed to delete project", errorOptions);
                // Revert optimistic update
                setProjects(prevProjects);
                setDeleteModalOpen(true);
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

    const handleFormSubmitSuccess = (savedProject: Project) => {
        if (formMode === "add") {
            // Optimistically add new project to top of UI
            setProjects(prev => [savedProject, ...prev]);
        } else if (formMode === "edit" && editProjectId) {
            // Optimistically update existing project in UI
            setProjects(prev => prev.map(p =>
                p.id === editProjectId
                    ? { ...p, ...savedProject, team_members: savedProject.team_members ?? p.team_members }
                    : p
            ));
        }
        setError(null);
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
                projectName={projects.find(p => p.id === projectToDelete)?.name || ""}
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
                    <TableView
                        projects={sortedProjects}
                        updatingIds={updatingIds}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                        openViewDrawer={openViewDrawer}
                        openEditModal={openEditModal}
                        openDeleteModal={openDeleteModal}
                        updateProjectStatus={updateProjectStatus}
                        updateProjectPriority={updateProjectPriority}
                    />
                </CardContent>
            </Card>
        </div>
    )
}