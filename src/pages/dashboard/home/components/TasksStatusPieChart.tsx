import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Chart from "react-apexcharts";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { fetchWorkItemStatusDistribution } from "../services/dashboard_work_item_by_status/FetchWorkItemStatusDistribution";
import { type WorkItemStatusDistribution } from "../services/dashboard_work_item_by_status/types";

const statusColorMapping: { [key: string]: string } = {
    'pending': '#FBBF24',
    'inprogress': '#60A5FA',
    'completed': '#34D399',
    'overdue': '#EF4444',
};

const defaultColor = '#9CA3AF';

export function TasksStatusPieChart() {
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: WorkItemStatusDistribution[] = await fetchWorkItemStatusDistribution();
                const seriesData = data.map((d) => d.count);
                const labelsData = data.map((d) => d.display_status);
                const colorsData = labelsData.map(label => statusColorMapping[label.toLowerCase()] || defaultColor);
                setSeries(seriesData);
                setLabels(labelsData);
                setColors(colorsData);
            } catch (error) {
                console.error("Failed to fetch work item status distribution:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        chart: {
            type: "donut" as const,
        },
        labels: labels,
        colors: colors,
        legend: {
            position: "bottom" as const,
        },
        dataLabels: {
            enabled: false
        }
    };

    return (
        <Card className="border shadow-none rounded-md gap-3 py-3">
            <CardHeader className="px-4 py-0">
                <CardTitle className="text-sm font-light">Tasks by Status</CardTitle>
                <CardDescription className="text-xs">
                    A breakdown of tasks by their current status.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        <div>Loading...</div>
                    </div>
                ) : (
                    <Chart
                        options={options}
                        series={series}
                        type="donut"
                        width="100%"
                        height={250}
                    />
                )}
            </CardContent>
        </Card>
    );
}