"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, ChevronDown, Filter, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchWorkItems } from "./work_item_services/FetchWorkItems"
import type { WorkItem } from "./work_item_services/types"
import { deleteWorkItem } from "./work_item_services/DeleteWorkItem"
import { updateWorkItem } from "./work_item_services/UpdateWorkItem"
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
import { List, LayoutGrid } from "lucide-react"

// Import the new components
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { WorkItemForm } from "./components/WorkItemForm"
import { WorkItemDetailDrawer } from "./components/WorkItemDetailDrawer"
import { WorkItemListSkeleton } from "./components/WorkItemListSkeleton"
import TableView from "./views/TableView"
import KanbanView from "./views/KanbanView"
import { tr } from "zod/v4/locales"

export default function WorkItemsList() {
    const [view, setView] = useState<"list" | "board">("list")
    const [workItems, setWorkItems] = useState<WorkItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [priorityFilter, setPriorityFilter] = useState<string>("")
    const [dueDateFilter, setDueDateFilter] = useState<string>("")
    const [projectFilter, setProjectFilter] = useState<string>("")
    const [sortField, setSortField] = useState<string>("")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [isDeleting, setIsDeleting] = useState(false)
    const [updatingItems, setUpdatingItems] = useState<number[]>([])

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"add" | "edit">("add")
    const [editWorkItemId, setEditWorkItemId] = useState<number | undefined>()
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [itemToView, setItemToView] = useState<WorkItem | null>(null)

    // Form state for add/edit
    const [formData, setFormData] = useState<Omit<WorkItem, 'id' | 'created_at' | 'updated_at'>>({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        assigned_to: [],
        project: { id: 0, name: "" }
    })

    const loadWorkItems = async () => {
        try {
            setLoading(true)
            const data = await fetchWorkItems()
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
        loadWorkItems()
    }, [])

    const updateWorkItemStatus = async (itemId: number, newStatus: WorkItem['status']) => {
        setUpdatingItems(prev => [...prev, itemId])
        try {
            await updateWorkItem(String(itemId), { status: newStatus });
            await loadWorkItems(); // Reload to reflect changes
        } catch (error) {
            console.error(`Failed to update status for item ${itemId}:`, error);
            // Optionally, show an error message to the user
        } finally {
            setUpdatingItems(prev => prev.filter(id => id !== itemId))
        }
    };

    const updateWorkItemPriority = async (itemId: number, newPriority: WorkItem['priority']) => {
        setUpdatingItems(prev => [...prev, itemId])
        try {
            await updateWorkItem(String(itemId), { priority: newPriority });
            await loadWorkItems(); // Reload to reflect changes
        } catch (error) {
            console.error(`Failed to update priority for item ${itemId}:`, error);
            // Optionally, show an error message to the user
        } finally {
            setUpdatingItems(prev => prev.filter(id => id !== itemId))
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
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

    const openAddModal = () => {
        setFormMode("add")
        setFormData({
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            due_date: "",
            assigned_to: [],
            project: { id: 0, name: "" }
        })
        setFormOpen(true)
    }

    const openEditModal = (item: WorkItem) => {
        setFormMode("edit")
        setEditWorkItemId(item.id)
        setFormData({
            title: item.title,
            description: item.description,
            status: item.status,
            priority: item.priority,
            due_date: item.due_date,
            assigned_to: item.assigned_to,
            project: item.project
        })
        setFormOpen(true)
    }

    const openDeleteModal = (id: number) => {
        setItemToDelete(id)
        setDeleteModalOpen(true)
    }

    const openViewDrawer = (item: WorkItem) => {
        setItemToView(item)
        setViewDrawerOpen(true)
    }

    const handleDelete = async () => {
        if (itemToDelete === null) return
        setIsDeleting(true)
        try {
            await deleteWorkItem(itemToDelete)
            await loadWorkItems()
            setDeleteModalOpen(false)
            setItemToDelete(null)
        } catch (err) {
            console.error("Failed to delete work item:", err)
            // Optionally show an error message
        } finally {
            setIsDeleting(false)
        }
    }

    const handleFormSubmitSuccess = async () => {
        setFormOpen(false)
        await loadWorkItems()
    }

    const sortedWorkItems = [...workItems]
        .filter(item => {
            const searchValue = search.toLowerCase()
            const statusMatch = !statusFilter || item.status === statusFilter
            const priorityMatch = !priorityFilter || item.priority === priorityFilter
            const projectMatch = !projectFilter || item.project.name === projectFilter
            const dueDateMatch = !dueDateFilter || (item.due_date && item.due_date.startsWith(dueDateFilter))

            const searchMatch =
                item.title.toLowerCase().includes(searchValue) ||
                item.description.toLowerCase().includes(searchValue) ||
                item.project.name.toLowerCase().includes(searchValue)

            return statusMatch && priorityMatch && projectMatch && dueDateMatch && searchMatch
        })
        .sort((a, b) => {
            if (!sortField) return 0

            const aValue = a[sortField as keyof WorkItem]
            const bValue = b[sortField as keyof WorkItem]

            if (aValue === null || aValue === undefined) return sortDirection === "asc" ? 1 : -1
            if (bValue === null || bValue === undefined) return sortDirection === "asc" ? -1 : 1

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Fallback for other types
            return 0
        })

    return (
        <div className="space-y-4">
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />

            {/* Add/Edit Work Item Modal */}
            <WorkItemForm
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmitSuccess={handleFormSubmitSuccess}
                formData={formData}
                setFormData={setFormData}
                mode={formMode}
                workItemId={editWorkItemId}
            />

            {/* View Work Item Drawer */}
            <WorkItemDetailDrawer
                open={viewDrawerOpen}
                onOpenChange={setViewDrawerOpen}
                item={itemToView}
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
                                                <BreadcrumbPage>Work Items</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                            </header>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* view changer */}
                            <div className='flex items-center gap-2'>
                                <Button
                                    variant={view === 'list' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('list')}
                                    className = "h-8 rounded-md text-xs font-normal"
                                >
                                    <List className="h-4 w-4 mr-2" />
                                    List
                                </Button>
                                <Button
                                    variant={view === 'board' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('board')}
                                    className = "h-8 rounded-md text-xs font-normal"
                                >
                                    <LayoutGrid className="h-4 w-4 mr-2" />
                                    Board
                                </Button>
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
                                    <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal">
                                        <Filter size={16} />
                                        Filters
                                        {(statusFilter || priorityFilter || dueDateFilter || projectFilter) && (
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {[statusFilter, priorityFilter, dueDateFilter, projectFilter].filter(Boolean).length}
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
                                            <label className="text-sm font-medium mb-2 block">Project</label>
                                            <Select value={projectFilter || "all"} onValueChange={(value) => setProjectFilter(value === "all" ? "" : value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Projects" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Projects</SelectItem>
                                                    {Array.from(new Set(workItems.map(t => t.project.name))).map(project => (
                                                        <SelectItem key={project} value={project}>{project}</SelectItem>
                                                    ))}
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
                                                    setProjectFilter("")
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
                                <Plus size={14} />
                                Add Work Item
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="mt-4">
                        {view === 'list' ? (
                            <TableView
                                workItems={sortedWorkItems}
                                updatingItems={updatingItems}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                                openViewDrawer={openViewDrawer}
                                openEditModal={openEditModal}
                                openDeleteModal={openDeleteModal}
                                updateWorkItemStatus={updateWorkItemStatus}
                                updateWorkItemPriority={updateWorkItemPriority}
                            />
                        ) : (
                            <KanbanView workItems={sortedWorkItems} updateWorkItemStatus={updateWorkItemStatus} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
