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
import { slackService, type SlackConnectionStatus } from "../services/SlackService"

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

export function SlackIntegration() {
    const [isConnected, setIsConnected] = useState(false)
    const [connectionData, setConnectionData] = useState<SlackConnectionStatus | null>(null)
    const [loading, setLoading] = useState(false)
    const [showTokenDialog, setShowTokenDialog] = useState(false)
    const [slackToken, setSlackToken] = useState("")
    const [tokenLoading, setTokenLoading] = useState(false)
    const [showScopes, setShowScopes] = useState(false)
    const [verifyingToken, setVerifyingToken] = useState(false)
    const [teamInfo, setTeamInfo] = useState<{ team_id: string, team_name: string } | null>(null)

    // Check initial connection status
    useEffect(() => {
        checkSlackConnection()
    }, [])

    const checkSlackConnection = async () => {
        setLoading(true)
        try {
            const data = await slackService.checkConnection()
            if (data.is_connected) {
                setIsConnected(true)
                setConnectionData(data)
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
        setTeamInfo(null)
    }

    const verifySlackToken = async () => {
        if (!slackToken.trim()) {
            toast.error("Please enter a bot token", errorOptions)
            return
        }

        setVerifyingToken(true)
        setTeamInfo(null)

        try {
            const data = await slackService.verifyToken(slackToken)

            if (data.ok && data.team_id && data.team) {
                setTeamInfo({
                    team_id: data.team_id,
                    team_name: data.team
                })
                toast.success(`Token verified! Workspace: ${data.team}`, successOptions)
            } else {
                toast.error(data.error || "Invalid Slack token. Please check and try again.", errorOptions)
            }
        } catch (error) {
            console.error("Error verifying token:", error)
            toast.error("Failed to verify token. Please check your internet connection.", errorOptions)
        } finally {
            setVerifyingToken(false)
        }
    }

    const handleAddToken = async () => {
        if (!slackToken.trim()) {
            toast.error("Please enter a bot token", errorOptions)
            return
        }

        if (!teamInfo) {
            toast.error("Please verify your token first", errorOptions)
            return
        }

        setTokenLoading(true)
        try {
            const data = await slackService.addToken(slackToken, teamInfo.team_id)
            setIsConnected(true)
            setConnectionData(data)
            setShowTokenDialog(false)
            setSlackToken("")
            setTeamInfo(null)
            toast.success("Slack connected successfully!", successOptions)
        } catch (error: any) {
            console.error("Error adding token:", error)
            toast.error(error.message || "An error occurred while connecting Slack", errorOptions)
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
            await slackService.disconnect()
            setIsConnected(false)
            setConnectionData(null)
            toast.success("Slack disconnected successfully", successOptions)
        } catch (error: any) {
            console.error("Error disconnecting:", error)
            toast.error(error.message || "An error occurred while disconnecting Slack", errorOptions)
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
                            Enter your Slack bot token to connect your workspace
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
                            <div className="flex gap-2">
                                <Input
                                    id="slack-token"
                                    type="password"
                                    placeholder="xoxb-your-token-here"
                                    value={slackToken}
                                    onChange={(e) => setSlackToken(e.target.value)}
                                    disabled={tokenLoading || verifyingToken}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={verifySlackToken}
                                    disabled={!slackToken.trim() || verifyingToken || tokenLoading}
                                    variant="outline"
                                    size="default"
                                >
                                    {verifyingToken ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Verify"
                                    )}
                                </Button>
                            </div>
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

                        {/* Team Info Display */}
                        {teamInfo && (
                            <Alert className="border-green-200 bg-green-50">
                                <Check className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <div className="space-y-1">
                                        <div><strong>Workspace:</strong> {teamInfo.team_name}</div>
                                        <div className="text-xs"><strong>Team ID:</strong> {teamInfo.team_id}</div>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowTokenDialog(false)
                                setTeamInfo(null)
                                setSlackToken("")
                            }}
                            disabled={tokenLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddToken}
                            disabled={tokenLoading || !teamInfo}
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
