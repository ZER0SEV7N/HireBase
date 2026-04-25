//frontend/hirebase/app/auth/page.tsx
//Pagina principal de autenticacion, muestra el formulario de login o registro dependiendo de la ruta
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
    return (
        <div className="flex min-h-screen">
            
            <div className="hidden lg:flex w-1/2 bg-slate-950 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10 text-white max-w-lg">
                
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                        Build Your Tech Career with Us. 
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Join the platform where the best tech talents find the most innovative companies. All in one place.
                    </p>
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-50 p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-200/50">
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
            </div>
            
        </div>
    );
}