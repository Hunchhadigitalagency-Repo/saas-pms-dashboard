import axios from "axios";
import type { DashboardCounts } from "./types";
export type { DashboardCounts } from "./types";

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
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
        throw new Error("Base URL not found. Cannot fetch dashboard counts.");
    }

    const url = `${baseUrl}/dashboard/dashboard_data/`;
    try {
        const response = await axios.get<DashboardCounts>(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
        throw error;
    }
}
