//Frontend/Hirebase/hooks/UserProfileHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/config';
import { ProfileData } from '@/types';

//Hook personalizado para manejar la logica del perfil del usuario
export const UserProfileInfo = () => {
    const { user, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    //Funcion para actualizar la informacion del perfil
    const updateProfileInfo = async (data: ProfileData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await api.patch('/profile', data);
            if (res.data.success) {
                await refreshProfile(); 
                setMessage({ type: 'success', text: 'Profile updated' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar datos.' });
        } finally {
            setIsLoading(false);
        }
    };

    //Funcion para actualizar la foto de perfil
    const updateProfilePicture = async (file: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('photo', file); 

        try {
            const res = await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                await refreshProfile();
                setMessage({ type: 'success', text: 'Profile picture updated' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al subir la imagen.' });
        } finally {
            setIsLoading(false);
        }
    };

    //Funcion para actualizar el CV
    const updateCV = async (file: File) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('cv_file', file); 

        try {
            const res = await api.post('/profile/cv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                await refreshProfile();
                setMessage({ type: 'success', text: 'Currículum actualizado correctamente.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al subir el archivo PDF.' });
        } finally {
            setIsLoading(false);
        }
    };

    return { updateProfileInfo, updateProfilePicture, updateCV, isLoading, message, setMessage };
};


