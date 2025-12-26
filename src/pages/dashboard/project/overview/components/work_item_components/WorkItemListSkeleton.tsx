// /Users/vneetkarki/Desktop/pms/frontend/src/pages/dashboard/work_items/components/WorkItemListSkeleton.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, ChevronDown } from "lucide-react"

export function WorkItemListSkeleton() {
    return (
        <div className="space-y-6 px-0">
            <Card className="shadow-none border-none p-0 bg-transparent">
                <CardContent className="p-0">
                    {/* Controls Header */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex gap-2 items-center">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <Skeleton className="w-8 h-6 rounded-md" />
                                <Skeleton className="w-8 h-6 rounded-md" />
                            </div>

                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                                <Input
                                    placeholder="Search work items..."
                                    className="pl-7 h-8 rounded-md text-xs placeholder:text-xs w-80"
                                    disabled
                                />
                            </div>
                            <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal whitespace-nowrap" disabled>
                                <Filter size={16} />
                                Filters
                                <ChevronDown size={16} />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">


                            <Button
                                className="gap-2 h-8 rounded-md cursor-pointer text-xs font-normal bg-secondary whitespace-nowrap hover:text-secondary hover:bg-white border border-secondary transition-colors ml-auto"
                                disabled
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
                                    <th className="text-left p-4 text-xs w-[7%] text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            SN
                                        </div>
                                    </th>
                                    <th className="text-left p-4 text-xs w-[60%] text-gray-700">
                                        <div className="flex font-medium items-center gap-2">
                                            Work Item Name
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
                                            Assigned To
                                        </div>
                                    </th>
                                    <th className="text-right font-normal p-4 text-xs text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border">
                                        <td className="px-3 py-4">
                                            <Skeleton className="h-4 w-12" />
                                        </td>
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
                                            <Skeleton className="h-8 w-24" />
                                        </td>
                                        <td className="px-3 py-4 text-right">
                                            <Skeleton className="h-8 w-8 ml-auto" />
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

