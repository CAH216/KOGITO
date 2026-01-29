import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Building, Save } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { organization: true }
  });

  const org = user?.organization;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres de l'établissement</h1>
        <p className="text-sm text-slate-500">Modifiez les informations de votre organisation</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-white shadow-sm">
                      {org?.name?.substring(0, 2).toUpperCase() || 'OR'}
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-900">{org?.name}</h3>
                      <p className="text-sm text-slate-500">Code Partenaire: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{org?.code}</span></p>
                  </div>
              </div>
          </div>
          
          <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nom de l'établissement</label>
                      <input 
                        type="text" 
                        defaultValue={org?.name}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email de contact</label>
                      <input 
                        type="email" 
                        defaultValue={org?.contactEmail || ''}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Téléphone</label>
                      <input 
                        type="tel" 
                        defaultValue={org?.phoneNumber || ''}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Adresse</label>
                      <input 
                        type="text" 
                        defaultValue={org?.address || ''}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Ville</label>
                      <input 
                        type="text" 
                        defaultValue={org?.city || ''}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                      <Save size={18} />
                      Enregistrer les modifications
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
