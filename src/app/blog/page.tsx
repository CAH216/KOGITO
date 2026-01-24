import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function BlogPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Le Blog éducatif</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Conseils d'étude, astuces pour les parents et actualités sur l'éducation et l'IA.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <BlogCard 
                category="Méthodologie"
                title="Comment préparer ses examens finaux sans stresser"
                excerpt="Découvrez la méthode des 3 couches pour mémoriser efficacement vos cours en un temps record."
                image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
                author="Sophie M."
                date="12 Jan 2024"
            />
             <BlogCard 
                category="Technologie"
                title="Pourquoi l'IA ne remplacera jamais les professeurs"
                excerpt="L'intelligence artificielle est un outil puissant, mais l'empathie humaine reste irremplaçable dans l'éducation."
                image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                author="Dr. Tremblay"
                date="05 Jan 2024"
            />
             <BlogCard 
                category="Parents"
                title="Aider son enfant à gérer son temps d'écran"
                excerpt="Des stratégies bienveillantes pour équilibrer études et loisirs numériques à la maison."
                image="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
                author="Marc L."
                date="28 Dec 2023"
            />
            <BlogCard 
                category="Sciences"
                title="Comprendre les bases de la physique quantique"
                excerpt="Une introduction simplifiée aux concepts qui régissent l'infiniment petit."
                image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
                author="Julie P."
                date="15 Dec 2023"
            />
            <BlogCard 
                category="Vie Étudiante"
                title="5 applications indispensables pour s'organiser"
                excerpt="Notre sélection des meilleurs outils digitaux pour booster votre productivité cette année."
                image="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800"
                author="Kevin T."
                date="10 Dec 2023"
            />
            <BlogCard 
                category="Nouveautés"
                title="Kogito lance son programme de tutorat hybride"
                excerpt="Une nouvelle offre combinant séances en personne et suivi par IA 24/7."
                image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                author="Team Kogito"
                date="01 Dec 2023"
            />
        </div>

        <div className="mt-16 flex justify-center">
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Charger plus d'articles
            </button>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}

function BlogCard({ category, title, excerpt, image, author, date }: any) {
    return (
        <Link href="#" className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group block">
            <div className="relative h-48 w-full">
                <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    {category}
                </div>
            </div>
            <div className="p-6">
                 <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                    {excerpt}
                </p>
                <div className="flex items-center text-indigo-600 font-bold text-sm">
                    Lire l'article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    )
}
