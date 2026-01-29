'use client';

import { createSchoolParent } from "@/actions/school-admin-actions";
import { User, Mail, MapPin, Phone, Lock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewParentPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createSchoolParent(formData);
            // Redirect is handled in server action
        } catch (error: any) {
            alert(error.message); // Replace with toast if available
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/school-admin/parents" className="flex items-center text-slate-500 hover:text-slate-700 transition">
                <ArrowLeft size={16} className="mr-1" />
                Retour à la liste
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Ajouter un Parent</h1>
                <p className="text-sm text-slate-500">Créez un compte famille pour permettre l'inscription des élèves.</p>
            </div>

            <form action={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Informations Personnelles</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nom Complet</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="name" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jean Dupont" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="jean.dupont@email.com" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="phoneNumber" type="tel" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="06 12 34 56 78" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Adresse</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input name="address" type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123 Rue de la Paix" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Sécurité</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Mot de passe provisoire</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input name="password" type="password" required minLength={6} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Minimum 6 caractères" />
                        </div>
                        <p className="text-xs text-slate-500">Le parent pourra changer ce mot de passe lors de sa première connexion.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Save size={18} />
                                Créer le Compte
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
