'use client';

import { createSchoolClass } from "@/actions/school-admin-actions";
import { BookOpen, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewClassPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createSchoolClass(formData);
        } catch (error: any) {
            alert(error.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Link href="/school-admin/classes" className="flex items-center text-slate-500 hover:text-slate-700 transition">
                <ArrowLeft size={16} className="mr-1" />
                Retour à la liste
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Créer un Groupe / Classe</h1>
                <p className="text-sm text-slate-500">Organisez les élèves pour faciliter la gestion.</p>
            </div>

            <form action={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nom du Groupe</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input name="name" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 3ème B, Groupe Maths Soutien..." />
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
                                Créer le Groupe
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
