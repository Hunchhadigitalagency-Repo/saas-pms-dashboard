import axios from "axios";

export interface ActivityLogData {
    id: number;
    project_id: number;
    project_name: string;
    activity: {
        event_type: string;
        repository?: string;
        branch?: string;
        pusher?: string;
        head_commit?: {
            id: string;
            url: string;
            message: string;
            author?: {
                name: string;
                email: string;
                date: string;
            };
            modified?: string[];
            added?: string[];
            removed?: string[];
        };
    };
    created_at: string;
}

export interface ActivityLogsResponse {
    total_items: number;
    current_page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: ActivityLogData[];
}

export async function fetchActivityLogs(projectId: string): Promise<ActivityLogData[]> {
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
        throw new Error("Base URL not found. Cannot fetch activity logs.");
    }

    let allActivityLogs: ActivityLogData[] = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
        const url = `${baseUrl}/project-activity-logs/by-project/${projectId}/?page=${currentPage}&page_size=20`;
        try {
            const response = await axios.get<ActivityLogsResponse>(url, {
                withCredentials: true,
            });

            const data = response.data;
            allActivityLogs = [...allActivityLogs, ...data.results];
            totalPages = data.total_pages;
            currentPage++;
        } catch (error) {
            console.error("Error fetching activity logs:", error);
            throw error;
        }
    }

    return allActivityLogs;
}

/**
 * Generate webhook URL for GitHub
 * The user can copy this URL and paste it into GitHub repository webhook settings
 */
export function generateWebhookUrl(projectId: string): string {
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
        return "";
    }

    return `${baseUrl}/project-activity-logs/${projectId}/post-push-event/`;
}
