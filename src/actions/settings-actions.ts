'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function updatePassword(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return { error: "Non autorisé" }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: "Tous les champs sont requis" }
    }

    if (newPassword !== confirmPassword) {
        return { error: "Les nouveaux mots de passe ne correspondent pas" }
    }
    
    if (newPassword.length < 6) {
        return { error: "Le mot de passe doit faire 6 caractères minimum" }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || !user.password) {
        return { error: "Utilisateur non trouvé" }
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
         return { error: "Mot de passe actuel incorrect" }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
    })

    return { success: "Mot de passe mis à jour avec succès !" }
}

export async function updateProfile(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return { error: "Non autorisé" }
    }

    const name = formData.get('name') as string
    const imageFile = formData.get('image') as File | null

    if (!name) {
        return { error: "Le nom est obligatoire" }
    }

    // Role check
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentUser) {
         return { error: "Utilisateur introuvable." }
    }

    let imageUrl = currentUser.image;
    let imageData: Buffer | undefined;
    let imageMimeType: string | undefined;

    // Handle Image Upload (Denylisted for Parent)
    if (imageFile && imageFile.size > 0) {
        if (currentUser.role === 'PARENT') {
             // Skip
        } else {
            // Store in DB for reliability as requested
            imageData = Buffer.from(await imageFile.arrayBuffer());
            imageMimeType = imageFile.type || 'image/jpeg';
            
            // Set URL to API route
            // Note: We use the ID, but it's the SAME ID, so the URL structure is consistent.
            imageUrl = `/api/files/avatar/${session.user.id}`;
        }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            image: imageUrl,
            ...(imageData && { imageData: imageData as any, imageMimeType })
        }
    })

    // Revalidate paths for all roles
    revalidatePath('/parent/settings')
    revalidatePath('/tutor/settings')
    revalidatePath('/employee/settings')
    revalidatePath('/admin/settings')

    return { success: "Profil mis à jour avec succès !" }
}

