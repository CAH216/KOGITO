
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { BADGES } from '@/lib/kogito/badges';
import { Trophy, Star, Medal, Award, Search, Mountain, Wand2, Crown, Footprints } from 'lucide-react';

const ICON_COMPONENTS = {
    Footprints,
    Search,
    Mountain,
    Wand2,
    Crown,
    Star,
    Medal,
    Award
} as any;

export default async function AchievementsPage() {
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;
  
  let studentBadges: string[] = [];

  if (currentStudentId) {
      const profile = await prisma.kogitoStudentProfile.findUnique({
          where: { studentId: currentStudentId },
          select: { badges: true }
      });
      if (profile?.badges) {
          studentBadges = profile.badges as string[];
      }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-black text-indigo-950 mb-2">Mes Trophées 🏆</h1>
        <p className="text-slate-500 mb-8">Collectionne les badges en progressant avec Kogito.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {BADGES.map((badge) => {
                const isUnlocked = studentBadges.includes(badge.id);
                const Icon = ICON_COMPONENTS[badge.icon] || Star;

                return (
                    <div 
                        key={badge.id}
                        className={`
                            relative overflow-hidden p-6 rounded-3xl border shadow-sm flex flex-col items-center text-center transition-all group
                            ${isUnlocked 
                                ? 'bg-white border-2 border-yellow-100 shadow-yellow-100/50' 
                                : 'bg-slate-50 border-slate-100 opacity-80 grayscale hover:grayscale-0'}
                        `}
                    >
                        {isUnlocked && (
                            <div className="absolute inset-0 bg-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        )}
                        
                        <div className={`
                            w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-transform group-hover:scale-110
                            ${isUnlocked 
                                ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white' 
                                : 'bg-slate-200 text-slate-400'}
                        `}>
                            <Icon size={32} className={isUnlocked ? 'fill-white' : ''} />
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-800">{badge.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{badge.description}</p>
                        
                        <div className={`
                            mt-4 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                            ${isUnlocked 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-slate-200 text-slate-500'}
                        `}>
                            {isUnlocked ? 'Débloqué' : 'Verrouillé'}
                        </div>
                    </div>
                );
            })}

        </div>
    </div>
  );
}
