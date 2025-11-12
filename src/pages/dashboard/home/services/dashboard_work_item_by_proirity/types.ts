export interface WorkItemPriorityDistribution {
    priority: string;
    count: number;
}

export interface WorkItemPriorityDistributionResponse {
    priority_distribution: WorkItemPriorityDistribution[];
}
