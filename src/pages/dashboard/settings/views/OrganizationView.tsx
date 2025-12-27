import React from "react"

const OrganizationView: React.FC = () => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Organization</h3>
                <p className="text-sm text-muted-foreground">Update your organization profile and basics.</p>
            </div>
            <div className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <div className="text-sm font-medium">Organization Name</div>
                    <div className="rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">Acme Inc.</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm font-medium">Domain</div>
                    <div className="rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">acme.com</div>
                </div>
                <div className="space-y-1 sm:col-span-2">
                    <div className="text-sm font-medium">Description</div>
                    <div className="rounded-md border bg-muted/30 p-2 text-sm text-muted-foreground">Modern product and services for global teams.</div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationView
