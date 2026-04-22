//frontend/Hirebase/components/user/onBoardingForm.tsx
//Componente del formulario de onboarding para candidatos
'use client';

import { useCandidateOnboarding } from '@/hooks/BoardingHook';
import { Button } from '../ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

//Tipo de datos para el formulario de onboarding
export default function OnBoardingForm() {
    const { register, handleSubmit, errors, onUpload, isPending, error } = useCandidateOnboarding();

    return (

        <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="text-blue-600" />
                    Complete your profile to get noticed by top companies
                </CardTitle>
                <CardDescription>
                    Finish setting up your profile to start applying for jobs and get noticed by top companies. It only takes a few minutes!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Professional Biography</Label>
                            <Textarea 
                            id="bio"
                            placeholder="Ej: Programmer with 5 years of experience in web development. Passionate about creating efficient and scalable applications."
                            {...register('bio', { required: "Tell us a bit about yourself" })}
                            />
                            {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cv">Upload CV (PDF)</Label>
                            <Input 
                            id="cv"
                            type="file"
                            accept=".pdf"
                            {...register('cv', { required: "The resume is required" })}
                            />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        <AlertCircle size={16} />
                        {error}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Uploading..." : "Complete My Application"}
                    </Button>
                </form>
            </CardContent>
        </Card>
  );
}