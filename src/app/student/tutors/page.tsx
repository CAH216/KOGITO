import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import TutorCard from './TutorCard';

export default async function StudentTutorsPage() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  if (!currentStudentId) redirect('/profiles');

  const student = await prisma.student.findUnique({
      where: { id: currentStudentId },
      include: { 
          parent: {
              select: { hoursBalance: true }
          }
      }
  });

  if (!student || !student.parent) {
      // Handle edge case where student exists but parent link is broken? 
      // Or just redirect / show error.
      // Usually shouldn't happen if constraints are correct.
      return <div>Erreur de chargement du profil parent.</div>;
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: { status: 'APPROVED' },
    include: { user: true }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="mb-10 text-center">
         <h1 className="text-4xl font-black text-indigo-950 mb-4">Trouve ton Super-Prof 🦸‍♂️</h1>
         <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Besoin d'aide en Maths, Français ou Anglais ? Nos tuteurs sont là pour toi.
            Envoie une demande et on s'occupe du reste !
         </p>
      </div>

      {/* Search Bar Placeholder */}
      <div className="max-w-md mx-auto mb-12 relative">
          <input 
            type="text" 
            placeholder="Rechercher par matière (ex: Maths)..." 
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-indigo-50 shadow-lg shadow-indigo-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map(tutor => (
             <TutorCard 
                key={tutor.id} 
                tutor={tutor} 
                parentBalance={student.parent.hoursBalance} 
             />
          ))}
      </div>
    </div>
  );
}
