
import axios from "axios";

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
        throw new Error("Base URL not found. Cannot delete project.");
    }

    const url = `${baseUrl}/projects/${projectId}/`;
    try {
        await axios.delete(url);
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
}
