'use client';

import { purchaseCredits } from '@/actions/parent-actions';
import { Loader2, Check, Sparkles, Plus, School, Building2 } from 'lucide-react';
import { useTransition } from 'react';

// Define the organization type based on what we need (subset of Prisma Organization)
type OrganizationInfo = {
    id: string;
    name: string;
    billingModel: 'SCHOOL_PAYS' | 'PARENT_PAYS';
} | null;

interface BillingContentProps {
    organization: OrganizationInfo;
    childrenCount: number;
}

export default function BillingContent({ organization, childrenCount }: BillingContentProps) {
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

    const isSchoolPays = organization?.billingModel === 'SCHOOL_PAYS';

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
            
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Choisissez votre réussite
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    {organization 
                        ? `Offre partenaire liée à ${organization.name}`
                        : "Une offre simple : Commencez gratuitement, investissez quand vous êtes prêts."
                    }
                </p>
            </div>

            {/* MAIN PLANS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
                
                {/* 1. SCHOOL / FREE PLAN */}
                {isSchoolPays ? (
                     <div className="flex flex-col p-6 rounded-[2rem] border-2 border-emerald-500 bg-emerald-50/50 relative">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-xl text-xs font-black uppercase tracking-wider flex items-center gap-1">
                            <School className="w-4 h-4" /> École
                        </div>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">
                                Licence Scolaire
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-emerald-900">0$</span>
                                <span className="text-emerald-600 font-medium text-sm">/parent</span>
                            </div>
                            <p className="text-emerald-700 mt-2 text-xs">
                                Offert par <strong>{organization.name}</strong>.
                            </p>
                        </div>

                        <div className="space-y-3 flex-grow border-t border-emerald-200 pt-6 mb-8">
                            <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" highlight />
                            <FeatureRow icon="🏫" text="Suivi Pédagogique" sub="Connecté à la classe" />
                            <FeatureRow icon="💳" text="Visio payante" sub="À la charge du parent" />
                        </div>

                        <button className="w-full py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-bold bg-white cursor-default flex items-center justify-center gap-2 text-sm">
                            <Check className="w-4 h-4" /> Active
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col p-6 rounded-[2rem] border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-lg relative">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-4">
                                Découverte
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">0$</span>
                                <span className="text-slate-500 font-medium text-sm">/mois</span>
                            </div>
                            <p className="text-slate-500 mt-2 text-xs">Pour tester sans engagement.</p>
                        </div>

                        <div className="space-y-3 flex-grow border-t border-slate-100 pt-6 mb-8">
                            <FeatureRow icon="🤖" text="IA Kogito : Limitée" sub="10 questions / jour" />
                            <FeatureRow icon="📚" text="Accès aux Tuteurs" />
                            <FeatureRow icon="💳" text="Visio payante" sub="Via recharge crédits" />
                        </div>

                        <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold bg-slate-50 cursor-not-allowed text-sm">
                            Plan actuel
                        </button>
                    </div>
                )}

                {/* 2. KOGITO SOLO (Only if not school pays) */}
                {!isSchoolPays && (
                    <div className="flex flex-col p-6 rounded-[2rem] border border-indigo-100 bg-white hover:border-indigo-300 transition-all hover:shadow-lg relative">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-4">
                                Kogito Solo
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">19$</span>
                                <span className="text-slate-500 font-medium text-sm">/mois</span>
                            </div>
                            <p className="text-slate-500 mt-2 text-xs">L'intelligence artificielle pour l'aide aux devoirs 24/7.</p>
                        </div>

                        <div className="space-y-3 flex-grow border-t border-slate-100 pt-6 mb-8">
                            <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" highlight />
                            <FeatureRow icon="🧠" text="Suivi Personnalisé" />
                            <FeatureRow icon="🚫" text="Pas de crédits inclus" sub="Recharge à la carte" />
                        </div>

                        <button 
                            onClick={() => handlePurchase('sub_solo')}
                            disabled={pending}
                            className="w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-all flex justify-center text-sm"
                        >
                            {pending ? <Loader2 className="animate-spin w-4 h-4" /> : "Choisir Solo"}
                        </button>
                    </div>
                )}

                {/* 3. ESSENTIEL (Sub + Credits) */}
                {!isSchoolPays && (
                     <div className="flex flex-col p-6 rounded-[2rem] border-2 border-indigo-600 bg-white shadow-xl scale-105 z-10 relative">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-2xl rounded-tr-xl text-[10px] font-black uppercase tracking-wider">
                            Recommandé
                        </div>
                        
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4">
                                Essentiel
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">49$</span>
                                <span className="text-slate-500 font-medium text-sm">/mois</span>
                            </div>
                            <p className="text-indigo-600/80 mt-2 text-xs font-semibold">
                                IA Illimitée + 30$ de crédits.
                            </p>
                        </div>

                        <div className="space-y-3 flex-grow border-t border-slate-100 pt-6 mb-8">
                            <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" dark />
                            <FeatureRow icon="🎁" text="30$ de Crédits / mois" sub="Cumulables" highlight />
                            <FeatureRow icon="🎓" text="Tuteurs Certifiés" sub="Payez avec vos crédits" />
                        </div>

                        <button 
                            onClick={() => handlePurchase('sub_essential')}
                            disabled={pending}
                            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex justify-center text-sm"
                        >
                            {pending ? <Loader2 className="animate-spin w-4 h-4" /> : "S'abonner"}
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-2">30$ pour les tuteurs.</p>
                    </div>
                )}

                {isSchoolPays && (
                    <div className="flex flex-col p-6 rounded-[2rem] border-2 border-indigo-600 bg-white shadow-xl scale-105 z-10 relative">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-2xl rounded-tr-xl text-[10px] font-black uppercase tracking-wider">
                            Boost Tuteur
                        </div>
                         <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4">
                                Pack Mensuel
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">30$</span>
                                <span className="text-slate-500 font-medium text-sm">/mois</span>
                            </div>
                            <p className="text-indigo-600/80 mt-2 text-xs font-semibold">
                                30$ de cours chaque mois (-15% vs recharge).
                                <br/>
                                <span className="text-[10px] font-normal text-slate-500">Kogito IA déjà débloqué.</span>
                            </p>
                        </div>
                         <div className="space-y-3 flex-grow border-t border-slate-100 pt-6 mb-8">
                            <FeatureRow icon="✅" text="IA Kogito : INCLUS" highlight />
                             <FeatureRow icon="💎" text="35 Crédits / mois" sub="Vous payez 30$, recevez 35$" highlight />
                             <FeatureRow icon="📅" text="Annulable à tout moment" />
                        </div>
                         <button 
                            onClick={() => handlePurchase('sub_tutoring_only')}
                            disabled={pending}
                            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex justify-center text-sm"
                        >
                            {pending ? <Loader2 className="animate-spin w-4 h-4" /> : "Activer (30$)"}
                        </button>
                    </div>
                )}

                {/* 4. PREMIUM (Sub + More Credits) */}
                <div className={`flex flex-col p-6 rounded-[2rem] border border-slate-200 bg-slate-900 text-white hover:border-indigo-500 transition-all hover:shadow-xl relative ${isSchoolPays ? 'opacity-80 scale-95' : ''}`}>
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-4">
                            Réussite
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white">99$</span>
                            <span className="text-slate-400 font-medium text-sm">/mois</span>
                        </div>
                        <p className="text-slate-400 mt-2 text-xs">Pour un suivi intensif.</p>
                    </div>

                    <div className="space-y-3 flex-grow border-t border-slate-800 pt-6 mb-8">
                        <FeatureRow icon="✨" text="IA Kogito : ILLIMITÉE" dark />
                        <FeatureRow icon="💎" text="80$ de Crédits / mois" sub="~2h de cours expert" highlight />
                        <FeatureRow icon="🚀" text="Support Prioritaire" dark />
                    </div>

                    <button 
                        onClick={() => handlePurchase('sub_premium')}
                        disabled={pending}
                        className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex justify-center text-sm"
                    >
                         {pending ? <Loader2 className="animate-spin w-4 h-4" /> : "Choisir Réussite"}
                    </button>
                </div>

            </div>

            {/* RECHARGE SECTION */}
            <div className="py-12 border-t border-slate-200 bg-slate-50/50 rounded-3xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                        <Plus className="w-6 h-6 text-emerald-600" />
                        Recharger mon portefeuille (Carte)
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {isSchoolPays 
                            ? "Complétez l'offre scolaire avec des heures de tutorat ponctuel." 
                            : "Besoin de plus de tuteurs ? Ajoutez des crédits à tout moment."}
                    </p>
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

            {/* INTERAC PAYMENT INFO */}
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 max-w-2xl mx-auto text-center">
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Paiement par Virement Interac
                </h3>
                <p className="text-blue-800 text-sm mb-2">
                    Vous préférez ne pas utiliser de carte de crédit ?
                </p>
                <div className="bg-white px-2 py-4 rounded-xl border border-blue-100 shadow-sm inline-block w-full">
                    <p className="text-slate-600 text-sm">
                        Envoyez le montant désiré par virement Interac à ce numéro :
                    </p>
                    <p className="text-2xl font-black text-slate-900 my-2 select-all">
                        514-261-2005
                    </p>
                    <p className="text-xs text-slate-500">
                        Indiquez votre adresse email <strong>({organization?.name ? "compte parent" : "email de connexion"})</strong> dans le message du virement pour que nous puissions créditer votre compte.
                    </p>
                </div>
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
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {bonus}
                </div>
            )}
            <div className="text-left">
                <div className="text-xl font-bold">{price}</div>
                <div className="text-xs text-slate-400 uppercase font-semibold">Payez</div>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
             <div className="text-left">
                <div className={`text-xl font-bold ${highlighted ? 'text-emerald-600' : 'text-slate-600'}`}>{credits}</div>
                <div className="text-xs text-slate-400 uppercase font-semibold">Crédits</div>
            </div>
        </button>
    )
}
