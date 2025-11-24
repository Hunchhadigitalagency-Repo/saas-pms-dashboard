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
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { createTenantService, checkSubdomainAvailability } from "./onboard_services/OnboardService";

const ROOT_DOMAIN = "collabrix.com"; // visible suffix

const schema = z.object({
    organizationName: z.string().min(2, { message: "Organization name is required" }),
    subdomain: z
        .string()
        .min(3, { message: "Subdomain must be at least 3 characters" })
        .regex(/^[a-z0-9-]+$/i, { message: "Subdomain can contain letters, numbers and hyphens only" }),
});

function slugify(value = "") {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CreateClientAndOrganization({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const orgInputRef = useRef<HTMLInputElement | null>(null);
    const [organizationName, setOrganizationName] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [isSubdomainEdited, setIsSubdomainEdited] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ organizationName?: string; subdomain?: string; logo?: string }>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState<null | "checking" | "available" | "taken">(null);
    const [subdomainMessage, setSubdomainMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

    useEffect(() => {
        if (!isSubdomainEdited) {
            const generated = slugify(organizationName || "");
            setSubdomain(generated);
        }
    }, [organizationName, isSubdomainEdited]);

    // autofocus organization name
    useEffect(() => {
        orgInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!logoFile) {
            setLogoPreview(null);
            return;
        }
        const url = URL.createObjectURL(logoFile);
        setLogoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [logoFile]);

    // Validate subdomain and check availability (debounced)
    useEffect(() => {
        // reset errors for subdomain when it changes
        setErrors((prev) => ({ ...prev, subdomain: undefined }));

        // basic client-side validation
        if (!subdomain) {
            setSubdomainStatus(null);
            setSubdomainMessage(null);
            return;
        }

        const minLen = 3;
        if (subdomain.length < minLen) {
            setErrors((prev) => ({ ...prev, subdomain: `Subdomain must be at least ${minLen} characters` }));
            setSubdomainStatus(null);
            setSubdomainMessage(null);
            return;
        }

        if (!/^[a-z0-9-]+$/.test(subdomain)) {
            setErrors((prev) => ({ ...prev, subdomain: "Subdomain can contain letters, numbers and hyphens only" }));
            setSubdomainStatus(null);
            setSubdomainMessage(null);
            return;
        }

        // Debounce availability check
        setSubdomainStatus("checking");
        setSubdomainMessage(null);
        if (debounceTimer) {
            window.clearTimeout(debounceTimer);
        }
        const timer = window.setTimeout(async () => {
            try {
                const res = await checkSubdomainAvailability(subdomain);
                if (res.available) {
                    setSubdomainStatus("available");
                    setSubdomainMessage(res.message || "Subdomain available");
                } else {
                    setSubdomainStatus("taken");
                    setSubdomainMessage(res.message || "Subdomain is taken");
                }
            } catch (err) {
                setSubdomainStatus(null);
                setSubdomainMessage(null);
            }
        }, 600);
        setDebounceTimer(timer);

        return () => {
            window.clearTimeout(timer);
        };
    }, [subdomain]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (f) {
            if (f.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, logo: "Image is too large. Max 2MB." }));
                setLogoFile(null);
                return;
            }
            setErrors((prev) => ({ ...prev, logo: undefined }));
        }
        setLogoFile(f);
    };

    const handleLogoRemove = () => {
        setLogoFile(null);
    };

    const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0] ?? null;
        if (f && f.type.startsWith("image/")) {
            if (f.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, logo: "Image is too large. Max 2MB." }));
                return;
            }
            setErrors((prev) => ({ ...prev, logo: undefined }));
            setLogoFile(f);
        }
    };

    const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase();
        setSubdomain(cleaned);
        setIsSubdomainEdited(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAttemptedSubmit(true);
        setIsLoading(true);

        // Validate fields
        const validation = schema.safeParse({ organizationName, subdomain });
        if (!validation.success) {
            const eState: typeof errors = {};
            validation.error.issues.forEach((issue) => {
                eState[issue.path[0] as keyof typeof errors] = issue.message;
            });
            setErrors(eState);
            setIsLoading(false);
            return;
        }

        if (subdomainStatus === "taken") {
            toast.error("Subdomain is already taken. Please choose another one.");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("organization_name", organizationName);
            formData.append("subdomain", subdomain);
            formData.append("domain", ROOT_DOMAIN);
            if (logoFile) {
                formData.append("logo", logoFile);
            }

            const res = await createTenantService(formData);
            if (res.success) {
                toast.success(res.message || "Tenant created successfully");
                // Redirect to dashboard or next step
                navigate("/dashboard");
            } else {
                toast.error(res.error || "Failed to create tenant");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while creating tenant");
        }

        setIsLoading(false);
    };

    const isFormValid =
        !!organizationName &&
        !!subdomain &&
        !errors.organizationName &&
        !errors.subdomain &&
        !errors.logo &&
        subdomainStatus !== "taken";

    return (
        <div className={cn("bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10", className)} {...props}>
            <div className="flex w-full max-w-lg flex-col gap-6">
                <Card className="text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl text-primary">Create your Organization</CardTitle>
                        <CardDescription className="text-popover-foreground">
                            Provide organization details to create your client (tenant).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="organizationName" className="text-primary">Organization name</Label>
                                    <Input
                                        id="organizationName"
                                        placeholder="Acme Corporation"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        ref={orgInputRef}
                                        className={cn("border-gray-600 text-popover-foreground", errors.organizationName && "border-red-500")}
                                    />
                                    {errors.organizationName && <p className="text-xs text-red-400 mt-1">{errors.organizationName}</p>}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="subdomain" className="text-primary">Subdomain</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="subdomain"
                                            placeholder="acme"
                                            value={subdomain}
                                            onChange={handleSubdomainChange}
                                            disabled={isLoading}
                                            required
                                            className={cn("border-gray-600 text-popover-foreground", errors.subdomain && "border-red-500")}
                                        />
                                        <span className="text-gray-400">.{ROOT_DOMAIN}</span>
                                        <div className="ml-2 text-xs">
                                            {subdomainStatus === "checking" && <span className="text-yellow-400">Checking...</span>}
                                            {subdomainStatus === "available" && <span className="text-green-400">Available</span>}
                                            {subdomainStatus === "taken" && <span className="text-red-400">Taken</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">Example: <strong>acme.{ROOT_DOMAIN}</strong></p>
                                    {errors.subdomain && <p className="text-xs text-red-400 mt-1">{errors.subdomain}</p>}
                                    {subdomainMessage && subdomainStatus !== "checking" && (
                                        <p className={`text-xs mt-1 ${subdomainStatus === "available" ? "text-green-400" : "text-red-400"}`}>{subdomainMessage}</p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="logo" className="text-primary">Organization Logo (optional)</Label>
                                    <div
                                        onDrop={handleLogoDrop}
                                        onDragOver={handleLogoDragOver}
                                        className="flex items-center gap-4"
                                    >
                                        <input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            disabled={isLoading}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />

                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => fileInputRef.current?.click()}
                                            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                                            className="flex items-center justify-center w-full rounded border border-dashed border-gray-600 p-4 text-sm text-gray-400 hover:border-gray-500 cursor-pointer"
                                        >
                                            {!logoPreview ? (
                                                <div className="text-center">Click or drag & drop an image to upload (Max 2MB)</div>
                                            ) : (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <img src={logoPreview} alt="logo preview" className="h-16 w-16 object-contain rounded" />
                                                    <button type="button" onClick={handleLogoRemove} className="text-xs text-red-400">Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">You can drag & drop an image or click to choose. Max 2MB recommended.</p>
                                    {errors.logo && <p className="text-xs text-red-400 mt-1">{errors.logo}</p>}
                                </div>

                                <div>
                                    <Button type="submit" className="w-full bg-secondary text-white hover:bg-secondary/90" disabled={isLoading || !isFormValid}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Organization
                                    </Button>
                                    {!isFormValid && attemptedSubmit && (
                                        <p className="text-xs text-gray-400 mt-2">Please fix the errors above before continuing.</p>
                                    )}
                                </div>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
