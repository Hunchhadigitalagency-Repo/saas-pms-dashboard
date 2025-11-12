"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Eye, Edit, Trash2, RefreshCw } from "lucide-react"
import type { WorkItem } from "../work_item_services/types"

type Props = {
    workItems: WorkItem[]
    updatingItems: number[]
    sortField: string
    sortDirection: "asc" | "desc"
    handleSort: (field: string) => void
    openViewDrawer: (item: WorkItem) => void
    openEditModal: (item: WorkItem) => void
    openDeleteModal: (itemId: number) => void
    updateWorkItemStatus: (itemId: number, newStatus: WorkItem['status']) => void
    updateWorkItemPriority: (itemId: number, newPriority: WorkItem['priority']) => void
}

export default function TableView({
    workItems,
    updatingItems,
    sortField,
    sortDirection,
    handleSort,
    openViewDrawer,
    openEditModal,
    openDeleteModal,
    updateWorkItemStatus,
    updateWorkItemPriority,
}: Props) {
    const getSortIcon = (field: string) => {
        if (sortField !== field) return <ArrowUpDown size={14} className="opacity-50" />
        return sortDirection === "asc" ? (
            <ArrowUp size={14} className="text-blue-600" />
        ) : (
            <ArrowDown size={14} className="text-blue-600" />
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            case "in_progress":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "completed":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "medium":
                return "bg-orange-100 text-orange-800 hover:bg-orange-200"
            case "low":
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const formatChoice = (choice: string) => {
        return choice.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border">
                        <th className="text-left p-4 text-[11px] w-[60%] text-gray-700">
                            <button
                                onClick={() => handleSort("title")}
                                className="flex font-medium whitespace-nowrap items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                Work Item Name
                                {getSortIcon("title")}
                            </button>
                        </th>
                        <th className="text-left p-4 text-[11px] text-gray-700">
                            <button
                                onClick={() => handleSort("status")}
                                className="flex font-medium whitespace-nowrap items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                Status
                                {getSortIcon("status")}
                            </button>
                        </th>
                        <th className="text-left p-4 text-[11px] text-gray-700">
                            <button
                                onClick={() => handleSort("priority")}
                                className="flex font-medium whitespace-nowrap items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                Priority
                                {getSortIcon("priority")}
                            </button>
                        </th>
                        <th className="text-left p-4 text-[11px] text-gray-700">
                            <button
                                onClick={() => handleSort("due_date")}
                                className="flex font-medium whitespace-nowrap items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                Due Date
                                {getSortIcon("due_date")}
                            </button>
                        </th>
                        <th className="text-left p-4 text-[11px] text-gray-700">
                            <button
                                onClick={() => handleSort("assigned_to")}
                                className="flex font-medium whitespace-nowrap items-center gap-2 hover:text-blue-600 transition-colors"
                            >
                                Assigned To
                                {getSortIcon("assigned_to")}
                            </button>
                        </th>

                        <th className="text-right w-[0.1%] p-4 text-[11px] text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {workItems.map((item) => (
                        <tr key={item.id} className="border hover:bg-gray-50">
                            <td className="px-3 py-1 text-[11px]"><span className="font-medium">{item.title}</span> </td>
                            <td className="px-3 py-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild disabled={updatingItems.includes(item.id)}>
                                        <Button variant="ghost" className="p-0 h-auto">
                                            <span
                                                className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${getStatusColor(item.status)}`}
                                            >
                                                {updatingItems.includes(item.id) ? <RefreshCw className="h-4 w-4 animate-spin" /> : formatChoice(item.status)}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemStatus(item.id, "pending")}>
                                            Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemStatus(item.id, "in_progress")}>
                                            In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemStatus(item.id, "completed")}>
                                            Completed
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                            <td className="px-3 py-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild disabled={updatingItems.includes(item.id)}>
                                        <Button variant="ghost" className="p-0 h-auto">
                                            <span
                                                className={`cursor-pointer hover:opacity-80 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${getPriorityColor(item.priority)}`}
                                            >
                                                {updatingItems.includes(item.id) ? <RefreshCw className="h-4 w-4 animate-spin" /> : formatChoice(item.priority)}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemPriority(item.id, "high")}>
                                            High
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemPriority(item.id, "medium")}>
                                            Medium
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="tetx-[11px]" onClick={() => updateWorkItemPriority(item.id, "low")}>
                                            Low
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                            <td className="px-3 py-1 text-[11px]">
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
                                                                    <AvatarFallback className="text-[11px] text-white bg-slate-400/10">
                                                                        {user.username.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                            <span className="text-[11px]">{user.first_name} {user.last_name}</span>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-[11px] text-gray-500">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-3 py-1 text-right text-[11px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal size={12} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="flex items-center text-[11px] gap-2"
                                            onClick={() => openViewDrawer(item)}
                                        >
                                            <Eye size={12} />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="flex items-center text-[11px] gap-2"
                                            onClick={() => openEditModal(item)}
                                        >
                                            <Edit size={12} />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="flex items-center text-[11px] gap-2"
                                            onClick={() => openDeleteModal(item.id)}
                                        >
                                            <Trash2 size={12} />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                    {workItems.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center text-gray-500 py-6">
                                No work items found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}