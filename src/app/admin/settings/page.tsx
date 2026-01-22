import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, Save, Lock, Bell } from "lucide-react";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/auth/login');

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Paramètres Administrateur</h1>
                <p className="text-slate-500">Configuration de votre compte et de la plateforme.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {session.user.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{session.user.name}</h2>
                        <p className="text-slate-500">{session.user.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">
                            Super Admin
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Commission Plateforme (%)</label>
                            <input type="number" defaultValue="20" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
                            <p className="text-xs text-slate-400 mt-1">Contactez le support technique pour modifier.</p>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email de support</label>
                            <input type="email" defaultValue="support@kogito.com" className="w-full p-2 border border-slate-200 rounded-lg" />
                         </div>
                     </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lock size={18} /> Sécurité
                </h3>
                <ChangePasswordForm hasPassword={true} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-75">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell size={18} /> Notifications (Non disponible)
                </h3>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-700">Nouvelle inscription tuteur</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between py-3">
                    <span className="text-slate-700">Rapport d'erreurs système</span>
                    <div className="w-10 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
