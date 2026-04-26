//frontend/hirebase/app/dashboard/candidates/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CandidatesTable } from '@/components/Dashboard/CandidatesTable';
import { Users, Loader2 } from 'lucide-react';

export default function AdminCandidatesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    //Redirige a la página de login si no está autenticado o no es admin
    useEffect(() => {
        if (!isLoading && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    //Evita renderizar la página mientras verifica o si es un intruso
    if (isLoading || user?.role !== 'admin') {
        return (
            <div className="flex h-[50vh] justify-center items-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Users className="text-blue-600" size={32} />
                        Candidates Management
                    </h1>
                    <p className="text-slate-500 mt-1">Revise CVs, change application statuses, and manage access.</p>
                </div>
            </header>

            <main>
                <CandidatesTable />
            </main>
        </div>
    );
}