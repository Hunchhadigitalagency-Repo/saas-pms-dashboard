import { BASE_URL } from "@/core/api/constant";

// --- Interface for send email response ---
interface SendEmailResponse {
    message: string;
    success: boolean;
}

// --- Interface for verify OTP response ---
interface VerifyOTPResponse {
    message: string;
    success: boolean;
    token?: string;
}

// --- Interface for reset password response ---
interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

// --- Send Email Service ---
export const sendEmailService = async (
    email: string
): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/forgot-password/send-email/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }

        const data: SendEmailResponse = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        console.error("Send email service error:", error);
        return { success: false, error: (error as Error).message };
    }
};

// --- Verify OTP Service ---
export const verifyOTPService = async (
    email: string,
    otp: string
): Promise<{ success: boolean; error?: string; message?: string; token?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/forgot-password/verify-otp/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }

        const data: VerifyOTPResponse = await response.json();
        return { success: true, message: data.message, token: data.token };
    } catch (error) {
        console.error("Verify OTP service error:", error);
        return { success: false, error: (error as Error).message };
    }
};

// --- Reset Password Service ---
export const resetPasswordService = async (
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/forgot-password/reset-password/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                token,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Request failed with status ${response.status}`);
        }

        const data: ResetPasswordResponse = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        console.error("Reset password service error:", error);
        return { success: false, error: (error as Error).message };
    }
};
