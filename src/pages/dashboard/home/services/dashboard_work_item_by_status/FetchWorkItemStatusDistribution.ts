import axios from "axios";
import { type WorkItemStatusDistributionResponse, type WorkItemStatusDistribution } from "./types";

export async function fetchWorkItemStatusDistribution(): Promise<WorkItemStatusDistribution[]> {
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
        throw new Error("Base URL not found. Cannot fetch work item status distribution.");
    }

    const url = `${baseUrl}/dashboard/work-item-status-distribution/`;
    try {
        const response = await axios.get<WorkItemStatusDistributionResponse>(url);
        return response.data.status_distribution;
    } catch (error) {
        console.error("Failed to fetch work item status distribution:", error);
        throw error;
    }
}