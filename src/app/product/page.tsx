import { Laptop, Zap, Shield, BarChart3, Video, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Product */}
      <div className="pt-24 pb-20 px-4 text-center max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            La plateforme de tutorat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">la plus avancée</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12">
            Tout ce dont vous avez besoin pour apprendre, enseigner et progresser, réuni dans une interface fluide et puissante.
        </p>
        
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 ring-8 ring-slate-100 max-w-5xl mx-auto">
            <Image 
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200"
                alt="Dashboard Preview"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                <Feature 
                    icon={<Video className="w-6 h-6 text-indigo-600" />}
                    title="Salle de Classe Virtuelle"
                    desc="Tableau blanc interactif, partage d'écran HD, et éditeur de code collaboratif en temps réel."
                />
                <Feature 
                    icon={<MessageSquare className="w-6 h-6 text-rose-600" />}
                    title="Kogito AI Chat"
                    desc="Un assistant disponible 24/7 pour répondre aux questions, corriger des textes ou générer des idées."
                />
                 <Feature 
                    icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
                    title="Suivi de Performance"
                    desc="Des graphiques détaillés sur la progression, les points forts et les lacunes à combler."
                />
                 <Feature 
                    icon={<Shield className="w-6 h-6 text-blue-600" />}
                    title="Sécurité Totale"
                    desc="Données chiffrées, enregistrements sécurisés et vérification rigoureuse de tous les utilisateurs."
                />
                 <Feature 
                    icon={<Zap className="w-6 h-6 text-amber-500" />}
                    title="Réservation Instantanée"
                    desc="Réservez un cours en 3 clics. Synchronisation automatique avec Google Calendar et Outlook."
                />
                 <Feature 
                    icon={<Laptop className="w-6 h-6 text-purple-600" />}
                    title="Multi-plateforme"
                    desc="Accessible depuis n'importe quel navigateur, tablette ou mobile sans installation requise."
                />
            </div>
        </div>
      </div>

      {/* Tech Specs */}
      <div className="py-24 px-4 border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Intégrations & Technique</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Logos usually go here, using text for now */}
                <span className="text-2xl font-bold text-slate-400">Zoom SDK</span>
                <span className="text-2xl font-bold text-slate-400">OpenAI GPT-4</span>
                <span className="text-2xl font-bold text-slate-400">Stripe Connect</span>
                <span className="text-2xl font-bold text-slate-400">Vercel Edge</span>
            </div>
         </div>
      </div>

    </main>
  );
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-lg">{desc}</p>
        </div>
    )
}
