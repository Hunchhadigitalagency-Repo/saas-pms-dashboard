import axios from "axios";

export async function deleteWorkItem(workItemId: number): Promise<void> {
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
        throw new Error("Base URL not found. Cannot delete work item.");
    }

    const url = `${baseUrl}/work-items/${workItemId}/`;
    try {
        await axios.delete(url, {
            withCredentials: true, // Include cookies with request
        });
    } catch (error) {
        console.error(`Failed to delete work item with ID ${workItemId}:`, error);
        throw error;
    }
}
