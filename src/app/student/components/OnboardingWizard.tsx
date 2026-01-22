'use client';

import { useState } from 'react';
import { updateStudentProfileAction } from '@/app/actions/kogito-actions';
import { ArrowRight, Check, Sparkles, Brain, Trophy, Zap, Target } from 'lucide-react';

const INTERESTS_LIST = ['Jeux Vidéo', 'Sport', 'Dessin', 'Musique', 'Lecture', 'Sciences', 'Animaux', 'Espace', 'Code', 'Histoire'];
const STRENGTHS_LIST = ['Logique', 'Mémoire', 'Créativité', 'Calcul', 'Langues', 'Curiosité'];
const WEAKNESSES_LIST = ['Concentration', 'Organisation', 'Confiance', 'Stress', 'Vitesse'];
const LEARNING_STYLES = [
    { id: 'Visual', label: 'Visuel', desc: 'Avec des schémas et images', icon: <Sparkles size={18} /> },
    { id: 'Verbal', label: 'Verbal', desc: 'En lisant des explications', icon: <Brain size={18} /> },
    { id: 'Active', label: 'Pratique', desc: 'En faisant des exercices', icon: <Zap size={18} /> },
    { id: 'Story', label: 'Histoire', desc: 'Avec des exemples concrets', icon: <ArrowRight size={18} /> }, // Storytelling
];

export default function OnboardingWizard({ 
    initialName,
    initialInterests = [],
    initialLearningStyle = '',
    initialStrengths = [],
    initialWeaknesses = [],
    onComplete 
}: { 
    initialName: string, 
    initialInterests?: string[],
    initialLearningStyle?: string,
    initialStrengths?: string[],
    initialWeaknesses?: string[],
    onComplete: () => void 
}) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState(initialName);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(initialInterests);
    const [learningStyle, setLearningStyle] = useState<string>(initialLearningStyle);
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>(initialStrengths);
    const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>(initialWeaknesses);
    const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!initialLearningStyle;

    const COGNITIVE_QUIZ = [
        {
            id: 'poetry',
            question: "Tu dois apprendre une poésie par cœur. Tu fais quoi ?",
            options: [
                { id: 'Visual', text: "Je la lis en silence et je 'photographie' les mots.", icon: "👀" },
                { id: 'Verbal', text: "Je la récite à voix haute.", icon: "🗣️" },
                { id: 'Active', text: "Je marche en la récitant.", icon: "🚶" },
                { id: 'Story', text: "J'imagine l'histoire dans ma tête comme un film.", icon: "🎬" }
            ]
        },
        {
            id: 'math',
            question: "Pour faire 12 x 4 de tête, tu penses à quoi ?",
            options: [
                { id: 'Visual', text: "Je vois les chiffres écrits sur un tableau noir.", icon: "🔢" },
                { id: 'Verbal', text: "Je me dis '10 fois 4..., 2 fois 4...'", icon: "💭" },
                { id: 'Active', text: "Je compte sur mes doigts ou j'utilise des objets.", icon: "🖐️" },
                { id: 'Story', text: "J'imagine 4 boîtes de 12 chocolats.", icon: "🍫" }
            ]
        }
    ];

    const answerQuiz = (questionId: string, styleId: string) => {
        setQuizAnswers(prev => ({ ...prev, [questionId]: styleId }));
        // Auto-select predominant style if both answered
        const newAnswers = { ...quizAnswers, [questionId]: styleId };
        if (Object.keys(newAnswers).length === COGNITIVE_QUIZ.length) {
             const styles = Object.values(newAnswers);
             const counts: {[key:string]: number} = {};
             styles.forEach(s => counts[s] = (counts[s] || 0) + 1);
             const topStyle = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
             setLearningStyle(topStyle);
        }
    };

    const toggleInterest = (item: string) => {
        if (selectedInterests.includes(item)) setSelectedInterests(prev => prev.filter(i => i !== item));
        else setSelectedInterests(prev => [...prev, item]);
    };

    const toggleStrength = (item: string) => {
        if (selectedStrengths.includes(item)) setSelectedStrengths(prev => prev.filter(i => i !== item));
        else setSelectedStrengths(prev => [...prev, item]);
    };

    const toggleWeakness = (item: string) => {
        if (selectedWeaknesses.includes(item)) setSelectedWeaknesses(prev => prev.filter(i => i !== item));
        else setSelectedWeaknesses(prev => [...prev, item]);
    };

    const handleNext = () => setStep(prev => prev + 1);
    
    // Safety check for Step 1
    const canGoToStep2 = name.trim().length > 1;
    // Safety check for Step 2
    const canGoToStep3 = selectedInterests.length > 0;
    // Safety check for Step 3 (Quiz)
    const canGoToStep4 = Object.keys(quizAnswers).length === COGNITIVE_QUIZ.length;
    // Safety check for Step 4 (Confirmation)
    const canGoToStep5 = !!learningStyle;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await updateStudentProfileAction({
                name,
                interests: selectedInterests,
                learningStyle,
                strengths: selectedStrengths,
                weaknesses: selectedWeaknesses
            });
            onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 w-full">
                    <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>

                <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                    {/* STEP 1: WELCOME & NAME */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                             </div>
                             <h2 className="text-3xl font-black text-slate-900">
                                {isEditing ? "Ton Profil Kogito" : "Bienvenue sur Kogito !"}
                             </h2>
                             <p className="text-slate-600 text-lg">
                                {isEditing 
                                    ? "Mets à jour tes préférences pour que je puisse mieux t'aider." 
                                    : "Je suis ton nouvel assistant. Avant de commencer, j'ai besoin de mieux te connaître pour t'aider efficacement."}
                             </p>
                             
                             <div className="space-y-2 pt-4">
                                <label className="block text-sm font-bold text-slate-700">Comment veux-tu que je t'appelle ?</label>
                                <input 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full text-2xl font-bold border-b-2 border-indigo-200 focus:border-indigo-600 outline-none py-2 text-slate-900 placeholder:text-slate-300 transition-colors"
                                    placeholder="Ton prénom..."
                                    autoFocus
                                />
                             </div>
                             
                             <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={handleNext}
                                    disabled={!canGoToStep2}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    C'est parti <ArrowRight />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* STEP 2: INTERESTS */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <h2 className="text-2xl font-black text-slate-900">Qu'est-ce que tu aimes ?</h2>
                             <p className="text-slate-600">Sélectionne ce qui t'intéresse (j'utiliserai ça pour mes exemples !).</p>
                             
                             <div className="flex flex-wrap gap-3 pt-4">
                                {INTERESTS_LIST.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleInterest(item)}
                                        className={`
                                            px-4 py-2 rounded-full border-2 font-bold transition-all
                                            ${selectedInterests.includes(item)
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-200 text-slate-500 hover:border-indigo-200'
                                            }
                                        `}
                                    >
                                        {item}
                                    </button>
                                ))}
                             </div>

                             <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={handleNext}
                                    disabled={!canGoToStep3}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Suivant <ArrowRight />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* STEP 3: COGNITIVE DIAGNOSTIC (QUIZ) */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <h2 className="text-2xl font-black text-slate-900">Mini-Jeu : Comment ton cerveau marche ?</h2>
                             <p className="text-slate-600">Réponds spontanément, il n'y a pas de mauvaise réponse !</p>
                             
                             <div className="space-y-6 pt-2">
                                {COGNITIVE_QUIZ.map((q, idx) => (
                                    <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <h4 className="font-bold text-slate-800 mb-3 text-lg"><span className="text-indigo-500">#{idx+1}</span> {q.question}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => answerQuiz(q.id, opt.id)}
                                                    className={`
                                                        p-3 rounded-xl border text-left transition-all text-sm font-medium flex items-center gap-3
                                                        ${quizAnswers[q.id] === opt.id
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.02]'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                                                        }
                                                    `}
                                                >
                                                    <span className="text-xl">{opt.icon}</span>
                                                    {opt.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                             </div>

                             <div className="pt-6 flex justify-end">
                                <button 
                                    onClick={handleNext}
                                    disabled={!canGoToStep4}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Suivant <ArrowRight />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* STEP 4: LEARNING STYLE CONFIRMATION */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <h2 className="text-2xl font-black text-slate-900">Analyse terminée ! 🧠</h2>
                             <p className="text-slate-600">D'après tes réponses, ton style d'apprentissage dominant semble être...</p>
                             
                             <div className="grid grid-cols-1 gap-4 pt-4">
                                {LEARNING_STYLES.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setLearningStyle(style.id)}
                                        className={`
                                            p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4
                                            ${learningStyle === style.id
                                                ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-200 scale-105'
                                                : 'border-slate-200 hover:border-indigo-200 opacity-60 hover:opacity-100'
                                            }
                                        `}
                                    >
                                        <div className={`p-3 rounded-lg ${learningStyle === style.id ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {style.icon}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${learningStyle === style.id ? 'text-indigo-900' : 'text-slate-800'}`}>{style.label}</h4>
                                            <p className="text-sm text-slate-500">{style.desc}</p>
                                        </div>
                                        {learningStyle === style.id && <div className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold self-center">Recommandé</div>}
                                    </button>
                                ))}
                             </div>
                             
                             <p className="text-center text-sm text-slate-400 italic mt-2">Tu peux changer manuellement si tu penses que je me trompe !</p>

                             <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={handleNext}
                                    disabled={!canGoToStep5}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    C'est tout bon <ArrowRight />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* STEP 5: STRENGTHS & WEAKNESSES */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="text-center">
                                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-black text-slate-900">Dernière étape !</h2>
                                <p className="text-slate-600">Dis-moi tes forces et tes difficultés.</p>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Target size={18} className="text-emerald-500" /> 
                                        Tes points forts
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {STRENGTHS_LIST.map(item => (
                                            <button
                                                key={item}
                                                onClick={() => toggleStrength(item)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-sm font-bold border transition-all
                                                    ${selectedStrengths.includes(item)
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                                                    }
                                                `}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Zap size={18} className="text-orange-500" />
                                        Tes défis
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {WEAKNESSES_LIST.map(item => (
                                            <button
                                                key={item}
                                                onClick={() => toggleWeakness(item)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-sm font-bold border transition-all
                                                    ${selectedWeaknesses.includes(item)
                                                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200'
                                                    }
                                                `}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </div>

                             <div className="pt-12 flex justify-center">
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-black text-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    {isSubmitting ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Terminer mon profil Kogito')}
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
