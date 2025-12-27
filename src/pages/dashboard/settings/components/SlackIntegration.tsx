import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Slack, Check, AlertCircle, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import { successOptions, errorOptions } from "@/core/utils/toast-styles"

const SLACK_OAUTH_SCOPES = [
    'channels:read',
    'chat:write',
    'groups:read',
]

const SLACK_SCOPE_DESCRIPTIONS = {
    'channels:read': 'View basic information about public channels in a workspace',
    'chat:write': 'Send messages as @collabrix-integration',
    'groups:read': 'View basic information about private channels that "collabrix-integration" has been added to'
}

interface SlackConnectionStatus {
    is_connected: boolean
    team_name?: string
    team_id?: string
}

export function SlackIntegration() {
    const [isConnected, setIsConnected] = useState(false)
    const [connectionData, setConnectionData] = useState<SlackConnectionStatus | null>(null)
    const [loading, setLoading] = useState(false)
    const [showTokenDialog, setShowTokenDialog] = useState(false)
    const [slackToken, setSlackToken] = useState("")
    const [teamId, setTeamId] = useState("")
    const [tokenLoading, setTokenLoading] = useState(false)
    const [showScopes, setShowScopes] = useState(false)

    // Check initial connection status
    useEffect(() => {
        checkSlackConnection()
    }, [])

    const checkSlackConnection = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/slack/check_connection/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.is_connected) {
                    setIsConnected(true)
                    setConnectionData(data)
                }
            }
        } catch (error) {
            console.error("Error checking Slack connection:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleConnectClick = () => {
        setShowTokenDialog(true)
        setShowScopes(true)
    }

    const handleAddToken = async () => {
        if (!slackToken.trim() || !teamId.trim()) {
            toast.error("Please enter both token and team ID", errorOptions)
            return
        }

        setTokenLoading(true)
        try {
            const response = await fetch('/api/v1/slack/add_token/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slack_token: slackToken,
                    team_id: teamId,
                })
            })

            if (response.ok) {
                const data = await response.json()
                setIsConnected(true)
                setConnectionData(data)
                setShowTokenDialog(false)
                setSlackToken("")
                setTeamId("")
                toast.success("Slack connected successfully!", successOptions)
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to add Slack token", errorOptions)
            }
        } catch (error) {
            console.error("Error adding token:", error)
            toast.error("An error occurred while connecting Slack", errorOptions)
        } finally {
            setTokenLoading(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect Slack?")) {
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/v1/slack/disconnect/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            })

            if (response.ok) {
                setIsConnected(false)
                setConnectionData(null)
                toast.success("Slack disconnected successfully", successOptions)
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to disconnect Slack", errorOptions)
            }
        } catch (error) {
            console.error("Error disconnecting:", error)
            toast.error("An error occurred while disconnecting Slack", errorOptions)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Slack className="h-5 w-5" />
                    Slack Integration
                </CardTitle>
                <CardDescription>
                    Connect your workspace to Slack for better collaboration
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : isConnected && connectionData ? (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <Check className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Slack is connected to <strong>{connectionData.team_name}</strong>
                                </AlertDescription>
                            </Alert>
                            <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Team ID:</span> {connectionData.team_id}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleDisconnect}
                                className="w-full"
                            >
                                Disconnect Slack
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Slack is not connected. Click below to connect your workspace.
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={handleConnectClick}
                                className="w-full"
                                size="lg"
                            >
                                <Slack className="mr-2 h-5 w-5" />
                                Connect Slack
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Token Dialog */}
            <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Connect Slack Workspace</DialogTitle>
                        <DialogDescription>
                            Enter your Slack authentication token and team ID to connect
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Scopes Section */}
                        {showScopes && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-sm text-blue-900">Required OAuth Scopes</h4>
                                    <button
                                        onClick={() => setShowScopes(false)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Hide
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {SLACK_OAUTH_SCOPES.map((scope) => (
                                        <li key={scope} className="text-sm text-blue-900 space-y-0.5">
                                            <div className="font-medium text-blue-950">{scope}</div>
                                            <div className="text-blue-800">
                                                {SLACK_SCOPE_DESCRIPTIONS[scope as keyof typeof SLACK_SCOPE_DESCRIPTIONS]}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-2 border-t border-blue-200">
                                    <a
                                        href="https://api.slack.com/apps"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        Get Token from Slack API
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Token Input */}
                        <div className="space-y-2">
                            <Label htmlFor="slack-token">Slack Bot Token</Label>
                            <Input
                                id="slack-token"
                                type="password"
                                placeholder="xoxb-your-token-here"
                                value={slackToken}
                                onChange={(e) => setSlackToken(e.target.value)}
                                disabled={tokenLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Create a Slack app at{" "}
                                <a
                                    href="https://api.slack.com/apps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    api.slack.com/apps
                                </a>
                                {" "}and copy your bot token
                            </p>
                        </div>

                        {/* Team ID Input */}
                        <div className="space-y-2">
                            <Label htmlFor="team-id">Team ID</Label>
                            <Input
                                id="team-id"
                                placeholder="T01234ABCD"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                                disabled={tokenLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Find your Team ID in Slack workspace settings
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowTokenDialog(false)}
                            disabled={tokenLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddToken}
                            disabled={tokenLoading || !slackToken.trim() || !teamId.trim()}
                        >
                            {tokenLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Connect"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
