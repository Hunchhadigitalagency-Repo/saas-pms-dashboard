"use client"

import { useEffect, useState } from "react"
import { ChevronRight, type LucideIcon, SquareTerminal } from "lucide-react"
import { Link } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { fetchOnGoingProjects, type Project } from "@/core/utils/fetchOnGoingProjects"

export function NavMain() {
  const [items, setItems] = useState<Project[]>([])
  const [openItemId, setOpenItemId] = useState<number | null>(null)

  useEffect(() => {
    async function loadProjects() {
      const projects = await fetchOnGoingProjects()
      console.log("Projects in NavMain:", projects);
      setItems(projects)

      // Set first project as open by default when projects are loaded
      if (projects.length > 0 && openItemId === null) {
        setOpenItemId(projects[0].id)
      }
    }
    loadProjects()
  }, [])

  const handleItemClick = (itemId: number) => {
    // If clicking the already open item, close it. Otherwise, open the clicked item
    setOpenItemId(openItemId === itemId ? null : itemId)
  }

  return (
    <SidebarGroup>
      <div className="flex justify-between items-center pr-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <span>
          <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M4 12H20M12 4V20" stroke="#5c5c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </span>
      </div>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.id}
            asChild
            open={openItemId === item.id}
            onOpenChange={() => handleItemClick(item.id)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}