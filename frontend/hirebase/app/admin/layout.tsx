//frontend/hirebase/app/admin/layout.tsx
//Layout para la seccion de administrador
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, Briefcase, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function adminLayout({ children}: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    //Proteger la ruta
    useEffect(() => {
        if(!user || user.role !== 'admin') 
            router.push('/auth');
    }, [user, router]);

    //Si el usuario no es admin, no renderizar nada
    if(!user || user.role !== 'admin') return null;

    //Funcion para cerrar sesion
    const handleLogout = async () => {
        await logout();
        router.push('/auth');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            
            <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col transition-all duration-300 hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                    <span className="text-xl font-bold text-white tracking-tight">Hire<span className="text-blue-500">Base</span> 
                    <span className="text-xs font-normal bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-1">ADMINISTRATOR</span></span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/10 text-blue-500 font-medium transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/candidates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <Users size={20} />
                        Candidates
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white truncate w-32">{user.name}</span>
                            <span className="text-xs text-slate-500">Administrator</span>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <LogOut size={18} className="mr-2" />
                        Log Out
                    </Button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>

        </div>
    );
}
