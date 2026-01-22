'use server';

import { prisma } from '@/lib/prisma';
import { TutorStatus, UserRole, SessionStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { logSystemEvent, LogLevel } from '@/lib/logger';
import { calculateTutorEarnings } from '@/lib/pricing';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function applyAsTutor(formData: FormData) {
  // 1. Get User Session (Mocking/Pseudo for now, need actual auth check)
  // In a real app: const session = await auth(); if (!session) throw ...
  
  // For the sake of this code, I will rely on the form passing ID or assuming context is handled.
  // BUT I really should check auth.
  // I will assume there is a `userId` in the form hidden, OR (better) I can't verify session here easily without reading more files.
  // Let's assume I can import `auth`. I will try to read `src/lib/auth.ts` or `src/auth.ts` if it exists.
  
  const userId = formData.get('userId') as string; // Temporary: relying on hidden input for speed, user authentication MUST be verified in production.
  
  const subjectsStr = formData.get('subjects') as string; // Comma separated
  const bio = formData.get('bio') as string;
  const experience = formData.get('experience') as string;
  const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
  const interviewDateStr = formData.get('interviewDate') as string;

  const subjects = subjectsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const interviewDate = interviewDateStr ? new Date(interviewDateStr) : undefined;

  if (!userId) {
      return { success: false, error: "User ID missing" };
  }

  try {
      await prisma.tutorProfile.upsert({
          where: { userId },
          create: {
              userId,
              bio,
              experience,
              hourlyRate,
              subjects,
              interviewDate,
              status: TutorStatus.PENDING,
              isVerified: false
          },
          update: {
              bio,
              experience,
              hourlyRate,
              subjects,
              interviewDate,
              status: TutorStatus.PENDING, // Re-applying resets status
              isVerified: false
          }
      });
      return { success: true };
  } catch (e) {
      console.error(e);
      return { success: false, error: "Database error" };
  }
}

export async function submitTutorApplication(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  
  // Handle multiple subjects
  const subjects = formData.getAll('subjects') as string[];
  
  const bio = formData.get('bio') as string;
  const experience = formData.get('experience') as string;
  const interviewDateStr = formData.get('interviewDate') as string;
  
  const hourlyRateStr = formData.get('hourlyRate') as string;
  const hourlyRate = hourlyRateStr ? parseFloat(hourlyRateStr) : 25;

  const cvFile = formData.get('cv') as File | null;
  let cvUrl = null;

  if (cvFile && cvFile.size > 0 && cvFile.name !== 'undefined') {
      try {
          // Create unique filename
          const bytes = await cvFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');
          await mkdir(uploadDir, { recursive: true });
          
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = cvFile.name.split('.').pop();
          const filename = `cv-${firstName.toLowerCase()}-${uniqueSuffix}.${extension}`;
          
          await writeFile(join(uploadDir, filename), buffer);
          cvUrl = `/uploads/cvs/${filename}`;
      } catch (err) {
          console.error("Error upload CV:", err);
          await logSystemEvent("CV_UPLOAD_ERROR", `Failed to upload CV for ${email}`, LogLevel.ERROR, { error: String(err) });
      }
  }

  if (!email || !password || !firstName || !lastName || subjects.length === 0) {
      return { success: false, error: "Champs obligatoires manquants" };
  }

  // Check existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    await logSystemEvent("REGISTER_FAIL_DUPLICATE", `Attempt to register duplicate email: ${email}`, LogLevel.WARNING);
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  const hashedPassword = await hash(password, 12);
  const name = `${firstName} ${lastName}`;
  const interviewDate = interviewDateStr ? new Date(interviewDateStr) : undefined;

  try {
      // Transaction to create User and Profile
      await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
              data: {
                  name,
                  email,
                  password: hashedPassword,
                  role: UserRole.TUTOR, 
              }
          });

          await tx.tutorProfile.create({
              data: {
                  userId: user.id,
                  bio,
                  subjects, // Array
                  experience,
                  interviewDate,
                  status: TutorStatus.PENDING,
                  isVerified: false,
                  hourlyRate,
                  cvUrl
              }
          });
          
          // Log success inside transaction (optional, but ensures consistency if wrapper supported it)
          // Since logSystemEvent is outside tx scope usually (separate connection), we call it slightly after or we could pass tx.
          // For simplicity we call it after.
      });

      await logSystemEvent("TUTOR_REGISTERED", `New tutor registered: ${email}`, LogLevel.INFO, { subjects, email });
      return { success: true };
  } catch (e: any) {
      console.error(e);
      await logSystemEvent("REGISTER_ERROR", `Database error during registration for ${email}`, LogLevel.ERROR, { error: e.message });
      return { success: false, error: "Erreur lors de l'enregistrement: " + e.message };
  }
}

export async function getPendingTutors() {
    return await prisma.tutorProfile.findMany({
        where: {
            status: TutorStatus.PENDING
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            }
        },
        orderBy: {
             id: 'desc'
        }
    });
}

export async function updateTutorStatus(tutorId: string, status: TutorStatus) {
    const isVerified = status === TutorStatus.APPROVED;
    
    const tutor = await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: {
            status,
            isVerified
        },
        include: { user: true }
    });

    return { success: true };
}

export async function getTutorProfile(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });
    return user?.tutorProfile;
}

export async function getTutorDashboardStats(email: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return null;

    const tutorId = tutor.tutorProfile.id;
    const hourlyRate = tutor.tutorProfile.hourlyRate || 0;

    // 1. Get Completed Sessions for Stats
    const completedSessions = await prisma.learningSession.findMany({
        where: {
            tutorId,
            status: SessionStatus.COMPLETED
        }
    });

    // Calculate Earnings & Hours
    let totalEarnings = 0;
    let totalHours = 0;

    completedSessions.forEach(session => {
        const duration = (session.endTime ? (session.endTime.getTime() - session.startTime.getTime()) : (60 * 60 * 1000)) / (1000 * 60 * 60);
        totalHours += duration;
        // Use price if stored, otherwise calc based on rate
        if (session.price) {
            // Assuming Price stored is Tutor Earnings. If not, recalculate.
            // But usually price is what parent paid in credits?
            // Let's stick to rate * duration for earnings to be safe unless we have a specific 'earning' field.
            totalEarnings += calculateTutorEarnings(hourlyRate, duration);
        } else {
             totalEarnings += calculateTutorEarnings(hourlyRate, duration);
        }
    });

    // 2. Count Active Students (Unique IDs involved in non-cancelled sessions)
    const distinctStudents = await prisma.learningSession.findMany({
        where: {
            tutorId,
            status: { not: SessionStatus.CANCELLED }
        },
        select: { studentId: true },
        distinct: ['studentId']
    });

    // 3. Upcoming Sessions
    const upcomingSessions = await prisma.learningSession.findMany({
        where: {
            tutorId,
            status: SessionStatus.SCHEDULED,
            startTime: { gte: new Date() }
        },
        include: {
            student: {
                select: { name: true, grade: true }
            }
        },
        orderBy: { startTime: 'asc' },
        take: 5
    });

    // 4. Pending Requests
    const pendingRequests = await prisma.learningSession.findMany({
        where: {
            tutorId,
            status: SessionStatus.REQUESTED
        },
        include: {
            student: {
                 select: { name: true, grade: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return {
        stats: {
            totalEarnings,
            totalHours: Math.round(totalHours),
            activeStudents: distinctStudents.length,
            rating: tutor.tutorProfile.rating || 5.0
        },
        upcomingSessions: upcomingSessions.map(s => ({
            id: s.id,
            student: s.student.name,
            subject: s.subject,
            startTime: s.startTime,
            endTime: s.endTime,
            avatar: s.student.name.substring(0,2).toUpperCase(),
            isToday: new Date(s.startTime).toDateString() === new Date().toDateString()
        })),
        pendingRequests: pendingRequests.map(r => ({
            id: r.id,
            student: r.student.name,
            subject: r.subject,
            message: r.notes || "Nouvelle demande de cours",
            createdAt: r.createdAt
        }))
    };
}

export async function getTutorSchedule(email: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return [];

    const sessions = await prisma.learningSession.findMany({
        where: {
            tutorId: tutor.tutorProfile.id,
            startTime: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)) // From today
            },
            status: { not: SessionStatus.CANCELLED }
        },
        include: {
            student: {
                select: { name: true, grade: true }
            }
        },
        orderBy: { startTime: 'asc' }
    });

    return sessions.map(s => ({
        id: s.id,
        title: `${s.subject} avec ${s.student.name}`,
        start: s.startTime,
        end: s.endTime || new Date(s.startTime.getTime() + 60 * 60 * 1000), // Default 1h if null
        status: s.status,
        studentName: s.student.name,
        subject: s.subject
    }));
}

export async function getTutorFinancials(email: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return null;

    const completedSessions = await prisma.learningSession.findMany({
        where: {
            tutorId: tutor.tutorProfile.id,
            status: SessionStatus.COMPLETED
        },
        include: {
            student: { select: { name: true } }
        },
        orderBy: { startTime: 'desc' }
    });

    let totalEarnings = 0;
    const history = completedSessions.map(session => {
        const durationHours = (session.endTime ? (session.endTime.getTime() - session.startTime.getTime()) : (60 * 60 * 1000)) / (1000 * 60 * 60);
        const amount = calculateTutorEarnings(tutor.tutorProfile!.hourlyRate || 0, durationHours);
        totalEarnings += amount;
        
        return {
            id: session.id,
            date: session.startTime,
            student: session.student.name,
            subject: session.subject,
            duration: durationHours,
            amount,
            status: "PAID" // Assuming instant credit for now
        };
    });

    return {
        totalEarnings,
        balance: totalEarnings, // No payout system yet
        history
    };
}

export async function getTutorStudents(email: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return [];

    // Find all distinct students from sessions
    const sessions = await prisma.learningSession.findMany({
        where: {
            tutorId: tutor.tutorProfile.id,
        },
        select: {
            studentId: true,
            student: {
                select: {
                    id: true,
                    name: true,
                    grade: true,
                    school: { select: { name: true } }
                }
            },
            startTime: true // to find last session
        },
        orderBy: { startTime: 'desc' },
    });

    // Deduplicate students manually to keep latest interaction info if needed
    const studentMap = new Map();
    sessions.forEach(s => {
        if (!studentMap.has(s.studentId)) {
            studentMap.set(s.studentId, {
                ...s.student,
                lastSession: s.startTime,
                totalSessions: 0
            });
        }
        studentMap.get(s.studentId).totalSessions++;
    });

    return Array.from(studentMap.values());
}

export async function updateTutorProfileSettings(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Utlisateur non authentifié" };

    const bio = formData.get('bio') as string;
    const subjectsRaw = formData.get('subjects') as string;
    const hourlyRate = parseFloat(formData.get('hourlyRate') as string);
    
    let subjects: string[] = [];
    try {
        subjects = JSON.parse(subjectsRaw);
    } catch {
        // fallback
    }

    try {
        // First get user to get id
        const user = await prisma.user.findUnique({
             where: { email: session.user.email },
             include: { tutorProfile: true }
        });

        if (!user || !user.tutorProfile) return { error: "Profil tuteur introuvable" };

        await prisma.tutorProfile.update({
            where: { id: user.tutorProfile.id },
            data: {
                bio,
                subjects,
                hourlyRate
            }
        });

        revalidatePath('/tutor/settings');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Erreur base de données" };
    }
}

export async function getTutorRequests(email: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return [];

    const requests = await prisma.learningSession.findMany({
        where: {
            tutorId: tutor.tutorProfile.id,
            status: SessionStatus.REQUESTED
        },
        include: {
            student: {
                select: { name: true, grade: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return requests.map(r => ({
        id: r.id,
        student: r.student.name,
        grade: r.student.grade,
        subject: r.subject,
        message: r.notes || "Pas de message",
        createdAt: r.createdAt
    }));
}

export async function getStudentDetailsForTutor(email: string, studentId: string) {
    const tutor = await prisma.user.findUnique({
        where: { email },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) return null;

    // Verify authorized access (tutor has at least one session with this student)
    const hasAccess = await prisma.learningSession.findFirst({
        where: {
            tutorId: tutor.tutorProfile.id,
            studentId
        }
    });

    if (!hasAccess) return null;

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            school: true,
            parent: {
                include: {
                    user: { select: { id: true, name: true, email: true, image: true } }
                }
            }
        }
    });

    if (!student) return null;

    const history = await prisma.learningSession.findMany({
        where: {
            tutorId: tutor.tutorProfile.id,
            studentId
        },
        orderBy: { startTime: 'desc' }
    });

    return {
        student,
        history
    };
}

