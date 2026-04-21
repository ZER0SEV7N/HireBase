//frontend/Hirebase/app/page.tsx
//Pagina principal de la aplicacion, 
// muestra una landing page con informacion sobre el producto y enlaces para registrarse o iniciar sesion
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center px-4">
      <main className="max-w-3xl space-y-8">
        
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
          Hirebase: ATS system for tech recruitment
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Your skill in <br className="hidden sm:block" />
          <span className="text-blue-600">the right place.</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Hirebase: this is a system with make the recruitment process easier and more efficient for both candidates and recruiters.
          <br />
          Join us and find the perfect match for your tech career or your next great hire.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/auth" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 bg-slate-900 hover:bg-slate-800 text-white">
              Start Now
            </Button>
          </Link>
          
          <Link href="/auth" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-slate-300 text-slate-700 hover:bg-slate-100">
              Sign In
            </Button>
          </Link>
        </div>

      </main>

      <footer className="absolute bottom-8 text-sm text-slate-400">
        © {new Date().getFullYear()} Hirebase. This project is academyc, make for ZER0SEV7N/Daniel
      </footer>
    </div>
  );
}