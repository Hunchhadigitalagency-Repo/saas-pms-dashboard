import { Loader } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkAuthStatus } from "@/core/utils/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Checking authentication status...");
        const checkStatus = async () => {
            const isAuthenticated = await checkAuthStatus();
            console.log("Authentication status:", isAuthenticated);
            if (isAuthenticated) {
                navigate("/dashboard");
            } else {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, [navigate]);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <Loader className="h-4 w-4 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link to="/login" className="flex items-center gap-2 self-center font-medium">
                    <img src="../logo/logo.png" alt="" />
                </Link>
                <LoginForm />
            </div>
        </div>
    );
}