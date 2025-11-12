export interface Comparison {
  previous_period: number;
  difference: number;
  percentage: number;
  trend: string;
}

export interface DashboardCount {
  count: number;
  comparison: Comparison;
}

export interface Velocity {
  velocity: number;
  comparison: Comparison;
}

export interface DashboardCounts {
  total_projects: DashboardCount;
  work_items_completed: DashboardCount;
  overdue_work_items: DashboardCount;
  velocity: Velocity;
}
