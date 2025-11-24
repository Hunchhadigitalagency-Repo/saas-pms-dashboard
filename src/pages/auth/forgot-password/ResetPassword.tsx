import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { resetPasswordService } from "../auth_service/ForgotPasswordService";

// Zod schema for validation
const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
                message: "Password must contain at least one special character",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function ResetPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        // Get email and token from session storage
        const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
        const storedToken = sessionStorage.getItem("resetPasswordToken");

        if (!storedEmail || !storedToken) {
            toast.error("Invalid session. Please start the process again.");
            navigate("/login");
            return;
        }

        setEmail(storedEmail);
        setToken(storedToken);
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // --- Validation ---
        const validationResult = resetPasswordSchema.safeParse({
            newPassword,
            confirmPassword,
        });

        if (!validationResult.success) {
            validationResult.error.issues.forEach((error) => {
                toast.error(error.message);
            });
            setIsLoading(false);
            return;
        }

        // --- API Call ---
        const result = await resetPasswordService(
            email,
            token,
            newPassword,
            confirmPassword
        );

        if (result.success) {
            toast.success(result.message || "Password reset successfully!");
            // Clear session storage
            sessionStorage.removeItem("forgotPasswordEmail");
            sessionStorage.removeItem("resetPasswordToken");
            navigate("/login");
        } else {
            toast.error(result.error || "Failed to reset password. Please try again.");
        }

        setIsLoading(false);
    };

    const handleBack = () => {
        navigate("/forgot-password/verify-otp");
    };

    const isPasswordValid = newPassword.length >= 8 && confirmPassword.length >= 8;
    const passwordsMatch = newPassword === confirmPassword;

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="text-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-primary">Reset Password</CardTitle>
                    <CardDescription className="text-popover-foreground">
                        Create a new password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-4">
                                {/* New Password Field */}
                                <div className="grid gap-3">
                                    <Label htmlFor="newPassword" className="text-primary">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                            disabled={isLoading}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="grid gap-3">
                                    <Label htmlFor="confirmPassword" className="text-primary">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword &&
                                        newPassword &&
                                        !passwordsMatch && (
                                            <p className="text-xs text-red-400">Passwords don't match</p>
                                        )}
                                    {confirmPassword &&
                                        newPassword &&
                                        passwordsMatch && (
                                            <p className="text-xs text-green-400">Passwords match</p>
                                        )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-white hover:bg-secondary/90"
                                    disabled={
                                        isLoading ||
                                        !isPasswordValid ||
                                        !passwordsMatch
                                    }
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Reset Password
                                </Button>
                            </div>
                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="text-primary hover:text-secondary"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
