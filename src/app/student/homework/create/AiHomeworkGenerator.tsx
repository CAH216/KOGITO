'use client';

import { useState } from 'react';
import { generateAiHomework } from '@/actions/homework-ai-actions';
import { Sparkles, Brain, Loader2, MessageSquare, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
    subjects: string[];
    sessions: { id: string; subject: string; topic: string | null; startedAt: Date }[];
}

export default function AiHomeworkGenerator({ subjects, sessions }: Props) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'TOPIC' | 'CHAT'>('TOPIC');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
        const res = await generateAiHomework(formData);
        if (res.success) {
            router.push('/student/homework'); 
        }
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la génération");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500">
        {/* Background FX */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
        
        <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                <Sparkles className="animate-pulse text-yellow-300" />
                Générateur de Défis IA
            </h2>
            <p className="text-indigo-100 mb-6 max-w-lg">
                Choisis un sujet ou une conversation récente, et Coach Kogito va te préparer un mini-entraînement sur mesure !
            </p>

            {/* Mode Switcher */}
            <div className="flex bg-indigo-900/40 p-1 rounded-xl w-fit mb-6 backdrop-blur-sm border border-white/10">
                 <button 
                    onClick={() => setMode('TOPIC')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'TOPIC' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-200 hover:text-white hover:bg-white/5'}`}
                 >
                    <PlusCircle size={16} /> Nouveau Sujet
                 </button>
                 <button 
                    onClick={() => setMode('CHAT')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'CHAT' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-200 hover:text-white hover:bg-white/5'}`}
                 >
                    <MessageSquare size={16} /> Depuis une discussion
                 </button>
            </div>

            <form action={handleSubmit} className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-inner">
                
                {mode === 'TOPIC' ? (
                    <>
                        <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Matière</label>
                        <select name="subject" className="w-full bg-indigo-900/50 border border-indigo-500/50 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer">
                            <option value="">Sélectionner une matière...</option>
                            {/* Standard Subjects */}
                            <optgroup label="Matières Principales">
                                <option value="MATHS">Mathématiques</option>
                                <option value="FRENCH">Français</option>
                                <option value="ENGLISH">Anglais</option>
                                <option value="SCIENCE">Sciences</option>
                                <option value="HISTORY">Histoire</option>
                            </optgroup>
                            
                            {/* User Custom Subjects */}
                            {subjects.length > 0 && (
                                <optgroup label="Mes Matières">
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </optgroup>
                            )}
                        </select>
                        </div>

                        <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Sujet Précis</label>
                        <input 
                            type="text" 
                            name="topic" 
                            placeholder="Ex: Théorème de Pythagore, Verbes irréguliers..." 
                            className="w-full bg-indigo-900/50 border border-indigo-500/50 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-indigo-300/50"
                            required
                        />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">Choisir une discussion récente</label>
                            {sessions.length === 0 ? (
                                <div className="text-center p-4 bg-white/5 rounded-xl text-sm text-indigo-200 border border-dashed border-white/20">
                                    Aucune discussion récente trouvée.
                                </div>
                            ) : (
                                <select name="chatId" className="w-full bg-indigo-900/50 border border-indigo-500/50 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer" required>
                                    {sessions.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.subject} - {s.topic || "Discussion générale"} ({new Date(s.startedAt).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="text-xs text-indigo-300 mt-2">
                                Kogito relira votre conversation pour créer des exercices adaptés à ce que vous avez vu ensemble.
                            </p>
                        </div>
                    </>
                )}

                <button 
                  disabled={loading || (mode === 'CHAT' && sessions.length === 0)}
                  className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 mt-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Création du challenge...
                        </>
                    ) : (
                        <>
                            <Brain size={20} />
                            Générer le devoir ({mode === 'TOPIC' ? 'Sujet' : 'Contexte'})
                        </>
                    )}
                </button>
            </form>
        </div>
    </div>
  );
}

