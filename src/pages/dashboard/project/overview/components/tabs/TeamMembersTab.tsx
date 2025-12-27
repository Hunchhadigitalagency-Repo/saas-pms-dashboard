import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import type { ProjectDetails, TeamMember } from "../../../types/types";
import { AddTeamMemberDialog } from "../team_member_components/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "../team_member_components/EditTeamMemberDialog";
import { DeleteTeamMemberDialog } from "../team_member_components/DeleteTeamMemberDialog";
import { updateProject } from "../../services/project_services/UpdateProject";

interface TeamMembersTabProps {
    project: ProjectDetails;
    onUpdateProject?: (updatedProject: ProjectDetails) => void;
}

export function TeamMembersTab({ project, onUpdateProject }: TeamMembersTabProps) {
    const members = (project.team_members || []) as TeamMember[];
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [editingMember, setEditingMember] = useState<number | null>(null);
    const [editRole, setEditRole] = useState<"owner" | "member" | "viewer">("member");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const handleEdit = (memberId: number, currentRole: string) => {
        setEditingMember(memberId);
        setEditRole(currentRole as "owner" | "member" | "viewer");
        setEditDialogOpen(true);
    };

    const handleSaveRole = async () => {
        if (editingMember === null) return;

        try {
            // Find the member to update
            const memberToUpdate = members.find(m => m.user.id === editingMember);
            if (!memberToUpdate) return;

            // Create updated team members list with new role
            const updatedTeamMembers = members.map(m =>
                m.user.id === editingMember
                    ? { ...m, role: editRole }
                    : m
            );

            // Prepare payload with user ID and role
            const teamMembersPayload = updatedTeamMembers.map(m => ({
                user: m.user.id,
                role: m.role
            }));

            const response = await updateProject(project.id, {
                team_members: teamMembersPayload
            });

            // Update UI with response data
            if (onUpdateProject && response) {
                onUpdateProject(response as ProjectDetails);
            }

            toast.success(`Role updated to ${editRole}`, { duration: 2000 });
            setEditingMember(null);
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update role:", error);
            toast.error("Failed to update role", { duration: 2000 });
        }
    }; const handleDeleteMember = (memberId: number) => {
        setMemberToDelete(memberId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (memberToDelete === null) return;

        try {
            // Remove the member from the list and prepare payload with user ID and role
            const updatedTeamMembers = members
                .filter(m => m.user.id !== memberToDelete)
                .map(m => ({
                    user: m.user.id,
                    role: m.role
                }));

            const response = await updateProject(project.id, {
                team_members: updatedTeamMembers
            });

            // Update UI with response data
            if (onUpdateProject && response) {
                onUpdateProject(response as ProjectDetails);
            }

            toast.success("Member removed", { duration: 2000 });
            setMemberToDelete(null);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Failed to remove member:", error);
            toast.error("Failed to remove member", { duration: 2000 });
        }
    };

    const handleAddMembers = async (newMembers: Array<{ userId: number; userName: string; userEmail: string; role: string }>) => {
        try {
            // Combine existing members with new members, sending user ID and role
            const existingMembersPayload = members.map(m => ({
                user: m.user.id,
                role: m.role
            }));

            const newMembersPayload = newMembers.map(m => ({
                user: m.userId,
                role: m.role
            }));

            const allMembers = [...existingMembersPayload, ...newMembersPayload];

            const response = await updateProject(project.id, {
                team_members: allMembers
            });

            // Update UI with response data
            if (onUpdateProject && response) {
                onUpdateProject(response as ProjectDetails);
            }

            toast.success(`${newMembers.length} member(s) added successfully`, { duration: 2000 });
            setAddDialogOpen(false);
        } catch (error) {
            console.error("Failed to add members:", error);
            toast.error("Failed to add members", { duration: 2000 });
        }
    };

    // Filter members based on search and role filter
    const filteredMembers = members.filter((member) => {
        const u = member.user;
        const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
        const email = u.email.toLowerCase();
        const searchMatch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        const roleMatch = roleFilter ? member.role === roleFilter : true;
        return searchMatch && roleMatch;
    });

    if (members.length === 0) {
        return (
            <Card className="bg-white shadow-none border-0">
                <CardContent className="py-8 flex flex-col justify-center items-center gap-4">
                    <p className="text-xs text-gray-500">No team members assigned yet.</p>
                    <AddTeamMemberDialog
                        open={addDialogOpen}
                        onOpenChange={setAddDialogOpen}
                        onConfirm={handleAddMembers}
                        trigger={true}
                        alignRight={false}
                        existingMemberIds={members.map(m => m.user.id)}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-lg shadow-none bg-white border-0 p-0">
            <CardContent className="p-0">
                {/* Search & Filter Controls */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                        <Input
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-7 h-8 rounded-md text-xs placeholder:text-xs w-full"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 h-8 rounded-md text-xs font-normal whitespace-nowrap">
                                <Filter size={12} />
                                Filter
                                {roleFilter && (
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        1
                                    </Badge>
                                )}
                                <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 p-3">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Role</label>
                                    <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRoleFilter("")}
                                        className="flex-1"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AddTeamMemberDialog
                        open={addDialogOpen}
                        onOpenChange={setAddDialogOpen}
                        onConfirm={handleAddMembers}
                        trigger={true}
                        alignRight={true}
                        existingMemberIds={members.map(m => m.user.id)}
                    />
                </div>

                {/* Members List */}
                <div className="space-y-2">
                    {filteredMembers.map((member) => {
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
                                    <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">
                                        {member.role}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                    <EditTeamMemberDialog
                                        open={editingMember === u.id && editDialogOpen}
                                        onOpenChange={(isOpen) => {
                                            if (!isOpen) setEditingMember(null);
                                            setEditDialogOpen(isOpen);
                                        }}
                                        memberName={`${u.first_name} ${u.last_name}`}
                                        role={editRole}
                                        onRoleChange={setEditRole}
                                        onConfirm={handleSaveRole}
                                        userId={u.id}
                                        currentRole={member.role}
                                        onEditClick={handleEdit}
                                    />

                                    <DeleteTeamMemberDialog
                                        open={memberToDelete === u.id && deleteDialogOpen}
                                        onOpenChange={(isOpen) => {
                                            if (!isOpen) setMemberToDelete(null);
                                            setDeleteDialogOpen(isOpen);
                                        }}
                                        memberName={`${u.first_name} ${u.last_name}`}
                                        onConfirm={confirmDelete}
                                        userId={u.id}
                                        onDeleteClick={handleDeleteMember}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
