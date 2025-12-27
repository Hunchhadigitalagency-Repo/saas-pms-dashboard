import React from "react"

const NotificationView: React.FC = () => {
    const prefs = [
        { label: "Email alerts", description: "Receive updates by email for important events." },
        { label: "In-app notifications", description: "Show notifications inside the dashboard." },
        { label: "Weekly summary", description: "A weekly recap of activity and metrics." },
    ]

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">Choose how you want to be notified.</p>
            </div>
            <div className="space-y-3 rounded-lg border bg-background p-4">
                {prefs.map((item) => (
                    <label key={item.label} className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 h-4 w-4" defaultChecked />
                        <span className="space-y-0.5">
                            <div className="text-sm font-medium">{item.label}</div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default NotificationView
