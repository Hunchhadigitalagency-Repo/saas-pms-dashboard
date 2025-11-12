import { SquareTerminal } from "lucide-react";
import axios from "axios";

export interface Project {
  id: number;
  title: string;
  url: string;
  icon: any;
  isActive: boolean;
  items: {
    title: string;
    url: string;
  }[];
}

export async function fetchOnGoingProjects(): Promise<Project[]> {
  const domainsString = localStorage.getItem("domains");
  let baseUrl = "";

  if (domainsString) {
    try {
      const domains = JSON.parse(domainsString);
      const primaryDomain = domains?.domain || domains?.[0]?.domain;
      if (primaryDomain) {
        baseUrl = `https://${primaryDomain}/api/v1`;
      }
    } catch (error) {
      console.error("Failed to parse domains from localStorage:", error);
    }
  }

  if (!baseUrl) {
    throw new Error("Base URL not found. Cannot fetch projects.");
  }

  const url = `${baseUrl}/ongoing-projects/`;
  try {
    const response = await axios.get<any[]>(url);
    const data = response.data;
    console.log("Fetched projects:", data);

    return data.map((project: any) => ({
      id: project.id,
      title: project.name,
      url: "#",
      icon: SquareTerminal,
      isActive: true, // You might want to adjust this based on your logic
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Sprints",
          url: "#",
        },
        {
          title: "Modules",
          url: "#",
        },
        {
          title: "Work Items",
          url: `/dashboard/project/${project.id}/work-items`,
        },
        {
          title: "Documents",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        }
      ],
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error; // bubble up instead of silently failing
  }
}