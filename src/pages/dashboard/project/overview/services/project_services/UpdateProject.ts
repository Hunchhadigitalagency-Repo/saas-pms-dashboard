import axios from "axios";
import type { Project, ProjectPayload } from "../../../types/types";
import { BASE_URL } from "@/core/api/constant";

export async function updateProject(projectId: number, projectData: Partial<ProjectPayload>): Promise<Project> {
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
        const response = await axios.patch<Project>(url, projectData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
}
