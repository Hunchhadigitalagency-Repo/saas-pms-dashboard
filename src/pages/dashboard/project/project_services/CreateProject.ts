
import axios from "axios";
import type { Project, ProjectPayload } from "./types";

export async function createProject(projectData: ProjectPayload): Promise<Project> {
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
        throw new Error("Base URL not found. Cannot create project.");
    }

    const url = `${baseUrl}/projects/`;
    try {
        const response = await axios.post<Project>(url, projectData, {
            withCredentials: true, // Include cookies with request
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
}
