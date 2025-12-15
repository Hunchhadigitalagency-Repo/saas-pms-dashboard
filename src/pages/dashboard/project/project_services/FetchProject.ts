import axios from "axios";
import { BASE_URL } from "@/core/api/constant";
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
        // fallback to app-wide BASE_URL if domains not present in localStorage
        console.warn("domains not found in localStorage; falling back to BASE_URL")
        baseUrl = BASE_URL
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