//frontend/hirebase/app/dashboard/profile/page.tsx
//Pagina de configuración de perfil del usuario, donde pueden actualizar su información personal y cambiar su contraseña.
'use client';

import { ProfileSettings } from '@/components/Dashboard/ProfileSettings';
import { UserCog } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <div className="flex items-center gap-3">
                    <UserCog className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Account Settings
                    </h1>
                </div>
                <p className="text-slate-500 mt-1">
                    Manage your personal information, profile picture, and security.
                </p>
            </header>

            <main>
                <ProfileSettings />
            </main>
        </div>
    );
}