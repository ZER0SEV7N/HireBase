import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HireBase | Applicant Tracking System",
  description: "Encuentra tu próximo gran talento o tu próximo gran empleo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}