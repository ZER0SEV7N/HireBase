//frontend/hirebase/app/admin/page.tsx
//Pagina principal del admin, muestra la tabla de candidatos registrados
import { useAuth } from '@/context/AuthContext';
import MetricsCharts from '@/components/admin/MetricsCharts';
import { LayoutDashboard } from 'lucide-react';

export default function AdminCandidatesPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <LayoutDashboard className="text-blue-600" size={32} />
                    Welcome, {user?.name}
                </h1>
                <p className="text-slate-500 mt-1">Overview and general metrics of HireBase platform.</p>
            </header>

            <main>
                <MetricsCharts />
            </main>
        </div>
    );
}