import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { successOptions, errorOptions } from "@/core/utils/toast-styles"

interface ProfileData {
    first_name: string
    last_name: string
    email: string
    profile_picture?: string
}

export function ProfileUpdateForm() {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [profileData, setProfileData] = useState<ProfileData>({
        first_name: "",
        last_name: "",
        email: "",
        profile_picture: ""
    })
    const [previewImage, setPreviewImage] = useState<string>("")

    useEffect(() => {
        // Load user data from localStorage or API
        const loadUserData = () => {
            const userString = localStorage.getItem("user")
            if (userString) {
                try {
                    const user = JSON.parse(userString)
                    setProfileData({
                        first_name: user.first_name || "",
                        last_name: user.last_name || "",
                        email: user.email || "",
                        profile_picture: user.profile?.profile_picture || ""
                    })
                    setPreviewImage(user.profile?.profile_picture || "")
                } catch (error) {
                    console.error("Error loading user data:", error)
                }
            }
        }
        loadUserData()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file", errorOptions)
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB", errorOptions)
            return
        }

        setUploading(true)
        try {
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)

            // TODO: Upload to your backend API
            // const formData = new FormData()
            // formData.append("profile_picture", file)
            // const response = await uploadProfilePicture(formData)

            toast.success("Profile picture updated", successOptions)
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error("Failed to upload image", errorOptions)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Call your API to update profile
            // const response = await updateUserProfile(profileData)

            // Update localStorage
            const userString = localStorage.getItem("user")
            if (userString) {
                const user = JSON.parse(userString)
                const updatedUser = {
                    ...user,
                    ...profileData
                }
                localStorage.setItem("user", JSON.stringify(updatedUser))
            }

            toast.success("Profile updated successfully", successOptions)
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile", errorOptions)
        } finally {
            setLoading(false)
        }
    }

    const getInitials = () => {
        if (profileData.first_name && profileData.last_name) {
            return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase()
        }
        if (profileData.first_name) {
            return profileData.first_name.substring(0, 2).toUpperCase()
        }
        return "U"
    }

    return (
        <Card className="shadow-none border-none py-0">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={previewImage} alt={`${profileData.first_name} ${profileData.last_name}`} />
                            <AvatarFallback className="text-2xl">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="profile-picture" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={uploading}
                                        asChild
                                    >
                                        <span>
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Change Picture
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </div>
                            </Label>
                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF. Max size 5MB.
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                value={profileData.first_name}
                                onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                value={profileData.last_name}
                                onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            placeholder="Enter your email"
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
