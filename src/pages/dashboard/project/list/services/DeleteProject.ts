
import axios from "axios";
import { BASE_URL } from "@/core/api/constant";

export async function deleteProject(projectId: number): Promise<void> {
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
        console.warn("domains not found in localStorage; falling back to BASE_URL")
        baseUrl = BASE_URL
    }

    const url = `${baseUrl}/projects/${projectId}/`;
    try {
        await axios.delete(url, {
            withCredentials: true, // Include cookies with request
        });
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
}
