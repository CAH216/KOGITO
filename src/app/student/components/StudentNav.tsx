'use client';

import Link from 'next/link';
import { Brain, Star, LogOut, User } from 'lucide-react';

export function StudentNav({ user }: { user?: { name: string, grade?: string, xp?: number } }) {
  const displayName = user?.name || "Élève";
  const displayGrade = user?.grade || "Niveau non défini";
  const displayXp = user?.xp || 0;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Fun */}
        <Link href="/student/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-200 rotation-3">
             <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black text-indigo-950 tracking-tight">Kogito <span className="text-indigo-600">Kids</span></span>
        </Link>

        <div className="flex items-center gap-6">
           {/* Gamification Badge */}
           <div className="hidden sm:flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="font-bold text-yellow-700">{displayXp} pts</span>
           </div>

           {/* User Profile */}
           <div className="flex items-center gap-3 pl-6 border-l border-indigo-100">
               <Link href="/student/settings" className="flex items-center gap-3">
                   <div className="text-right hidden md:block">
                       <p className="text-sm font-bold text-indigo-950">{displayName}</p>
                       <p className="text-xs text-indigo-500 font-medium">{displayGrade}</p>
                   </div>
                   <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-50 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                       <User className="text-indigo-600 h-5 w-5" />
                   </div>
               </Link>
               
               <Link href="/auth/signout" className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors" title="Se déconnecter">
                  <LogOut size={20} />
               </Link>
           </div>
        </div>
      </div>
    </nav>
  );
}
