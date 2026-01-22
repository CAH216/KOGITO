'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Globe, 
  Upload,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { submitTutorApplication } from '@/actions/tutor-actions';

export default function TutorApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitTutorApplication(formData);

    if (result.success) {
       // Show success state instead of redirecting immediately
       setIsSubmitting(false);
       setSuccess(true);
    } else {
      setErrorMessage(result.error || 'Une erreur est survenue.');
      setIsSubmitting(false);
    }
  }

  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
         {/* Navbar simple */}
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                  <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Kogito Tuteurs</span>
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-green-100 p-6 rounded-full mb-6 relative animate-bounce-slow">
             <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Candidature envoyée !</h1>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 max-w-lg mx-auto text-left space-y-4">
             <h3 className="font-bold text-blue-900 flex items-center gap-2">
               <span className="flex h-6 w-6 rounded-full bg-blue-200 items-center justify-center text-blue-800 text-xs">1</span>
               Connectez-vous à votre espace
             </h3>
             <p className="text-sm text-blue-800/80 ml-8">
               Utilisez l'email et le mot de passe que vous venez de créer pour accéder à votre tableau de bord tuteur.
             </p>

             <h3 className="font-bold text-blue-900 flex items-center gap-2">
               <span className="flex h-6 w-6 rounded-full bg-blue-200 items-center justify-center text-blue-800 text-xs">2</span>
               Suivez votre dossier
             </h3>
             <p className="text-sm text-blue-800/80 ml-8">
               Vous verrez l'avancement de la vérification et la confirmation de votre date d'entretien vidéo.
             </p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
              Retour à l&apos;accueil
            </Link>
            <Link href="/auth/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-blue-500/30">
              Se connecter à mon espace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar simple */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                   <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Kogito Tuteurs</span>
           </Link>
           <div className="flex gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Déjà inscrit ?
              </Link>
           </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="relative bg-slate-900 py-20 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                 <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-blue-600/20 blur-3xl opacity-50" />
                 <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Transmettez votre savoir,<br />
                        <span className="text-blue-400">Inspirez le futur.</span>
                    </h1>
                    <p className="mt-6 text-xl text-slate-300 max-w-2xl">
                        Rejoignez l'élite des tuteurs sur Kogito. Une plateforme innovante, une rémunération attractive et la liberté d'enseigner à votre rythme.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                        <a href="#apply-form" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all hover:shadow-lg shadow-blue-500/30">
                            Postuler maintenant
                        </a>
                        <Link href="/about" className="inline-flex items-center justify-center px-8 py-3 border border-slate-700 text-base font-medium rounded-full text-slate-300 hover:bg-slate-800 md:py-4 md:text-lg md:px-10 transition-colors">
                            En savoir plus
                        </Link>
                    </div>
                </div>
                
                {/* Stats / Graphics */}
                <div className="hidden lg:block relative">
                    <div className="relative rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                               <DollarSign className="h-6 w-6" />
                           </div>
                           <div>
                               <p className="text-slate-400 text-sm">Gains moyens</p>
                               <p className="text-2xl font-bold text-white">25€ - 45€ <span className="text-sm font-normal text-slate-400">/ heure</span></p>
                           </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                                <span>Paiement hebdomadaire garanti</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                                <span>Outils pédagogiques intégrés</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                                <span>Emploi du temps flexible</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Benefits Grid */}
        <div className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">Pourquoi devenir tuteur Kogito ?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BenefitCard 
                        icon={Clock}
                        title="Liberté totale"
                        description="Gérez votre emploi du temps comme vous le souhaitez. Acceptez les cours qui vous conviennent, quand vous êtes disponible."
                    />
                    <BenefitCard 
                        icon={DollarSign}
                        title="Revenus attractifs"
                        description="Fixez vos tarifs ou suivez nos recommandations. Plus vous enseignez et meilleures sont vos notes, plus vous gagnez."
                    />
                    <BenefitCard 
                        icon={Globe}
                        title="Impact Global"
                        description="Accédez à des milliers d'élèves motivés, peu importe où vous vous trouvez grâce à notre classe virtuelle."
                    />
                </div>
            </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-slate-900 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Candidature Tuteur</h2>
                        <p className="text-slate-400 text-sm mt-1">Remplissez ce formulaire pour rejoindre notre réseau d'experts.</p>
                    </div>
                    
                    <div className="p-8">
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                                {errorMessage}
                            </div>
                        )}
                        <form action={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Prénom <span className="text-red-500">*</span></label>
                                    <input name="firstName" required type="text" className="text-slate-900 bg-white mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Nom <span className="text-red-500">*</span></label>
                                    <input name="lastName" required type="text" className="text-slate-900 bg-white mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email professionnel <span className="text-red-500">*</span></label>
                                <input name="email" required type="email" className="text-slate-900 bg-white mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700">Mot de passe <span className="text-red-500">*</span></label>
                                <div className="relative mt-1">
                                    <input 
                                        name="password" 
                                        required 
                                        type={showPassword ? "text" : "password"} 
                                        className="text-slate-900 bg-white block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pr-10" 
                                        placeholder="Min. 8 caractères"
                                        minLength={8}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Matières enseignées (Plusieurs choix possibles) <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        "Mathématiques", "Physique-Chimie", "Anglais", "Français",
                                        "Histoire-Géo", "SVT", "Informatique", "Philosophie", 
                                        "Espagnol", "Allemand", "Économie", "Aide aux devoirs"
                                    ].map((subject) => (
                                        <label key={subject} className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                                            <input 
                                                type="checkbox" 
                                                name="subjects" 
                                                value={subject} 
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 mr-2"
                                            />
                                            <span className="text-sm font-medium text-slate-900">{subject}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-slate-500">Cochez toutes les matières pour lesquelles vous êtes qualifié(e).</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Votre expérience</label>
                                    <select name="experience" className="text-slate-900 bg-white mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2">
                                        <option value="Junior (0-2 ans)">Junior (0-2 ans)</option>
                                        <option value="Confirmé (2-5 ans)">Confirmé (2-5 ans)</option>
                                        <option value="Senior (5-10 ans)">Senior (5-10 ans)</option>
                                        <option value="Expert (10+ ans)">Expert (10+ ans)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tarif horaire (CAD/h) <span className="text-red-500">*</span></label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-slate-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            min="15"
                                            max="200"
                                            placeholder="25"
                                            required
                                            className="text-slate-900 bg-white block w-full rounded-md border-slate-300 pl-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">Les sessions de 30min seront à 50% de ce tarif.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">CV / Diplômes</label>
                                <div className="mt-1">
                                    <input 
                                        type="file" 
                                        name="cv" 
                                        accept=".pdf,.doc,.docx"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg cursor-pointer bg-slate-50"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">PDF ou Word, max 5MB. Optionnel mais recommandé.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Courte présentation</label>
                                <textarea name="bio" rows={4} className="text-slate-900 bg-white mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="Présentez-vous en quelques lignes..." />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <label className="block text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                                    <Clock size={16} /> Proposition d'entretien (Visio 15min) <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-blue-700 mb-2">Pour valider votre profil, nous devons échanger de vive voix.</p>
                                <input 
                                    name="interviewDate" 
                                    required 
                                    type="datetime-local" 
                                    className="text-slate-900 bg-white mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors flex justify-center items-center group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Envoyer ma candidature
                                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
            &copy; 2026 Kogito Education. Tous droits réservés.
        </footer>
      </main>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    )
}

function Star({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
    )
}