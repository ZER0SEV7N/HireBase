//frontend/Hirebase/hooks/BoardingHook.tsx
//Hook encargado de manejar la logica relacionada al onboarding del candidato
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/config';

export type BoardingFormData = {
  bio: string;
  cv: FileList;
};

export const CandidateOnboarding = () => {
    const { user, refreshProfile } = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<BoardingFormData>();

    //Funcion para manejar el submit del formulario de onboarding
    const onUpload = async (data: BoardingFormData) => {
        setIsPending(true);
        setError(null);

        try{
            if (data.cv && data.cv.length > 0) {
                const cvFormData = new FormData();
                cvFormData.append('cv_file', data.cv[0]); 

                await api.post('/profile/cv', cvFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            //Actualizar la Biografía del usuario
            await api.patch('/profile', {
                name: user?.name,
                lastname: user?.lastname,
                email: user?.email,
                DNI: user?.DNI,
                bio: data.bio
            });

            //Recargar el usuario global para que desaparezca el formulario
            await refreshProfile();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred while uploading your data.");
        } finally {
            setIsPending(false);
        }
    };

    return { register, handleSubmit, errors, onUpload, isPending, error };
};