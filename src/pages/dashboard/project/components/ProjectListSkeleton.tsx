// /Users/vneetkarki/Desktop/pms/frontend/src/pages/dashboard/project/components/ProjectListSkeleton.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, ChevronDown } from "lucide-react"
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

export function ProjectListSkeleton() {
    return (
        <div className="space-y-6">
            <Card className="shadow-none border-none p-0">
                <CardContent>
                    {/* Search & Filters */}
                    <div className="flex justify-between gap-4 ">
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
                                    className="pl-7 h-8 rounded-md text-xs placeholder:text-xs"
                                    disabled
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal whitespace-nowrap" disabled>
                                    <Filter size={12} />
                                    Filters
                                    <ChevronDown size={16} />
                                </Button>

                                <Button
                                    className="gap-2 h-8 rounded-md cursor-pointer text-xs font-normal bg-secondary whitespace-nowrap hover:text-secondary hover:bg-white border border-secondary transition-colors"
                                    disabled
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
                                        <div className="flex font-medium items-center gap-2">
                                            Project Name
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Status
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Priority
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Due Date
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Meet Link
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Team Members
                                        </div>
                                    </th>
                                    <th className="text-right font-normal p-4 text-xs text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="border">
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-3/4" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-20" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-20" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-16" />
                                        </td>
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-8 w-24" />
                                        </td>
                                        <td className="px-3 py-4 text-right">
                                            <Skeleton className="h-8 w-8" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
