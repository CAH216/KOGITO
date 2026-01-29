'use client';

import { updateChild } from '@/actions/parent-actions';
import { User, GraduationCap, School } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Enregistrement...' : 'Enregistrer les modifications'}
    </button>
  );
}

export function EditChildForm({ student }: { student: any }) {
    const updateChildWithId = updateChild.bind(null, student.id);

    return (
        <form action={updateChildWithId} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        name="name" 
                        defaultValue={student.name}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Classe</label>
                <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-slate-400" size={20} />
                    <select 
                        name="grade" 
                        defaultValue={student.grade || ""}
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

            {/* School Field (Display Only or simple input for now as current Update action doesn't handle school relation logic fully yet) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">école</label>
                 <div className="relative">
                    <School className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        name="schoolName" 
                        defaultValue={student.organization?.name || ''}
                        placeholder="Nom de l'établissement" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}
