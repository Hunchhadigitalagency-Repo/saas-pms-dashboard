import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Link as LinkIcon, Pencil, ListTodo } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import type { ProjectDetails } from "../../../types/types";

interface OverviewDetailsTabProps {
    project: ProjectDetails;
}

function stripHtml(input?: string) {
    if (!input) return "";
    return input.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function statusBadge(status?: string) {
    const s = status || "N/A";
    const cls =
        s === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            s === "on_hold" ? "bg-amber-50 text-amber-700 border-amber-200" :
                s === "completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-slate-50 text-slate-700 border-slate-200";
    return <Badge variant="outline" className={cls}>{s.replace("_", " ")}</Badge>;
}

function priorityBadge(priority?: string) {
    const p = priority || "N/A";
    const cls =
        p === "high" ? "bg-rose-50 text-rose-700 border-rose-200" :
            p === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                p === "low" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-slate-50 text-slate-700 border-slate-200";
    const label = p === "N/A" ? "N/A" : p.charAt(0).toUpperCase() + p.slice(1);
    return <Badge variant="outline" className={cls}>{label}</Badge>;
}

export function OverviewDetailsTab({ project }: OverviewDetailsTabProps) {
    const cleanDescription = useMemo(() => stripHtml(project.description), [project.description]);

    return (
        <>
            <Card className="rounded-lg shadow-none bg-white p-0 m-0 border-0 my-5 mb-0">
                <CardHeader className="p-0">
                    <div className="flex flex-col gap-3">
                        {/* Top row: title + actions */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg font-semibold truncate">{project.name}</h1>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap items-start h-full">
                                {project.meeting_link ? (
                                    <Button asChild size="sm" className="h-8 text-xs">
                                        <a href={project.meeting_link} target="_blank" rel="noopener noreferrer">
                                            <LinkIcon className="w-3.5 h-3.5 mr-1" />
                                            Join
                                        </a>
                                    </Button>
                                ) : (
                                    <Button disabled size="sm" className="h-8 text-xs">
                                        <LinkIcon className="w-3.5 h-3.5 mr-1" />
                                        No link
                                    </Button>
                                )}

                                <Button variant="secondary" size="sm" className="h-8 text-xs">
                                    <ListTodo className="w-3.5 h-3.5 mr-1" />
                                    Work Items
                                </Button>

                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                    <Pencil className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Separator className="my-3" />
            <Card className="rounded-lg shadow-none bg-white border-0 p-0 mb-0">
                <CardContent className="p-0">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-0 my-5">
                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-2">Status</div>
                                <div className="flex items-center gap-2 capitalize">{statusBadge(project.status)}</div>
                            </div>

                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-2">Priority</div>
                                <div className="flex items-center gap-2">{priorityBadge(project.priority)}</div>
                            </div>

                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-2">Due Date</div>
                                <div className="text-xs font-medium text-gray-900">{formatDate(project.due_date)}</div>
                            </div>

                            <div>
                                <div className="text-xs font-medium text-gray-500 mb-2">Created</div>
                                <div className="text-xs font-medium text-gray-900">{formatDate(project.created_at)}</div>
                            </div>

                            <div className="md:col-span-1">
                                <div className="text-xs font-medium text-gray-500 mb-2">Team Members</div>
                                <div className="flex items-center">
                                    {project.team_members && project.team_members.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {project.team_members.map((member) => {
                                                const u = member.user;
                                                return (
                                                    <TooltipProvider key={u.id}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                    <Avatar className="w-8 h-8 p-0 border-2 border-white bg-slate-400/10">
                                                                        <AvatarImage src={u.profile?.profile_picture || undefined} alt={u.username} className="object-cover" />
                                                                        <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-700">
                                                                            {u.first_name?.[0]}{u.last_name?.[0]}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                                <div className="text-[11px]">
                                                                    <p className="font-medium">{u.first_name} {u.last_name}</p>
                                                                    <p className="text-gray-300">{member.role}</p>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No team members assigned</span>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <div className="text-xs font-medium text-gray-500 mb-2">Project Owner</div>
                                <div className="flex items-center">
                                    {project.team_members && project.team_members.filter(m => m.role === "owner").length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {project.team_members.filter(m => m.role === "owner").map((member) => {
                                                const u = member.user;
                                                return (
                                                    <TooltipProvider key={u.id}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="relative hover:z-10 transition-transform hover:scale-110">
                                                                    <Avatar className="w-8 h-8 p-0 border-2 border-white bg-slate-400/10">
                                                                        <AvatarImage src={u.profile?.profile_picture || undefined} alt={u.username} className="object-cover" />
                                                                        <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-700">
                                                                            {u.first_name?.[0]}{u.last_name?.[0]}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="bg-black text-white rounded px-3 py-1.5">
                                                                <div className="text-[11px]">
                                                                    <p className="font-medium">{u.first_name} {u.last_name}</p>
                                                                    <p className="text-gray-300">{member.role}</p>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-500">No project owner assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="mb-0 my-5">
                            <h3 className="font-medium text-xs text-gray-600 mb-2">Description</h3>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                {cleanDescription || "No description provided"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
