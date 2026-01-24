import { Check, Star, Zap } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Investissez dans la réussite</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Des tarifs transparents, sans frais cachés. Annulez à tout moment.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Pay as you go */}
            <PricingCard 
                title="À la carte"
                price="45$"
                period="/heure"
                desc="Parfait pour une aide ponctuelle avant un examen."
                features={[
                    "Tuteur expert certifié",
                    "Rapport de séance détaillé",
                    "Enregistrement du cours",
                    "Sans engagement"
                ]}
                cta="Réserver un cours"
                variant="basic"
            />

            {/* Monthly */}
            <PricingCard 
                title="Forfait Mensuel"
                price="199$"
                period="/mois"
                desc="La solution complète pour un suivi régulier et efficace."
                features={[
                    "5 heures de tutorat incluses",
                    "Accès illimité à Kogito IA",
                    "Suivi de progression avancé",
                    "Priorité de réservation",
                    "Support WhatsApp parents"
                ]}
                cta="Commencer l'essai gratuit"
                popular={true}
                variant="pro"
            />

            {/* Schools */}
            <PricingCard 
                title="Institutionnel"
                price="Sur mesure"
                period=""
                desc="Pour les écoles et commissions scolaires."
                features={[
                    "Licences étudiants illimitées",
                    "Tableau de bord administrateur",
                    "Intégration SSO (Google/Microsoft)",
                    "Formation des enseignants",
                    "Support dédié 24/7"
                ]}
                cta="Contacter les ventes"
                variant="enterprise"
            />

        </div>

        <div className="mt-16 text-center">
            <p className="text-slate-500 mb-4">Vous avez des besoins spécifiques ?</p>
            <a href="/contact" className="text-indigo-600 font-bold hover:underline">Discuter avec un conseiller pédagogique</a>
        </div>

      </div>
    </main>
  );
}

function PricingCard({ title, price, period, desc, features, cta, popular, variant }: any) {
    const isPro = variant === "pro";
    const isEnterprise = variant === "enterprise";

    return (
        <div className={`relative bg-white rounded-3xl p-8 shadow-xl flex flex-col ${isPro ? 'border-2 border-indigo-600 ring-4 ring-indigo-600/10 scale-105 z-10' : 'border border-slate-100'}`}>
            
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Recommandé
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${isPro ? 'text-indigo-600' : 'text-slate-900'}`}>{title}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-extrabold text-slate-900">{price}</span>
                    <span className="text-slate-500 font-medium">{period}</span>
                </div>
                <p className="text-slate-500 text-sm">{desc}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <Check className={`w-5 h-5 flex-shrink-0 ${isPro ? 'text-indigo-600' : 'text-slate-400'}`} />
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${isPro ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'}`}>
                {cta}
            </button>
        </div>
    )
}
