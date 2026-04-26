//Frontend/hirebase/app/dashboard/layout.tsx
//Este archivo define el diseño de la página del dashboard, incluyendo la barra lateral y el área principal de contenido.
'use client';

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, User, Briefcase, Bell, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

//Componente de diseño para el dashboard
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    //Proteger la ruta del dashboard
    useEffect(() => {
        if(!user && !isLoading) 
            router.push("/auth");
    }, [user, router, isLoading]);

    if(isLoading) 
        return <div className="flex h-screen items-center justify-center"> <Loader2 className="animate-spin text-blue-600" size={40}/> </div>;

    if (!user) return null;

    //Manejar el cierre de sesión
    const handleLogout = async () => await logout();

    //Obtener el admin
    const isAdmin = user?.role === "admin";

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            
            {/* SIDEBAR INTELIGENTE */}
            <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col transition-all duration-300 hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                    <span className="text-xl font-bold text-white tracking-tight">
                        Hire<span className="text-blue-500">Base</span> 
                    </span>
                    {isAdmin && (
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2 uppercase">Administration</span>
                    )}
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">

                    {isAdmin ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                            <Link href="/dashboard/candidates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                                <Users size={20} />
                                Candidates
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                                <User size={20} />
                                Profile
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">

                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white truncate w-32">{user.name}</span>
                            <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                        </div>

                    </div>

                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <LogOut size={18} className="mr-2" />
                        Logout
                    </Button>
                    
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )

}