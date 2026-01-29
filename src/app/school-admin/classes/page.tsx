import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, MoreHorizontal, BookOpen } from "lucide-react";

export default async function ClassesPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  if (!user?.organization) {
      return <div>Erreur d&apos;organisation</div>;
  }

  const classes = await prisma.classGroup.findMany({
      where: { organizationId: user.organization.id },
      include: {
          _count: {
              select: { students: true }
          }
      }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes et Groupes</h1>
          <p className="text-sm text-slate-500">Organisez vos élèves par classes ou groupes de niveau</p>
        </div>
        <Link 
            href="/school-admin/classes/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
            <Plus size={18} />
            Nouveau groupe
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                   <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-lg">Aucune classe</p>
                  <p className="text-sm mb-4">Créez des groupes pour organiser vos élèves.</p>
              </div>
          ) : (
              classes.map((group) => (
                  <div key={group.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                              <BookOpen size={20} />
                          </div>
                          <button className="text-slate-400 hover:text-slate-600">
                              <MoreHorizontal size={18} />
                          </button>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{group.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 gap-2 mb-4">
                           <span>{group._count.students} élèves</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                          <div className="bg-blue-500 h-1.5 rounded-full w-2/3"></div>
                      </div>
                      <p className="text-xs text-slate-400">Progression moyenne: 66%</p>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
