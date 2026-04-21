//frontend/Hirebase/hooks/OnCandidateBoarding.tsx
//Hook encargado de manejar la logica relacionada al onboarding del candidato
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/config';

export type OnboardingFormData = {
  bio: string;
  cv: FileList;
};

export const useCandidateOnboarding = () => {
    const {login} = useAuth();
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<OnboardingFormData>();

    //Funcion para manejar el submit del formulario de onboarding
    const onUpload = async (data: OnboardingFormData) => {
        setIsPending(true);
        setError(null);

        try{
            const formData = new FormData();
            formData.append('bio', data.bio);
            //Si el usuario subió un CV, agregarlo al formData
            if(data.cv?.[0]) formData.append('cv', data.cv[0]);

            const res = await api.post('/candidate/onboarding', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            //Si el onboarding fue exitoso, actualizar el contexto del usuario con los nuevos datos
            if(res.data.success) login(localStorage.getItem('auth_token') || '', res.data.data);
        } catch (error: any) {
            console.error("Error during candidate onboarding:", error);
            setError(error.response?.data?.message || "An error occurred during onboarding. Please try again.");
        } finally {
            setIsPending(false);
        }

    };
 
    return { register, handleSubmit, errors, onUpload, isPending, error };
}