import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getMyClientUsers } from "@/core/utils/getMyClientUsers";
import type { User } from "../../../types/types";

interface NewMember {
    userId: number;
    userName: string;
    userEmail: string;
    role: "owner" | "member" | "viewer";
}

interface AddTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (members: NewMember[]) => void;
    trigger?: boolean;
    alignRight?: boolean;
    existingMemberIds?: number[];
}

export function AddTeamMemberDialog({
    open,
    onOpenChange,
    onConfirm,
    trigger = true,
    alignRight = false,
    existingMemberIds = [],
}: AddTeamMemberDialogProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newMembers, setNewMembers] = useState<NewMember[]>([
        { userId: 0, userName: "", userEmail: "", role: "member" }
    ]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchUsers() {
            if (open) {
                setIsLoading(true);
                try {
                    const usersData = await getMyClientUsers();
                    if (usersData) {
                        setUsers(usersData);
                    }
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Clear state when dialog closes
                setNewMembers([{ userId: 0, userName: "", userEmail: "", role: "member" }]);
                setUsers([]);
            }
        }

        fetchUsers();
    }, [open]);

    // Auto-scroll to bottom when newMembers change
    useEffect(() => {
        if (scrollContainerRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 0);
        }
    }, [newMembers]);

    const handleAddMore = () => {
        setNewMembers([...newMembers, { userId: 0, userName: "", userEmail: "", role: "member" }]);
    };

    const handleRemoveMember = (index: number) => {
        setNewMembers(newMembers.filter((_, i) => i !== index));
    };

    const handleUserChange = (index: number, userId: string) => {
        const selectedUser = users.find(u => u.id === parseInt(userId));
        if (selectedUser) {
            const updated = [...newMembers];
            updated[index] = {
                ...updated[index],
                userId: selectedUser.id,
                userName: `${selectedUser.first_name} ${selectedUser.last_name}`,
                userEmail: selectedUser.email,
            };
            setNewMembers(updated);
        }
    };

    const handleRoleChange = (index: number, role: "owner" | "member" | "viewer") => {
        const updated = [...newMembers];
        updated[index] = { ...updated[index], role };
        setNewMembers(updated);
    };

    const handleConfirm = () => {
        const validMembers = newMembers.filter(m => m.userId !== 0);
        if (validMembers.length > 0) {
            onConfirm(validMembers);
            setNewMembers([{ userId: 0, userName: "", userEmail: "", role: "member" }]);
            onOpenChange(false);
        }
    };

    const getAvailableUsers = (currentIndex: number) => {
        const selectedIds = newMembers
            .map((m, i) => i !== currentIndex ? m.userId : 0)
            .filter(id => id !== 0);
        return users.filter(u =>
            !existingMemberIds.includes(u.id) &&
            !selectedIds.includes(u.id)
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            {trigger && (
                <DialogTrigger asChild>
                    <Button className={`gap-2 h-8 rounded-md cursor-pointer text-xs font-normal bg-secondary whitespace-nowrap hover:text-secondary hover:bg-white border border-secondary transition-colors ${alignRight ? 'ml-auto' : ''}`}>
                        <Plus size={12} />
                        Add Member
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add Team Members</DialogTitle>
                    <DialogDescription>
                        Add one or more members to your team
                    </DialogDescription>
                </DialogHeader>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-2 pr-2 scroll-smooth">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-gray-500">No users available</p>
                        </div>
                    ) : (
                        newMembers.map((member, index) => (
                            <div key={index} className="flex items-end gap-2 p-2.5 border border-gray-200 rounded-md bg-white hover:border-gray-300 transition-colors">
                                <div className="flex-1 space-y-0.5 min-w-0">
                                    <label className="text-xs font-medium text-gray-600">Team Member</label>
                                    <Select
                                        value={member.userId === 0 ? "" : member.userId.toString()}
                                        onValueChange={(val) => handleUserChange(index, val)}
                                    >
                                        <SelectTrigger className={`h-8 text-xs border-gray-200 px-2 w-full ${member.userId !== 0 ? 'justify-start' : ''}`}>
                                            {member.userId === 0 ? (
                                                <span className="text-gray-400">Select member</span>
                                            ) : (
                                                <div className="flex items-center gap-2 w-full">
                                                    <Avatar className="h-6 w-6 rounded-sm flex-shrink-0">
                                                        {users.find(u => u.id === member.userId)?.profile?.profile_picture ? (
                                                            <AvatarImage src={users.find(u => u.id === member.userId)?.profile?.profile_picture ?? undefined} alt={member.userName} className="object-cover" />
                                                        ) : null}
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-sm">
                                                            {`${member.userName.split(' ')[0]?.[0] || ''}${member.userName.split(' ')[1]?.[0] || ''}`.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{member.userName}</span>
                                                </div>
                                            )}
                                        </SelectTrigger>
                                        <SelectContent className="min-w-[250px]">
                                            {getAvailableUsers(index).length === 0 ? (
                                                <div className="p-2 text-xs text-gray-500">
                                                    No available users
                                                </div>
                                            ) : (
                                                getAvailableUsers(index).map(user => {
                                                    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.trim() || user.username?.[0]?.toUpperCase() || "?";
                                                    const profilePic = user.profile?.profile_picture || undefined;
                                                    return (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6 rounded-sm">
                                                                    {profilePic ? (
                                                                        <AvatarImage src={profilePic} alt={`${user.first_name} ${user.last_name}`} className="object-cover" />
                                                                    ) : null}
                                                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-sm">
                                                                        {initials}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="text-xs font-medium">{user.first_name} {user.last_name}</div>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-0.5 min-w-0">
                                    <label className="text-xs font-medium text-gray-600">Role</label>
                                    <Select
                                        value={member.role}
                                        onValueChange={(val) => handleRoleChange(index, val as "owner" | "member" | "viewer")}
                                    >
                                        <SelectTrigger className="h-8 text-xs border-gray-200 w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {newMembers.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                        onClick={() => handleRemoveMember(index)}
                                    >
                                        <X size={16} />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddMore}
                        disabled={isLoading}
                        className="gap-1.5 text-xs h-8"
                    >
                        <Plus size={14} />
                        Add More
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-xs h-8"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleConfirm}
                            disabled={newMembers.every(m => m.userId === 0)}
                            className="text-xs h-8"
                        >
                            Add Members
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
