//frontend/hirebase/components/auth/CompleteProfile.tsx
//Componente para completar el perfil despues del registro, utiliza el hook useCompleteProfile para manejar la logica
'use client';

import { useCompleteProfile } from '@/hooks/SocialiteProfileHook';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompleteProfile() {
    const { user } = useAuth();
    const { register, handleSubmit, errors, onSubmit, submitError, isSubmitting } = useCompleteProfile();

    return (
        <Card className="w-full max-w-xl shadow-lg border-slate-200">
            <CardHeader className="space-y-1 text-center bg-slate-900 text-white rounded-t-xl pb-8 pt-10">
                <CardTitle className="text-3xl font-bold tracking-tight">Last step</CardTitle>
                <CardDescription className="text-slate-300 text-base mt-2">
                    Hi {user?.name || 'Newcomer'}. Please finish setting up your profile.
                </CardDescription>
            </CardHeader>      

            <CardContent className="p-8">
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {submitError}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Names <span className="text-red-500">*</span></Label>
                            <Input 
                                id="name" 
                                placeholder="Your real names" 
                                {...register("name", { required: "The name is required" })} 
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastname">Last Names <span className="text-red-500">*</span></Label>
                            <Input 
                                id="lastname" 
                                placeholder="Your last names" 
                                {...register("lastname", { required: "The last name is required" })} 
                            />
                            {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
                        </div>
                    </div>

                    {/* Fila 2: DNI y Fecha de Nacimiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="DNI">Document (DNI) <span className="text-red-500">*</span></Label>
                            <Input 
                                id="DNI" 
                                placeholder="Ej. 12345678" 
                                maxLength={8}
                                {...register("DNI", { 
                                    required: "The DNI is required", 
                                    minLength: { value: 8, message: "Must have 8 digits" } 
                                })} 
                            />
                            {errors.DNI && <p className="text-red-500 text-xs">{errors.DNI.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birthdate">Birth Date <span className="text-red-500">*</span></Label>
                            <Input 
                                id="birthdate" 
                                type="date" 
                                {...register("birthdate", { required: "The birth date is required" })} 
                            />
                            {errors.birthdate && <p className="text-red-500 text-xs">{errors.birthdate.message}</p>}
                        </div>
                    </div>

                    {/* Fila 3: Especialidad */}
                    <div className="space-y-2">
                        <Label htmlFor="hardSkill">Your Specialization <span className="text-red-500">*</span></Label>
                        <select 
                            id="hardSkill" 
                            {...register("hardSkill", { required: "Select a specialization" })}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
                        >
                            <option value="">Select an area...</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Full Stack">Full Stack</option>
                            <option value="Design">Design</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Others">Others</option>
                        </select>
                        {errors.hardSkill && <p className="text-red-500 text-xs">{errors.hardSkill.message}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-lg mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Start using HireBase'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}