export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile?: {
        profile_picture: string | null;
    };
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

// inherit the project and make a copy with name projectdetails
export type ProjectDetails = Project;

export interface ProjectPayload extends Omit<Project, 'id' | 'created_at' | 'updated_at' | 'team_members'> {
    team_members: number[];
}
