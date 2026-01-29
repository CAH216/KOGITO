'use client';

import { deleteAIRule, toggleAIRule } from "@/actions/ai-rules-actions";
import { Trash2, Power, BookOpen } from "lucide-react";

export default function RuleList({ rules }: { rules: any[] }) {
    
    return (
        <div className="space-y-3">
            {rules.map((rule) => (
                <div key={rule.id} className={`bg-white border rounded-xl p-4 transition-all ${rule.isActive ? 'border-slate-200 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <p className="text-slate-800 text-sm font-medium leading-relaxed">"{rule.content}"</p>
                            {rule.subject && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                                    <BookOpen size={10} />
                                    {rule.subject}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => toggleAIRule(rule.id, rule.isActive)}
                                className={`p-1.5 rounded-md transition-colors ${rule.isActive ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'}`}
                                title={rule.isActive ? "Désactiver" : "Activer"}
                            >
                                <Power size={16} />
                            </button>
                            <button 
                                onClick={() => {
                                    if(confirm('Supprimer cette règle ?')) deleteAIRule(rule.id)
                                }}
                                className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
