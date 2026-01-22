'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  LineChart, 
  ShieldCheck, 
  Brain, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Mail,
  Phone,
  School
} from 'lucide-react';

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation Specifique B2B */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2">
                <div className="bg-indigo-900 p-2 rounded-lg">
                   <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">Kogito <span className="text-indigo-600">Éducation</span></span>
           </Link>
           <div className="hidden md:flex gap-8 items-center">
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Solutions</a>
              <a href="#analytics" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pilotage</a>
              <a href="#contact" className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                Demander une démo
              </a>
           </div>
        </div>
      </nav>

      <main>
        {/* Hero Section B2B */}
        <div className="relative bg-slate-50 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8">
                        <School className="h-4 w-4" />
                        Partenariat Établissements Scolaires
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                        Prolongez l'excellence pédagogique <br />
                        <span className="text-indigo-600">au-delà de la classe.</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Offrez à vos élèves un soutien scolaire hybride (IA + Tuteurs Certifiés) directement piloté par votre établissement. Luttez contre le décrochage scolaire avec des données précises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#contact" className="px-8 py-4 rounded-xl bg-indigo-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:translate-y-[-2px]">
                            Devenir Établissement Partenaire
                        </a>
                        <a href="#solutions" className="px-8 py-4 rounded-xl bg-white text-slate-700 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                             Découvrir la plateforme
                             <ArrowRight className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* Value Props */}
        <div id="solutions" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    <FeatureCard 
                        icon={Brain}
                        title="IA Pédagogique Adaptative"
                        description="Notre IA analyse les lacunes de chaque élève en temps réel et propose des exercices ciblés qui complètent votre programme scolaire."
                    />
                    <FeatureCard 
                        icon={Users}
                        title="Tuteurs Agréés"
                        description="Accès à notre réseau de tuteurs certifiés pour des sessions de remédiation en visioconférence, synchronisées avec les besoins identifiés."
                    />
                    <FeatureCard 
                        icon={LineChart}
                        title="Tableau de Bord Direction"
                        description="Suivez la progression de vos cohortes, identifiez les élèves à risque et mesurez l'impact du soutien scolaire sur les résultats."
                    />
                </div>
            </div>
        </div>

        {/* Dashboard Preview Section */}
        <div id="analytics" className="py-24 bg-slate-950 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">Le pilotage par la donnée.</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Ne laissez plus aucun élève passer sous les radars. Notre interface administrateur vous donne une vue d'ensemble sur l'engagement et la performance de vos élèves en dehors des heures de cours.
                        </p>
                        <ul className="space-y-4">
                            <ListItem text="Indicateurs de décrochage en temps réel" />
                            <ListItem text="Rapports d'activité hebdomadaires" />
                            <ListItem text="Intégration simple (code établissement)" />
                            <ListItem text="Conforme RGPD et protection des mineurs" />
                        </ul>
                    </div>
                    <div className="relative">
                         <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                         <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl skew-y-[-2deg] hover:skew-y-0 transition-transform duration-700">
                            {/* Fake Dashboard UI */}
                            <div className="bg-slate-950 rounded-lg p-6 h-[400px] flex flex-col gap-4">
                                <div className="flex gap-4 mb-4">
                                    <div className="h-24 w-1/3 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-24 w-1/3 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-24 w-1/3 bg-slate-800 rounded animate-pulse" />
                                </div>
                                <div className="flex-1 bg-slate-800/50 rounded flex items-center justify-center text-slate-700 font-mono text-sm">
                                    [Visualisation des Données Élèves]
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact" className="py-24 bg-indigo-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
                    <div className="p-10 md:p-14">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Parlons de votre établissement</h2>
                            <p className="text-slate-600">
                                Pour garantir la qualité de notre service, nous travaillons sur devis et contrat cadre avec les établissements. Remplissez ce formulaire pour être recontacté par notre équipe Éducation.
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'établissement</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white" placeholder="Lycée Condorcet" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white" placeholder="Paris" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom du contact</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white" placeholder="M. martin" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fonction</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white" placeholder="Directeur / Chef d'établissement" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email professionnel</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white" placeholder="direction@academie.fr" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre d'élèves concernés (estimation)</label>
                                <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 bg-white">
                                    <option>Moins de 100</option>
                                    <option>100 - 500</option>
                                    <option>500 - 1000</option>
                                    <option>Plus de 1000</option>
                                </select>
                            </div>

                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform transform active:scale-[0.98]">
                                Demander une présentation
                            </button>

                            <p className="text-center text-xs text-slate-400 mt-4">
                                Vos données sont traitées conformément à notre politique de confidentialité.
                            </p>
                        </form>
                    </div>
                    <div className="bg-indigo-900 p-8 flex justify-center gap-8 text-indigo-200 text-sm">
                        <div className="flex items-center gap-2">
                             <Phone className="h-4 w-4" />
                             01 23 45 67 89
                        </div>
                        <div className="flex items-center gap-2">
                             <Mail className="h-4 w-4" />
                             partenaires@kogito-education.com
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all">
            <div className="h-14 w-14 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </div>
    )
}

function ListItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-slate-300 font-medium">{text}</span>
        </li>
    )
}
