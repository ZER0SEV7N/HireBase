//frontend/Hirebase/context/AuthContext.tsx
//Este archivo define el contexto de autenticacion para la aplicacion,
//proporcionando funciones para iniciar sesion, cerrar sesion y registrar usuarios,
'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/config';
import { User } from '@/types';

//estructura de datos del contexto de autenticacion
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

//Creacion del contexto de autenticacion
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//El AuthProvider es un componente que envuelve toda la app
export const AuthProvider = ({ children }: {children:React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    //Verificar el token al cargar la aplicacion
    useEffect(() => {
        checkauth();
    }, []);

    //Funcion para verificar el token almacenado en localStorage
    const checkauth = async () => {
        const token = localStorage.getItem('auth_token');
        if(!token){
            setIsLoading(false);
            return;
        }

        try{
            const res = await api.get('/profile')
            setUser(res.data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            localStorage.removeItem('auth_token');
        } finally {
            setIsLoading(false);
        }
    };

    //Funcion para refrescar el perfil del usuario, se puede usar despues de actualizar datos
    const refreshProfile = async () => {
        try{
            const res = await api.get('/profile');
            setUser(res.data.data);
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    }

    //Funcion para iniciar sesion, guarda el token y redirige segun el rol del usuario
    const login = (token: string, userData: User) => {
        localStorage.setItem('auth_token', token);
        setUser(userData);

        //Redirigir dependiendo del rol
        if(userData.role === 'admin'){
            router.push('/admin/dashboard');
        } else {
            if(!userData.cv_url)
                router.push('/profile');
            else
                router.push('/dashboard');
        }
    };

    //Funcion para cerrar sesion, elimina el token y redirige a login
    const logout = async () => {
        try{
            await api.post('/logout');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

//Hook personalizado para usar el contexto de autenticacion
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}