import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean;
    projectName: string;
}

export function DeleteConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    projectName,
}: DeleteConfirmationDialogProps) {
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        if (!open) {
            setInputValue("")
        }
    }, [open])

    const isMatch = inputValue === projectName;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Project
                    </DialogTitle>
                    <DialogDescription className="space-y-3 pt-3">
                        <p>
                            Are you absolutely sure you want to delete <span className="font-semibold text-foreground">"{projectName}"</span>?
                        </p>
                        <p className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
                            This action cannot be undone. This will permanently delete the project and remove all associated data and team member access.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                    <Label htmlFor="project-name" className="text-sm font-medium">
                        Please type <span className="font-bold select-all">{projectName}</span> to confirm.
                    </Label>
                    <Input
                        id="project-name"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type project name here"
                        className={!isMatch && inputValue ? "border-red-300 focus-visible:ring-red-300" : ""}
                    />
                </div>

                <DialogFooter className="sm:justify-between flex-row gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting} className="flex-1 sm:flex-none">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting || !isMatch}
                        className="flex-1 sm:flex-none"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}