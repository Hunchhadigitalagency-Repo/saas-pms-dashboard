import axios from "axios";
import type { WorkItem } from "./types";
export type { WorkItem } from "./types";

interface WorkItemResponse {
    total_items: number;
    current_page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: WorkItem[];
}

export async function fetchWorkItems(): Promise<WorkItem[]> {
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
        const url = `${baseUrl}/work-items/?page=${currentPage}`;
        try {
            const response = await axios.get<WorkItemResponse>(url);

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

export async function fetchWorkItemById(workItemId: string): Promise<WorkItem> {
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
        throw new Error("Base URL not found. Cannot fetch work item.");
    }

    const url = `${baseUrl}/work-items/${workItemId}/`;
    try {
        const response = await axios.get<WorkItem>(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch work item with ID ${workItemId}:`, error);
        throw error;
    }
}
