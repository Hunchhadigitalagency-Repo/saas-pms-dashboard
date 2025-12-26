import { AlertCircle, Copy, CheckCircle2, Github, ExternalLink, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchActivityLogs, generateWebhookUrl } from "../../services/FetchActivityLogs";
import type { ActivityLogData } from "../../services/FetchActivityLogs";

export function ActivityTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityLogData[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<ActivityLogData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [webhookUrl, setWebhookUrl] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const loadActivityLogs = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setLoading(true);
            }
            const logs = await fetchActivityLogs(projectId!);
            setAllActivityLogs(logs || []);
            setFilteredLogs(logs || []);
            setError(null);
        } catch (err) {
            console.error("Error loading activity logs:", err);
            setAllActivityLogs([]);
            setFilteredLogs([]);
            setError("Failed to load activity logs");
        } finally {
            if (isRefresh) {
                setIsRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!projectId) return;
        console.log(error)
        // Generate webhook URL
        const url = generateWebhookUrl(projectId);
        setWebhookUrl(url);

        loadActivityLogs();
    }, [projectId]);

    // Filter logs based on date range
    useEffect(() => {
        let filtered = allActivityLogs;

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            filtered = filtered.filter(log => new Date(log.created_at) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(log => new Date(log.created_at) <= end);
        }

        setFilteredLogs(filtered);
    }, [startDate, endDate, allActivityLogs]);

    const copyWebhookUrl = () => {
        if (webhookUrl) {
            navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const resetDateFilters = () => {
        setStartDate("");
        setEndDate("");
    };

    if (loading) {
        return (
            <Card className="rounded-lg shadow-none bg-white border-0 p-0">
                <CardContent className="p-0">
                    <div className="space-y-4">
                        {[1, 2, 3].map((idx) => (
                            <div key={idx} className="border-l-4 border-blue-200 px-4 py-4 bg-gray-50 rounded animate-pulse">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 w-full">
                                        {/* Header skeleton */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                            <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                            <div className="h-5 w-32 bg-blue-200 rounded-full"></div>
                                            <div className="h-4 w-32 bg-gray-300 rounded ml-auto"></div>
                                        </div>

                                        {/* Content skeleton */}
                                        <div className="text-xs text-gray-700 space-y-2 mt-3 bg-white rounded p-3 border border-gray-200">
                                            {/* Commit message skeleton */}
                                            <div className="pb-2 border-b border-gray-200">
                                                <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                                                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                                            </div>

                                            {/* Details grid skeleton */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                                </div>
                                                <div>
                                                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                                </div>
                                                <div>
                                                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                                </div>
                                                <div>
                                                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                                                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>

                                            {/* Files section skeleton */}
                                            <div className="pt-2 border-t border-gray-200">
                                                <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
                                                <div className="flex flex-wrap gap-1">
                                                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                                                    <div className="h-6 w-28 bg-gray-300 rounded"></div>
                                                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                                                </div>
                                            </div>

                                            {/* Button skeleton */}
                                            <div className="pt-3 border-t border-gray-200">
                                                <div className="h-8 w-48 bg-gray-300 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (allActivityLogs.length === 0) {
        return (
            <Card className="shadow-none bg-white border-0">
                <CardContent className="py-8">
                    <div className="text-center space-y-6">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-4">
                                No activity logs yet. Set up GitHub webhook to track commits.
                            </p>

                            {/* Task Status Update Instructions */}
                            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200 text-left">
                                <p className="text-xs font-semibold text-gray-700 mb-3">
                                    📋 Task Status Update - Commit Message Structure
                                </p>
                                <p className="text-xs text-gray-600 mb-3">
                                    To update task status, use this commit message format:
                                </p>
                                <div className="bg-white rounded p-3 mb-3 border border-gray-300">
                                    <code className="text-xs font-mono text-gray-800 block break-words">
                                        WI-12:#done WI-15:#inprogress WI-18:#pending Finalizing multiple features
                                    </code>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-600">
                                        <strong>Format:</strong> WI-[ID]:#[status] ... [commit message]
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        <strong>Available Status:</strong>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">completed</span>
                                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">inprogress</span>
                                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">pending</span>
                                    </div>
                                </div>
                            </div>

                            {webhookUrl && (
                                <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
                                    <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        GitHub Webhook URL
                                    </p>
                                    <div className="flex items-center gap-2 bg-white rounded border border-gray-300 p-2">
                                        <code className="text-xs text-gray-600 flex-1 truncate">{webhookUrl}</code>
                                        <button
                                            onClick={copyWebhookUrl}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors text-xs font-medium"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        Copy this URL and add it to your GitHub repository webhook settings with Content type : application/json to track push events.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-lg shadow-none bg-white border-0 p-0">
            <CardContent className="p-0">
                {/* Task Status Update Instructions */}
                <div className="bg-blue-50 rounded-t-lg p-4 border-b border-blue-200">
                    <p className="text-xs font-semibold text-gray-700 mb-3">
                        📋 Task Status Update - Commit Message Structure
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                        To update task status, use this commit message format:
                    </p>
                    <div className="bg-white rounded p-3 mb-3 border border-gray-300">
                        <code className="text-xs font-mono text-gray-800 block break-words">
                            WI-12:#done WI-15:#inprogress WI-18:#pending Finalizing multiple features
                        </code>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-600">
                            <strong>Format:</strong> WI-[ID]:#[status] ... [commit message]
                        </p>
                        <p className="text-xs text-gray-600">
                            <strong>Available Status:</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">completed</span>
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">inprogress</span>
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">pending</span>
                        </div>
                    </div>
                </div>

                {/* Date Filter Section */}
                <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 flex-wrap justify-between">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Start date"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="End date"
                                />
                                {(startDate || endDate) && (
                                    <button
                                        onClick={resetDateFilters}
                                        className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-sm transition-colors font-medium"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-600 font-medium">
                                {filteredLogs.length} of {allActivityLogs.length}
                            </div>
                            <button
                                onClick={() => loadActivityLogs(true)}
                                disabled={isRefreshing}
                                className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-sm transition-colors font-medium"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>                    {/* No results after filtering */}
                {filteredLogs.length === 0 && allActivityLogs.length > 0 ? (
                    <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No activity logs found for the selected date range.</p>
                    </div>
                ) : (
                    <div className="space-y-4 p-0 py-3">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="border-l-4 border-blue-500 px-4 py-4 bg-gradient-to-r from-blue-50 to-white rounded hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Header with event type and repository */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Github className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            <p className="text-sm font-semibold text-gray-800">
                                                {log.activity.event_type === 'github_push' ? 'Push Event' : 'Activity'}
                                            </p>
                                            {log.activity.repository && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    📦 {log.activity.repository}
                                                </span>
                                            )}
                                            <div className="text-xs flex gap-2 text-gray-500 text-right flex-shrink-0 whitespace-nowrap ml-auto">
                                                <p className="font-medium">{new Date(log.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                <p>{new Date(log.created_at).toLocaleTimeString()}</p>
                                            </div>
                                        </div>

                                        {log.activity.head_commit && (
                                            <div className="text-xs text-gray-700 space-y-2 mt-3 bg-white rounded p-3 border border-blue-100">
                                                {/* Commit message */}
                                                <div className="pb-2 border-b border-gray-200">
                                                    <p className="font-semibold text-gray-900 line-clamp-2">
                                                        {log.activity.head_commit.message}
                                                    </p>
                                                </div>

                                                {/* Commit details grid */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <strong>Branch:</strong>
                                                        </p>
                                                        <p className="text-gray-800 font-medium">
                                                            🌿 {log.activity.branch || 'Unknown'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <strong>Author:</strong>
                                                        </p>
                                                        <p className="text-gray-800 font-medium">
                                                            👤 {log.activity.head_commit.author?.name || log.activity.pusher || 'Unknown'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <strong>Commit:</strong>
                                                        </p>
                                                        <code className="inline-block bg-gray-200 px-2 py-1 rounded font-mono text-gray-800">
                                                            {log.activity.head_commit.id?.substring(0, 7) || 'Unknown'}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <strong>Email:</strong>
                                                        </p>
                                                        <p className="text-gray-800 text-xs truncate" title={log.activity.head_commit.author?.email}>
                                                            {log.activity.head_commit.author?.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Modified files */}
                                                {log.activity.head_commit.modified && log.activity.head_commit.modified.length > 0 && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-gray-600 font-medium mb-1">
                                                            📝 Modified Files ({log.activity.head_commit.modified.length}):
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {log.activity.head_commit.modified.map((file, idx) => (
                                                                <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                                    {file.split('/').pop()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Added files */}
                                                {log.activity.head_commit.added && log.activity.head_commit.added.length > 0 && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-gray-600 font-medium mb-1">
                                                            ➕ Added Files ({log.activity.head_commit.added.length}):
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {log.activity.head_commit.added.map((file, idx) => (
                                                                <span key={idx} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                                    {file.split('/').pop()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Removed files */}
                                                {log.activity.head_commit.removed && log.activity.head_commit.removed.length > 0 && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-gray-600 font-medium mb-1">
                                                            🗑️ Removed Files ({log.activity.head_commit.removed.length}):
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {log.activity.head_commit.removed.map((file, idx) => (
                                                                <span key={idx} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                                                    {file.split('/').pop()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* View commit button */}
                                                {log.activity.head_commit.url && (
                                                    <div className="pt-3 border-t border-gray-200">
                                                        <a
                                                            href={log.activity.head_commit.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-xs font-medium"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            View Commit on GitHub
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
