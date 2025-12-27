import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
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

interface EditTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberName: string;
    role: "owner" | "member" | "viewer";
    onRoleChange: (role: "owner" | "member" | "viewer") => void;
    onConfirm: () => void;
    userId: number;
    currentRole: string;
    onEditClick: (userId: number, currentRole: string) => void;
}

export function EditTeamMemberDialog({
    open,
    onOpenChange,
    memberName,
    role,
    onRoleChange,
    onConfirm,
    userId,
    currentRole,
    onEditClick,
}: EditTeamMemberDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onEditClick(userId, currentRole)}
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Update role for {memberName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Role</label>
                        <Select value={role} onValueChange={(val) => onRoleChange(val as "owner" | "member" | "viewer")}>
                            <SelectTrigger className="w-full">
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
                        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={onConfirm}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
