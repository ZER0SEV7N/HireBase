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
    DNI: string;
    hardSkill: 'Frontend' | 'Backend' | 'Design' | 'Analyst' | 'Full Stack' | 'Others';
    profile_picture?: FileList;
};

export const useUserProfile = () => {
    const { user, login} = useAuth();
    const [ loading, setLoading ] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileData>({
        defaultValues: {
            name: user?.name || '',
            lastname: user?.lastname || '',
            'DNI': user?.DNI || '',
            'hardSkill': user?.hardSkill || 'Others',
        }
    });

    const updateProfile = async (data: UserProfileData) => {
        setLoading(true);

        try{
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('lastname', data.lastname);
            formData.append('DNI', data.DNI);
            formData.append('hardSkill', data.hardSkill);

            //Si el usuario subió una foto de perfil, agregarla al formData
            if(data.profile_picture?.[0]) formData.append('profile_picture', data.profile_picture[0]);

            const res = await api.put('/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if(res.data.success) login(localStorage.getItem('auth_token') || '', res.data.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);

        }
    };

    return { register, handleSubmit, errors, updateProfile, loading };
}