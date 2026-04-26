//frontend/Hirebase/components/Dashboard/ProfileSettings.tsx
//Componente para mostrar y editar la informacion del perfil del usuario en el dashboard
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProfileInfo } from '@/hooks/UserProfileHook';
import { Button } from '@/components/ui/button';
import { Camera, Save, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

//Componente principal para mostrar y editar la informacion del perfil del usuario
export function ProfileSettings () {
    const { user, refreshProfile } = useAuth();
    const { updateProfileInfo, updateProfilePicture, updateCV, isLoading, message, setMessage } = UserProfileInfo();

    const photoInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    //Estado para manejar el formulario de edicion de perfil
    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        DNI: user?.DNI || '',
        hardSkill: user?.hardSkill || '',
        bio: user?.bio || ''
    });

    //Limpiar mensajes despues de 5 segundos
    useEffect(() => {
        if(message){
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    //Funcion para cambiar la foto de perfil
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) await updateProfilePicture(file);
    };

    //Funcion para cambiar el CV
    const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) await updateCV(file);
    };

    //Funcion para manejar el submit del formulario de edicion de perfil
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await updateProfileInfo(formData);
    };

    if (!user) return null

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 max-w-4xl mx-auto">
            
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8 pb-8 border-b border-slate-100">
                
                <div className="relative group shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center">
                        {isLoading && !message ? (
                            <Loader2 className="animate-spin text-slate-400" size={32} />
                        ) : user.profile_picture ? (
                            <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-slate-400">{user.name.charAt(0)}</span>
                        )}
                    </div>
                    <button 
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        <Camera size={18} />
                    </button>
                    <input type="file" ref={photoInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoChange} />
                </div>

                <div className="text-center md:text-left flex-1 pt-2 w-full">
                    <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-slate-500 mt-1 mb-4">Update your photo and personal details here.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        {user.role === 'admin' ? (
                            <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider items-center h-8">
                                Administrator
                            </span>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => cvInputRef.current?.click()} disabled={isLoading} className="border-slate-300">
                                    <FileText size={16} className="mr-2" /> 
                                    {user.cv_url ? 'Update Curriculum (PDF)' : 'Upload Curriculum'}
                                </Button>
                                <input type="file" ref={cvInputRef} className="hidden" accept="application/pdf" onChange={handleCVChange} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">First Name</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Last Name</label>
                        <input type="text" required value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    
                    {user.role !== 'admin' && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Specialty</label>
                            <select value={formData.hardSkill} onChange={e => setFormData({...formData, hardSkill: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option value="">Select your area</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Full Stack">Full Stack</option>
                                <option value="Design">Design</option>
                                <option value="Analyst">Analyst</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">About Me (Bio)</label>
                    <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about your experience and goals..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="px-8 bg-blue-600 hover:bg-blue-700">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}