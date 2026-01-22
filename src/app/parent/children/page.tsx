import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, GraduationCap, Edit2, User } from 'lucide-react';
import Link from 'next/link';

export default async function ParentChildrenPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) return null;

  const parentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      parentProfile: {
        include: {
          children: {
            include: {
               school: true
            }
          }
        }
      }
    }
  });

  const children = parentUser?.parentProfile?.children || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Enfants</h1>
          <p className="text-slate-500">Gérez les profils et suivez la progression scolaire.</p>
        </div>
        <Link href="/parent/children/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200">
          <Plus size={18} />
          Ajouter un enfant
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => {
          // Generate a deterministic color based on index
          const colors = [
              "bg-blue-100 text-blue-600",
              "bg-pink-100 text-pink-600", 
              "bg-purple-100 text-purple-600",
              "bg-orange-100 text-orange-600",
              "bg-emerald-100 text-emerald-600"
          ];
          const avatarColor = colors[index % colors.length];

          return (
            <div key={child.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${avatarColor}`}>
                            {child.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{child.name}</h3>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                <GraduationCap size={14} />
                                {child.grade ? child.grade : 'Non défini'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3 mt-6">
                    <div className="flex justify-between text-sm">
                         <span className="text-slate-500">École</span>
                         <span className="font-medium text-slate-900">{child.school ? child.school.name : 'Non renseignée'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Cours suivis</span>
                         <span className="font-medium text-slate-900">--</span> 
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                 <Link href={`/parent/children/${child.id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Edit2 size={14} />
                    Gérer le profil
                 </Link>
                 <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> 
            </div>
          </div>
          )
        })}

        {children.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <User className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucun enfant ajouté</h3>
                <p className="text-slate-500 max-w-sm mt-1 mb-6">Commencez par ajouter le profil de votre enfant pour trouver un tuteur.</p>
                <Link href="/parent/children/new" className="text-blue-600 font-medium hover:underline">
                    Ajouter mon premier enfant
                </Link>
            </div>
        )}
      </div>
    </div>
  )
}