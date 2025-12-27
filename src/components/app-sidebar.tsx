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
      url: "/dashboard/settings",
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
  const [user, setUser] = React.useState({ name: "", email: "", avatar: "" });

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: `${parsedUser.first_name} ${parsedUser.last_name}`,
        email: parsedUser.email,
        avatar: `https://ui-avatars.com/api/?name=${parsedUser.first_name}+${parsedUser.last_name}`,
      });
    }
  }, []);
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
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}