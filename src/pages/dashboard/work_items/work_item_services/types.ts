export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface ProjectLite {
    id: number;
    name: string;
}

export interface WorkItem {
    id: number;
    assigned_to: User[];
    title: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    project: ProjectLite;
}

// Payload for create/update from forms
export interface WorkItemWrite {
    title: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
    project: number;
    assigned_to: number[];
}
