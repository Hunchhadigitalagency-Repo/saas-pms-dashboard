import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Trash2 } from "lucide-react";
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
import toast from "react-hot-toast";
import type { ProjectDetails, TeamMember } from "../../../types/types";

interface TeamMembersTabProps {
    project: ProjectDetails;
    onRefresh?: () => void;
}

export function TeamMembersTab({ project, onRefresh }: TeamMembersTabProps) {
    const members = (project.team_members || []) as TeamMember[];
    const [editingMember, setEditingMember] = useState<number | null>(null);
    const [editRole, setEditRole] = useState<"owner" | "member" | "viewer">("member");
    const [open, setOpen] = useState(false);

    const handleEdit = (memberId: number, currentRole: string) => {
        setEditingMember(memberId);
        setEditRole(currentRole as "owner" | "member" | "viewer");
    };

    const handleSaveRole = async () => {
        if (editingMember === null) return;
        // TODO: Call API to update role
        toast.success(`Role updated to ${editRole}`, { duration: 2000 });
        setEditingMember(null);
        setOpen(false);
    };

    const handleRemove = async () => {
        // TODO: Call API to remove member
        toast.success("Member removed", { duration: 2000 });
        onRefresh?.();
    };

    if (members.length === 0) {
        return (
            <Card className="rounded-lg shadow-md bg-white border-0">
                <CardContent className="py-8 flex justify-center">
                    <p className="text-xs text-gray-500">No team members assigned yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-lg shadow-none bg-white border-0 p-0">
            <CardContent className="p-0">
                <div className="space-y-2">
                    {members.map((member) => {
                        const u = member.user;
                        const initials = `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.trim() || u.username?.[0]?.toUpperCase() || "?";
                        const img = u.profile?.profile_picture || undefined;

                        return (
                            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Avatar className="w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden">
                                        {img ? (
                                            <AvatarImage src={img} alt={`${u.first_name} ${u.last_name}`} className="object-cover" />
                                        ) : null}
                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-[11px] font-semibold rounded-lg">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm text-gray-900 truncate">
                                            {(u.first_name || u.last_name) ? `${u.first_name} ${u.last_name}` : u.username}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                    <Dialog open={editingMember === u.id && open} onOpenChange={(isOpen) => {
                                        if (!isOpen) setEditingMember(null);
                                        setOpen(isOpen);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0"
                                                onClick={() => handleEdit(u.id, member.role)}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Edit Role</DialogTitle>
                                                <DialogDescription>
                                                    Update role for {u.first_name} {u.last_name}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 block mb-2">Role</label>
                                                    <Select value={editRole} onValueChange={(val) => setEditRole(val as "owner" | "member" | "viewer")}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="owner">Owner</SelectItem>
                                                            <SelectItem value="member">Member</SelectItem>
                                                            <SelectItem value="viewer">Viewer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        setEditingMember(null);
                                                        setOpen(false);
                                                    }}>
                                                        Cancel
                                                    </Button>
                                                    <Button size="sm" onClick={handleSaveRole}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleRemove()}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
