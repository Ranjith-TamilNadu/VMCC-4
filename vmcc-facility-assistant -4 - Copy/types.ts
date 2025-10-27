export interface User {
    username: string;
    password: string; // In a real app, this would be a hash
    role: 'student' | 'admin';
}

export type CurrentUser = User | null;

export type Sender = 'user' | 'bot';

export interface ChatMessage {
    id: string;
    sender: Sender;
    text: string;
    timestamp?: string;
    reactions?: { [key: string]: number };
}

export type ProblemStatus = 'Reported' | 'In Progress' | 'Resolved' | 'Closed';
export type ProblemPriority = 'Low' | 'Medium' | 'High';

export interface Problem {
    id: string;
    description: string;
    location: string;
    priority: ProblemPriority;
    status: ProblemStatus;
    reportedAt: string;
}