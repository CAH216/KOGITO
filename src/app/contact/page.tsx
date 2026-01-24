import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function ContactPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contactez-nous</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Notre équipe est basée à Montréal et disponible 7j/7 pour répondre à vos questions.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
                <ContactCard 
                    icon={<Mail className="w-6 h-6 text-indigo-600" />}
                    title="Email"
                    content="support@kogito.ca"
                    link="mailto:support@kogito.ca"
                />
                <ContactCard 
                    icon={<Phone className="w-6 h-6 text-emerald-600" />}
                    title="Téléphone"
                    content="+1 (514) 555-0123"
                    link="tel:+15145550123"
                />
                <ContactCard 
                    icon={<MapPin className="w-6 h-6 text-red-500" />}
                    title="Bureaux"
                    content="1234 Boul. De Maisonneuve O, Montréal, QC H3G 1M8"
                />
                
                <div className="bg-indigo-900 text-white p-8 rounded-3xl mt-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <h3 className="text-2xl font-bold mb-4">Besoin d'une démo ?</h3>
                    <p className="text-indigo-200 mb-6">
                        Vous êtes une école ou une commission scolaire ? Réservez une démonstration de notre plateforme Kogito Schools.
                    </p>
                    <button className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors">
                        Planifier un appel
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="Jean Dupont" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="jean@exemple.com" />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sujet</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all">
                            <option>Support Technique</option>
                            <option>Question sur les tarifs</option>
                            <option>Partenariat</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all h-32" placeholder="Comment pouvons-nous vous aider ?" ></textarea>
                    </div>
                    <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        Envoyer le message
                    </button>
                </form>
            </div>

        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}

function ContactCard({ icon, title, content, link }: { icon: any, title: string, content: string, link?: string }) {
    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="p-3 bg-slate-50 rounded-xl">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                {link ? (
                    <a href={link} className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">{content}</a>
                ) : (
                    <p className="text-slate-600">{content}</p>
                )}
            </div>
        </div>
    )
}
