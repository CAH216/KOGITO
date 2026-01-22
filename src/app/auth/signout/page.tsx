'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignOutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/auth/login');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
             <Link href="/" className="flex items-center gap-2 group">
                 <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                    <Brain className="h-8 w-8 text-blue-600" />
                 </div>
                 <span className="text-2xl font-bold text-slate-800 tracking-tight">Kogito</span>
            </Link>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-100 text-center">
            
            <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-75"></div>
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border border-blue-100">
                    <ShieldCheck className="h-10 w-10 text-blue-600" />
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1 border-2 border-white">
                    <LogOut size={12} className="text-white" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              À bientôt !
            </h2>
            
            <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
              Vous avez été déconnecté en toute sécurité. Merci d&apos;avoir utilisé notre plateforme.
            </p>

            <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100">
                <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-slate-500">Redirection...</span>
                    <span className="font-bold text-blue-600">{countdown}s</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(countdown / 5) * 100}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Link 
                    href="/auth/login"
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
                >
                    Se reconnecter
                    <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
                <Link 
                    href="/"
                    className="w-full inline-flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    Retour à l&apos;accueil
                </Link>
            </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            © 2026 Kogito Education. Sécurité garantie.
        </p>
      </div>
    </div>
  );
}
