//frontend/hirebase/hooks/AuthHook.tsx
//Hook encargado de manejar la logica de autenticacion
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/config";


export const useLogin = () => {
    const { login } = useAuth()!;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //Funcion para manejar el submit
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try{
            const res = await api.post('/login', {
                email,
                password
            });
            const { token, user } = res.data.data;
            login(token, user);
        }catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        error, isLoading,
        handleSubmit
    }
};

//Hook para manejar el registro de usuarios
export const useRegister = () => {
    const { login } = useAuth()!;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        DNI: "",
        birthdate: "",
        hardSkill: 'Others', 
    });

    //Funcion para cambiar los datos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    //Funcion para manejar el submit del registro
    const handleRegisterSubmit = async (e:React.SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/register', formData);
            const { token, user } = res.data.data;
            login(token, user); //Loguearse automaticamente despues de registrarse
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData, handleChange,
        error, isLoading,
        handleRegisterSubmit
    };
};

//Hook para manejar la autentificacion social
export const useSocialAuth = () => {
    const [socialError, setSocialError] = useState<string | null>(null);

    //Funcion para manejar el inicio de sesion con proveedores sociales
    const handleSocialLogin = async (provider: string) => {
        try{
            const res = await api.get(`/auth/${provider}/redirect`);
            if (res.data.success && res.data.url)
                window.location.href = res.data.url; //Redirige al proveedor social
        }catch (error) {
            console.error('Error initiating social login:', error);
            setSocialError(`Could not connect to ${provider}. Check backend .env keys.`);
        }
    };
    return { handleSocialLogin, socialError };
}

//Hook para manejar el logout
export const useLogout = () => {
    const { logout } = useAuth()!;
    const [error, setError] = useState("");

    const handleLogout = async () => {
        try{
            await logout();
        }
        catch (error: any) {
            console.error('Logout error:', error);
            setError(error.response?.data?.message || 'An error occurred during logout');
        }
    };
    return { handleLogout, error };
}

//Hook para manejar la recuperacion de contraseña 
export const usePasswordRecovery = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordRecovery = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        try{
            const res = await api.post('/password/recover', { email });
            setMessage(res.data.message || 'If an account with that email exists, a recovery link has been sent.');
        }
        catch (error: any) {
            console.error('Password recovery error:', error);
            setError(error.response?.data?.message || 'An error occurred during password recovery');
        }
        finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        message, error, isLoading,
        handlePasswordRecovery
    };
};

//Hook para manejar el cambio de contraseña
export const usePasswordChange = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //Funcion para manejar el cambio de contraseña
    const handlePasswordReset = async (e: React.SyntheticEvent, email: string, token: string) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        try{
            const res = await api.post('/password/reset', {  
                    email: email,
                    token: token,
                    password: password,
                    password_confirmation: passwordConfirmation
                });
            setMessage(res.data.message || 'Password changed successfully');
        }
        catch (error: any) {
            console.error('Password change error:', error);
            setError(error.response?.data?.message || 'An error occurred during password change');
        }
        finally {
            setIsLoading(false);
        }
    };

    return {
        password, setPassword,
        passwordConfirmation, setPasswordConfirmation,
        message, error, isLoading,
        handlePasswordReset
    };
};
