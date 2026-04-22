//frontend/hirebase/app/auth/callback/page.tsx
//Pagina encargada de manejar el callback despues de la autenticacion social, 
//verifica el token recibido y redirige al usuario
'use client';

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/config";
import { useAuth } from "@/context/AuthContext";

//Funcion para manejar el proceso de callback despues de la autenticacion social
function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth()!;

    useEffect(() => {
        const proccessCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            //Si el usuario cancelo la autenticacion o hubo un error, redirigir al login con mensaje de error
            if(error){
                router.push(`/auth?error=${error}`);
                return;
            }

            //Si no se recibe un token, redirigir al login con mensaje de error
            if(!token){
                router.push('/auth');
                return;
            }

          try {
                localStorage.setItem('auth_token', token);

                const res = await api.get('/profile');
                const user = res.data.data; // <-- CORRECCIÓN AQUÍ

                const action = searchParams.get('action');

                if (action === 'complete_profile') {
                    router.push('/complete-profile');
                } else {
                    login(token, user);
                }

            } catch (error) {
                console.error('Error during social login callback:', error);
                localStorage.removeItem('auth_token');
                router.push('/auth?error=auth_failed'); 
            }
            
        };
        proccessCallback();
    }, [searchParams, router, login]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Verificando autenticación...</h2>
            <p className="text-sm text-slate-500 mt-2">Preparando tu entorno de trabajo, por favor espera.</p>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-pulse text-slate-500">Cargando...</div>
            </div>
        }>
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                <CallbackHandler />
            </div>
        </Suspense>
    );
}