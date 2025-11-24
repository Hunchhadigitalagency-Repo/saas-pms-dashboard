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
import { Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { verifyOTPService } from "../auth_service/ForgotPasswordService";

// Zod schema for validation
const verifyOTPSchema = z.object({
    otp: z
        .string()
        .length(5, { message: "OTP must be exactly 5 digits" })
        .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export default function VerifyOTP({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Get email from session storage
        const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
        if (!storedEmail) {
            toast.error("Please start the process from the login page");
            navigate("/login");
            return;
        }
        setEmail(storedEmail);
    }, [navigate]);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 5);
        setOtp(value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // --- Validation ---
        const validationResult = verifyOTPSchema.safeParse({ otp });
        if (!validationResult.success) {
            validationResult.error.issues.forEach((error) => {
                toast.error(error.message);
            });
            setIsLoading(false);
            return;
        }

        // --- API Call ---
        const result = await verifyOTPService(email, otp);
        if (result.success) {
            toast.success(result.message || "OTP verified successfully!");
            // Store token and email for reset password step
            if (result.token) {
                sessionStorage.setItem("resetPasswordToken", result.token);
            }
            navigate("/forgot-password/reset-password");
        } else {
            toast.error(result.error || "Invalid OTP. Please try again.");
        }

        setIsLoading(false);
    };

    const handleBack = () => {
        navigate("/forgot-password/send-email");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="text-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-primary">Verify OTP</CardTitle>
                    <CardDescription className="text-popover-foreground">
                        Enter the 5-digit OTP sent to your email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="otp" className="text-primary">
                                        Enter OTP
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="00000"
                                        maxLength={5}
                                        required
                                        value={otp}
                                        onChange={handleOtpChange}
                                        disabled={isLoading}
                                        className="border-gray-600 text-popover-foreground text-center text-2xl tracking-widest font-mono"
                                    />
                                    <p className="text-xs text-gray-400 text-center">
                                        We sent a code to {email}
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-white hover:bg-secondary/90"
                                    disabled={isLoading || otp.length !== 5}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify OTP
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
