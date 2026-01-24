import { ArrowRight, CheckCircle2, Rocket, Heart, Zap } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function CareersPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-24 pb-16 px-4 bg-slate-900 text-white relative overflow-hidden">
             
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')"}}></div>
            
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-block bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-indigo-500/30">
                    Nous recrutons !
                </div>
                <h1 className="text-5xl font-extrabold mb-6">Rejoignez la révolution éducative</h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                    Nous construisons le futur du tutorat avec l'IA. Aidez-nous à démocratiser l'accès à une éducation d'élite pour tous les étudiants.
                </p>
                <a href="#positions" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full transition-all inline-flex items-center gap-2">
                    Voir les postes ouverts <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </div>

        {/* Culture */}
        <div className="py-24 px-4 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi Kogito ?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Plus qu'un job, une mission. Voici ce qui nous anime au quotidien.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <CultureCard 
                        icon={<Rocket className="w-8 h-8 text-indigo-600" />}
                        title="Innovation Rapide"
                        desc="Nous expédions du code tous les jours. L'expérimentation est au cœur de notre processus."
                    />
                    <CultureCard 
                        icon={<Heart className="w-8 h-8 text-rose-500" />}
                        title="Impact Réel"
                        desc="Chaque ligne de code aide un étudiant à mieux comprendre et à réussir ses examens."
                    />
                    <CultureCard 
                        icon={<Zap className="w-8 h-8 text-amber-500" />}
                        title="Excellence"
                        desc="Nous visons les plus hauts standards techniques et pédagogiques. Pas de compromis."
                    />
                </div>
            </div>
        </div>

        {/* Positions */}
        <div id="positions" className="py-24 px-4">
             <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">Postes Ouverts</h2>
                
                <div className="space-y-4">
                    <JobRow 
                        title="Tuteurs (Toutes matières)"
                        dept="Éducation"
                        loc="Distance / Présentiel"
                        type="Flexible"
                    />
                     <JobRow 
                        title="Créateurs de contenu pédagogique"
                        dept="Contenu"
                        loc="Distance"
                        type="Freelance"
                    />
                     <JobRow 
                        title="Ambassadeur Campus"
                        dept="Marketing"
                        loc="Sur campus"
                        type="Temps partiel"
                    />
                </div>

                <div className="mt-12 text-center text-slate-500">
                    Nous sommes toujours à la recherche de talents passionnés par l'éducation. <Link href="/tutors/apply" className="text-indigo-600 font-bold underline">Rejoignez-nous !</Link>.
                </div>
             </div>
        </div>

    </main>
    <SiteFooter />
    </>
  );
}

function CultureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
    )
}

function JobRow({ title, dept, loc, type }: any) {
    return (
        <Link href="/tutors/apply" className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
            <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{dept}</span>
                    <span> {loc}</span>
                    <span> {type}</span>
                </div>
            </div>
             <div className="mt-4 md:mt-0">
                <span className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">Postuler</span>
            </div>
        </Link>
    )
}
