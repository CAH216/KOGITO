'use client';

import { 
  ClipboardCheck, 
  Calendar, 
  Video, 
  Loader2, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from "next/link";

interface OnboardingDashboardProps {
  tutorProfile: any;
  userName?: string | null;
}

export default function OnboardingDashboard({ tutorProfile, userName }: OnboardingDashboardProps) {

  if (!tutorProfile) return <div>Chargement du profil...</div>;

  if (tutorProfile.status === 'REJECTED') {
      return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <AlertCircle className="h-8 w-8 text-red-600" />
                 </div>
                 <h1 className="text-2xl font-bold text-slate-900 mb-2">Candidature refusée</h1>
                 <p className="text-slate-600 mb-6">
                    Malheureusement, votre profil ne correspond pas aux critères que nous recherchons actuellement pour nos tuteurs.
                 </p>
                 <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 mb-8 border border-slate-200">
                    Si vous pensez qu'il s'agit d'une erreur, vous pouvez contacter notre support pour plus d'informations.
                 </div>
                 <Link href="/auth/signout" className="block w-full py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
                    Se déconnecter
                 </Link>
            </div>
        </div>
      )
  }

  const steps = [
    { id: 1, title: 'Inscription', status: 'completed' },
    { id: 2, title: 'Vérification du dossier', status: tutorProfile.interviewDate ? 'completed' : 'current' },
    { id: 3, title: 'Entretien Vidéo', status: tutorProfile.interviewDate ? 'current' : 'upcoming' },
    { id: 4, title: 'Validation Finale', status: 'upcoming' },
  ];

  const interviewDate = tutorProfile.interviewDate ? new Date(tutorProfile.interviewDate) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
             {userName?.charAt(0) || "T"}
          </div>
          <div className="text-center md:text-left">
             <h1 className="text-2xl font-bold text-slate-900">Bienvenue, {userName} !</h1>
             <p className="text-slate-500 mt-1">
               Votre candidature est en cours de traitement. Suivez l'avancement de votre dossier ici.
             </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Parcours d'intégration</h2>
            <div className="relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
                
                {/* Connector Line (Mobile) */}
                <div className="md:hidden absolute left-5 top-0 w-0.5 h-full bg-slate-100 -z-10" />

                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                    {steps.map((step) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';
                        
                        return (
                            <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-4 transition-colors z-10 ${
                                    isCompleted ? 'bg-green-500 border-green-100 text-white' :
                                    isCurrent ? 'bg-blue-600 border-blue-100 text-white animate-pulse' :
                                    'bg-white border-slate-200 text-slate-300'
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">{step.id}</span>}
                                </div>
                                <span className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Action Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            
            {/* Status Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                <div className="flex items-center gap-3 mb-4">
                    <ClipboardCheck className="h-6 w-6 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900">État du dossier</h3>
                </div>
                
                {!interviewDate ? (
                     <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-800 font-medium">En attente d'examen</p>
                            <p className="text-amber-700/80 text-sm mt-1">
                                Notre équipe examine actuellement votre CV et vos informations. Vous recevrez une notification pour planifier un entretien.
                            </p>
                        </div>
                     </div>
                ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-green-800 font-medium">Dossier pré-validé</p>
                            <p className="text-green-700/80 text-sm mt-1">
                                Votre profil a retenu notre attention. Une session d'entretien a été programmée.
                            </p>
                        </div>
                     </div>
                )}
            </div>

            {/* Interview Card */}
            <div className={`p-6 rounded-2xl shadow-sm border h-full flex flex-col ${interviewDate ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                 <div className="flex items-center gap-3 mb-4">
                    <Video className={`h-6 w-6 ${interviewDate ? 'text-blue-200' : 'text-slate-400'}`} />
                    <h3 className={`text-lg font-semibold ${interviewDate ? 'text-white' : 'text-slate-900'}`}>Session d&apos;entretien</h3>
                 </div>

                 {interviewDate ? (
                     <div className="flex-1 flex flex-col justify-between">
                         <div className="space-y-4">
                             <div className="flex items-center gap-3 text-blue-100 bg-blue-500/30 p-3 rounded-lg">
                                 <Calendar className="h-5 w-5" />
                                 <span className="font-medium">
                                    {interviewDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                 </span>
                             </div>
                             <div className="flex items-center gap-3 text-blue-100 bg-blue-500/30 p-3 rounded-lg">
                                 <Clock className="h-5 w-5" />
                                 <span className="font-medium">
                                    {interviewDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                             </div>
                         </div>
                         
                         <div className="mt-6">
                            <Link 
                                href={`/interview/tutor-${tutorProfile.id}`}
                                className="block w-full bg-white text-blue-600 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Rejoindre la visioconférence
                            </Link>
                            <p className="text-xs text-blue-200 text-center mt-3">
                                Le lien sera actif 10 minutes avant l'heure.
                            </p>
                         </div>
                     </div>
                 ) : (
                     <div className="flex-1 flex items-center justify-center text-center">
                         <p className="text-slate-500">
                            Aucun entretien programmé pour le moment.
                         </p>
                     </div>
                 )}
            </div>

        </div>
      </div>
    </div>
  );
}
