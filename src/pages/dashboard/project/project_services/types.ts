export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

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
    meeting_link: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectPayload extends Omit<Project, 'id' | 'created_at' | 'updated_at' | 'team_members'> {
    team_members: number[];
}
