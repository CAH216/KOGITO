import Image from "next/image";
import { Users, Target, Heart, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function AboutPage() {
  return (
    <>
    <SiteHeader />
    <main className="bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/40 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl font-extrabold mb-6">Notre Mission</h1>
            <p className="text-2xl text-slate-200 max-w-3xl mx-auto">
                Démocratiser l'excellence scolaire en rendant le tutorat de haute qualité accessible à tous, à tout moment.
            </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">La genèse de Kogito</h2>
            <div className="prose prose-lg text-slate-600">
                <p>
                    Tout a commencé avec un constat simple : le tutorat traditionnel est cassé. Trop cher, rigide, et souvent inefficace car il n'intervient pas au moment précis où l'élève est bloqué.
                </p>
                <p>
                    Nous avons réuni une équipe d'ingénieurs en IA et de pédagogues chevronnés pour créer la première solution hybride. Une IA bienveillante pour l'immédiat, et des humains experts pour la profondeur.
                </p>
            </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Nos Valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <ValueCard 
                    icon={<Target className="w-8 h-8 text-indigo-600" />}
                    title="Excellence"
                    desc="Nous ne faisons aucun compromis sur la qualité de nos tuteurs et de nos algorithmes."
                />
                <ValueCard 
                    icon={<Heart className="w-8 h-8 text-red-500" />}
                    title="Bienveillance"
                    desc="L'apprentissage passe par la confiance. Notre IA est programmée pour encourager, jamais pour juger."
                />
                <ValueCard 
                    icon={<Zap className="w-8 h-8 text-yellow-500" />}
                    title="Accessibilité"
                    desc="Le savoir ne doit pas être un luxe. Nous nous battons pour garder des prix justes."
                />
            </div>
        </div>
      </section>

    </main>
    <SiteFooter />
    </>
  );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="mb-4 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{desc}</p>
        </div>
    )
}

function TeamMember({ name, role, img }: { name: string, role: string, img: string }) {
    return (
        <div className="text-center group">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                <img src={img} alt={name} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">{name}</h4>
            <span className="text-slate-500 font-medium">{role}</span>
        </div>
    )
}
