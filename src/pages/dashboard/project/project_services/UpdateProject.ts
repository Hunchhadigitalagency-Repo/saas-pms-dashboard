
import axios from "axios";
import type { Project, ProjectPayload } from "./types";

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
        throw new Error("Base URL not found. Cannot update project.");
    }

    const url = `${baseUrl}/projects/${projectId}/`;
    try {
        const response = await axios.patch<Project>(url, projectData);
        return response.data;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
}
