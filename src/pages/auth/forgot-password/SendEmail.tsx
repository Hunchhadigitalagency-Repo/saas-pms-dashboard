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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { sendEmailService } from "../auth_service/ForgotPasswordService";

// Zod schema for validation
const sendEmailSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function SendEmail({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // --- Validation ---
        const validationResult = sendEmailSchema.safeParse({ email });
        if (!validationResult.success) {
            validationResult.error.issues.forEach((error) => {
                toast.error(error.message);
            });
            setIsLoading(false);
            return;
        }

        // --- API Call ---
        const result = await sendEmailService(email);
        if (result.success) {
            toast.success(result.message || "OTP sent to your email!");
            // Store email in session storage for next step
            sessionStorage.setItem("forgotPasswordEmail", email);
            navigate("/forgot-password/verify-otp");
        } else {
            toast.error(result.error || "Failed to send email. Please try again.");
            navigate("/forgot-password/verify-otp");

        }

        setIsLoading(false);
    };

    const handleBack = () => {
        navigate("/login");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="text-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-primary">Forgot Password?</CardTitle>
                    <CardDescription className="text-popover-foreground">
                        No worries! Enter your email address and we'll send you an OTP to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="email" className="text-primary">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="border-gray-600 text-popover-foreground"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-secondary text-white hover:bg-secondary/90"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send OTP
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
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
