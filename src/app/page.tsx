import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  Users, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  Brain,
  Clock,
  GraduationCap,
  Video,
  MonitorPlay,
  Star,
  MessageCircle,
  ChevronDown
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    // "min-h-screen" here causes hydration warning if Body also has styles.
    // Simplifying standard semantic structure.
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Kogito</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#subjects" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Matières
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Tarifs
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                 <Link 
                    href={
                      session.user.role === 'ADMIN' ? "/admin/dashboard" : 
                      session.user.role === 'EMPLOYEE' ? "/employee/dashboard" :
                      session.user.role === 'PARENT' ? "/parent/dashboard" :
                      session.user.role === 'TUTOR' ? "/tutor/dashboard" :
                      session.user.role === 'SCHOOL_ADMIN' ? "/school-admin/dashboard" :
                      "/dashboard"
                    } 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                 >
                    Mon Espace ({session.user.name?.split(' ')[0]})
                    <ArrowRight className="h-4 w-4" />
                 </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium text-slate-900 hover:text-blue-600">
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    Commencer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden pt-10 pb-16 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-100">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Inscriptions ouvertes 2024-2025
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                L'excellence scolaire <br/>
                <span className="text-blue-600">à portée de main.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Une plateforme d'apprentissage <strong>interactive</strong> où votre enfant progresse avec l'IA et choisit son propre tuteur pour des explications en <strong>vidéo live</strong> quand il en a besoin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                >
                  Essayer gratuitement
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex justify-center items-center px-8 py-4 border border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all hover:border-blue-300"
                >
                  <MonitorPlay className="w-5 h-5 mr-2 text-slate-500" />
                  Voir la démo
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" /> 
                  ))}
                </div>
                <p>Rejoint par +1,000 familles cette semaine</p>
              </div>
            </div>

            {/* Visual Content - Interface Mockup */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-slate-900 shadow-2xl overflow-hidden border border-slate-800">
                {/* Mock Window Header */}
                <div className="bg-slate-800/50 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs text-slate-400 font-mono">Kogito - Mathématiques - Live Class</div>
                </div>

                {/* Mock Video Interface */}
                <div className="relative aspect-video bg-slate-900 flex flex-col">
                  {/* Main Video Area (Tutor) */}
                  <div className="flex-1 relative bg-slate-800/50 m-2 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
                    <div className="text-center">
                       <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">👨‍🏫</div>
                       <p className="text-white font-medium">M. Thomas (Tuteur Expert)</p>
                       <p className="text-indigo-300 text-sm animate-pulse">En direct • Équation du 2nd degré</p>
                    </div>
                    {/* Student PiP */}
                    <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 shadow-lg flex items-center justify-center">
                       <span className="text-white text-xs">Votre enfant</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="h-14 bg-slate-900 flex items-center justify-center gap-4 px-4 pb-2">
                    <div className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer transition-colors">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer transition-colors">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white cursor-pointer transition-colors shadow-lg shadow-red-900/50">
                      <span className="font-bold text-xs">FIN</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Exercice Résolu</p>
                    <p className="text-xs text-slate-500">Il y a 2 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase mb-2">Technologie & Humain</h2>
               <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  Tout ce dont votre enfant a besoin pour exceller.
               </p>
               <p className="mt-4 text-slate-500 text-lg">
                  Nous combinons l'intelligence artificielle pour la pratique quotidienne et des experts humains pour les concepts profonds.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Feature 1 */}
               <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600">
                     <MonitorPlay className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Visioconférence Sécurisée</h3>
                  <p className="text-slate-600 leading-relaxed">
                     Une salle de classe virtuelle intégrée. Tableau blanc partagé, discussion audio/vidéo fluide sans aucune installation de logiciel externe.
                  </p>
               </div>

               {/* Feature 2 */}
               <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-600">
                     <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Choix du Tuteur</h3>
                  <p className="text-slate-600 leading-relaxed">
                     L'élève est acteur de son apprentissage. En cas de blocage, il parcourt les profils recommandés et choisit le tuteur avec qui il se sent le plus à l'aise.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-emerald-600">
                     <Brain className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">IA Interactive</h3>
                  <p className="text-slate-600 leading-relaxed">
                     Pas de cours magistral ennuyeux. L'IA pose des questions, lance des défis et adapte les exercices au niveau réel de votre enfant.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-20 bg-slate-900 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl font-bold mb-4">Toutes les matières principales</h2>
                  <p className="text-slate-400 max-w-xl">
                     Du collège au lycée, nous couvrons le programme officiel pour assurer de meilleures notes partout.
                  </p>
               </div>
               <Link href="/matires" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 font-medium mt-4 md:mt-0">
                  Voir tout le programme <ArrowRight className="ml-2 w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { name: "Mathématiques", icon: "📐", count: "1200+ Exos" },
                  { name: "Physique-Chimie", icon: "🧪", count: "850+ Exos" },
                  { name: "Français", icon: "📚", count: "Grammaire & Littérature" },
                  { name: "Anglais", icon: "🇬🇧", count: "Oral & Écrit" },
                  { name: "Histoire-Géo", icon: "🌍", count: "Cartes & Dates" },
                  { name: "SVT", icon: "🧬", count: "Biologie & Géologie" },
                  { name: "Espagnol", icon: "🇪🇸", count: "Vocabulaire" },
                  { name: "Philosophie", icon: "🤔", count: "Méthodologie" },
               ].map((subject, idx) => (
                  <div key={idx} className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 p-6 rounded-xl transition-colors cursor-pointer group">
                     <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{subject.icon}</div>
                     <h3 className="font-bold text-lg">{subject.name}</h3>
                     <p className="text-xs text-slate-400 mt-1">{subject.count}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Tutor Selection Preview */}
      <section className="py-24 bg-blue-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto lg:mr-auto rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-900">Choisir un tuteur</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">Maths • 3ème</span>
                     </div>
                     <div className="space-y-4">
                        {[
                           { name: "Sarah Connor", rating: 4.9, role: "Professeur Certifié", img: "👩‍🏫" },
                           { name: "John Smith", rating: 4.8, role: "Étudiant Grande École", img: "👨‍🎓" },
                           { name: "Marie Curie", rating: 5.0, role: "Expert Doctorant", img: "👩‍🔬" }
                        ].map((tutor, i) => (
                           <div key={i} className="flex items-center p-3 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl mr-4 shadow-sm group-hover:bg-white">
                                 {tutor.img}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between">
                                    <h5 className="font-bold text-slate-800 text-sm">{tutor.name}</h5>
                                    <div className="flex items-center text-yellow-500 text-xs">
                                       <Star className="w-3 h-3 fill-current" /> {tutor.rating}
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500">{tutor.role}</p>
                              </div>
                              <div className="bg-blue-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="order-1 lg:order-2">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">
                     L'élève a le dernier mot.
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Parce que le feeling est important pour apprendre, nous laissons votre enfant choisir le tuteur qui lui correspond le mieux parmi une pré-sélection qualifiée.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Profils détaillés avec avis d'autres élèves
                     </li>
                     <li className="flex items-center text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Disponibilité immédiate affichée
                     </li>
                     <li className="flex items-center text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        Badges de certification vérifiés
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

       {/* FAQ Section */}
       <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Questions Fréquentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Comment fonctionne l'abonnement ?", a: "C'est un abonnement mensuel unique pour le parent qui donne accès à l'IA en illimité. Les sessions de tutorat humain sont incluses selon votre forfait." },
              { q: "Les tuteurs sont-ils qualifiés ?", a: "Oui, chaque tuteur passe un processus de vérification rigoureux (Diplômes, Casier judiciaire, Entretien pédagogique)." },
              { q: "Mon enfant est-il en sécurité ?", a: "Absolument. Toutes les conversations et vidéos sont enregistrées et analysées par des algorithmes de sécurité pour protéger les mineurs." },
              { q: "Puis-je suivre les progrès ?", a: "Oui, vous avez accès à un tableau de bord parent détaillé avec les notions acquises et les temps d'étude." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 pb-4">
                <button className="flex w-full justify-between items-center text-left py-2 focus:outline-none">
                   <span className="font-semibold text-slate-900 text-lg">{faq.q}</span>
                   <ChevronDown className="w-5 h-5 text-slate-400" />
                </button>
                <p className="mt-2 text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
               <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                     <Brain className="h-6 w-6 text-blue-600" />
                     <span className="text-xl font-bold text-slate-900">Kogito</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">
                     La plateforme de soutien scolaire nouvelle génération qui réconcilie technologie et pédagogie humaine.
                  </p>
                  <div className="flex gap-4">
                     {/* Social icons placeholders */}
                     <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">𝕏</div>
                     <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors">In</div>
                  </div>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Plateforme</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Comment ça marche</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Nos Tuteurs</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Tarifs</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Pour les Écoles</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Support</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Centre d'aide</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Contacter l'équipe</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Signaler un problème</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Légal</h4>
                  <ul className="space-y-3 text-sm text-slate-600">
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Confidentialité</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">CGU</Link></li>
                     <li><Link href="#" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
                  </ul>
               </div>
            </div>
            <div className="text-center pt-8 border-t border-slate-100 text-slate-400 text-sm">
               © 2024 Kogito. Tous droits réservés.
            </div>
         </div>
      </footer>
    </main>
  );
}
