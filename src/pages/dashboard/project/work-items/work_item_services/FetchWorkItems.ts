import axios from "axios";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface ProjectLite {
    id: number;
    name: string;
}

export interface WorkItem {
    id: number;
    assigned_to: User[];
    title: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    project: ProjectLite;
}

interface WorkItemResponse {
    total_items: number;
    current_page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: WorkItem[];
}

export async function fetchWorkItems(projectId: string): Promise<WorkItem[]> {
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
        throw new Error("Base URL not found. Cannot fetch work items.");
    }

    let allWorkItems: WorkItem[] = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
        const url = `${baseUrl}/work-items/?project=${projectId}&page=${currentPage}`;
        try {
            const response = await axios.get<WorkItemResponse>(url, {
                withCredentials: true, // Include cookies with request
            });

            const data = response.data;
            allWorkItems = [...allWorkItems, ...data.results];
            totalPages = data.total_pages;
            currentPage++;
        } catch (error) {
            console.error("Failed to fetch work items:", error);
            throw error; // bubble up instead of silently failing
        }
    }

    return allWorkItems;
}