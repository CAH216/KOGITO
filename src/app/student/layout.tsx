import { StudentNav } from "./components/StudentNav";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('currentStudentId')?.value;
  
  let user = undefined;
  
  if (studentId) {
      const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { name: true, grade: true }
      });

      const kogitoProfile = await prisma.kogitoStudentProfile.findUnique({
        where: { studentId },
        select: { xp: true, level: true }
      });

      if (student) {
          user = {
              name: student.name,
              grade: student.grade || "Niveau non défini",
              xp: kogitoProfile?.xp || 0
          };
      }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-indigo-200">
      <StudentNav user={user} />
      <main>
        {children}
      </main>
    </div>
  );
}
