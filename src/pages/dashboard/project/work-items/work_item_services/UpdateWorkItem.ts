import axios from "axios";
import type { WorkItem } from "./FetchWorkItems";

export interface WorkItemUpdatePayload {
    title?: string;
    description?: string;
    due_date?: string;
    status?: string;
    priority?: string;
    project?: number;
    assigned_to?: number[];
}

export async function updateWorkItem(id: number, workItemData: WorkItemUpdatePayload): Promise<WorkItem> {
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
        throw new Error("Base URL not found. Cannot update work item.");
    }

    const url = `${baseUrl}/work-items/${id}/`;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error("Access Token not found.");
    }

    try {
        const response = await axios.patch<WorkItem>(url, workItemData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update work item with ID ${id}:`, error);
        throw error;
    }
}
