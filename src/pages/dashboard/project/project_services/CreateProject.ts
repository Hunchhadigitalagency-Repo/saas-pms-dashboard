
import axios from "axios";
import type { Project, ProjectPayload } from "./types";
import { BASE_URL } from "@/core/api/constant";

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
        console.warn("domains not found in localStorage; falling back to BASE_URL")
        baseUrl = BASE_URL
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
