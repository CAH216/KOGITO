'use client';

import { createSchoolTutor } from "@/actions/school-admin-actions";
import { User, Mail, BookOpen, Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewTeacherPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createSchoolTutor(formData);
        } catch (error: any) {
            alert(error.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/school-admin/teachers" className="flex items-center text-slate-500 hover:text-slate-700 transition">
                <ArrowLeft size={16} className="mr-1" />
                Retour à la liste
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Inscrire un Enseignant</h1>
                <p className="text-sm text-slate-500">Ajoutez un nouveau membre à votre équipe pédagogique.</p>
            </div>

            <form action={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Identité</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nom Complet</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="name" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Prof. Martin" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Professionnel</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="martin@ecole.com" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Matières enseignées (séparées par des virgules)</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input name="subjects" type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mathématiques, Physique, Chimie" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Accès</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Mot de passe initial</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input name="password" type="password" required minLength={6} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="******" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                         {isSubmitting ? 'Création...' : (
                            <>
                                <Save size={18} />
                                Inscrire l'enseignant
                            </>
                         )}
                    </button>
                </div>

            </form>
        </div>
    );
}
