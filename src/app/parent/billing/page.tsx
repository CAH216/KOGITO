'use client';

import { purchaseCredits } from '@/actions/parent-actions';
import { Loader2, Check, Sparkles, Plus } from 'lucide-react';
import { useTransition } from 'react';

export default function ParentBillingPage() {
    const [pending, startTransition] = useTransition();

    const handlePurchase = (pack: string) => {
        startTransition(async () => {
            try {
                const result = await purchaseCredits(pack);
                if (result.success && result.url) {
                    window.location.href = result.url;
                } else {
                    alert("Erreur: " + (result.error || "Impossible d'initier le paiement."));
                }
            } catch (e) {
                alert("Une erreur est survenue.");
            }
        });
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Choisissez votre réussite
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Une offre simple : Commencez gratuitement, investissez quand vous êtes prêts.
                </p>
            </div>

            {/* MAIN PLANS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
                
                {/* 1. GRATUIT */}
                <div className="flex flex-col p-8 rounded-[2rem] border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-lg relative">
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold mb-4">
                            Découverte
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900">0$</span>
                            <span className="text-slate-500 font-medium">/mois</span>
                        </div>
                        <p className="text-slate-500 mt-2 text-sm">Pour tester la plateforme sans engagement.</p>
                    </div>

                    <div className="space-y-4 flex-grow border-t border-slate-100 pt-6 mb-8">
                        <FeatureRow icon="🤖" text="IA Kogito : Limitée" sub="10 questions / jour" />
                        <FeatureRow icon="📚" text="Accès aux Tuteurs" />
                        <FeatureRow icon="💳" text="Visio payante" sub="Via recharge crédits" />
                    </div>

                    <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-500 font-bold bg-slate-50 cursor-not-allowed">
                        Votre plan actuel
                    </button>
                </div>

                {/* 2. ESSENTIEL (Sub + Credits) */}
                <div className="flex flex-col p-8 rounded-[2rem] border-2 border-indigo-600 bg-white shadow-xl scale-105 z-10 relative">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-xl text-xs font-black uppercase tracking-wider">
                        Recommandé
                    </div>
                    
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4">
                            Essentiel
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-slate-900">49$</span>
                            <span className="text-slate-500 font-medium">/mois</span>
                        </div>
                        <p className="text-indigo-600/80 mt-2 text-sm font-semibold">
                            IA Illimitée + 30$ de crédits inclus.
                        </p>
                    </div>

                    <div className="space-y-4 flex-grow border-t border-slate-100 pt-6 mb-8">
                        <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" dark />
                        <FeatureRow icon="🎁" text="30$ de Crédits / mois" sub="Cumulables" highlight />
                        <FeatureRow icon="🎓" text="Tuteurs Certifiés" sub="Payez avec vos crédits inclus" />
                    </div>

                    <button 
                        onClick={() => handlePurchase('sub_essential')}
                        disabled={pending}
                        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex justify-center"
                    >
                        {pending ? <Loader2 className="animate-spin" /> : "S'abonner (49$)"}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">30$ utilisables pour les tuteurs.</p>
                </div>

                {/* 3. PREMIUM (Sub + More Credits) */}
                <div className="flex flex-col p-8 rounded-[2rem] border border-slate-200 bg-slate-900 text-white hover:border-indigo-500 transition-all hover:shadow-xl relative hidden md:flex">
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-emerald-400 text-sm font-bold mb-4">
                            Réussite
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">99$</span>
                            <span className="text-slate-400 font-medium">/mois</span>
                        </div>
                        <p className="text-slate-400 mt-2 text-sm">Pour un suivi intensif.</p>
                    </div>

                    <div className="space-y-4 flex-grow border-t border-slate-800 pt-6 mb-8">
                        <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" dark />
                        <FeatureRow icon="💎" text="80$ de Crédits / mois" sub="~2h de cours expert" highlight />
                        <FeatureRow icon="🚀" text="Support Prioritaire" dark />
                    </div>

                    <button 
                        onClick={() => handlePurchase('sub_premium')}
                        disabled={pending}
                        className="w-full py-4 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex justify-center"
                    >
                         {pending ? <Loader2 className="animate-spin" /> : "Choisir Réussite"}
                    </button>
                </div>

            </div>

            {/* RECHARGE SECTION */}
            <div className="py-12 border-t border-slate-200 bg-slate-50/50 rounded-3xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                        <Plus className="w-6 h-6 text-emerald-600" />
                        Recharger mon portefeuille
                    </h2>
                    <p className="text-slate-500 mt-2">Besoin de plus de tuteurs ? Ajoutez des crédits à tout moment.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                    <CreditPack 
                        price="50$" 
                        credits="50" 
                        onClick={() => handlePurchase('credit_50')} 
                        disabled={pending} 
                    />
                    <CreditPack 
                        price="100$" 
                        credits="100" 
                        bonus="+ Bonus"
                        highlighted 
                        onClick={() => handlePurchase('credit_100')} 
                        disabled={pending} 
                    />
                     <CreditPack 
                        price="200$" 
                        credits="220" 
                        bonus="+ 10%" 
                        onClick={() => handlePurchase('credit_200')} 
                        disabled={pending} 
                    />
                </div>
                <p className="text-center text-xs text-slate-400 mt-6">
                    Les crédits n'expirent jamais. 1 Crédit = 1$ Canadien.
                </p>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-sm">
                    Paiements sécurisés via Stripe. Annulable à tout moment.
                </p>
            </div>
        </div>
    )
}

function FeatureRow({ icon, text, sub, dark, highlight }: any) {
    return (
        <div className={`flex items-start gap-3 ${highlight ? 'text-emerald-500 font-bold' : dark ? 'text-slate-200' : 'text-slate-600'}`}>
            <span className="text-lg">{icon}</span>
            <div>
                <p className="text-sm leading-tight font-medium">{text}</p>
                {sub && <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>}
            </div>
        </div>
    )
}

function CreditPack({ price, credits, bonus, highlighted, onClick, disabled }: any) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`
                relative flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 bg-white
                ${highlighted 
                    ? 'border-emerald-500 text-slate-900 shadow-md ring-4 ring-emerald-500/10' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }
            `}
        >
            {bonus && (
                <span className="absolute -top-3 right-4 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
                    {bonus}
                </span>
            )}
            <div className="flex flex-col text-left">
                <span className="text-xl font-bold">{price}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-slate-500">Reçoit</span>
                <span className="text-sm font-bold text-slate-900">{credits} crédits</span>
            </div>
        </button>
    )
}
