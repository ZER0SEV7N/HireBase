//frontend/hirebase/app/admin/page.tsx
//Pagina principal del admin, muestra la tabla de candidatos registrados
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, Activity } from 'lucide-react';

export default function AdminCandidatesPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome, {user?.name}
                </h1>
                <p className="text-slate-500 mt-1">These are the key metrics for your hiring process.</p>
            </div>

            {/* Tarjetas de Métricas (Placeholder) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900"></div>
                        <p className="text-xs text-emerald-600 mt-1 font-medium"></p>
                    </CardContent>
                </Card>
                
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Card className="h-96 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50">
                    <Activity className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium"></p>
                </Card>
            </div>
        </div>
    );
}