'use client';

import { purchaseCredits } from '@/actions/parent-actions';
import { Check, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function ParentBillingPage() {
    const [pending, startTransition] = useTransition();

    const handlePurchase = (pack: string) => {
        startTransition(async () => {
            const result = await purchaseCredits(pack);
            if (result.success) {
                alert(`Pack activé ! Nouveau solde : ${result.newBalance} heures.`);
            } else {
                alert("Erreur lors de l'achat.");
            }
        });
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Recharger votre solde Tuteur</h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Achetez des heures de <strong>cours particuliers en visio</strong> avec nos tuteurs qualifiés.
                    <br/>
                    <span className="text-indigo-600 font-bold">🎁 Bonus :</span> L'accès à l'assistant IA Kogito est <strong>illimité et gratuit</strong> pour tous les membres actifs !
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Pack Essai */}
                <PricingCard 
                    title="Essai Gratuit" 
                    hours={1} 
                    price="Gratuit" 
                    features={['1h de visio avec un tuteur', 'IA Kogito illimitée 24/7', 'Sans engagement']}
                    onClick={() => handlePurchase('pack_trial')}
                    loading={pending}
                    buttonLabel="Commencer"
                />

                {/* Pack 5h */}
                <PricingCard 
                    title="Découverte" 
                    hours={5} 
                    price="125$" 
                    perHour="25$/h"
                    features={['5h de cours en visio', 'IA Kogito illimitée', 'Valable 1 an']}
                    onClick={() => handlePurchase('pack_5')}
                    loading={pending}
                />
                
                {/* Pack 10h */}
                <PricingCard 
                    title="Populaire" 
                    hours={10} 
                    price="220$" 
                    perHour="22$/h"
                    save="Économisez 30$"
                    recommended={true}
                    features={['10h de cours en visio', 'IA Kogito illimitée', 'Bilan mensuel']}
                    onClick={() => handlePurchase('pack_10')}
                    loading={pending}
                />

                {/* Pack 20h */}
                <PricingCard 
                    title="Intensif" 
                    hours={20} 
                    price="400$" 
                    perHour="20$/h"
                    save="Économisez 100$"
                    features={['20h de cours en visio', 'IA Kogito illimitée', 'Support VIP', 'Suivi personnalisé']}
                    onClick={() => handlePurchase('pack_20')}
                    loading={pending}
                />
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-600 text-sm">
                    Prix en dollars canadiens (CAD). Paiement sécurisé via Stripe. <br/>
                    Une facture sera envoyée par email après chaque rechargement.
                    <br/>Besoin d'une offre personnalisée ? <a href="#" className="text-indigo-600 font-bold underline">Contactez-nous</a>.
                </p>
            </div>
        </div>
    )
}

function PricingCard({ title, hours, price, perHour, save, recommended, features, onClick, loading, buttonLabel = "Choisir ce pack" }: any) {
    return (
        <div className={`relative p-6 rounded-3xl border bg-white flex flex-col ${recommended ? 'border-indigo-600 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm hover:border-indigo-200'}`}>
            {recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Recommandé
                </div>
            )}
            
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">{hours}h</span>
                    <span className="text-slate-500 font-medium">de cours</span>
                </div>
                {perHour && <p className="text-sm text-slate-400 font-medium mt-1">Soit {perHour}</p>}
                {save && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-2">{save}</span>}
            </div>

            <div className="mb-8 flex-1">
                <ul className="space-y-3">
                    {features.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                            <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-6 border-t border-slate-50">
                <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-slate-900">{price}</span>
                    {price !== 'Gratuit' && <span className="text-slate-400 text-sm"> / pack</span>}
                </div>
                <button 
                    onClick={onClick}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${recommended 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }
                    `}
                >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    {buttonLabel}
                </button>
            </div>
        </div>
    )
}