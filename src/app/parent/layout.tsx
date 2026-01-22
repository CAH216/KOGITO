import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers" 
import ParentSidebar from "./components/ParentSidebar";
import { getUserProfiles } from "@/actions/profile-actions";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
      redirect('/api/auth/signin?callbackUrl=/parent/dashboard')
  }

  // Role check
  if (session.user.role !== 'PARENT' && session.user.role !== 'ADMIN') {
      redirect('/dashboard')
  }

  // Get Profiles and Current Selection
  const profileData = await getUserProfiles();
  const cookieStore = await cookies();
  const currentStudentId = cookieStore.get('currentStudentId')?.value;

  const students = profileData?.students || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <ParentSidebar 
        user={session.user} 
        students={students}
        currentStudentId={currentStudentId}
      />
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
