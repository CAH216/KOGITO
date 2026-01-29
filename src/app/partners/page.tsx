// Server Component
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { 
  Building2, 
  School, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Zap, 
  CheckCircle2,
  BrainCircuit,
  PieChart,
  Wallet
} from 'lucide-react';
import { PartnerRequestForm } from "@/components/partners/PartnerRequestForm";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-8">
                    Kogito pour les Organisations
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    L'IA Éducative au service de <span className="text-indigo-400">votre excellence</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                    Digitalisez votre établissement. Offrez un tuteur IA 24/7 à vos élèves, tout en gardant le contrôle pédagogique total.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    {/* Liens avec ancres corrigés */}
                    <Link href="#contact-form" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all hover:-translate-y-1">
                        Demander une démo
                    </Link>
                    <Link href="#pricing" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                        Voir les modèles économiques <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
                  Ils nous font confiance pour innover
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-400">
                      <School className="h-8 w-8" /> Académie du Savoir
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-400">
                      <Zap className="h-8 w-8" /> Future Tutors
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-400">
                      <Building2 className="h-8 w-8" /> Groupe Éducation
                  </div>
                  <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-400">
                      <Users className="h-8 w-8" /> Parents Unis
                  </div>
              </div>
          </div>
      </div>

      {/* Solutions Grid */}
      <div id="solutions" className="py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Solutions sur mesure</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Deux approches, un même objectif
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                
                {/* School Card */}
                <div className="flex flex-col bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-10 flex-1">
                        <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                            <School className="h-7 w-7 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Pour les Écoles</h3>
                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Étendez votre salle de classe. L'IA devient l'assistant personnel de chaque élève pour l'aide aux devoirs.
                        </p>
                        <ul className="mt-8 space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" />
                                <span className="text-slate-700">Tuteur disponible 24/7/365</span>
                            </li>
                             <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" />
                                <span className="text-slate-700">Tableau de bord de suivi du décrochage</span>
                            </li>
                             <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" />
                                <span className="text-slate-700">Supervision des conversations</span>
                            </li>
                        </ul>
                    </div>
                </div>

                 {/* Agency Card */}
                <div className="flex flex-col bg-slate-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-10 flex-1">
                        <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp className="h-7 w-7 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">Pour les Agences</h3>
                        <p className="mt-4 text-base leading-7 text-slate-400">
                            Digitalisez votre offre. Proposez une formule hybride "Tuteur Humain + IA" à vos clients.
                        </p>
                        <ul className="mt-8 space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-teal-400" />
                                <span className="text-slate-300">Marque Blanche (Votre Logo)</span>
                            </li>
                             <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-teal-400" />
                                <span className="text-slate-300">Escalade vers l'humain si l'IA bloque</span>
                            </li>
                             <li className="flex gap-3">
                                <CheckCircle2 className="h-6 w-5 flex-none text-teal-400" />
                                <span className="text-slate-300">Gestion de la facturation intégrée</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>

       {/* PRICING SECTION */}
      <div id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Modèles Économiques Flexibles</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Choisissez qui porte le coût de l'innovation : l'établissement ou les familles.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Model 1: Organization Pays */}
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAIRE ÉCOLES</div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Licence Établissement</h3>
                            <p className="text-sm text-slate-500">L'école offre le service aux élèves</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-slate-900">Sur Devis</span>
                        <span className="text-slate-500"> / an</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-slate-600">
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Gratuit pour toutes les familles</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Tableau de bord Admin complet</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Contrôle des "prompts" (Cerveau)</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Formation de l'équipe pédagogique</li>
                    </ul>
                    <a href="#contact-form" className="block w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                        Contacter l'équipe
                    </a>
                </div>

                {/* Model 2: Parents Pay */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Modèle "Partenaire"</h3>
                            <p className="text-sm text-slate-500">Les parents souscrivent individuellement</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-slate-900">0$</span>
                        <span className="text-slate-500"> pour l'école</span>
                    </div>
                     <ul className="space-y-3 mb-8 text-sm text-slate-600">
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Accès Dashboard gratuit pour l'école</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Code promo exclusif pour vos élèves</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Rétro-commission possible pour l'école</li>
                        <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Les parents paient l'abonnement "Pro"</li>
                    </ul>
                    <a href="#contact-form" className="block w-full text-center bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors">
                        Devenir partenaire
                    </a>
                </div>
            </div>
        </div>
      </div>

       {/* Brain Section */}
       <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black py-24 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                     <div className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-sm font-semibold leading-6 text-teal-400 ring-1 ring-inset ring-teal-500/20 mb-6">
                        Exclusivité Kogito
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                        Le Cerveau Dynamique :<br />
                        <span className="text-indigo-400">C'est vous qui décidez.</span>
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Contrairement aux IAs génériques, Kogito vous donne le contrôle. Configurez le "cerveau" de l'assistant pour qu'il respecte votre pédagogie.
                    </p>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-none">
                                <ShieldCheck className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold">Gardez le contrôle</h4>
                                <p className="text-sm text-slate-400">Définissez des règles strictes (ex: "Ne jamais donner la réponse en Maths sans explication").</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-none">
                                <BrainCircuit className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="font-bold">Contexte personnalisé</h4>
                                <p className="text-sm text-slate-400">L'IA connaît le programme de VOTRE classe et les devoirs assignés.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl skew-y-1">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                        <span className="ml-2 text-xs text-slate-500 font-mono">admin-console.exe</span>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between items-center text-slate-300">
                            <span>&gt; Règle #1: Tone</span>
                            <span className="text-green-400">[ACTIVE]</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded text-green-300">
                            "Encourage l'élève, utilise la méthode Socratique."
                        </div>
                    </div>
                </div>
            </div>
        </div>

      {/* Contact Form */}
      <div id="contact-form" className="py-24 sm:py-32 bg-white scroll-mt-24">
         <div className="max-w-xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Devenons Partenaires</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Remplissez ce formulaire pour planifier une démo ou discuter des tarifs.
                </p>
            </div>
            
            <PartnerRequestForm />
         </div>
      </div>

      <SiteFooter />
    </div>
  );
}
