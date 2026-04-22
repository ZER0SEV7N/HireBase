//Frontend/Hirebase/hooks/AdminHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/config';
import { User } from '@/types';

export const AdminDashboard = () => {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    //Funcion para obtener la lista de candidatos registrados
    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        try{
            const res = await api.get('/users');
            if(res.data.success)
                setCandidates(res.data.data);

        }catch(error){
            console.error('Error fetching candidates:', error);
        }finally{
            setIsLoading(false);
        }
    }, []);

    //Funcion para cambiar el estado de un candidato
    const changeStatus = async (id:number, newStatus: string) => {
        setActionLoading(id);
        try{
            const res = await api.patch(`/users/${id}/status`, { status: newStatus });
            if(res.data.success)
                setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));

        }catch(error){
            console.error('Error updating candidate status:', error);
        }finally{
            setActionLoading(null);
        }
    }

    //Funcion para activar/desactivar un candidato al ser rechazado
    const toggleActive = async (id:number) => {
        setActionLoading(id);
        try {
            const response = await api.patch(`/users/${id}/toggle-active`);
            if (response.data.success) {
                setCandidates(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
            }
        } catch (error) {
            console.error('Error toggling active status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    return { candidates, isLoading, actionLoading, changeStatus, toggleActive };
};