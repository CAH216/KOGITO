import { Sparkles, Brain, Lock, History, MessageSquare } from "lucide-react";

export default function IAPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      
      <div className="relative pt-24 pb-32 px-4 overflow-hidden">
        
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 border border-indigo-500/50 rounded-full px-4 py-1.5 bg-indigo-500/10 mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-200">Propulsé par GPT-4 & Claude 3</span>
            </div>
            
            <h1 className="text-6xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                L'intelligence qui <br/> comprend votre enfant.
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
                Kogito n'est pas juste un chatbot. C'est un tuteur virtuel empathique qui s'adapte au style d'apprentissage de chaque élève pour débloquer son potentiel.
            </p>

            <div className="flex justify-center gap-4">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Discuter avec Kogito
                </button>
                <button className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                    Voir la démo
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Brain className="w-8 h-8 text-indigo-400" />}
                title="Socratique par défaut"
                desc="Kogito ne donne pas la réponse. Il pose des questions guidées pour aider l'élève à trouver la solution par lui-même."
            />
            <FeatureCard 
                icon={<History className="w-8 h-8 text-pink-400" />}
                title="Mémoire Long Terme"
                desc="Il se souvient des difficultés passées et adapte ses explications futures en fonction des progrès réalisés."
            />
            <FeatureCard 
                icon={<Lock className="w-8 h-8 text-emerald-400" />}
                title="Sécurité & Filtres"
                desc="Conçu pour les mineurs. Filtrage strict des contenus inappropriés et alertes automatiques aux parents en cas de danger."
            />
      </div>

    </main>
  );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{desc}</p>
        </div>
    )
}
