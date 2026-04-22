//frontend/Hirebase/components/admin/CandidatesTable.tsx
//Componente encargado de mostrar la tabla de candidatos registrados para el admin
'use client';

import { useState } from 'react';
import { AdminDashboard } from '@/hooks/AdminHook';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, UserMinus, UserCheck, Loader2 } from 'lucide-react';

//Componente principal de la tabla de candidatos
export const CandidatesTable = () => {
    const { candidates, isLoading, actionLoading, changeStatus, toggleActive } = AdminDashboard();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) 
        return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
    
    //Funcion para abrir el modal de confirmacion de desactivacion
    const openDeactivateModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    //Funcion para confirmar la desactivacion del candidato
    const handleConfirmDeactivate = async () => {
        if (selectedUser) {
            await toggleActive(selectedUser.id);
            setIsModalOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Candidate</th>
                            <th className="px-6 py-4">Specialty</th>
                            <th className="px-6 py-4 text-center">Curriculum</th>
                            <th className="px-6 py-4">Process Status</th>
                            <th className="px-6 py-4 text-right">Account Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No candidates found</td>
                            </tr>
                        ) : (
                            candidates.map((candidato) => (
                                <tr key={candidato.id} className={`hover:bg-slate-50 transition-colors ${!candidato.is_active ? 'opacity-60 bg-slate-100' : ''}`}>

                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                                            {candidato.profile_picture ? (
                                                <img src={candidato.profile_picture} alt="Perfil" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-slate-500">{candidato.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{candidato.name} {candidato.lastname}</p>
                                            <p className="text-xs text-slate-500">{candidato.email} • DNI: {candidato.DNI || 'N/A'}</p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {candidato.hardSkill || 'No definida'}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {candidato.cv_url ? (
                                            <a href={candidato.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full transition-colors font-medium">
                                                <FileText size={14} /> See CV
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">Sin CV</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <select 
                                            value={candidato.status}
                                            onChange={(e) => changeStatus(candidato.id, e.target.value)}
                                            disabled={actionLoading === candidato.id || !candidato.is_active}
                                            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 disabled:opacity-50"
                                        >
                                            <option value="Review">In Review</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Hired">Hired</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        {candidato.status === 'Rejected' && candidato.is_active && (
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="bg-red-500 hover:bg-red-600"
                                                onClick={() => openDeactivateModal(candidato)}
                                                disabled={actionLoading === candidato.id}
                                            >
                                                <UserMinus size={14} className="mr-1" /> Deactivate
                                            </Button>
                                        )}

                                        {!candidato.is_active && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                onClick={() => toggleActive(candidato.id)}
                                                disabled={actionLoading === candidato.id}
                                            >
                                                <UserCheck size={14} className="mr-1" /> Reactivate
                                            </Button>
                                        )}
                                        
                                        {candidato.status !== 'Rejected' && candidato.is_active && (
                                            <span className="text-xs text-slate-400 italic">In active process</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <UserMinus size={20} /> Deactivate Account
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            You are about to deactivate the account of <strong>{selectedUser?.name} {selectedUser?.lastname}</strong>. 
                            The candidate will no longer be able to log in to HireBase.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDeactivate} className="bg-red-600 hover:bg-red-700">
                            Yes, deactivate candidate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}