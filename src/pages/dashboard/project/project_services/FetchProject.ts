import axios from "axios";
import type { Project } from "./types";
export type { Project } from "./types";

interface ProjectResponse {
    total_items: number;
    current_page: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: Project[];
}

export async function fetchProjects(): Promise<Project[]> {
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
        throw new Error("Base URL not found. Cannot fetch projects.");
    }

    let allProjects: Project[] = [];
    let currentPage = 1;
    let totalPages = 1;


    while (currentPage <= totalPages) {
        const url = `${baseUrl}/projects/?page=${currentPage}`;
        try {
            const response = await axios.get<ProjectResponse>(url, {
                withCredentials: true, // Include cookies with request
            });

            const data = response.data;
            allProjects = [...allProjects, ...data.results];
            totalPages = data.total_pages;
            currentPage++;
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            throw error; // bubble up instead of silently failing
        }
    }

    return allProjects;
}