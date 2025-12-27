import React from "react"
import { User, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ProfileUpdateForm } from "./components/ProfileUpdateForm"
import { ChangePasswordForm } from "./components/ChangePasswordForm"

const tabItems = [
    { value: "profile", label: "Profile", icon: User },
    { value: "password", label: "Password", icon: Lock },
]

const AccountPage: React.FC = () => {
    return (
        <div className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-6" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Account</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 h-full col-span-4 md:h-[90vh] md:col-span-1">
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

                    <div className="rounded-lg bg-card col-span-4 md:col-span-3">
                        <TabsContent value="profile">
                            <ProfileUpdateForm />
                        </TabsContent>
                        <TabsContent value="password">
                            <ChangePasswordForm />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default AccountPage
