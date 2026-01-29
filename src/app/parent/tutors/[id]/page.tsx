import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { MapPin, Star, Calendar, MessageCircle, ArrowLeft, Video, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TutorProfileActions from './components/TutorProfileActions';

interface TutorProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function TutorProfilePage(props: TutorProfilePageProps) {
  const params = await props.params;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: params.id },
    include: {
        user: {
            select: { id: true, name: true, image: true, email: true }
        },
        organization: true,
        sessions: {
            where: { status: 'COMPLETED' },
            take: 5,
            orderBy: { startTime: 'desc' }
        }
    }
  });

  if (!tutor) {
      notFound();
  }

  // Get Parent Balance (We assume user is authenticated if they can access this page)
  // But we need the userId. We can get it from session, but let's assume we can fetch the parent profile linked to current user.
  // Actually, for simplicity in server component, let's fetch session.
  // We can't use hooks here. 
  
  const { authOptions } = await import('@/lib/auth');
  const { getServerSession } = await import('next-auth');
  
  const session = await getServerSession(authOptions);
  let parentBalance = 0;
  
  if (session?.user?.id) {
     const parent = await prisma.parentProfile.findUnique({
         where: { userId: session.user.id }
     });
     parentBalance = parent?.hoursBalance || 0;
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-5xl mx-auto">
        
        {/* Navigation */}
        <Link href="/parent/tutors/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft size={18} /> Retour à la recherche
        </Link>
        
        {/* Header Profile */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 -z-0"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="shrink-0 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 mb-4 overflow-hidden ring-4 ring-white shadow-lg">
                        {tutor.user.image ? (
                             <Image 
                                src={tutor.user.image} 
                                alt={tutor.user.name || "Tuteur"} 
                                width={128} 
                                height={128} 
                                className="object-cover w-full h-full"
                             />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 text-4xl font-bold">
                                 {tutor.user.name?.[0] || 'T'}
                             </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 text-yellow-700 font-bold text-sm">
                        <Star size={16} fill="currentColor" className="text-yellow-500" />
                        <span>{tutor.rating > 0 ? tutor.rating.toFixed(1) : 'Nouveau'}</span>
                        <span className="text-yellow-600/70 font-normal">({tutor.totalReviews})</span>
                    </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{tutor.user.name}</h1>
                            <div className="flex flex-wrap gap-4 text-slate-600 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} className="text-blue-500" /> Canada (En ligne)
                                </span>
                                {tutor.organization && (
                                    <span className="flex items-center gap-1">
                                        <BookOpen size={16} className="text-indigo-500" /> {tutor.organization.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-3xl font-bold text-slate-900">1 <span className="text-sm font-normal text-slate-500">crédit/h</span></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                            {tutor.subjects.map(s => (
                                <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                    {s}
                                </span>
                            ))}
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                        {tutor.bio || "Ce tuteur n'a pas encore ajouté de biographie."}
                    </div>

                    {/* Action Buttons */}
                    <TutorProfileActions 
                        tutor={{
                            id: tutor.id,
                            userId: tutor.user.id,
                            name: tutor.user.name || "Tuteur",
                            hourlyRate: tutor.hourlyRate,
                            subjects: tutor.subjects
                        }}
                        parentBalance={parentBalance}
                    />
                </div>
            </div>
        </div>

        {/* Details Dictionary */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Video size={20} className="text-indigo-500" />
                    Expérience & CV
                </h3>
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                     <p className="text-slate-600 whitespace-pre-line">
                         {tutor.experience || "Non renseigné."}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Clock size={20} className="text-indigo-500" />
                    Disponibilités Types
                </h3>
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                     <p className="text-slate-500 italic">
                         Les disponibilités sont mises à jour en temps réel sur le calendrier de réservation.
                     </p>
                </div>
            </div>
        </div>
    </div>
  )
}
