//frontend/hirebase/components/auth/registerForm
//Componente formulario para el registro de un nuevo usuario
'use client'

import Link from "next/link"
import { useRegister, useSocialAuth } from "@/hooks/AuthHook"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "../ui/card"

export function RegisterForm() {
    const { formData, handleChange, error, isLoading, handleRegisterSubmit } = useRegister();
    const { handleSocialLogin, socialError } = useSocialAuth();

    return (
        <Card className="w-full max-w-xl shadow-lg border-slate-200">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create a new Account</CardTitle>
                <CardDescription className="text-slate-500">
                    Fill in the information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {(error || socialError) && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error || "Cannot connect with the social provider."}
                    </div>
                )}
                
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Names</Label>
                            <Input id="name" placeholder="e.g., John" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname">Last Names</Label>
                            <Input id="lastname" placeholder="e.g., Doe" value={formData.lastname} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Fila 2: Correo electrónico */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="you@company.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Fila 3: DNI y Fecha de Nacimiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="DNI">DNI</Label>
                            <Input id="DNI" maxLength={9} placeholder="Your document number" value={formData.DNI} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthdate">Birth Date</Label>
                            <Input id="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Fila 4: Especialidad y Contraseña */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hardSkill">Your Speciality or HardSkill</Label>
                            <select 
                                id="hardSkill" 
                                value={formData.hardSkill} 
                                onChange={handleChange}
                                className="flex h-9 w-full items-center justify-between rounded-md border border-slate-200 
                                bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none 
                                focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Full Stack">Full Stack</option>
                                <option value="Design">Design</option>
                                <option value="Analyst">Analyst</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" minLength={8} placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Register'}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or sign up with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleSocialLogin('google')} type="button" className="text-slate-600">
                        Google
                    </Button>
                    <Button variant="outline" onClick={() => handleSocialLogin('github')} type="button" className="text-slate-600">
                        GitHub
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
