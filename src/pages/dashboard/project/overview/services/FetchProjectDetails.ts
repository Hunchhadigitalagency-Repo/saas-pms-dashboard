import axios from "axios";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface TeamMember {
    user: User;
    role: string;
}

export interface ProjectDetails {
    id: number;
    team_members: TeamMember[];
    name: string;
    priority: string;
    status: string;
    due_date: string;
    description: string;
    meeting_link: string;
    created_at: string;
    updated_at: string;
}

export async function fetchProjectDetails(projectId: string): Promise<ProjectDetails> {
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
        throw new Error("Base URL not found. Cannot fetch project details.");
    }

    const url = `${baseUrl}/projects/${projectId}/`;
    try {
        const response = await axios.get<ProjectDetails>(url, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch project details:", error);
        throw error;
    }
}
