import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import TutorCard from './TutorCard';
import Link from 'next/link'; // Added Link

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
      return <div>Erreur de chargement du profil parent.</div>;
  }

  // WALLED GARDEN LOGIC
  // If student belongs to an Org, show ONLY Org tutors.
  const whereClause: any = { status: 'APPROVED' };

  if (student.organizationId) {
      whereClause.organizationId = student.organizationId;
  } else {
      // Public student: Can see independent tutors (OrgId is null)
      // Or maybe all tutors? For now, let's say independent tutors only
      // to protect Org tutors from being booked by outside students.
      whereClause.organizationId = null; 
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: whereClause,
    include: { user: true }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="mb-6">
        <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft size={20} /> Retour au tableau de bord
        </Link>
      </div>

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
