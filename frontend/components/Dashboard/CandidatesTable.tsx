//frontend/Hirebase/components/admin/CandidatesTable.tsx
//Componente encargado de mostrar la tabla de candidatos registrados para el admin
'use client';

import { useState } from 'react';
import { AdminDashboard } from '@/hooks/AdminHook';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, UserMinus, UserCheck, Loader2, Eye, Mail, CreditCard, Calendar, UserX } from 'lucide-react';

//Componente principal de la tabla de candidatos
export const CandidatesTable = () => {
    const { candidates, isLoading, actionLoading, changeStatus, toggleActive } = AdminDashboard();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<'details' | 'deactivate' | null>(null);

    if (isLoading) 
        return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
    
    //Funcion para abrir el modal de confirmacion de desactivacion
    const openDeactivateModal = (user: User) => {
        setSelectedUser(user);
        setModalType('deactivate');
    };

    //Funcion para abrir el modal de detalles del candidato
    const openDetailsModal = (user: User) => {
        setSelectedUser(user);
        setModalType('details');
    };

    //Funcion para cerrar cualquier modal   
    const closeModal = () => {
        setModalType(null);
        setTimeout(() => setSelectedUser(null), 200); 
    };

    //Funcion para confirmar desactivación
    const handleConfirmDeactivate = async () => {
        if (selectedUser) {
            await toggleActive(selectedUser.id);
            closeModal();
        }
    };

    //Funcion Helper para mostrar el badge de estado del proceso de selección
    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Hired': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Hired</Badge>;
            case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
            case 'Interview': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Interview</Badge>;
            default: return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Review</Badge>;
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
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300 shrink-0">
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

                                    <td className="px-6 py-4 space-y-2">
                                        <div className="mb-2">{getStatusBadge(candidato.status)}</div>
                                        <select 
                                            value={candidato.status}
                                            onChange={(e) => changeStatus(candidato.id, e.target.value)}
                                            disabled={actionLoading === candidato.id || !candidato.is_active}
                                            className="bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 disabled:opacity-50"
                                        >
                                            <option value="Review">In Review</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Hired">Hired</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full justify-center"
                                                onClick={() => openDetailsModal(candidato)}
                                            >
                                                <Eye size={14} className="mr-2" /> Details
                                            </Button>

                                            {candidato.status === 'Rejected' && candidato.is_active && (
                                                <Button variant="destructive" size="sm" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => openDeactivateModal(candidato)} disabled={actionLoading === candidato.id}
                                                >
                                                    <UserMinus size={14} className="mr-2" /> Deactivate
                                                </Button>
                                            )}

                                            {!candidato.is_active && (
                                                <Button variant="outline" size="sm" className="w-full justify-center text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                    onClick={() => toggleActive(candidato.id)} disabled={actionLoading === candidato.id}
                                                >
                                                    <UserCheck size={14} className="mr-2" /> Reactivate
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={modalType !== null} onOpenChange={(open) => !open && closeModal()}>
                
                {modalType === 'deactivate' && (
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
                            <Button variant="outline" onClick={closeModal}>Cancel</Button>
                            <Button variant="destructive" onClick={handleConfirmDeactivate} className="bg-red-600 hover:bg-red-700">
                                Yes, deactivate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}

                {modalType === 'details' && selectedUser && (
                    <DialogContent className="sm:max-w-[600px] bg-slate-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                {selectedUser.name} {selectedUser.lastname}
                                {getStatusBadge(selectedUser.status)}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 text-base">
                                Application details and professional profile.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                                    <Mail className="text-slate-400 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                                        <p className="text-sm font-medium">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                                    <CreditCard className="text-slate-400 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Document (DNI)</p>
                                        <p className="text-sm font-medium">{selectedUser.DNI || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                                    <Calendar className="text-slate-400 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Birthdate</p>
                                        <p className="text-sm font-medium">{selectedUser.birthdate || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3 shadow-sm">
                                    <FileText className="text-slate-400 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Specialty</p>
                                        <p className="text-sm font-medium">{selectedUser.hardSkill || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-900">About the Candidate</h4>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-600 min-h-[100px] max-h-[150px] overflow-y-auto shadow-sm">
                                    {selectedUser.bio ? selectedUser.bio : <span className="italic text-slate-400">This candidate hasn't written a biography yet.</span>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200">
                                
                                {selectedUser.cv_url ? (
                                    <Button variant="outline" className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                                        <a href={selectedUser.cv_url} target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-2 h-4 w-4" /> View Resume
                                        </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled className="w-full sm:w-auto">
                                        <FileText className="mr-2 h-4 w-4" /> No Resume Uploaded
                                    </Button>
                                )}

                                <div className="flex gap-2 w-full sm:w-auto">
                                    {selectedUser.status !== 'Hired' && (
                                        <Button 
                                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" 
                                            disabled={actionLoading === selectedUser.id}
                                            onClick={() => {
                                                changeStatus(selectedUser.id, 'Hired');
                                                closeModal();
                                            }}
                                        >
                                            <UserCheck className="mr-2 h-4 w-4" /> Hire
                                        </Button>
                                    )}
                                    {selectedUser.status !== 'Rejected' && (
                                        <Button 
                                            variant="destructive" 
                                            className="w-full sm:w-auto"
                                            disabled={actionLoading === selectedUser.id}
                                            onClick={() => {
                                                changeStatus(selectedUser.id, 'Rejected');
                                                closeModal();
                                            }}
                                        >
                                            <UserX className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};