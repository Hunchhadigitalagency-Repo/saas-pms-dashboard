
export interface TeamMember {
    user: User;
    role: string;
}

export interface Project {
    id: number;
    team_members: TeamMember[];
    name: string;
    priority: string;
    status: string;
    due_date: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}
