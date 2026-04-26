//Frontend/hirebase/components/Dashboard/ProfileDashboard.tsx
//Componente encargado de mostrar y editar la informacion del perfil del usuario
'use client';

import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { ProfileData, UserProfileInfo } from "@/hooks/UserProfileHook";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Camera, FileUp, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

//Componente principal del dashboard de perfil
export const ProfileDashboard = () => {
    const { user } = useAuth();
    const { updateProfileInfo, updateProfilePicture, updateCV, isLoading, message, setMessage } = UserProfileInfo();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileData>({
        defaultValues: {
            name: user?.name || '',
            lastname: user?.lastname || '',
            email: user?.email || '',
            DNI: user?.DNI || '',
            bio: user?.bio || '',
        }
    });

    useEffect(() => {
        if (user) reset(user);
    }, [user, reset]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            
            <div className="space-y-6 lg:col-span-1">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Camera size={18} className="text-slate-500" /> Photo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden mb-4 relative group">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-4 text-slate-300" />
                            )}
                        </div>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            className="text-xs file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md"
                            onChange={(e) => e.target.files?.[0] && updateProfilePicture(e.target.files[0])}
                            disabled={isLoading}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileUp size={18} className="text-slate-500" /> Resume (PDF)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user?.cv_url && (
                            <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">Current CV</span>
                                <a href={user.cv_url} target="_blank" className="text-xs text-blue-600 hover:underline">View</a>
                            </div>
                        )}
                        <Input 
                            type="file" 
                            accept=".pdf"
                            className="text-xs"
                            onChange={(e) => e.target.files?.[0] && updateCV(e.target.files[0])}
                            disabled={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your general data and biography.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <div className={`p-3 rounded-md text-sm mb-6 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(updateProfileInfo)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Names</Label>
                                <Input {...register('name', { required: true })} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label>Lastnames</Label>
                                <Input {...register('lastname', { required: true })} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label>DNI</Label>
                                <Input {...register('DNI', { required: true })} maxLength={9} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" {...register('email', { required: true })} disabled={isLoading} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Professional Bio</Label>
                            <Textarea 
                                {...register('bio')} 
                                className="min-h-[120px] resize-none" 
                                placeholder="Write something about your experience..."
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading} className="bg-slate-900">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}