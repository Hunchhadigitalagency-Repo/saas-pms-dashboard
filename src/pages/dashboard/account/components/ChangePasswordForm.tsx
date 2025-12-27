import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { successOptions, errorOptions } from "@/core/utils/toast-styles"

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    })

    const validatePassword = () => {
        if (!passwordData.current_password) {
            toast.error("Please enter your current password", errorOptions)
            return false
        }

        if (!passwordData.new_password) {
            toast.error("Please enter a new password", errorOptions)
            return false
        }

        if (passwordData.new_password.length < 8) {
            toast.error("New password must be at least 8 characters long", errorOptions)
            return false
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("Passwords do not match", errorOptions)
            return false
        }

        if (passwordData.current_password === passwordData.new_password) {
            toast.error("New password must be different from current password", errorOptions)
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword()) {
            return
        }

        setLoading(true)

        try {
            // TODO: Call your API to change password
            // const response = await changePassword({
            //     current_password: passwordData.current_password,
            //     new_password: passwordData.new_password
            // })

            toast.success("Password changed successfully", successOptions)

            // Reset form
            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: ""
            })
        } catch (error: any) {
            console.error("Error changing password:", error)
            const errorMessage = error?.response?.data?.message || "Failed to change password"
            toast.error(errorMessage, errorOptions)
        } finally {
            setLoading(false)
        }
    }

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: "", color: "" }

        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++

        if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" }
        if (strength <= 3) return { strength, label: "Medium", color: "bg-yellow-500" }
        return { strength, label: "Strong", color: "bg-green-500" }
    }

    const passwordStrength = getPasswordStrength(passwordData.new_password)

    return (
        <Card className="shadow-none border-none p-0">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                placeholder="Enter your current password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new_password"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                placeholder="Enter your new password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordData.new_password && (
                            <div className="space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded ${level <= passwordStrength.strength
                                                ? passwordStrength.color
                                                : "bg-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Password strength: {passwordStrength.label}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters long
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                placeholder="Confirm your new password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password && (
                            <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="bg-primary">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Change Password
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
