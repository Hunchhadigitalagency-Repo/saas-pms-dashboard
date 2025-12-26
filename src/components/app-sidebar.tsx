import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  LifeBuoy,
  Send,
  Settings,
  Funnel,
} from "lucide-react"
import { NavSecondary } from "@/components/nav-secondary"
import { NavMain } from "@/components/nav-main"
import { NavPlatform } from "@/components/nav-platform"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
  platform: [
    {
      name: "Home",
      url: "/dashboard/",
      icon: Frame,

    },
    {
      name: "Leads",
      url: "/dashboard/leads",
      icon: Funnel,
    },
    {
      name: "Projects",
      url: "/dashboard/projects",
      icon: PieChart,
    },
    {
      name: "Work Items",
      url: "/dashboard/work-items",
      icon: Map,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-muted">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <NavPlatform platforms={data.platform} />
          <NavMain />
        </div>

        {/* Fixed bottom section */}
        <div className="flex-shrink-0">
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}