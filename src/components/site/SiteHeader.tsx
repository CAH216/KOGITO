import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">Kogito</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#method" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Notre Méthode</Link>
              <Link href="/#pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Tarifs</Link>
              <Link href="/tutors/apply" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Devenir Tuteur</Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                 <Link 
                    href={
                      session.user.role === 'ADMIN' ? "/admin/dashboard" : 
                      session.user.role === 'EMPLOYEE' ? "/employee/dashboard" :
                      session.user.role === 'PARENT' ? "/parent/dashboard" :
                      session.user.role === 'TUTOR' ? "/tutor/dashboard" :
                      session.user.role === 'SCHOOL_ADMIN' ? "/school-admin/dashboard" :
                      "/dashboard"
                    } 
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                 >
                    Mon Espace
                    <ArrowRight className="h-4 w-4" />
                 </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Essai Gratuit
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}
