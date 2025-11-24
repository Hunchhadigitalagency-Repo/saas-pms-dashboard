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
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import toast from 'react-hot-toast';

// Password strength checker
const checkPasswordStrength = (password: string) => {
    const criteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password),
    };

    const score = Object.values(criteria).filter(Boolean).length;

    let strength = "";
    let color = "";
    if (score === 0) {
        strength = "No password";
        color = "text-gray-500";
    } else if (score <= 2) {
        strength = "Weak";
        color = "text-red-500";
    } else if (score <= 3) {
        strength = "Fair";
        color = "text-yellow-500";
    } else if (score <= 4) {
        strength = "Good";
        color = "text-blue-500";
    } else {
        strength = "Strong";
        color = "text-green-500";
    }

    return { strength, color, criteria, score };
};

// Zod schema for validation
const registerSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordStrength = checkPasswordStrength(password);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // --- Validation ---
        const validationResult = registerSchema.safeParse({
            firstName,
            lastName,
            email,
            password,
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
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                toast.success("Registration successful! Please log in.");
                navigate("/login");
            } else {
                const data = await response.json();
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error("Registration error:", error);
        }

        setIsLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="text-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-primary">Create Account</CardTitle>
                    <CardDescription className="text-popover-foreground">
                        Sign up to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full bg-white text-primary hover:bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign up with Google
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="text-gray-500 relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-4">
                                {/* First Name and Last Name */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName" className="text-primary">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName" className="text-primary">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-primary">Email</Label>
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

                                {/* Password */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-primary">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">Password strength:</span>
                                                <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                                    {passwordStrength.strength}
                                                </span>
                                            </div>

                                            {/* Strength bar */}
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score === 0
                                                        ? "w-0 bg-gray-600"
                                                        : passwordStrength.score === 1
                                                            ? "w-1/5 bg-red-500"
                                                            : passwordStrength.score === 2
                                                                ? "w-2/5 bg-red-500"
                                                                : passwordStrength.score === 3
                                                                    ? "w-3/5 bg-yellow-500"
                                                                    : passwordStrength.score === 4
                                                                        ? "w-4/5 bg-blue-500"
                                                                        : "w-full bg-green-500"
                                                        }`}
                                                />
                                            </div>

                                            {/* Password requirements */}
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center gap-1">
                                                    {passwordStrength.criteria.length ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-500" />
                                                    )}
                                                    <span className={passwordStrength.criteria.length ? "text-green-500" : "text-gray-500"}>
                                                        8+ characters
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {passwordStrength.criteria.uppercase ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-500" />
                                                    )}
                                                    <span className={passwordStrength.criteria.uppercase ? "text-green-500" : "text-gray-500"}>
                                                        Uppercase
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {passwordStrength.criteria.lowercase ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-500" />
                                                    )}
                                                    <span className={passwordStrength.criteria.lowercase ? "text-green-500" : "text-gray-500"}>
                                                        Lowercase
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {passwordStrength.criteria.number ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <X className="h-3 w-3 text-gray-500" />
                                                    )}
                                                    <span className={passwordStrength.criteria.number ? "text-green-500" : "text-gray-500"}>
                                                        Number
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword" className="text-primary">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="border-gray-600 text-popover-foreground pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-red-500">Passwords don't match</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full bg-secondary text-white hover:bg-secondary/90" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </div>
                            <div className="text-center text-sm text-primary">
                                Already have an account?{" "}
                                <Link to="/login" className="text-secondary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link to="/terms" className="text-secondary">Terms of Service</Link>{" "}
                and <Link to="/policy" className="text-secondary">Privacy Policy</Link>.
            </div>
        </div>
    );
}
