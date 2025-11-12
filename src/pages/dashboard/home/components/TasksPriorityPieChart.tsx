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
import { fetchWorkItemPriorityDistribution } from "../services/dashboard_work_item_by_proirity/FetchWorkItemPriorityDistribution";
import { type WorkItemPriorityDistribution } from "../services/dashboard_work_item_by_proirity/types";

const priorityColorMapping: { [key: string]: string } = {
    'high': '#F87171',
    'medium': '#FBBF24',
    'low': '#10B981',
};

const defaultColor = '#9CA3AF';

export function TasksPriorityPieChart() {
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: WorkItemPriorityDistribution[] = await fetchWorkItemPriorityDistribution();
                const seriesData = data.map((d) => d.count);
                const labelsData = data.map((d) => d.priority);
                const colorsData = labelsData.map(label => priorityColorMapping[label.toLowerCase()] || defaultColor);
                setSeries(seriesData);
                setLabels(labelsData);
                setColors(colorsData);
            } catch (error) {
                console.error("Failed to fetch work item priority distribution:", error);
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
                <CardTitle className="text-sm font-light">Tasks by Priority</CardTitle>
                <CardDescription className="text-xs py-0">
                    A breakdown of tasks by their priority level.
                </CardDescription>
            </CardHeader>
            <Separator className="py-0" />
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
