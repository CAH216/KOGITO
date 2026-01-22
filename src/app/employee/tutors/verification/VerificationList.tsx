'use client';

import { useState } from 'react';
import { TutorStatus } from '@prisma/client';
import { updateTutorStatus } from '@/actions/tutor-actions';
import { Check, X, Eye, FileText, User, Calendar, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TutorProfileWithUser = {
  id: string;
  subjects: string[];
  experience: string | null;
  bio: string | null;
  status: TutorStatus;
  interviewDate: Date | null;
  cvUrl: string | null;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export default function VerificationList({ initialTutors }: { initialTutors: TutorProfileWithUser[] }) {
  const [tutors, setTutors] = useState<TutorProfileWithUser[]>(initialTutors);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusUpdate = async (id: string, status: TutorStatus) => {
    setProcessingId(id);
    try {
      const result = await updateTutorStatus(id, status);
      if (result.success) {
        setTutors((prev) => prev.filter((t) => t.id !== id));
        router.refresh(); // Refresh server data if needed elsewhere
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue");
    } finally {
      setProcessingId(null);
    }
  };

  if (tutors.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
             <Check className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Aucune demande en attente</h3>
        <p className="text-slate-500 mt-1">Tous les dossiers ont été traités.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tutors.map((tutor) => (
        <div key={tutor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              
              {/* Info Candidat */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {tutor.user.name?.charAt(0) || <User />}
                  </div>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">{tutor.user.name}</h3>
                   <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <FileText className="h-4 w-4" />
                      <span>{tutor.experience || 'Non spécifié'}</span>
                   </div>
                   {tutor.cvUrl && (
                      <a href={tutor.cvUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 text-sm mt-1 hover:underline">
                          <FileText className="h-4 w-4" />
                          Voir le CV
                      </a>
                   )}
                   <div className="mt-2 flex flex-wrap gap-2">
                      {tutor.subjects.map((sub, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {sub}
                        </span>
                      ))}
                   </div>
                </div>
              </div>

              {/* Bio & Actions */}
              <div className="flex-1 md:border-l md:pl-6 border-slate-100">
                 {tutor.interviewDate && (
                    <div className="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Proposition d'entretien</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {new Date(tutor.interviewDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 pl-8">
                           <a 
                              href={`/interview/tutor-${tutor.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-2 text-xs bg-white border border-orange-200 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-100 transition-colors font-semibold shadow-sm"
                           >
                              <Video className="h-3 w-3" />
                              Démarrer l'entretien vidéo
                           </a>
                        </div>
                    </div>
                 )}

                 <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Présentation</h4>
                 <p className="text-slate-600 text-sm italic mb-4 line-clamp-3">
                    "{tutor.bio || "Pas de bio"}"
                 </p>
                 
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleStatusUpdate(tutor.id, 'APPROVED')}
                        disabled={processingId === tutor.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Check className="h-4 w-4" />
                        Accepter
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(tutor.id, 'REJECTED')}
                        disabled={processingId === tutor.id}
                        className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <X className="h-4 w-4" />
                        Rejeter
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
