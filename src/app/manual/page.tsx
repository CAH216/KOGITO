import { Search, Book, MessageCircle, HelpCircle, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function ManualPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Centre d'aide et Manuel</h1>
            <div className="max-w-2xl mx-auto relative">
                <input 
                    type="text" 
                    placeholder="Comment pouvons-nous vous aider ?" 
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
                />
                <Search className="absolute left-4 top-4.5 text-slate-400 w-6 h-6" />
            </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
            <CategoryCard 
                icon={<Book className="w-8 h-8 text-indigo-600" />}
                title="Guides de démarrage"
                desc="Tout pour bien commencer avec la plateforme Kogito."
                items={["Créer son compte étudiant", "Réserver son premier cours", "Configurer son profil"]}
            />
            <CategoryCard 
                icon={<MessageCircle className="w-8 h-8 text-emerald-600" />}
                title="Le Tutorat en ligne"
                desc="Comment se déroulent les séances et les outils disponibles."
                items={["Utiliser le tableau blanc", "Partager son écran", "Enregistrement des séances"]}
            />
            <CategoryCard 
                icon={<FileText className="w-8 h-8 text-blue-600" />}
                title="Facturation"
                desc="Gérer vos paiements et abonnements."
                items={["Comprendre ma facture", "Politique d'annulation", "Mettre à jour sa carte"]}
            />
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
                Questions Fréquentes
            </h2>
            
            <div className="space-y-6">
                <Accordion 
                    question="Comment annuler un cours ?"
                    answer="Vous pouvez annuler un cours sans frais jusqu'à 24h à l'avance depuis votre tableau de bord. Passé ce délai, 50% du montant sera retenu."
                />
                 <Accordion 
                    question="Puis-je changer de tuteur ?"
                    answer="Absolument. Si le courant ne passe pas, contactez-nous et nous vous proposerons un autre profil adapté à vos besoins."
                />
                 <Accordion 
                    question="Comment fonctionne le paiement ?"
                    answer="Le paiement est effectué automatiquement après chaque séance via la carte de crédit enregistrée. Un reçu est envoyé par email."
                />
                 <Accordion 
                    question="L'IA remplace-t-elle le tuteur ?"
                    answer="Non, l'IA est un assistant qui aide l'étudiant entre les séances pour s'exercer. Le tuteur humain reste le guide principal."
                />
            </div>
        </div>

      </div>
    </main>
    <SiteFooter />
    </>
  );
}

function CategoryCard({ icon, title, desc, items }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 mb-6 text-sm">{desc}</p>
            <ul className="space-y-3">
                {items.map((item: string, i: number) => (
                    <li key={i}>
                        <a href="#" className="flex items-center text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
                            <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full mr-2"></span>
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function Accordion({ question, answer }: any) {
    return (
        <div className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <h3 className="font-bold text-slate-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors">{question}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
        </div>
    )
}
