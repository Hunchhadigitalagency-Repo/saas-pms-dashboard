import { BASE_URL } from "@/core/api/constant";

interface CreateTenantResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const createTenantService = async (
    formData: FormData
): Promise<{ success: boolean; error?: string; data?: any; message?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/tenant/create/`, {
            method: "POST",
            // Let browser set Content-Type for FormData
            body: formData,
            credentials: "include",
        });

        if (!response.ok) {
            const err = await response.json().catch(() => null);
            throw new Error(err?.detail || err?.message || `Request failed with status ${response.status}`);
        }

        const data: CreateTenantResponse = await response.json();
        return { success: true, data: data.data, message: data.message };
    } catch (error) {
        console.error("Create tenant service error:", error);
        return { success: false, error: (error as Error).message };
    }
};

// --- Check Subdomain Availability ---
export const checkSubdomainAvailability = async (
    subdomain: string
): Promise<{ available: boolean; message?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/tenant/check-subdomain/?subdomain=${encodeURIComponent(subdomain)}`);
        if (!response.ok) {
            // If endpoint not implemented or returns error, assume unknown/unavailable
            const err = await response.json().catch(() => null);
            return { available: false, message: err?.detail || err?.message || `Request failed with status ${response.status}` };
        }
        const data = await response.json();
        // Expecting { available: boolean, message?: string }
        return { available: !!data.available, message: data.message };
    } catch (error) {
        console.error("Check subdomain availability error:", error);
        return { available: false, message: (error as Error).message };
    }
};
