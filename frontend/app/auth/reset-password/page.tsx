//frontend/hirebase/app/reset-password/page.tsx
//Página de restablecimiento de contraseña, 
//donde los usuarios pueden establecer una nueva contraseña utilizando un token enviado por correo electrónico.
'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePasswordChange } from "@/hooks/AuthHook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const emailParam = searchParams.get('email') || '';

    const { 
        password, setPassword, 
        passwordConfirmation, setPasswordConfirmation, 
        message, error, isLoading, 
        handlePasswordReset 
    } = usePasswordChange();

    return (
        <Card className="w-full max-w-md shadow-lg border-slate-200">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create New Password</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                    Your new password must be different from previously used passwords.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}
                
                {message ? (
                    <div className="text-center space-y-6">
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-md flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                        <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                            <Link href="/auth">Proceed to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={(e) => handlePasswordReset(e, emailParam, token)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={emailParam}
                                disabled
                                className="bg-slate-100 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                                className="focus-visible:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                placeholder="••••••••"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                minLength={8}
                                required
                                className="focus-visible:ring-blue-500"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Reset Password
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Suspense fallback={<Loader2 className="animate-spin text-slate-400" size={32} />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}