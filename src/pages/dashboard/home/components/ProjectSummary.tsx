
import { Card, CardTitle } from "@/components/ui/card";
import { Briefcase, ListChecks, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardCounts, type DashboardCounts } from "../services/dashboard_counts/FetchDashboardCounts";

interface ProjectStat {
    title: string;
    value: string;
    icon: any;
    color: string;
    trend: 'up' | 'down' | 'neutral';
    change: string;
    changeValue: string;
    description?: string;
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
        case 'up':
            return <TrendingUp className="h-3 w-3" />;
        case 'down':
            return <TrendingDown className="h-3 w-3" />;
        case 'neutral':
            return <Minus className="h-3 w-3" />;
    }
};

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
        case 'up':
            return 'text-green-600';
        case 'down':
            return 'text-red-600';
        case 'neutral':
            return 'text-yellow-600';
    }
};

const transformData = (data: DashboardCounts): ProjectStat[] => {
    return [
        {
            title: "Total Projects",
            value: String(data.total_projects.count),
            icon: Briefcase,
            color: "bg-blue-500",
            trend: data.total_projects.comparison.trend === 'growing' ? 'up' : data.total_projects.comparison.trend === 'declining' ? 'down' : 'neutral',
            change: `${data.total_projects.comparison.percentage}%`,
            changeValue: "vs last month",
            description: "This Month"
        },
        {
            title: "Tasks Completed",
            value: String(data.work_items_completed.count),
            icon: ListChecks,
            color: "bg-green-500",
            trend: data.work_items_completed.comparison.trend === 'growing' ? 'up' : data.work_items_completed.comparison.trend === 'declining' ? 'down' : 'neutral',
            change: `${data.work_items_completed.comparison.percentage}%`,
            changeValue: "vs last week",
            description: "This week"
        },
        {
            title: "Over Due Task",
            value: String(data.overdue_work_items.count),
            icon: AlertTriangle,
            color: "bg-red-500",
            trend: data.overdue_work_items.comparison.trend === 'growing' ? 'up' : data.overdue_work_items.comparison.trend === 'declining' ? 'down' : 'neutral',
            change: `${data.overdue_work_items.comparison.percentage}%`,
            changeValue: "vs last week",
            description: "Until Today"
        },
        {
            title: "Velocity",
            value: String(data.velocity.velocity),
            icon: TrendingUp,
            color: "bg-emerald-500",
            trend: data.velocity.comparison.trend === 'growing' ? 'up' : data.velocity.comparison.trend === 'declining' ? 'down' : 'neutral',
            change: `${data.velocity.comparison.percentage}%`,
            changeValue: "vs last week",
            description: "Avg task completed"
        },
    ];
}

const CountCardSkeleton = () => {
    return (
        <Card className="px-6 py-4 border shadow-none rounded-lg">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-200 animate-pulse h-9 w-9"></div>
                    <div>
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                </div>
            </div>
        </Card>
    );
};

export function ProjectSummary() {
    const [dashboardData, setDashboardData] = useState<ProjectStat[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const data = await fetchDashboardCounts();
                setDashboardData(transformData(data));
            } catch (err) {
                setError("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        getDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-5 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CountCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="grid gap-5 md:grid-cols-4">
            {dashboardData?.map((stat) => (
                <Card key={stat.title} className="px-6 py-4 border shadow-none rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                {stat.description && (
                                    <div className="text-xs text-gray-500">
                                        {stat.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-medium text-gray-900">
                            {stat.value}
                        </div>
                        <div className="text-right">
                            <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${getTrendColor(stat.trend)}`}>
                                {getTrendIcon(stat.trend)}
                                <span>{stat.change}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {stat.changeValue}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
