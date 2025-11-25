import axios from "axios";
import type { WorkItem, WorkItemWrite } from "./types";

export async function updateWorkItem(
    workItemId: string,
    updatedData: Partial<WorkItemWrite>
): Promise<WorkItem> {
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

    const url = `${baseUrl}/work-items/${workItemId}/`;
    try {
        const response = await axios.patch<WorkItem>(url, updatedData, {
            withCredentials: true, // Include cookies with request
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update work item with ID ${workItemId}:`, error);
        throw error;
    }
}