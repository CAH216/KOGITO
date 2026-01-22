'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfiles, selectStudentProfile } from '@/actions/profile-actions';
import { User, GraduationCap, Lock, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function SelectProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ user: any, students: any[] } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getUserProfiles();
      if (!res) {
        router.push('/auth/login');
        return;
      }
      
      // Role Based Redirection
      const role = res.user.role;
      if (role === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
      } 
      if (role === 'TUTOR') {
          router.push('/tutor/dashboard');
          return;
      }
      if (role === 'EMPLOYEE') {
          router.push('/employee/dashboard'); // Adjust path if needed
          return; 
      }
      if (role === 'SCHOOL_ADMIN') {
           router.push('/school-admin/dashboard');
           return;
      }

      // Only PARENT stays here
      setData(res);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSelectStudent = async (studentId: string) => {
    setLoading(true);
    await selectStudentProfile(studentId);
    router.push('/student/dashboard');
  };

  const handleSelectParent = () => {
    router.push('/parent/dashboard'); // Or direct to parent view
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 tracking-tight">Qui veut apprendre ?</h1>
      
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        
        {/* Parent Profile */}
        <div className="group flex flex-col items-center gap-3 cursor-pointer" onClick={handleSelectParent}>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-blue-600 flex items-center justify-center border-4 border-transparent group-hover:border-white transition-all overflow-hidden shadow-2xl relative">
            <User size={64} className="text-white" />
            <div className="absolute top-2 right-2 bg-black/30 p-1 rounded">
               <Lock size={14} className="text-white" />
            </div>
          </div>
          <span className="text-slate-300 group-hover:text-white text-lg md:text-xl font-medium transition-colors">
            {data.user.name} (Parent)
          </span>
        </div>

        {/* Children Profiles */}
        {data.students.map((student: any) => (
          <div 
            key={student.id} 
            className="group flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => handleSelectStudent(student.id)}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border-4 border-transparent group-hover:border-white transition-all shadow-2xl relative">
                <span className="text-5xl">🎓</span>
            </div>
            <span className="text-slate-300 group-hover:text-white text-lg md:text-xl font-medium transition-colors">
              {student.name}
            </span>
          </div>
        ))}

        {/* Add Profile Button (Mock) */}
        <div className="group flex flex-col items-center gap-3 cursor-pointer">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-slate-800 flex items-center justify-center border-4 border-transparent group-hover:border-slate-500 transition-all">
            <Plus size={48} className="text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-slate-500 group-hover:text-slate-300 text-lg md:text-xl font-medium transition-colors">
            Ajouter
          </span>
        </div>

      </div>

      <button className="mt-16 text-slate-500 border border-slate-700 px-6 py-2 rounded-none hover:border-white hover:text-white transition-all tracking-widest uppercase text-sm">
        Gérer les profils
      </button>
    </div>
  );
}
