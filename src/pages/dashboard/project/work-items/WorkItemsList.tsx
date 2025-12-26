import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, ChevronDown, Filter, LayoutList, KanbanSquare } from "lucide-react"
import { fetchWorkItems } from "./work_item_services/FetchWorkItems"
import { deleteWorkItem } from "../../work_items/work_item_services/DeleteWorkItem"
import { updateWorkItem } from "../../work_items/work_item_services/UpdateWorkItem"
import type { WorkItem } from "./work_item_services/FetchWorkItems"
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
import toast from "react-hot-toast"

// Import the new components
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { WorkItemDetailDrawer } from "./components/WorkItemDetailDrawer"
import { WorkItemListSkeleton } from "./components/WorkItemListSkeleton"
import { WorkItemForm } from "./components/WorkItemForm"
import ProjectTableView, { type SortConfigItem } from "./views/ProjectTableView"
import ProjectKanbanView from "./views/ProjectKanbanView"

const successOptions = {
    duration: 3000,
    style: {
        background: '#10B981',
        color: '#fff',
    },
    iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
    },
};

const errorOptions = {
    duration: 4000,
    style: {
        background: '#EF4444',
        color: '#fff',
    },
    iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
    },
};

export default function WorkItemsList() {
    const { projectId } = useParams<{ projectId: string }>();

    if (!projectId) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <p className="text-red-500 text-lg">Project not found</p>
                    <p className="text-gray-500 mt-2">Please check the URL and try again.</p>
                </div>
            </div>
        );
    }

    const [workItems, setWorkItems] = useState<WorkItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [view, setView] = useState<'list' | 'board'>('list')

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [priorityFilter, setPriorityFilter] = useState<string>("")
    const [dueDateFilter, setDueDateFilter] = useState<string>("")

    // Sort and Update states
    const [sortConfig, setSortConfig] = useState<SortConfigItem[]>([])
    const [isDeleting, setIsDeleting] = useState(false)
    const [updatingStatusIds, setUpdatingStatusIds] = useState<number[]>([])
    const [updatingPriorityIds, setUpdatingPriorityIds] = useState<number[]>([])

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"add" | "edit">("add")
    const [editWorkItemId, setEditWorkItemId] = useState<number | undefined>()
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [itemToView, setItemToView] = useState<WorkItem | null>(null)

    // Form state for add/edit - partially managed by WorkItemForm component now, but we init it here for openAddModal
    const [formData, setFormData] = useState<Omit<WorkItem, 'id' | 'created_at' | 'updated_at'>>({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        assigned_to: [],
        project: { id: parseInt(projectId), name: "" }
    })

    const loadWorkItems = async (projectId: string) => {
        try {
            setLoading(true)
            const data = await fetchWorkItems(projectId)
            setWorkItems(data)
            setError(null)
        } catch (err) {
            console.error("Failed to load work items:", err)
            setError("Failed to load work items. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (projectId) {
            loadWorkItems(projectId)
        }
    }, [projectId])

    // Optimistic Update Handlers
    const updateWorkItemStatus = async (itemId: number, newStatus: WorkItem['status']) => {
        const prevWorkItems = [...workItems];
        setUpdatingStatusIds(prev => [...prev, itemId])

        // Optimistic update
        setWorkItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, status: newStatus } : item
        ));

        try {
            await updateWorkItem(String(itemId), { status: newStatus });
            const item = prevWorkItems.find(i => i.id === itemId);
            toast.success(
                `Status for "${item?.title}" updated to ${newStatus.replace('_', ' ')}`,
                successOptions
            );
        } catch (error) {
            console.error(`Failed to update status for item ${itemId}:`, error);
            setWorkItems(prevWorkItems);
            toast.error("Failed to update status", errorOptions);
        } finally {
            setUpdatingStatusIds(prev => prev.filter(id => id !== itemId))
        }
    };

    const updateWorkItemPriority = async (itemId: number, newPriority: WorkItem['priority']) => {
        const prevWorkItems = [...workItems];
        setUpdatingPriorityIds(prev => [...prev, itemId])

        // Optimistic update
        setWorkItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, priority: newPriority } : item
        ));

        try {
            await updateWorkItem(String(itemId), { priority: newPriority });
            const item = prevWorkItems.find(i => i.id === itemId);
            toast.success(
                `Priority for "${item?.title}" updated to ${newPriority}`,
                successOptions
            );
        } catch (error) {
            console.error(`Failed to update priority for item ${itemId}:`, error);
            setWorkItems(prevWorkItems);
            toast.error("Failed to update priority", errorOptions);
        } finally {
            setUpdatingPriorityIds(prev => prev.filter(id => id !== itemId))
        }
    };

    const handleSort = (field: string) => {
        setSortConfig((prevConfig) => {
            const existingIndex = prevConfig.findIndex((item) => item.field === field);
            const newConfig = [...prevConfig];

            if (existingIndex > -1) {
                // Cycle: asc -> desc -> remove
                const currentDirection = newConfig[existingIndex].direction;
                if (currentDirection === "asc") {
                    newConfig[existingIndex].direction = "desc";
                } else {
                    newConfig.splice(existingIndex, 1);
                }
            } else {
                // Add new sort field
                newConfig.push({ field, direction: "asc" });
            }
            return newConfig;
        });
    };

    // Filter Logic
    const filteredWorkItems = workItems.filter((item) => {
        return (
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            (statusFilter ? item.status === statusFilter : true) &&
            (priorityFilter ? item.priority === priorityFilter : true) &&
            (dueDateFilter ? item.due_date === dueDateFilter : true)
        )
    })

    // Sort Logic
    const sortedWorkItems = [...filteredWorkItems].sort((a, b) => {
        for (const { field, direction } of sortConfig) {
            let aValue: any = a[field as keyof WorkItem];
            let bValue: any = b[field as keyof WorkItem];

            if (field === "status") {
                const statusOrder = { "pending": 1, "in_progress": 2, "completed": 3 };
                aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
                bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
            } else if (field === "priority") {
                const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
                aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
                bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            } else if (field === "due_date") {
                aValue = new Date(a.due_date).getTime();
                bValue = new Date(b.due_date).getTime();
            } else if (field === "assigned_to") {
                aValue = a.assigned_to.map(u => u.username).join(", ").toLowerCase()
                bValue = b.assigned_to.map(u => u.username).join(", ").toLowerCase()
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Delete item functions
    const openDeleteModal = (itemId: number) => {
        setItemToDelete(itemId)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!itemToDelete) return;
        console.log("Deleting item with ID:", isDeleting);
        setIsDeleting(true);
        const prevWorkItems = [...workItems];
        // Optimistic delete
        setWorkItems(prev => prev.filter(item => item.id !== itemToDelete));
        setDeleteModalOpen(false);

        try {
            await deleteWorkItem(itemToDelete);
            toast.success("Work Item deleted successfully", successOptions);
        } catch (error) {
            console.error("Failed to delete work item:", error);
            setWorkItems(prevWorkItems);
            toast.error("Failed to delete work item", errorOptions);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    }

    const openAddModal = () => {
        setFormMode("add");
        setFormData({
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            due_date: "",
            assigned_to: [],
            project: { id: parseInt(projectId), name: "" }
        });
        setEditWorkItemId(undefined);
        setFormOpen(true);
    };

    const openEditModal = (item: WorkItem) => {
        setFormMode("edit");
        setFormData({
            title: item.title,
            description: item.description || "",
            status: item.status,
            priority: item.priority,
            due_date: item.due_date,
            assigned_to: [...item.assigned_to],
            project: item.project
        });
        setEditWorkItemId(item.id);
        setFormOpen(true);
    };

    const handleFormSubmitSuccess = (savedItem: WorkItem) => {
        setFormOpen(false);
        if (formMode === 'add') {
            setWorkItems(prev => [savedItem, ...prev]);
            toast.success("Work Item created successfully", successOptions);
        } else {
            setWorkItems(prev => prev.map(item => item.id === savedItem.id ? savedItem : item));
            toast.success("Work Item updated successfully", successOptions);
        }
    };

    // View item functions
    const openViewDrawer = (item: WorkItem) => {
        setItemToView(item)
        setViewDrawerOpen(true)
    }

    if (loading) {
        return <WorkItemListSkeleton />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 px-6">
            <DeleteConfirmationDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
            />

            <WorkItemForm
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmitSuccess={handleFormSubmitSuccess} // Now accepts the item
                formData={formData}
                setFormData={setFormData}
                mode={formMode}
                workItemId={editWorkItemId}
            />

            <WorkItemDetailDrawer
                open={viewDrawerOpen}
                onOpenChange={setViewDrawerOpen}
                item={itemToView}
            />

            <Card className="shadow-none border-none p-0 bg-transparent">
                <CardContent className="p-0">
                    {/* Header & Controls */}
                    <div className="flex justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator
                                        orientation="vertical"
                                        className="mr-2 h-4"
                                    />
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href="/dashboard/projects">
                                                    Dashboard
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href="/dashboard/projects">
                                                    Project
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Work Items </BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                            </header>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            {/* View Toggles */}
                            <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <LayoutList size={16} />
                                </button>
                                <button
                                    onClick={() => setView('board')}
                                    className={`p-1.5 rounded-md transition-all ${view === 'board' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <KanbanSquare size={16} />
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                                <Input
                                    placeholder="Search work items..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-7 h-8 rounded-md text-xs placeholder:text-xs"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal whitespace-nowrap">
                                        <Filter size={16} />
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
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Status</label>
                                            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
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
                                <Plus size={16} />
                                Add Work Item
                            </Button>
                        </div>
                    </div>

                    {/* Views Render */}
                    <div>
                        {view === 'list' ? (
                            <ProjectTableView
                                workItems={sortedWorkItems}
                                updatingStatusIds={updatingStatusIds}
                                updatingPriorityIds={updatingPriorityIds}
                                sortConfig={sortConfig}
                                handleSort={handleSort}
                                openViewDrawer={openViewDrawer}
                                openEditModal={openEditModal}
                                openDeleteModal={openDeleteModal}
                                updateWorkItemStatus={updateWorkItemStatus}
                                updateWorkItemPriority={updateWorkItemPriority}
                            />
                        ) : (
                            <div>
                                <ProjectKanbanView
                                    workItems={sortedWorkItems}
                                    updateWorkItemStatus={updateWorkItemStatus}
                                    openViewDrawer={openViewDrawer}
                                    openEditModal={openEditModal}
                                    openDeleteModal={openDeleteModal}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}