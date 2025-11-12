import axios from "axios";
import { type WorkItemPriorityDistributionResponse, type WorkItemPriorityDistribution } from "./types";

export async function fetchWorkItemPriorityDistribution(): Promise<WorkItemPriorityDistribution[]> {
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
        throw new Error("Base URL not found. Cannot fetch work item priority distribution.");
    }

    const url = `${baseUrl}/dashboard/work-item-priority-distribution/`;
    try {
        const response = await axios.get<WorkItemPriorityDistributionResponse>(url);
        return response.data.priority_distribution;
    } catch (error) {
        console.error("Failed to fetch work item priority distribution:", error);
        throw error;
    }
}
