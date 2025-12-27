import React from "react"
import { Bell, Building2, Users } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrganizationView from "./views/OrganizationView"
import NotificationView from "./views/NotificationView"
import TeamMembersView from "./views/TeamMembersView"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const tabItems = [
    { value: "organization", label: "Organization", icon: Building2 },
    { value: "notifications", label: "Notification", icon: Bell },
    { value: "team", label: "Team Members", icon: Users },
]

const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-6" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Settings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <Tabs defaultValue="organization" className="w-full">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg  bg-gray-50 h-full col-span-3 md:h-[90vh] md:col-span-1">
                        <TabsList className="flex h-auto w-full flex-col items-stretch gap-2 bg-transparent p-2">
                            {tabItems.map((item) => (
                                <TabsTrigger
                                    key={item.value}
                                    value={item.value}
                                    className="justify-start gap-2 text-left"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="rounded-lg bg-card px-4 col-span-3 md:col-span-3">
                        <TabsContent value="organization">
                            <OrganizationView />
                        </TabsContent>
                        <TabsContent value="notifications">
                            <NotificationView />
                        </TabsContent>
                        <TabsContent value="team">
                            <TeamMembersView />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default SettingsPage
