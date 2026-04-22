//Frontend/Hirebase/hooks/UserProfileHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/config';

//Tipo de datos para el formulario de completar perfil
export type UserProfileData = {
    name: string;
    lastname: string;
    email: string;
    DNI: string;
    bio?: string;
};

//Hook personalizado para manejar la logica del perfil del usuario
export const useUserProfile = () => {
    const { user, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    //Funcion para actualizar la informacion del perfil del usuario
    const updateProfileInfo = async (data: UserProfileData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            await api.patch('/profile', data);
            await refreshProfile(); // Actualiza el contexto con los nuevos datos
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    //Funcion para actualizar la foto de perfil del usuario
    const updateProfilePicture = async (fileList: FileList) => {
        if (!fileList || fileList.length === 0) return;
        setIsLoading(true);
        setMessage(null);
        
        try {
            const formData = new FormData();
            formData.append('photo', fileList[0]); 

            await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await refreshProfile();
            setMessage({ type: 'success', text: 'Profile picture updated.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update picture.' });
        } finally {
            setIsLoading(false);
        }
    };

    return { updateProfileInfo, updateProfilePicture, isLoading, message, setMessage };
};