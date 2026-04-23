//Frontend/Hirebase/hooks/AdminHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/config';
import { DashboardMetrics, RegistrationTrend } from '@/types';

//Hook personalizado para manejar la logica del perfil del usuario
export const DashboardMetricsHook = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [trend, setTrend] = useState<RegistrationTrend[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    //Funcion para obtener las metricas del dashboard
    const fetchMetrics = useCallback(async () => {
        setIsLoading(true);
        try{
            const res = await api.get('/dashboard/metrics');
            if(res.data.success){
                setMetrics(res.data.data.metrics);
                setTrend(res.data.data.trend);
            }
        }catch(error){
            console.error('Error fetching dashboard metrics:', error);
        }finally{
            setIsLoading(false);
        }
    }, []);

    //Obtener las metricas al cargar el componente
    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return { metrics, trend, isLoading };
}