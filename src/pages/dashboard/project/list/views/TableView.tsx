"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Project } from "../services/FetchProject"

export type SortConfigItem = {
    field: string;
    direction: "asc" | "desc" | "on_hold" | "medium_first";
}

type Props = {
    projects: Project[]
    updatingIds: number[]
    sortConfig: SortConfigItem[]
    handleSort: (field: string) => void
    openViewDrawer: (project: Project) => void
    openEditModal: (project: Project) => void
    openDeleteModal: (projectId: number) => void
    updateProjectStatus: (projectId: number, newStatus: Project['status']) => void
    updateProjectPriority: (projectId: number, newPriority: Project['priority']) => void
}

export default function TableView({
    projects,
    updatingIds,
    sortConfig,
    handleSort,
    openViewDrawer,
    openEditModal,
    openDeleteModal,
    updateProjectStatus,
    updateProjectPriority,
}: Props) {
    const getSortIcon = (field: string) => {
        const sortItem = sortConfig.find(item => item.field === field);
        const index = sortConfig.findIndex(item => item.field === field);

        if (!sortItem) return <ArrowUpDown size={14} className="opacity-50" />

        let Icon = ArrowUpDown;
        if (sortItem.direction === "asc") Icon = ArrowUp;
        else if (sortItem.direction === "desc") Icon = ArrowDown;
        else if (sortItem.direction === "on_hold" || sortItem.direction === "medium_first") Icon = ArrowUpDown;

        const isCustomSort = sortItem.direction === "on_hold" || sortItem.direction === "medium_first";
        const colorClass = isCustomSort ? "text-orange-500" : "text-blue-600";

        return (
            <div className="flex items-center">
                <Icon size={14} className={colorClass} />
                {sortConfig.length > 1 && (
                    <span className={`text-[10px] ml-0.5 font-bold ${colorClass}`}>
                        {index + 1}
                    </span>
                )}
            </div>
        )
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border">
                        <th className="text-left p-4 text-xs w-[30%] text-gray-700">
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
                            <div className="flex font-medium items-center gap-2 text-gray-700 cursor-default">
                                Meet Link
                            </div>
                        </th>
                        <th className="text-left p-4 text-xs text-gray-700">
                            <div className="flex font-medium items-center gap-2 text-gray-700 cursor-default">
                                Team Members
                            </div>
                        </th>
                        <th className="text-right font-normal p-4 text-xs text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id} className="border hover:bg-gray-50">
                            <td className="px-3 py-1 text-xs"><span className="font-medium font-bold">{project.name}</span>  </td>
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
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectStatus(project.id, "active")}>
                                            Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectStatus(project.id, "completed")}>
                                            Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectStatus(project.id, "on_hold")}>
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
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectPriority(project.id, "high")}>
                                            High
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectPriority(project.id, "medium")}>
                                            Medium
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={updatingIds.includes(project.id)} onClick={() => updateProjectPriority(project.id, "low")}>
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
                                    {(project.team_members?.length ?? 0) > 0 ? (
                                        <div className="flex -space-x-2">
                                            {(project.team_members ?? []).map((member: any, idx: number) => {
                                                const user = member?.user || {}
                                                const firstInitial = user.first_name ? String(user.first_name).charAt(0).toUpperCase() : (user.username ? String(user.username).charAt(0).toUpperCase() : "?")
                                                const lastInitial = user.last_name ? String(user.last_name).charAt(0).toUpperCase() : ""
                                                const key = user.id ?? member.id ?? idx
                                                return (
                                                    <TooltipProvider key={key}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                    <Avatar className="h-8 w-8 border-2 border-white bg-black">
                                                                        <AvatarImage src={user.profile?.profile_picture || undefined} alt={user.username} className="object-cover" />
                                                                        <AvatarFallback className="text-xs text-white bg-slate-400/10">
                                                                            {firstInitial}{lastInitial}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                                <span className="text-xs">
                                                                    {user.first_name ?? user.username ?? "Unknown"} {user.last_name ?? ""}
                                                                </span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )
                                            })}
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
                    {projects.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center text-gray-500 py-6">
                                No projects found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
