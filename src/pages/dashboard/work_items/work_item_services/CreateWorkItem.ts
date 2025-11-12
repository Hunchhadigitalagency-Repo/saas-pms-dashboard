import axios from "axios";
import type { WorkItem, WorkItemWrite } from "./types";

export async function createWorkItem(
    newItem: WorkItemWrite
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
        throw new Error("Base URL not found. Cannot create work item.");
    }

    const url = `${baseUrl}/work-items/`;
    try {
        const response = await axios.post<WorkItem>(url, newItem);
        return response.data;
    } catch (error) {
        console.error("Failed to create work item:", error);
        throw error;
    }
}