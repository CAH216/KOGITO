'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { TutorStatus, UserRole } from "@prisma/client"

export async function submitTutorApplication(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string // Should be added to form or generated
    const subject = formData.get('subject') as string
    const experience = formData.get('experience') as string
    const bio = formData.get('bio') as string

    if (!email || !firstName || !lastName || !password) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires." }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
        return { success: false, error: "Cet email est déjà utilisé." }
    }

    const hashedPassword = await hash(password, 12);

    // Create User and TutorProfile
    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: UserRole.TUTOR,
        tutorProfile: {
           create: {
             subjects: [subject],
             experience,
             bio,
             status: TutorStatus.PENDING,
             isVerified: false // Keep it false until approved
           }
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error submitting tutor application:", error)
    return { success: false, error: "Une erreur est survenue lors de l'inscription." }
  }
}

export async function getPendingTutors() {
  try {
    const tutors = await prisma.tutorProfile.findMany({
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
        // createdAt field doesn't exist on TutorProfile, assume we sort by ID or need to add createdAt to TutorProfile? 
        // Or sort by user.createdAt if possible. 
        // For simplicity, just take them as is.
        // But wait, user has createdAt.
        user: {
            createdAt: 'desc'
        }
      }
    })
    return { success: true, data: tutors }
  } catch (error) {
     console.error("Error fetching pending tutors:", error)
     return { success: false, error: "Impossible de récupérer les candidatures." }
  }
}

export async function updateTutorStatus(tutorProfileId: string, newStatus: TutorStatus) {
    try {
        const isVerified = newStatus === TutorStatus.APPROVED;
        
        await prisma.tutorProfile.update({
            where: { id: tutorProfileId },
            data: {
                status: newStatus,
                isVerified: isVerified
            }
        })
        
        revalidatePath('/employee/tutors/verification')
        revalidatePath('/admin/tutors')
        return { success: true }
    } catch (error) {
        console.error("Error updating tutor status:", error)
        return { success: false, error: "Erreur lors de la mise à jour du statut." }
    }
}
