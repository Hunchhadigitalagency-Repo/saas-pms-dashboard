import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, ChevronDown, Filter, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchWorkItems } from "./work_item_services/FetchWorkItems"
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

// Import the new components
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"
import { WorkItemDetailDrawer } from "./components/WorkItemDetailDrawer"
import { WorkItemListSkeleton } from "./components/WorkItemListSkeleton"
import { WorkItemForm } from "./components/WorkItemForm"

export default function WorkItemsList() {
    const { projectId } = useParams<{ projectId: string }>();

    console.log('Project ID from URL params:', projectId);

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
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [priorityFilter, setPriorityFilter] = useState<string>("")
    const [dueDateFilter, setDueDateFilter] = useState<string>("")
    const [projectFilter, setProjectFilter] = useState<string>("")
    const [sortField, setSortField] = useState<string>("")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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
        console.log('Loading work items for project:', projectId)
        if (projectId) {
            loadWorkItems(projectId)
        }
    }, [projectId])

    const updateWorkItemStatus = (itemId: number, newStatus: WorkItem['status']) => {
        setWorkItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, status: newStatus }
                    : item
            )
        )
    }

    const updateWorkItemPriority = (itemId: number, newPriority: WorkItem['priority']) => {
        setWorkItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, priority: newPriority }
                    : item
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
            case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            case "in_progress": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "completed": return "bg-green-100 text-green-800 hover:bg-green-200"
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

    const filteredWorkItems = workItems.filter((item) => {
        return (
            item.title.toLowerCase().includes(search.toLowerCase()) &&
            (statusFilter ? item.status === statusFilter : true) &&
            (priorityFilter ? item.priority === priorityFilter : true) &&
            (dueDateFilter ? item.due_date === dueDateFilter : true) &&
            (projectFilter ? item.project.name === projectFilter : true)
        )
    })

    const sortedWorkItems = [...filteredWorkItems].sort((a, b) => {
        if (!sortField) return 0

        let aValue: any = a[sortField as keyof WorkItem]
        let bValue: any = b[sortField as keyof WorkItem]

        switch (sortField) {
            case "title":
                aValue = a.title.toLowerCase()
                bValue = b.title.toLowerCase()
                break
            case "status":
                const statusOrder = { "pending": 1, "in_progress": 2, "completed": 3 }
                aValue = statusOrder[a.status as keyof typeof statusOrder] || 0
                bValue = statusOrder[b.status as keyof typeof statusOrder] || 0
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
            case "assigned_to":
                aValue = a.assigned_to.map(u => u.username).join(", ").toLowerCase()
                bValue = b.assigned_to.map(u => u.username).join(", ").toLowerCase()
                break
            case "project":
                aValue = a.project.name.toLowerCase()
                bValue = b.project.name.toLowerCase()
                break
            default:
                return 0
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    // Delete item functions
    const openDeleteModal = (itemId: number) => {
        setItemToDelete(itemId)
        setDeleteModalOpen(true)
    }

    const handleDelete = () => {
        if (itemToDelete) {
            setWorkItems(workItems.filter(item => item.id !== itemToDelete))
            setDeleteModalOpen(false)
            setItemToDelete(null)
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

    const handleFormSubmitSuccess = () => {
        setFormOpen(false);
        if (projectId) {
            loadWorkItems(projectId)
        }
    };

    // View item functions
    const openViewDrawer = (item: WorkItem) => {
        setItemToView(item)
        setViewDrawerOpen(true)
    }

    const formatChoice = (choice: string) => {
        return choice.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        <div className="space-y-6">
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
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
                                <Plus size={16} />
                                Add Work Item
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border">
                                    <th className="text-left p-4 text-xs w-[50%] text-gray-700">
                                        <button
                                            onClick={() => handleSort("title")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Work Item Name
                                            {getSortIcon("title")}
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
                                            onClick={() => handleSort("assigned_to")}
                                            className="flex font-medium items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Assigned To
                                            {getSortIcon("assigned_to")}
                                        </button>
                                    </th>
                                    <th className="text-right p-4 text-xs text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedWorkItems.map((item) => (
                                    <tr key={item.id} className="border hover:bg-gray-50">
                                        <td className="px-3 py-1 text-xs"><span className="font-medium">{item.title}</span> </td>
                                        <td className="px-3 py-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="p-0 h-auto">
                                                        <span
                                                            className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}
                                                        >
                                                            {formatChoice(item.status)}
                                                            <ChevronDown size={12} />
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => updateWorkItemStatus(item.id, "pending")}>
                                                        Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateWorkItemStatus(item.id, "in_progress")}>
                                                        In Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateWorkItemStatus(item.id, "completed")}>
                                                        Completed
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="px-3 py-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="p-0 h-auto">
                                                        <span
                                                            className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(item.priority)}`}
                                                        >
                                                            {formatChoice(item.priority)}
                                                            <ChevronDown size={12} />
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => updateWorkItemPriority(item.id, "high")}>
                                                        High
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateWorkItemPriority(item.id, "medium")}>
                                                        Medium
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateWorkItemPriority(item.id, "low")}>
                                                        Low
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="px-3 py-1 text-xs">
                                            {new Date(item.due_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-3 py-1">
                                            <div className="flex items-center">
                                                {item.assigned_to.length > 0 ? (
                                                    <div className="flex -space-x-2">
                                                        {item.assigned_to.map((user) => (
                                                            <TooltipProvider key={user.id}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                            <Avatar className="w-4 h-4 p-3 border-2 border-white bg-black">
                                                                                <AvatarFallback className="text-xs text-white bg-slate-400/10">
                                                                                    {user.username.charAt(0).toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        <p className="font-xs p-3 bg-gray-100/90">{user.username}</p>
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
                                                        onClick={() => openViewDrawer(item)}
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center text-xs gap-2"
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center text-xs gap-2"
                                                        onClick={() => openDeleteModal(item.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {sortedWorkItems.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 py-6">
                                            No work items found
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