'use client';

import { addChild } from '@/actions/parent-actions';
import { ArrowLeft, User, GraduationCap, School } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
    >
      {pending ? 'Création en cours...' : 'Ajouter le profil'}
    </button>
  );
}

export default function NewChildPage() {
  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      
      <div className="mb-8">
        <Link href="/parent/children" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Ajouter un enfant</h1>
        <p className="text-slate-500 mt-2">Créez un profil pour suivre sa progression et trouver des tuteurs adaptés.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form action={addChild} className="space-y-6">
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom de l'enfant</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Ex: Sophie" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Classe actuelle</label>
                <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-slate-400" size={20} />
                    <select 
                        name="grade" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                        <option value="">Sélectionner une classe</option>
                        <optgroup label="Primaire">
                            <option value="CP">CP</option>
                            <option value="CE1">CE1</option>
                            <option value="CE2">CE2</option>
                            <option value="CM1">CM1</option>
                            <option value="CM2">CM2</option>
                        </optgroup>
                        <optgroup label="Collège">
                            <option value="6ème">6ème</option>
                            <option value="5ème">5ème</option>
                            <option value="4ème">4ème</option>
                            <option value="3ème">3ème</option>
                        </optgroup>
                        <optgroup label="Lycée">
                            <option value="Seconde">Seconde</option>
                            <option value="Première">Première</option>
                            <option value="Terminale">Terminale</option>
                        </optgroup>
                    </select>
                </div>
            </div>

            {/* School Field (Optional for now) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">école (Optionnel)</label>
                <div className="relative">
                    <School className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        name="schoolName" 
                        placeholder="Nom de l'établissement" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1">Nous l'utiliserons pour vous proposer des tuteurs à proximité.</p>
            </div>

            <div className="pt-4">
                <SubmitButton />
            </div>

        </form>
      </div>

    </div>
  )
}
