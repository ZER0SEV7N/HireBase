//frontend/Hirebase/hooks/SocialiteProfileHook.tsx
//Hook encargado de manejar la logica relacionada al perfil del usuario
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/config";
import { CompleteData } from "@/types";

export const useCompleteProfile = () => {
    const router = useRouter();
    const { user, refreshProfile } = useAuth()!;
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Inicializar el formulario con los datos del usuario si existen
    const { register, handleSubmit, formState: { errors } } = useForm<CompleteData>({
        defaultValues: {
            name: user?.name || '',
            lastname: user?.lastname || '',
        }
    });

    //Funcion para manejar el submit del formulario
    const onSubmit = async (data: CompleteData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const res = await api.post('/profile/complete', data);
            if(res.data.success){
                await refreshProfile();
                router.push('/dashboard');
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
