//frontend/hirebase/app/auth/page.tsx
//Pagina principal de autenticacion, muestra el formulario de login o registro dependiendo de la ruta
import { LoginForm } from "@/components/auth/loginform";
import { RegisterForm } from "@/components/auth/registerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="login" className="w-full max-w-xl">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Create Account</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="focus-visible:outline-none">
                    <LoginForm />
                </TabsContent>

                <TabsContent value="register" className="focus-visible:outline-none">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
