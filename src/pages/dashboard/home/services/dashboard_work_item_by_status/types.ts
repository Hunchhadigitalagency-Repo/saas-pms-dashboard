export interface WorkItemStatusDistribution {
    display_status: string;
    count: number;
}

export interface WorkItemStatusDistributionResponse {
    status_distribution: WorkItemStatusDistribution[];
}
