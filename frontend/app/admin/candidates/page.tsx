//frontend/hirebase/app/admin/candidates/page.tsx
import { CandidatesTable } from '@/components/admin/CandidatesTable';
import { Users } from 'lucide-react';

export default function AdminCandidatesPage() {
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