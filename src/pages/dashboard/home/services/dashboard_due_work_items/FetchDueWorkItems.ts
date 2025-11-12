import axios from "axios";
import type { DueWorkItem } from "./types";

interface DueWorkItemsResponse {
    due_tasks: DueWorkItem[];
}

export async function fetchDueWorkItems(): Promise<DueWorkItem[]> {
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
        throw new Error("Base URL not found. Cannot fetch due work items.");
    }

    const url = `${baseUrl}/dashboard/due-tasks/`;
    try {
        const response = await axios.get<DueWorkItemsResponse>(url);
        return response.data.due_tasks;
    } catch (error) {
        console.error("Failed to fetch due work items:", error);
        throw error; // bubble up instead of silently failing
    }
}
