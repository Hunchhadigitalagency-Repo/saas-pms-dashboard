
import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Filter, ChevronDown } from "lucide-react";
import { ProjectSummary } from "./components/ProjectSummary";
import { TasksPriorityPieChart } from "./components/TasksPriorityPieChart";
import { TasksStatusPieChart } from "./components/TasksStatusPieChart";
import { OverdueTasks } from "./components/OverdueTasks";
import ProjectProgress from "@/components/ProjectProgress";

const DashboardHome = () => {
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [dueDateFilter, setDueDateFilter] = useState("");

    return (
        <div className="space-y-4 px-6">
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
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                </div>
                <div className="flex items-center gap-4">
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
                    </div>
                </div>
            </div>

            <ProjectSummary />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <TasksPriorityPieChart />
                <TasksStatusPieChart />
                <OverdueTasks />
            </div>

            {/* <div className="grid gap-6 md:grid-cols-2 mb-10">
                <RecentWorkItems />
                <TeamWorkload />
            </div> */}
            <div className="grid gap-6 md:grid-cols-2 mb-10">
                <ProjectProgress />
            </div>
        </div>
    );
};

export default DashboardHome;
