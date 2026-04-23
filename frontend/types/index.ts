//frontend/hirebase/types/index.ts
//Archivo de tipos para la aplicacion
export interface User {
    id: number;
    name: string;
    lastname?: string;
    email: string;
    birthdate?: string;
    DNI?: string;
    hardSkill?: 'Frontend' | 'Backend' | 'Design' | 'Analyst' | 'Full Stack' | 'Others';
    password?: string;

    role?: 'admin' | 'user';

    profile_picture?: string;
    bio?: string;
    cv_url?: string;

    is_active: boolean;
    status?: 'Review' | 'Interview' | 'Hired' | 'Rejected';
    is_approved?: boolean;

    created_at?: string;
    updated_at?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    token?: string;
}

export type DashboardMetrics = {
    total_users: number;
    Pending_Review: number;
    In_Interview: number;
    Hired: number;
    Rejected: number;
};

export type RegistrationTrend = {
    date: string;
    count: number;
};


export interface Socialite{
    provider: 'google' | 'github' | 'linkedin';
    provider_id: string;
}