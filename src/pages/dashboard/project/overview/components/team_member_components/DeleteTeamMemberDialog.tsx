import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberName: string;
    onConfirm: () => void;
    userId: number;
    onDeleteClick: (userId: number) => void;
}

export function DeleteTeamMemberDialog({
    open,
    onOpenChange,
    memberName,
    onConfirm,
    userId,
    onDeleteClick,
}: DeleteTeamMemberDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteClick(userId)}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Remove Member</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove {memberName} from the team?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onConfirm}>
                        Remove
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
