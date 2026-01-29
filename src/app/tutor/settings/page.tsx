import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import EditProfileForm from "@/components/settings/EditProfileForm";
import EditTutorProfileForm from "@/components/settings/EditTutorProfileForm";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login')

  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tutorProfile: true }
  })

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4 py-6 md:py-10">
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Paramètres du compte</h1>

      <div className="space-y-8">
          
          {/* 1. Account Info (Avatar & Name) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Profil Utilisateur</h2>
              <EditProfileForm 
                  initialName={user.name || ''} 
                  initialImage={user.image} 
                  allowPhoto={true} // Enabled photo upload
              />
          </div>

          {/* 2. Tutor Specific Info (Bio, Price, Subjects) */}
          {user.tutorProfile && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Profil Professeur</h2>
                  <EditTutorProfileForm 
                        initialBio={user.tutorProfile.bio || ''}
                        initialSubjects={user.tutorProfile.subjects}
                        initialRate={user.tutorProfile.hourlyRate || 25}
                        initialCvUrl={user.tutorProfile.cvUrl}
                  />
              </div>
          )}

          {/* 3. Security */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Sécurité</h2>
              <ChangePasswordForm hasPassword={!!user.password} />
          </div>

          <div className="mt-8">
              <DeleteAccountSection role="TUTOR" />
          </div>

      </div>
    </div>
  )
}
