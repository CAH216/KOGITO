import { Brain, Users, Sparkles, Presentation, Check } from "lucide-react";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Hero */}
      <div className="bg-slate-900 text-white pt-24 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Nos Solutions Éducatives</h1>
        <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-8">
            De l'aide ponctuelle au suivi complet, nous avons la formule adaptée à chaque besoin.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid md:grid-cols-3 gap-8">
            
            {/* Private Tutoring */}
            <ServiceCard 
                 title="Tutorat Privé 1-on-1"
                 icon={<Presentation className="w-10 h-10 text-indigo-500" />}
                 image="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800"
                 desc="L'excellence du cours particulier, modernisé. Un tuteur expert dédié exclusivement à votre enfant pour combler les lacunes et viser l'excellence."
                 features={[
                     "Tuteur certifié et vérifié",
                     "Horaires flexibles 7j/7",
                     "Bilan de compétences inclus",
                     "Rapports détaillés après chaque séance"
                 ]}
                 cta="Trouver un tuteur"
                 popular={true}
            />

            {/* AI Assistant */}
            <ServiceCard 
                 title="Assistant Kogito IA"
                 icon={<Brain className="w-10 h-10 text-rose-500" />}
                 image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                 desc="Votre coach personnel disponible 24/7. Notre IA répond aux questions, génère des exercices et explique les concepts difficiles à tout moment."
                 features={[
                     "Disponible 24h/24 et 7j/7",
                     "Aide aux devoirs instantanée",
                     "Génération de quizz personnalisés",
                     "Adapté au programme scolaire"
                 ]}
                 cta="Essayer gratuitement"
            />

            {/* Group Classes */}
             <ServiceCard 
                 title="Classes de Révision"
                 icon={<Users className="w-10 h-10 text-emerald-500" />}
                 image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                 desc="La dynamique de groupe pour préparer les examens. Des sessions intensives en petits groupes pour réviser les notions clés avant les épreuves importantes."
                 features={[
                     "Petits groupes (max 6 élèves)",
                     "Préparation examens du Ministère",
                     "Tarif avantageux",
                     "Émulation positive"
                 ]}
                 cta="Voir le calendrier"
            />

        </div>

        {/* Enterprise / Schools */}
        <div className="mt-24 flex flex-col md:flex-row items-center bg-indigo-900 rounded-3xl overflow-hidden shadow-xl text-white">
            <div className="md:w-1/2 p-12">
                <div className="inline-flex items-center gap-2 bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                    <Sparkles className="w-4 h-4" /> Pour les Institutions
                </div>
                <h2 className="text-3xl font-bold mb-6">Kogito pour les Écoles</h2>
                <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                    Équipez votre établissement de notre technologie. Offrez à vos élèves un soutien scolaire illimité grâce à notre plateforme IA supervisée par des pédagogues.
                </p>
                <button className="bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl hover:bg-indigo-50 transition-colors">
                    Demander une démo école
                </button>
            </div>
            <div className="md:w-1/2 h-96 relative">
                 <Image 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" 
                    alt="School Hallway" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>
      </div>
    </main>
  );
}

function ServiceCard({ title, desc, icon, image, features, cta, popular }: any) {
    return (
        <div className={`bg-white rounded-3xl overflow-hidden border shadow-lg flex flex-col relative ${popular ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-slate-100'}`}>
            {popular && (
                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    Plus Populaire
                </div>
            )}
            <div className="h-48 relative">
                 <Image src={image} alt={title} fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className="absolute bottom-4 left-6 text-white font-bold text-xl flex items-center gap-3">
                    {icon}
                    {title}
                 </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
                <p className="text-slate-600 mb-8 leading-relaxed">
                    {desc}
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                    {features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {cta}
                </button>
            </div>
        </div>
    )
}
