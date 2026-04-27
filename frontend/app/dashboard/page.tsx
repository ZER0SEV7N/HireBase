//frontend/Hirebase/app/Dashboard/page.tsx
//Pagina principal del dashboard, muestra un mensaje de bienvenida y el estado del perfil del usuario
'use client';

import { useAuth } from '@/context/AuthContext';
import OnBoardingForm from '@/components/Dashboard/BoardingForm';
import MetricsCharts  from '@/components/Dashboard/MetricsCharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { User, LayoutDashboard, Briefcase, Bell } from 'lucide-react';

//Componente principal del dashboard
export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    //Si el perfil del usuario no esta completo, mostrar el formulario de onboarding
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
                    <p className="text-sm font-medium text-slate-500">Please wait one moment...</p>
                </div>
            </div>
        );
    }

    //Vista de administador
    if (user?.role === 'admin') {
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


    //Vista de candidato
    //Si el usuario no ha completado su perfil, mostrar el formulario de onboarding
    const needsOnboarding = !user?.cv_url || !user?.bio;

    //Si necesita completar el perfil, mostrar el formulario, sino mostrar el dashboard
    const getStatusVariant = (status?: string) => {
        switch (status) {
            case 'Hired': return 'default';
            case 'Rejected': return 'destructive';
            case 'Interview': return 'secondary';
            default: return 'outline'; 
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
                
                <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Hello, {user?.name}!
                        </h1>
                        <p className="text-slate-500">
                            Manage your professional profile and check the status of your applications.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Current Status:
                        </span>
                        <Badge variant={getStatusVariant(user?.status)} className="px-3 py-1 capitalize">
                            {user?.status || 'Under Review'}
                        </Badge>
                    </div>
                    
                </header>

                {needsOnboarding ? (
                    <div className="max-w-3xl mx-auto mt-8">
                        <div className="mb-6 text-center space-y-2">
                            <h2 className="text-xl font-semibold text-slate-800">Almost ready to get started</h2>
                            <p className="text-slate-500">Complete these last details so recruiters can see your profile.</p>
                        </div>
                        <OnBoardingForm />
                    </div>
                ) : (
                    <Tabs defaultValue="profile" className="w-full space-y-6">
                        
                        <div className="flex justify-center md:justify-start">
                            <TabsList className="bg-white border border-slate-200 p-1 h-12 shadow-sm rounded-xl">
                                <TabsTrigger value="profile" className="rounded-lg px-6 flex gap-2">
                                    <User size={16} /> Profile
                                </TabsTrigger>
                                <TabsTrigger value="applications" className="rounded-lg px-6 flex gap-2">
                                    <Briefcase size={16} /> Applications
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="rounded-lg px-6 flex gap-2">
                                    <Bell size={16} /> Notifications
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="applications" className="mt-0 focus-visible:outline-none">
                            <Card className="p-12 border-2 border-dashed border-slate-200 bg-white/50 text-center rounded-2xl">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-slate-100 rounded-full text-slate-400">
                                        <LayoutDashboard size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-slate-700">Your application is in progress</h3>
                                        <p className="text-slate-500 max-w-xs mx-auto">
                                            Currently, our recruitment team is reviewing your profile. We will notify you of any changes here.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                                {/* Traducido al inglés */}
                                <p className="text-slate-500 font-medium">You don't have new notifications at the moment.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}