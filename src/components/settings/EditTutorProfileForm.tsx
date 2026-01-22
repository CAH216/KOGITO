'use client';

import { useState } from 'react';
import { updateTutorProfileSettings } from "@/actions/tutor-actions";
import { User, BookOpen, Clock, Loader2, DollarSign, Save } from "lucide-react";

interface Props {
  initialBio: string;
  initialSubjects: string[];
  initialRate: number;
}

export default function EditTutorProfileForm({ initialBio, initialSubjects, initialRate }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [subjects, setSubjects] = useState<string[]>(initialSubjects);
    const [subjectInput, setSubjectInput] = useState('');

    const handleAddSubject = () => {
        if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
            setSubjects([...subjects, subjectInput.trim()]);
            setSubjectInput('');
        }
    };

    const handleRemoveSubject = (sub: string) => {
        setSubjects(subjects.filter(s => s !== sub));
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setMessage('');

        // Inject subjects manually since they are state-managed
        formData.set('subjects', JSON.stringify(subjects));

        try {
            const res = await updateTutorProfileSettings(formData);
            if (res.success) {
                setMessage('Profil mis à jour avec succès !');
            } else {
                setMessage('Erreur lors de la mise à jour.');
            }
        } catch (e) {
            setMessage('Erreur inattendue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Bio / Présentation
                    </label>
                    <textarea 
                        name="bio"
                        defaultValue={initialBio}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 outline-none transition-all"
                        placeholder="Présentez-vous aux élèves..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tarif Horaire (€)
                    </label>
                    <div className="relative">
                        <DollarSign size={18} className="absolute left-3 top-3.5 text-slate-400" />
                        <input 
                            name="hourlyRate"
                            type="number"
                            defaultValue={initialRate}
                            step="0.5"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 outline-none transition-all"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Vous recevrez ce montant moins 20% de commission plateforme.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Matières enseignées
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input 
                            value={subjectInput}
                            onChange={(e) => setSubjectInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 outline-none"
                            placeholder="Ajouter une matière (ex: Mathématiques)"
                        />
                        <button 
                            type="button" 
                            onClick={handleAddSubject}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            Ajouter
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(sub => (
                             <span key={sub} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {sub}
                                <button type="button" onClick={() => handleRemoveSubject(sub)} className="hover:text-blue-900 font-bold ml-1">×</button>
                             </span>
                        ))}
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm ${message.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <button
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Enregistrer les modifications
            </button>
        </form>
    );
}
