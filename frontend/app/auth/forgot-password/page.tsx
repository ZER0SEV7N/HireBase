//frontend/hirebase/app/forgot-password/page.tsx
//Página de recuperación de contraseña, donde los usuarios pueden solicitar un enlace para restablecer su contraseña.
'use client';

import Link from "next/link";
import { usePasswordRecovery } from "@/hooks/AuthHook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const { email, setEmail, message, error, isLoading, handlePasswordRecovery } = usePasswordRecovery();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                        Enter your email and we'll send you a link to reset your password.
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
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/auth">Return to Sign In</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordRecovery} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="youremail@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="focus-visible:ring-blue-500"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send Recovery Link
                            </Button>
                        </form>
                    )}

                    {!message && (
                        <div className="mt-6 text-center">
                            <Link href="/auth" className="text-sm text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}