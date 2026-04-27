//frontend/Hirebase/components/auth/LoginForm.tsx
//Componente para el formulario de login, utiliza el hook useLogin para manejar la logica
'use client';

import Link from "next/link";
import { useLogin, useSocialAuth } from "@/hooks/AuthHook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
    const { email, setEmail, password, setPassword, error, isLoading, handleSubmit } = useLogin();
    const { handleSocialLogin, socialError } = useSocialAuth();
    
    return (
        <Card className="w-full max-w-md shadow-lg border-slate-200">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                    Insert your email and password to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {(error || socialError) && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm font-medium">
                        {error || socialError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            minLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="focus-visible:ring-blue-500"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
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
