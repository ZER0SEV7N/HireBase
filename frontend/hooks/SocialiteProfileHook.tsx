//frontend/Hirebase/hooks/SocialiteProfileHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/config";
import { ProfileData } from "@/types";

export const useCompleteProfile = () => {
    const router = useRouter();
    const { user, login } = useAuth()!;
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Inicializar el formulario con los datos del usuario si existen
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
        defaultValues: {
            name: user?.name || '',
            lastname: user?.lastname || '',
        }
    });

    //Funcion para manejar el submit del formulario
    const onSubmit = async (data: ProfileData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const res = await api.put('/profile/complete', data);
            if(res.data.success){
                login(localStorage.getItem('auth_token') || '', res.data.data);
                router.push('/profile');
            }
        } catch (error: any) {
            console.error("Error to complete profile:", error);
            setSubmitError(error.response?.data?.message || "An error occurred while updating your profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return { register, handleSubmit, errors, onSubmit, submitError, isSubmitting };
};
