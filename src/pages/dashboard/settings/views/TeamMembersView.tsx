import React from "react"

const members = [
    { name: "Jane Cooper", role: "Owner", email: "jane.cooper@acme.com" },
    { name: "Devon Lane", role: "Admin", email: "devon.lane@acme.com" },
    { name: "Courtney Henry", role: "Member", email: "courtney.henry@acme.com" },
]

const TeamMembersView: React.FC = () => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Team Members</h3>
                <p className="text-sm text-muted-foreground">View who has access to this workspace.</p>
            </div>
            <div className="space-y-2 rounded-lg border bg-background p-4">
                {members.map((member) => (
                    <div
                        key={member.email}
                        className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2"
                    >
                        <div>
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">{member.role}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeamMembersView
