import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link as AlertCircle } from "lucide-react"
import { fetchProjectDetails, type ProjectDetails } from "./services/FetchProjectDetails"
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { ProjectDetailsSkeleton } from "./components/OrverviewLoadingSkeleton"
import { TeamMembersTab, OverviewDetailsTab, ActivityTab, SettingsTab } from "./components/tabs"

const errorOptions = {
    duration: 4000,
    style: { background: "#EF4444", color: "#fff" },
    iconTheme: { primary: "#fff", secondary: "#EF4444" },
};

// Main Component
export default function ProjectOverview() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProject = async () => {
        if (!projectId) {
            setError("Project ID not found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const details = await fetchProjectDetails(projectId);
            setProject(details);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load project details");
            toast.error("Failed to load project details", errorOptions);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
    }, [projectId]);

    if (loading) {
        return <div className="space-y-6 px-6"><ProjectDetailsSkeleton /></div>;
    }

    if (error || !project) {
        return (
            <div className="space-y-6 px-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                        <p className="text-red-500 text-lg">{error || "Project not found"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Breadcrumb & Header */}
            <div className="flex items-center gap-2 px-6 border-gray-200">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
            </div>

            {/* Tabs at top */}
            <Tabs defaultValue="details" className="w-full flex flex-col flex-1">
                <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-gray-200 rounded-none p-0 px-6">
                    <TabsTrigger value="details" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent">Details</TabsTrigger>
                    <TabsTrigger value="team" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent">Team</TabsTrigger>
                    <TabsTrigger value="activity" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent">Activity</TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent">Settings</TabsTrigger>
                </TabsList>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <TabsContent value="details" className="mt-0 animate-in fade-in duration-300 ease-in-out">
                        <OverviewDetailsTab project={project} />
                    </TabsContent>
                    <TabsContent value="team" className="mt-0 pt-6 animate-in fade-in duration-300 ease-in-out"><TeamMembersTab project={project} onRefresh={loadProject} /></TabsContent>
                    <TabsContent value="activity" className="mt-0 pt-6 animate-in fade-in duration-300 ease-in-out"><ActivityTab /></TabsContent>
                    <TabsContent value="settings" className="mt-0 pt-6 animate-in fade-in duration-300 ease-in-out"><SettingsTab /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
