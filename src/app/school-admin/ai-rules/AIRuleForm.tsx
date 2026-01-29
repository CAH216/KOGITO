'use client';

import { createAIRule } from "@/actions/ai-rules-actions";
import { useState } from "react";
import { Plus, X, Save } from "lucide-react";

export default function AIRuleForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        await createAIRule(formData);
        setIsSubmitting(false);
        setIsOpen(false);
    }

    if (!isOpen) {
        return (
            <div className="flex justify-end">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                    <Plus size={16} />
                    Nouvelle Règle
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Nouvelle Instruction IA</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                </button>
            </div>
            
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Instruction</label>
                    <textarea 
                        name="content"
                        required
                        rows={4}
                        placeholder="Ex: Ne donne jamais la réponse directement. Pose toujours une question pour guider l'élève."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                    ></textarea>
                </div>
                
                <div>
                    <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Matière (Optionnel)</label>
                    <select name="subject" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Toutes les matières</option>
                        <option value="MATH">Mathématiques</option>
                        <option value="FRANCAIS">Français</option>
                        <option value="SCIENCES">Sciences</option>
                        <option value="ANGLAIS">Anglais</option>
                        <option value="HISTOIRE">Histoire-Géo</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                     <button 
                        type="button" 
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg text-sm transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 flex items-center gap-2 text-sm transition-colors shadow-sm"
                    >
                        {isSubmitting ? '...' : <><Save size={16} /> Enregistrer</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
